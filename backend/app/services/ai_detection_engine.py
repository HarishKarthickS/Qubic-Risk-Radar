import json
import time
import logging
import google.generativeai as genai
from typing import Dict, Any, Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.models.ai_detection import AIDetection
from app.models.event import NormalizedEvent

logger = logging.getLogger(__name__)

class AIDetectionEngine:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set - AI detection disabled")
            self.enabled = False
            return
        
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
            self.enabled = settings.ENABLE_AI_DETECTION
            logger.info(f"AI Detection Engine initialized with model: {settings.GEMINI_MODEL}")
        except Exception as e:
            logger.error(f"Failed to initialize AI Engine: {e}")
            self.enabled = False
    
    async def analyze_event(
        self,
        event: NormalizedEvent,
        db: AsyncSession
    ) -> Optional[AIDetection]:
        if not self.enabled:
            return None
        
        existing = await db.execute(
            select(AIDetection).where(AIDetection.event_id == event.id)
        )
        if existing.scalar_one_or_none():
            return existing.scalar_one_or_none()
        
        try:
            start_time = time.time()
            prompt = self._build_detection_prompt(event)
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            analysis = self._parse_response(response.text)
            
            processing_time = int((time.time() - start_time) * 1000)
            
            detection = AIDetection(
                event_id=event.id,
                user_id=event.user_id,
                anomaly_score=analysis['anomaly_score'],
                severity=analysis['severity'],
                confidence=analysis['confidence'],
                primary_category=analysis['category'],
                sub_categories=analysis.get('sub_categories'),
                scope=self._determine_scope(event, analysis),
                summary=analysis['summary'],
                detailed_analysis=analysis.get('detailed_analysis'),
                detected_patterns=analysis.get('patterns', []),
                risk_factors=analysis.get('risk_factors', []),
                recommendations=analysis.get('recommendations', []),
                related_addresses=analysis.get('related_addresses', []),
                model_version=settings.GEMINI_MODEL,
                processing_time_ms=processing_time
            )
            
            db.add(detection)
            await db.flush()
            
            return detection
            
        except Exception as e:
            logger.error(f"AI analysis failed for event {event.id}: {str(e)}")
            return None
    
    def _build_detection_prompt(self, event: NormalizedEvent) -> str:
        event_data = event.metadata_json or {}
        return f"""Analyze this Qubic blockchain event:
Type: {event.event_name}
From: {event.from_address}
To: {event.to_address}
Amount: {event.amount} {event.token_symbol}
Data: {json.dumps(event_data)}

Respond ONLY with JSON:
{{
  "anomaly_score": <float 0-1>,
  "severity": "<CRITICAL|HIGH|MEDIUM|LOW|INFO>",
  "confidence": <float 0-1>,
  "category": "<WhaleActivity|SecurityThreat|ExchangeFlow|UnusualPattern|NormalActivity>",
  "sub_categories": [],
  "summary": "...",
  "detailed_analysis": "...",
  "patterns": [],
  "risk_factors": [],
  "recommendations": [],
  "related_addresses": []
}}"""

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        try:
            text = response_text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
        except:
            return {
                'anomaly_score': 0.5,
                'severity': 'MEDIUM',
                'confidence': 0.3,
                'category': 'UnusualPattern',
                'summary': 'Parse failed'
            }
    
    def _determine_scope(self, event: NormalizedEvent, analysis: Dict[str, Any]) -> str:
        if event.to_address and len(event.to_address) > 40:
            return 'protocol'
        return 'wallet'

import asyncio
ai_detection_engine = AIDetectionEngine()
