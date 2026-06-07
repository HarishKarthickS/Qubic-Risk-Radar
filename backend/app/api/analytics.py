from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func
from pydantic import BaseModel
from app.database import get_db
from app.models.ai_detection import MultiScopeReport, AIDetection
from app.models.incident import Incident
from app.models.user import User
from app.dependencies.auth import get_verified_user
from app.services.reporting_engine import get_reporting_engine
from app.logging_config import get_logger

router = APIRouter(prefix="/api/analytics", tags=["analytics"])
logger = get_logger(__name__)

class ReportGenerateRequest(BaseModel):
    scope: str = 'all'
    time_range_days: int = 7
    report_type: str = 'standard'

class ReportResponse(BaseModel):
    id: UUID
    scope: str
    report_type: str
    time_range_start: datetime
    time_range_end: datetime
    total_detections: int
    critical_count: int
    high_count: int
    executive_summary: Optional[str]
    risk_assessment: Optional[str]
    generated_at: datetime
    
    class Config:
        from_attributes = True

class AnalyticsOverview(BaseModel):
    total_incidents: int
    incidents_today: int
    incidents_this_week: int
    by_severity: dict
    by_category: dict

@router.post("/reports/generate", response_model=ReportResponse)
async def generate_report(
    request: ReportGenerateRequest,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        engine = get_reporting_engine(db)
        report = await engine.generate_report(
            user_id=user.id,
            scope=request.scope,
            time_range_days=request.time_range_days,
            report_type=request.report_type
        )
        return report
    except Exception as e:
        logger.error(f"Report generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports", response_model=List[ReportResponse])
async def list_reports(
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MultiScopeReport).where(MultiScopeReport.user_id == user.id).order_by(desc(MultiScopeReport.generated_at))
    )
    return result.scalars().all()

@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    
    total = await db.execute(select(func.count(Incident.id)).where(Incident.user_id == user.id))
    today = await db.execute(select(func.count(Incident.id)).where(and_(Incident.user_id == user.id, Incident.created_at >= today_start)))
    week = await db.execute(select(func.count(Incident.id)).where(and_(Incident.user_id == user.id, Incident.created_at >= week_start)))
    
    incidents_result = await db.execute(select(Incident).where(Incident.user_id == user.id))
    incidents = incidents_result.scalars().all()
    
    by_severity = {}
    by_category = {}
    for inc in incidents:
        by_severity[inc.severity] = by_severity.get(inc.severity, 0) + 1
        if inc.category:
            by_category[inc.category] = by_category.get(inc.category, 0) + 1
            
    return AnalyticsOverview(
        total_incidents=total.scalar(),
        incidents_today=today.scalar(),
        incidents_this_week=week.scalar(),
        by_severity=by_severity,
        by_category=by_category
    )
