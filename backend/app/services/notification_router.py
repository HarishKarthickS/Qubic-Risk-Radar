import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.ai_detection import AIDetection, NotificationRoutingRule, NotificationLog
from app.models.user import User
from app.models.incident import Incident
from app.config import settings

logger = logging.getLogger(__name__)

class NotificationRouter:
    DEFAULT_ROUTING = {
        'CRITICAL': ['discord', 'telegram', 'email'],
        'HIGH': ['discord', 'telegram'],
        'MEDIUM': ['telegram'],
        'LOW': [],
        'INFO': []
    }
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def route_incident(self, incident: Incident, user: User) -> Dict[str, Any]:
        channels = self.DEFAULT_ROUTING.get(incident.severity, [])
        results = {}
        for channel in channels:
            results[channel] = True
        return results

    async def create_default_rules(self, user_id: UUID):
        default_rules = [
            {'severity': 'CRITICAL', 'email_enabled': 'true', 'priority': 10},
            {'severity': 'HIGH', 'email_enabled': 'false', 'priority': 7}
        ]
        for rd in default_rules:
            rule = NotificationRoutingRule(user_id=user_id, **rd)
            self.db.add(rule)
        await self.db.commit()
