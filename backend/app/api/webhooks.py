import hmac
import hashlib
from typing import Dict, Any
from fastapi import APIRouter, Request, HTTPException, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.event import Event, NormalizedEvent
from app.models.ai_detection import AIDetection
from app.models.incident import Incident
from app.models.easyconnect_config import EasyConnectConfig
from app.models.user import User
from app.services.event_normalizer import EventNormalizer
from app.services.ai_detection_engine import ai_detection_engine
from app.services.rules_engine import RuleEngine
from app.logging_config import get_logger
from app.config import settings
from datetime import datetime

router = APIRouter(prefix="/webhook", tags=["webhooks"])
logger = get_logger(__name__)

def verify_webhook_signature(body: bytes, signature: str | None) -> bool:
    if not signature or not settings.WEBHOOK_SECRET:
        return True
    try:
        expected = hmac.new(
            key=settings.WEBHOOK_SECRET.encode(),
            msg=body,
            digestmod=hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(signature, expected)
    except Exception as e:
        logger.error("signature_verification_failed", error=str(e))
        return False

@router.post("/qubic/events")
async def receive_qubic_event(
    request: Request,
    db: AsyncSession = Depends(get_db),
    x_signature: str | None = Header(None, alias="X-Signature")
):
    body = await request.body()
    if not verify_webhook_signature(body, x_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    try:
        payload = await request.json()
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    
    alert_id = payload.get("alert_id")
    if not alert_id:
        raise HTTPException(status_code=400, detail="Missing alert_id")
    
    result = await db.execute(
        select(EasyConnectConfig).where(EasyConnectConfig.alert_id == alert_id)
    )
    ec_config = result.scalar_one_or_none()
    if not ec_config:
        raise HTTPException(status_code=404, detail="Alert ID not found")
    
    user_result = await db.execute(select(User).where(User.id == ec_config.user_id))
    user = user_result.scalar_one_or_none()
    if user and not user.webhook_test_received:
        user.webhook_test_received = True
        await db.flush()
    
    event = Event(
        user_id=ec_config.user_id,
        easyconnect_config_id=ec_config.id,
        raw_payload=payload,
        event_type=payload.get("event_type", "Unknown")
    )
    db.add(event)
    await db.flush()
    
    normalizer = EventNormalizer()
    normalized = await normalizer.normalize(event, db)
    if not normalized:
        return {"status": "error", "message": "Normalization failed"}
    
    detection = await ai_detection_engine.analyze_event(normalized, db)
    
    rule_engine = RuleEngine(db)
    incidents = await rule_engine.evaluate_event(normalized)
    
    await db.commit()
    
    return {
        "status": "success",
        "event_id": str(event.id),
        "ai_detection": True if detection else False,
        "incidents_created": len(incidents)
    }

@router.get("/health")
async def webhook_health():
    return {"status": "healthy"}
