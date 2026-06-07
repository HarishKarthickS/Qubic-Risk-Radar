from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.event import NormalizedEvent
from app.models.rule import Rule
from app.models.incident import Incident, IncidentEvent
from app.logging_config import get_logger
from app.config import settings

logger = get_logger(__name__)

class RuleEngine:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def evaluate_event(self, event: NormalizedEvent) -> List[Incident]:
        if not settings.RULE_EVALUATION_ENABLED:
            return []
        
        result = await self.db.execute(select(Rule).where(Rule.enabled == True))
        rules = result.scalars().all()
        
        incidents = []
        for rule in rules:
            try:
                if await self._evaluate_rule(event, rule):
                    incident = await self._create_incident(event, rule)
                    if incident:
                        incidents.append(incident)
            except Exception as e:
                logger.error("rule_evaluation_failed", rule_id=str(rule.id), error=str(e))
        
        return incidents
    
    async def _evaluate_rule(self, event: NormalizedEvent, rule: Rule) -> bool:
        conditions = rule.conditions_json
        if 'event_name' in conditions and event.event_name != conditions['event_name']:
            return False
        if 'amount_greater_than' in conditions and (not event.amount or event.amount <= conditions['amount_greater_than']):
            return False
        return True
    
    async def _create_incident(self, event: NormalizedEvent, rule: Rule) -> Optional[Incident]:
        incident = Incident(
            user_id=event.user_id,
            severity=rule.severity,
            type=rule.type or 'Unknown',
            title=rule.name,
            description=rule.description,
            protocol=event.contract_label,
            contract_address=event.contract_address,
            primary_wallet=event.from_address,
            first_seen_at=event.timestamp,
            last_seen_at=event.timestamp,
            rule_id=rule.id,
            metadata_json={
                'amount': event.amount,
                'token': event.token_symbol,
                'tx_hash': event.tx_hash,
                'event_name': event.event_name,
            }
        )
        self.db.add(incident)
        await self.db.flush()
        
        incident_event = IncidentEvent(incident_id=incident.id, normalized_event_id=event.id)
        self.db.add(incident_event)
        return incident
