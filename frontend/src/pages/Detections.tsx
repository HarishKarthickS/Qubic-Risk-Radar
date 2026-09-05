import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Detection } from '../types';
import './Detections.css';

export default function Detections() {
    const [detections, setDetections] = useState<Detection[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        severity: '',
        category: '',
        days: 7
    });

    useEffect(() => {
        loadDetections();
    }, [page, filters]);

    const loadDetections = async () => {
        try {
            setLoading(true);
            const data = await apiClient.getDetections({
                page,
                page_size: 20,
                ...filters
            });
            setDetections(data.detections || []);
            setTotalPages(data.total_pages || 1);
        } catch (error) {
            console.error('Failed to load detections:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="detections-page">
            <div className="page-head">
                <div>
                    <h1>Detection tape</h1>
                    <p className="subtitle">Severity is the signal. Filter the queue, do not decorate it.</p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="filter-group">
                    <label>Severity</label>
                    <select
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    >
                        <option value="">ALL</option>
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                        <option value="INFO">INFO</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Lookback</label>
                    <select
                        value={filters.days}
                        onChange={(e) => setFilters({ ...filters, days: parseInt(e.target.value) })}
                    >
                        <option value={1}>24H</option>
                        <option value={7}>7D</option>
                        <option value={30}>30D</option>
                        <option value={90}>90D</option>
                    </select>
                </div>

                <button className="refresh-btn" onClick={loadDetections}>
                    Reload
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Reading tape…</p>
                </div>
            ) : detections.length === 0 ? (
                <div className="empty-state">
                    <p>NO ROWS</p>
                    <p className="subtitle">Widen lookback or drop the severity gate.</p>
                </div>
            ) : (
                <>
                    <div className="tape">
                        <div className="tape-head">
                            <span>SEV</span>
                            <span>CAT</span>
                            <span>SUMMARY</span>
                            <span>CONF</span>
                            <span>ANOM</span>
                            <span>UTC</span>
                        </div>
                        {detections.map((detection) => (
                            <div key={detection.id} className="tape-row">
                                <span className={`sev ${detection.severity}`}>{detection.severity}</span>
                                <span className="cat">{detection.primary_category}</span>
                                <div>
                                    <p className="summary">{detection.summary}</p>
                                    {!!detection.detected_patterns?.length && (
                                        <div className="pattern-tags">
                                            {detection.detected_patterns.slice(0, 3).map((pattern, idx) => (
                                                <span key={idx} className="pattern-tag">{pattern}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="score">{Math.round(detection.confidence * 100)}</span>
                                <span className="score">{Math.round(detection.anomaly_score * 100)}</span>
                                <span className="timestamp">
                                    {new Date(detection.created_at).toISOString().slice(0, 16).replace('T', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Prev
                            </button>
                            <span>{page} / {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
