from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, String, DateTime, ForeignKey, Index, Float, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSON, JSONB
from sqlalchemy.orm import relationship
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    severity = Column(String(20), nullable=False, index=True)
    status = Column(String(50), default='open', index=True)
    
    type = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)
    scope = Column(String(50), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(String)
    
    protocol = Column(String(100), index=True)
    contract_address = Column(String(255), index=True)
    primary_wallet = Column(String(255))
    
    impact_score = Column(Float, nullable=True)
    urgency = Column(String(20), nullable=True)
    
    first_seen_at = Column(DateTime, nullable=False, index=True)
    last_seen_at = Column(DateTime, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    
    rule_id = Column(PGUUID(as_uuid=True), ForeignKey('rules.id', ondelete='SET NULL'), nullable=True)
    detection_id = Column(PGUUID(as_uuid=True), ForeignKey('ai_detections.id', ondelete='SET NULL'), nullable=True)
    
    deduplication_key = Column(String(512), index=True)
    metadata_json = Column(JSON)
    user_notes = Column(Text, nullable=True)
    tags = Column(JSONB, nullable=True)
    assigned_to = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="incidents")
    rule = relationship("Rule", back_populates="incidents")
    alerts = relationship("Alert", back_populates="incident", cascade="all, delete-orphan")
    incident_events = relationship("IncidentEvent", back_populates="incident", cascade="all, delete-orphan")
    ai_detection = relationship("AIDetection", back_populates="incident", uselist=False)
    
    __table_args__ = (
        Index('idx_incidents_severity_first', 'severity', 'first_seen_at'),
        Index('idx_incidents_protocol', 'protocol', 'first_seen_at'),
        Index('idx_incidents_dedup_key', 'deduplication_key'),
    )

class IncidentEvent(Base):
    __tablename__ = "incident_events"
    
    incident_id = Column(PGUUID(as_uuid=True), ForeignKey('incidents.id', ondelete='CASCADE'), primary_key=True)
    normalized_event_id = Column(PGUUID(as_uuid=True), ForeignKey('normalized_events.id', ondelete='CASCADE'), primary_key=True)
    added_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    incident = relationship("Incident", back_populates="incident_events")
    normalized_event = relationship("NormalizedEvent", back_populates="incident_events")
    
    __table_args__ = (
        Index('idx_incident_events_incident', 'incident_id'),
        Index('idx_incident_events_event', 'normalized_event_id'),
    )
