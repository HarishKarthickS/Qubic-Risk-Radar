import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Detection, AnalyticsOverview } from '../types';
import './Dashboard.css';

export default function Dashboard() {
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [overviewData, detectionsData] = await Promise.all([
                apiClient.getAnalyticsOverview(),
                apiClient.getDetections({ page: 1, page_size: 8 })
            ]);
            setOverview(overviewData);
            setRecentDetections(detectionsData.detections || []);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Syncing station…</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="page-head">
                <div>
                    <h1>Station overview</h1>
                    <p className="subtitle">Webhook ingest · rule hits · severity as signal</p>
                </div>
            </div>

            <div className="metric-grid">
                <div className="metric ok">
                    <div className="k">Detections</div>
                    <div className="v">{overview?.total_detections || 0}</div>
                    <div className="n">week {overview?.detections_this_week || 0}</div>
                </div>
                <div className="metric crit">
                    <div className="k">Critical</div>
                    <div className="v">{overview?.by_severity?.CRITICAL || 0}</div>
                    <div className="n">page now</div>
                </div>
                <div className="metric high">
                    <div className="k">High</div>
                    <div className="v">{overview?.by_severity?.HIGH || 0}</div>
                    <div className="n">review queue</div>
                </div>
                <div className="metric med">
                    <div className="k">Last 24h</div>
                    <div className="v">{overview?.detections_today || 0}</div>
                    <div className="n">window</div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-bar">
                    <span>Event log</span>
                    <Link to="/detections" className="view-all">OPEN FULL TAPE →</Link>
                </div>
                <div className="panel-body">
                    {recentDetections.length === 0 ? (
                        <div className="empty-state">
                            <p>NO HITS ON TAPE</p>
                            <p className="subtitle">Ingest is live. Rules have not fired.</p>
                        </div>
                    ) : (
                        recentDetections.map((detection) => (
                            <div key={detection.id} className="log-row">
                                <span className={`sev ${detection.severity}`}>{detection.severity}</span>
                                <span className="cat">{detection.primary_category}</span>
                                <span>{detection.summary}</span>
                                <span className="score">{Math.round(detection.anomaly_score * 100).toString().padStart(3, '0')}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="cmd-grid">
                <Link to="/webhooks" className="cmd">
                    <h4>01 Hooks</h4>
                    <p>Register ingest endpoints and rotate secrets.</p>
                </Link>
                <Link to="/detections" className="cmd">
                    <h4>02 Filter tape</h4>
                    <p>Slice detections by severity and lookback.</p>
                </Link>
                <Link to="/analytics" className="cmd">
                    <h4>03 Rollup</h4>
                    <p>Severity mix and generated reports.</p>
                </Link>
            </div>
        </div>
    );
}
