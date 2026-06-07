from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from app.database import get_db
from app.models.incident import Incident, IncidentEvent
from app.models.event import NormalizedEvent
from app.logging_config import get_logger

router = APIRouter(prefix="/api/incidents", tags=["incidents"])
logger = get_logger(__name__)

class IncidentResponse(BaseModel):
    id: UUID
    severity: str
    status: str
    type: str
    category: Optional[str]
    scope: Optional[str]
    title: str
    description: Optional[str]
    protocol: Optional[str]
    contract_address: Optional[str]
    primary_wallet: Optional[str]
    impact_score: Optional[float]
    urgency: Optional[str]
    first_seen_at: datetime
    last_seen_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class IncidentDetailResponse(IncidentResponse):
    related_events: List[dict] = Field(default_factory=list)

class IncidentUpdateRequest(BaseModel):
    status: Optional[str] = None
    user_notes: Optional[str] = None
    assigned_to: Optional[str] = None

class IncidentListResponse(BaseModel):
    incidents: List[IncidentResponse]
    total: int
    page: int
    page_size: int

@router.get("", response_model=IncidentListResponse)
async def list_incidents(
    db: AsyncSession = Depends(get_db),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    query = select(Incident)
    if severity:
        query = query.where(Incident.severity == severity.upper())
    if status:
        query = query.where(Incident.status == status.lower())
    
    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar()
    
    offset = (page - 1) * page_size
    query = query.order_by(desc(Incident.first_seen_at)).limit(page_size).offset(offset)
    
    result = await db.execute(query)
    incidents = result.scalars().all()
    
    return IncidentListResponse(
        incidents=[IncidentResponse.model_validate(inc) for inc in incidents],
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{incident_id}", response_model=IncidentDetailResponse)
async def get_incident(
    incident_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    events_result = await db.execute(
        select(NormalizedEvent)
        .join(IncidentEvent, IncidentEvent.normalized_event_id == NormalizedEvent.id)
        .where(IncidentEvent.incident_id == incident_id)
        .order_by(NormalizedEvent.timestamp)
    )
    events = events_result.scalars().all()
    
    response_data = IncidentResponse.model_validate(incident).model_dump()
    response_data['related_events'] = [
        {
            'id': str(event.id),
            'event_name': event.event_name,
            'tx_hash': event.tx_hash,
            'timestamp': event.timestamp.isoformat(),
        }
        for event in events
    ]
    
    return response_data

@router.patch("/{incident_id}", response_model=IncidentResponse)
async def update_incident(
    incident_id: UUID,
    update: IncidentUpdateRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    if update.status:
        incident.status = update.status
    if update.user_notes:
        incident.user_notes = update.user_notes
    if update.assigned_to:
        incident.assigned_to = update.assigned_to
        
    await db.commit()
    await db.refresh(incident)
    return incident
