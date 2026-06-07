from typing import Dict, Any, Optional
from datetime import datetime
from app.models.event import NormalizedEvent
from app.logging_config import get_logger

logger = get_logger(__name__)

class EventNormalizer:
    @staticmethod
    def normalize_easyconnect_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            timestamp_str = payload.get('timestamp')
            timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00')) if timestamp_str else datetime.utcnow()
            
            return {
                'chain': 'QUBIC',
                'contract_address': payload.get('contract_address', ''),
                'contract_label': payload.get('contract_name', ''),
                'event_name': payload.get('event_type') or payload.get('method', ''),
                'tx_hash': payload.get('tx_hash', ''),
                'tx_status': payload.get('status', 'unknown'),
                'from_address': payload.get('from_address', ''),
                'to_address': payload.get('to_address', ''),
                'amount': payload.get('amount', 0),
                'token_symbol': payload.get('token_symbol', 'QUBIC'),
                'block_height': payload.get('block_height'),
                'tick': payload.get('tick'),
                'timestamp': timestamp,
                'metadata_json': {
                    'alert_id': payload.get('alert_id'),
                    'metadata': payload.get('metadata', {}),
                }
            }
        except Exception as e:
            logger.error("normalization_failed", error=str(e))
            raise

    async def normalize(self, event, db) -> Optional[NormalizedEvent]:
        data = self.normalize_easyconnect_payload(event.raw_payload)
        normalized = NormalizedEvent(event_id=event.id, user_id=event.user_id, **data)
        db.add(normalized)
        await db.flush()
        return normalized
