import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { AnalyticsOverview, Report } from '../types';
import './Analytics.css';

export default function Analytics() {
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [overviewData, reportsData] = await Promise.all([
                apiClient.getAnalyticsOverview(),
                apiClient.getReports({ limit: 10 })
            ]);
            setOverview(overviewData);
            setReports(reportsData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            await apiClient.generateReport({
                scope: 'all',
                time_range_days: 7,
                report_type: 'detailed'
            });
            await loadData();
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const sevColors: Record<string, string> = {
        CRITICAL: 'var(--sev-crit)',
        HIGH: 'var(--sev-high)',
        MEDIUM: 'var(--sev-med)',
        LOW: 'var(--sev-low)',
        INFO: 'var(--sev-info)'
    };

    return (
        <div className="analytics-page">
            <div className="page-head">
                <div>
                    <h1>Rollup</h1>
                    <p className="subtitle">Counts by severity. Color is the function, not a theme.</p>
                </div>
                <button className="primary-btn" onClick={handleGenerateReport}>
                    Compile report
                </button>
            </div>

            <div className="metric-grid">
                <div className="metric ok">
                    <div className="k">Total</div>
                    <div className="v">{overview?.total_detections || 0}</div>
                    <div className="n">week {overview?.detections_this_week || 0}</div>
                </div>
                <div className="metric med">
                    <div className="k">24h</div>
                    <div className="v">{overview?.detections_today || 0}</div>
                    <div className="n">activity</div>
                </div>
                <div className="metric high">
                    <div className="k">Classes</div>
                    <div className="v">{Object.keys(overview?.by_category || {}).length}</div>
                    <div className="n">categories</div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-bar"><span>Severity mix</span></div>
                <div className="panel-body sev-mix">
                    {Object.entries(overview?.by_severity || {}).map(([severity, count]) => {
                        const total = overview?.total_detections || 1;
                        const percentage = ((count as number) / total) * 100;
                        return (
                            <div key={severity} className="severity-bar-item">
                                <div className="severity-bar-header">
                                    <span className={`sev ${severity}`}>{severity}</span>
                                    <span className="score">{count as number}</span>
                                </div>
                                <div className="severity-bar-track">
                                    <div
                                        className="severity-bar-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: sevColors[severity]
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="panel">
                <div className="panel-bar"><span>Reports</span></div>
                <div className="panel-body">
                    {reports.length === 0 ? (
                        <div className="empty-state">
                            <p>NO COMPILED REPORTS</p>
                            <button className="primary-btn" onClick={handleGenerateReport}>
                                Compile first
                            </button>
                        </div>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="report-item">
                                <div className="report-header">
                                    <h4>{report.scope.toUpperCase()} // {report.report_type}</h4>
                                    <span className="risk-badge">{report.risk_assessment}</span>
                                </div>
                                <div className="report-stats">
                                    <span>N={report.total_detections}</span>
                                    <span className="sev CRITICAL">CRIT {report.critical_count}</span>
                                    <span className="sev HIGH">HIGH {report.high_count}</span>
                                </div>
                                <p className="report-summary">{report.executive_summary}</p>
                                <span className="timestamp">
                                    {new Date(report.generated_at).toISOString().replace('T', ' ').slice(0, 19)}Z
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
