import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Webhook } from '../types';
import './WebhooksManagement.css';

export default function WebhooksManagement() {
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

    useEffect(() => {
        loadWebhooks();
    }, []);

    const loadWebhooks = async () => {
        try {
            const data = await apiClient.getWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error('Failed to load webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this ingest hook?')) return;
        try {
            await apiClient.deleteWebhook(id);
            await loadWebhooks();
        } catch (error) {
            console.error('Failed to delete webhook:', error);
        }
    };

    const handleRegenerateSecret = async (id: string) => {
        if (!confirm('This invalidates the current shared secret. Continue?')) return;
        try {
            const result = await apiClient.regenerateWebhookSecret(id);
            alert(`NEW SECRET: ${result.new_secret}`);
            await loadWebhooks();
        } catch (error) {
            console.error('Failed to regenerate secret:', error);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="webhooks-page">
            <div className="page-head">
                <div>
                    <h1>Ingest hooks</h1>
                    <p className="subtitle">EasyConnect endpoints. Shared secret on the wire.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowEditor(true)}>
                    New hook
                </button>
            </div>

            {webhooks.length === 0 ? (
                <div className="empty-state">
                    <p>NO HOOKS ARMED</p>
                    <button className="primary-btn" onClick={() => setShowEditor(true)}>
                        Arm first hook
                    </button>
                </div>
            ) : (
                <div className="hook-table">
                    <div className="hook-head">
                        <span>NAME</span>
                        <span>ALERT ID</span>
                        <span>PRI</span>
                        <span>EVENTS</span>
                        <span></span>
                    </div>
                    {webhooks.map((webhook) => (
                        <div key={webhook.id} className="hook-row">
                            <div>
                                <strong>{webhook.name}</strong>
                                {webhook.is_primary && <span className="pri-flag"> PRIMARY</span>}
                                {webhook.description && <p>{webhook.description}</p>}
                            </div>
                            <code>{webhook.alert_id}</code>
                            <span className="score">{webhook.webhook_priority}</span>
                            <span className="score">{webhook.total_events}</span>
                            <div className="hook-actions">
                                <button type="button" onClick={() => { setEditingWebhook(webhook); setShowEditor(true); }}>
                                    Edit
                                </button>
                                <button type="button" onClick={() => handleRegenerateSecret(webhook.id)}>
                                    Secret
                                </button>
                                <button type="button" className="danger" onClick={() => handleDelete(webhook.id)}>
                                    Drop
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showEditor && (
                <WebhookEditorModal
                    webhook={editingWebhook}
                    onClose={() => { setShowEditor(false); setEditingWebhook(null); }}
                    onSave={async () => { await loadWebhooks(); setShowEditor(false); setEditingWebhook(null); }}
                />
            )}
        </div>
    );
}

function WebhookEditorModal({ webhook, onClose, onSave }: any) {
    const [formData, setFormData] = useState({
        name: webhook?.name || '',
        description: webhook?.description || '',
        alert_id: webhook?.alert_id || '',
        tags: webhook?.tags || [],
        webhook_priority: webhook?.webhook_priority || 50,
        is_primary: webhook?.is_primary || false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (webhook) {
                await apiClient.updateWebhook(webhook.id, formData);
            } else {
                await apiClient.createWebhook(formData);
            }
            await onSave();
        } catch (error) {
            console.error('Failed to save webhook:', error);
            alert('SAVE FAILED');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{webhook ? 'Edit hook' : 'Arm hook'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>Alert ID</label>
                        <input
                            type="text"
                            value={formData.alert_id}
                            onChange={(e) => setFormData({ ...formData, alert_id: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Priority {formData.webhook_priority}</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.webhook_priority}
                            onChange={(e) => setFormData({ ...formData, webhook_priority: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.is_primary}
                                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                            />
                            Primary ingest
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={onClose}>Abort</button>
                        <button type="submit" className="primary-btn">Commit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
