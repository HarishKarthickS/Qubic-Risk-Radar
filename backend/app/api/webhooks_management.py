from typing import List, Optional
from uuid import UUID
from datetime import datetime
import secrets
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, func
from pydantic import BaseModel, Field
from app.database import get_db
from app.models.easyconnect_config import EasyConnectConfig
from app.models.user import User
from app.dependencies.auth import get_verified_user
from app.config import settings
from app.logging_config import get_logger

router = APIRouter(prefix="/api/webhooks", tags=["webhooks-management"])
logger = get_logger(__name__)

class WebhookCreate(BaseModel):
    name: str
    description: Optional[str] = None
    alert_id: str
    tags: Optional[List[str]] = None
    webhook_priority: int = 0
    is_primary: bool = False
    contract_address: Optional[str] = None
    event_type: Optional[str] = None

class WebhookUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    webhook_priority: Optional[int] = None
    is_primary: Optional[bool] = None
    is_active: Optional[bool] = None

class WebhookResponse(BaseModel):
    id: UUID
    name: Optional[str]
    description: Optional[str]
    alert_id: str
    webhook_url: str
    webhook_secret: str
    tags: Optional[List[str]]
    webhook_priority: int
    is_primary: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("", response_model=List[WebhookResponse])
async def list_webhooks(
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(EasyConnectConfig)
        .where(EasyConnectConfig.user_id == user.id)
        .order_by(desc(EasyConnectConfig.is_primary), desc(EasyConnectConfig.created_at))
    )
    webhooks = result.scalars().all()
    
    return [
        WebhookResponse(
            id=w.id,
            name=w.name,
            description=w.description,
            alert_id=w.alert_id,
            webhook_url=f"{settings.BACKEND_URL}/webhook/qubic/events",
            webhook_secret=w.webhook_secret,
            tags=w.tags,
            webhook_priority=w.webhook_priority,
            is_primary=w.is_primary,
            is_active=w.is_active,
            created_at=w.created_at
        )
        for w in webhooks
    ]

@router.post("", response_model=WebhookResponse, status_code=status.HTTP_201_CREATED)
async def create_webhook(
    data: WebhookCreate,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(
        select(EasyConnectConfig).where(
            and_(EasyConnectConfig.user_id == user.id, EasyConnectConfig.alert_id == data.alert_id)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Alert ID already configured")
    
    webhook_secret = secrets.token_urlsafe(32)
    
    if data.is_primary:
        await db.execute(
            select(EasyConnectConfig).where(EasyConnectConfig.user_id == user.id)
        )
        # Reset others
    
    webhook = EasyConnectConfig(
        user_id=user.id,
        name=data.name,
        alert_id=data.alert_id,
        webhook_secret=webhook_secret,
        description=data.description,
        tags=data.tags,
        webhook_priority=data.webhook_priority,
        is_primary=data.is_primary,
        contract_address=data.contract_address,
        event_type=data.event_type
    )
    
    db.add(webhook)
    await db.commit()
    await db.refresh(webhook)
    
    return WebhookResponse(
        id=webhook.id,
        name=webhook.name,
        description=webhook.description,
        alert_id=webhook.alert_id,
        webhook_url=f"{settings.BACKEND_URL}/webhook/qubic/events",
        webhook_secret=webhook.webhook_secret,
        tags=webhook.tags,
        webhook_priority=webhook.webhook_priority,
        is_primary=webhook.is_primary,
        is_active=webhook.is_active,
        created_at=webhook.created_at
    )

@router.get("/{webhook_id}", response_model=WebhookResponse)
async def get_webhook(
    webhook_id: UUID,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(EasyConnectConfig).where(
            and_(EasyConnectConfig.id == webhook_id, EasyConnectConfig.user_id == user.id)
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    return WebhookResponse(
        id=webhook.id,
        name=webhook.name,
        description=webhook.description,
        alert_id=webhook.alert_id,
        webhook_url=f"{settings.BACKEND_URL}/webhook/qubic/events",
        webhook_secret=webhook.webhook_secret,
        tags=webhook.tags,
        webhook_priority=webhook.webhook_priority,
        is_primary=webhook.is_primary,
        is_active=webhook.is_active,
        created_at=webhook.created_at
    )

@router.patch("/{webhook_id}", response_model=WebhookResponse)
async def update_webhook(
    webhook_id: UUID,
    data: WebhookUpdate,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(EasyConnectConfig).where(
            and_(EasyConnectConfig.id == webhook_id, EasyConnectConfig.user_id == user.id)
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(webhook, key, value)
    
    await db.commit()
    await db.refresh(webhook)
    
    return WebhookResponse(
        id=webhook.id,
        name=webhook.name,
        description=webhook.description,
        alert_id=webhook.alert_id,
        webhook_url=f"{settings.BACKEND_URL}/webhook/qubic/events",
        webhook_secret=webhook.webhook_secret,
        tags=webhook.tags,
        webhook_priority=webhook.webhook_priority,
        is_primary=webhook.is_primary,
        is_active=webhook.is_active,
        created_at=webhook.created_at
    )

@router.delete("/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_webhook(
    webhook_id: UUID,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(EasyConnectConfig).where(
            and_(EasyConnectConfig.id == webhook_id, EasyConnectConfig.user_id == user.id)
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    await db.delete(webhook)
    await db.commit()
    return None

@router.post("/{webhook_id}/regenerate-secret")
async def regenerate_secret(
    webhook_id: UUID,
    user: User = Depends(get_verified_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(EasyConnectConfig).where(
            and_(EasyConnectConfig.id == webhook_id, EasyConnectConfig.user_id == user.id)
        )
    )
    webhook = result.scalar_one_or_none()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    webhook.webhook_secret = secrets.token_urlsafe(32)
    await db.commit()
    
    return {"webhook_secret": webhook.webhook_secret}
