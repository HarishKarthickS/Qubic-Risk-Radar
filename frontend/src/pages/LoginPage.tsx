import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.detail || 'AUTH REJECTED')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-screen">
            <div className="noc-scan" aria-hidden />
            <div className="auth-card">
                <div className="noc-brand">
                    <strong>QRR</strong>
                    <span>STATION LOGIN</span>
                </div>
                <h2>Identify</h2>
                <p>
                    Operator console. No account? <Link to="/signup">request access</Link>
                </p>
                <form onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}
                    <label htmlFor="email">Callsign / email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Passphrase</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? 'CHECKING…' : 'ENTER CONSOLE'}
                    </button>
                </form>
            </div>
        </div>
    )
}
