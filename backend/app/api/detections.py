from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func
from pydantic import BaseModel
from app.database import get_db
from app.models.ai_detection import AIDetection
from app.models.incident import Incident
from app.models.user import User
from app.dependencies.auth import get_verified_user
from app.logging_config import get_logger

router = APIRouter(prefix="/api/detections", tags=["detections"])
logger = get_logger(__name__)

class DetectionResponse(BaseModel):
    id: UUID
    event_id: UUID
    severity: str
    anomaly_score: float
    confidence: float
    primary_category: str
    summary: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("", response_model=List[DetectionResponse])
async def list_detections(
    days: int = Query(7, ge=1, le=90),
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    since = datetime.utcnow() - timedelta(days=days)
    query = select(AIDetection).where(
        and_(AIDetection.user_id == user.id, AIDetection.created_at >= since)
    ).order_by(desc(AIDetection.created_at))
    
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{detection_id}", response_model=DetectionResponse)
async def get_detection(
    detection_id: UUID,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(AIDetection).where(
        and_(AIDetection.id == detection_id, AIDetection.user_id == user.id)
    )
    result = await db.execute(query)
    detection = result.scalar_one_or_none()
    
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    
    return detection
