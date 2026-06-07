from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Index, UniqueConstraint, Integer
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSON, JSONB
from sqlalchemy.orm import relationship
from app.database import Base

class EasyConnectConfig(Base):
    __tablename__ = "easyconnect_configs"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    name = Column(String(255), nullable=True)
    alert_id = Column(String(255), nullable=False, index=True)
    webhook_secret = Column(String(255), nullable=False)
    
    contract_address = Column(String(255))
    contract_label = Column(String(255))
    event_type = Column(String(100))
    conditions_json = Column(JSON, default={})
    
    tags = Column(JSONB, nullable=True)
    webhook_priority = Column(Integer, default=0)
    is_primary = Column(Boolean, default=False)
    routing_rule_id = Column(PGUUID(as_uuid=True), nullable=True)
    
    is_active = Column(Boolean, default=True, index=True)
    description = Column(String(512))
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="easyconnect_configs")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'alert_id', name='uq_user_alert'),
        Index('idx_ec_alert_id', 'alert_id'),
        Index('idx_ec_user_active', 'user_id', 'is_active'),
    )
