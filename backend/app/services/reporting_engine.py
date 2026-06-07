import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from uuid import UUID
from collections import defaultdict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc
from app.models.ai_detection import AIDetection, MultiScopeReport
from app.models.event import NormalizedEvent
from app.models.incident import Incident
from app.config import settings

logger = logging.getLogger(__name__)

class ReportingEngine:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def generate_report(
        self,
        user_id: UUID,
        scope: str = 'all',
        time_range_days: int = 7,
        report_type: str = 'standard'
    ) -> MultiScopeReport:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(days=time_range_days)
        
        incidents = await self._fetch_incidents(user_id, start_time, end_time)
        stats = self._calculate_statistics(incidents)
        
        report = MultiScopeReport(
            user_id=user_id,
            report_type=report_type,
            scope=scope,
            time_range_start=start_time,
            time_range_end=end_time,
            total_events=len(incidents),
            total_detections=len(incidents),
            critical_count=stats['by_severity'].get('CRITICAL', 0),
            high_count=stats['by_severity'].get('HIGH', 0),
            medium_count=stats['by_severity'].get('MEDIUM', 0),
            low_count=stats['by_severity'].get('LOW', 0),
            executive_summary=f"Analysis of {len(incidents)} incidents over {time_range_days} days.",
            risk_assessment=self._assess_risk(stats),
            by_category=stats['by_category'],
            by_severity=stats['by_severity'],
            by_scope=stats['by_scope'],
            top_addresses=stats['top_addresses'],
            recommendations=["Review critical incidents immediately."]
        )
        
        self.db.add(report)
        await self.db.commit()
        await self.db.refresh(report)
        return report

    async def _fetch_incidents(self, user_id: UUID, start_time: datetime, end_time: datetime) -> List[Incident]:
        query = select(Incident).where(
            and_(
                Incident.user_id == user_id,
                Incident.created_at >= start_time,
                Incident.created_at <= end_time
            )
        ).order_by(desc(Incident.created_at))
        result = await self.db.execute(query)
        return list(result.scalars().all())

    def _calculate_statistics(self, incidents: List[Incident]) -> Dict[str, Any]:
        stats = {
            'by_severity': defaultdict(int),
            'by_category': defaultdict(int),
            'by_scope': defaultdict(int),
            'top_addresses': []
        }
        for inc in incidents:
            stats['by_severity'][inc.severity] += 1
            if inc.category:
                stats['by_category'][inc.category] += 1
            if inc.scope:
                stats['by_scope'][inc.scope] += 1
        
        stats['by_severity'] = dict(stats['by_severity'])
        stats['by_category'] = dict(stats['by_category'])
        stats['by_scope'] = dict(stats['by_scope'])
        return stats

    def _assess_risk(self, stats: Dict[str, Any]) -> str:
        critical = stats['by_severity'].get('CRITICAL', 0)
        if critical > 5: return 'extreme'
        if critical > 0: return 'high'
        return 'low'

def get_reporting_engine(db: AsyncSession) -> ReportingEngine:
    return ReportingEngine(db)
