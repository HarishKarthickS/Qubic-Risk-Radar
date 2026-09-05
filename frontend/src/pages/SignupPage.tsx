import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage() {
    const { signup } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signup(formData.email, formData.password, formData.fullName)
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'CREATE FAILED')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="auth-screen">
                <div className="noc-scan" aria-hidden />
                <div className="auth-card">
                    <div className="noc-brand">
                        <strong>QRR</strong>
                        <span>MAIL CHECK</span>
                    </div>
                    <h2>Verify inbox</h2>
                    <p>
                        Confirmation sent to <strong>{formData.email}</strong>. Open the link, then sign in.
                    </p>
                    <Link to="/login" className="primary-btn">Return to login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-screen">
            <div className="noc-scan" aria-hidden />
            <div className="auth-card">
                <div className="noc-brand">
                    <strong>QRR</strong>
                    <span>NEW OPERATOR</span>
                </div>
                <h2>Request access</h2>
                <p>Local FastAPI station. Trial flags in env are leftovers, not a billed product.</p>
                <form onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    <label htmlFor="fullName">Name</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <label htmlFor="password">Passphrase</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <p>Minimum 8 characters.</p>
                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? 'WRITING…' : 'CREATE OPERATOR'}
                    </button>
                    <p>
                        Already keyed? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
