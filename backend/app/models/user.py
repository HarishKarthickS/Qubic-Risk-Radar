from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Index
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    
    is_verified = Column(Boolean, default=False, index=True)
    verification_token = Column(String(255), nullable=True)
    verification_token_expires = Column(DateTime, nullable=True)
    
    is_active = Column(Boolean, default=True, index=True)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    onboarding_completed = Column(Boolean, default=False, server_default='false', nullable=False)
    onboarding_step = Column(Integer, default=1, server_default='1', nullable=False)
    webhook_test_received = Column(Boolean, default=False, server_default='false', nullable=False)
    
    discord_user_id = Column(String(50), nullable=True)
    telegram_chat_id = Column(String(50), nullable=True)
    email_notifications_enabled = Column(Boolean, default=True, server_default='true', nullable=False)
    
    discord_verified = Column(Boolean, default=False, server_default='false', nullable=False)
    telegram_verified = Column(Boolean, default=False, server_default='false', nullable=False)
    
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
    easyconnect_configs = relationship("EasyConnectConfig", back_populates="user", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="user")
    rules = relationship("Rule", back_populates="user")
    monitored_targets = relationship("MonitoredTarget", back_populates="user")
    
    __table_args__ = (
        Index('idx_users_email', 'email'),
        Index('idx_users_verified', 'is_verified'),
        Index('idx_users_active', 'is_active'),
    )
