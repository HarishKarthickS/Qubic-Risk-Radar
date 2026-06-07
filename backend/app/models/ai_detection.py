from sqlalchemy import Column, String, Float, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class AIDetection(Base):
    __tablename__ = "ai_detections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey('normalized_events.id', ondelete='CASCADE'), nullable=False, unique=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    anomaly_score = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)
    
    primary_category = Column(String(100), nullable=False)
    sub_categories = Column(JSONB, nullable=True)
    scope = Column(String(50), nullable=False)
    
    summary = Column(Text, nullable=False)
    detailed_analysis = Column(Text, nullable=True)
    detected_patterns = Column(JSONB, nullable=True)
    risk_factors = Column(JSONB, nullable=True)
    recommendations = Column(JSONB, nullable=True)
    related_addresses = Column(JSONB, nullable=True)
    
    model_version = Column(String(50), nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    incident = relationship("Incident", back_populates="ai_detection", uselist=False)

class NotificationRoutingRule(Base):
    __tablename__ = "notification_routing_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    severity = Column(String(20), nullable=False)
    incident_type = Column(String(100), nullable=True)
    scope = Column(String(50), nullable=True)
    
    discord_channel_id = Column(String(50), nullable=True)
    telegram_chat_id = Column(String(50), nullable=True)
    email_enabled = Column(String(50), nullable=False, server_default='false')
    webhook_url = Column(Text, nullable=True)
    
    notification_format = Column(String(50), nullable=False, server_default='minimal')
    include_ai_analysis = Column(String(50), nullable=False, server_default='true')
    
    priority = Column(Integer, nullable=False, server_default='0')
    enabled = Column(String(50), nullable=False, server_default='true')
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), nullable=False, onupdate=func.now())

class NotificationLog(Base):
    __tablename__ = "notification_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey('incidents.id', ondelete='CASCADE'), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    routing_rule_id = Column(UUID(as_uuid=True), ForeignKey('notification_routing_rules.id', ondelete='SET NULL'), nullable=True)
    
    channel = Column(String(50), nullable=False)
    destination = Column(Text, nullable=False)
    severity = Column(String(20), nullable=True)
    
    status = Column(String(50), nullable=False)
    delivered_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, nullable=False, server_default='0')
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

class MultiScopeReport(Base):
    __tablename__ = "multi_scope_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    report_type = Column(String(50), nullable=False)
    scope = Column(String(50), nullable=False)
    time_range_start = Column(DateTime, nullable=False)
    time_range_end = Column(DateTime, nullable=False)
    
    total_events = Column(Integer, nullable=True)
    total_detections = Column(Integer, nullable=True)
    critical_count = Column(Integer, nullable=True)
    high_count = Column(Integer, nullable=True)
    medium_count = Column(Integer, nullable=True)
    low_count = Column(Integer, nullable=True)
    
    executive_summary = Column(Text, nullable=True)
    key_findings = Column(JSONB, nullable=True)
    anomaly_trends = Column(JSONB, nullable=True)
    pattern_summary = Column(JSONB, nullable=True)
    risk_assessment = Column(String(50), nullable=True)
    
    by_category = Column(JSONB, nullable=True)
    by_severity = Column(JSONB, nullable=True)
    by_scope = Column(JSONB, nullable=True)
    by_contract = Column(JSONB, nullable=True)
    
    top_addresses = Column(JSONB, nullable=True)
    top_contracts = Column(JSONB, nullable=True)
    top_patterns = Column(JSONB, nullable=True)
    
    recommendations = Column(JSONB, nullable=True)
    action_items = Column(JSONB, nullable=True)
    
    generated_at = Column(DateTime, server_default=func.now(), nullable=False)
    model_version = Column(String(50), nullable=True)
    generation_time_ms = Column(Integer, nullable=True)
