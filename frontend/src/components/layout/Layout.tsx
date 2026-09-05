import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
    { path: '/dashboard', idx: '01', label: 'OVERVIEW' },
    { path: '/detections', idx: '02', label: 'DETECTIONS' },
    { path: '/webhooks', idx: '03', label: 'HOOKS' },
    { path: '/analytics', idx: '04', label: 'ANALYTICS' },
]

function clockStamp() {
    return new Date().toISOString().replace('T', ' ').slice(0, 19) + 'Z'
}

export const Layout = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const [now, setNow] = useState(clockStamp)

    useEffect(() => {
        const id = setInterval(() => setNow(clockStamp()), 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <div className="noc-shell">
            <div className="noc-scan" aria-hidden />
            <div className="noc-vignette" aria-hidden />
            <header className="noc-top">
                <Link to="/dashboard" className="noc-brand">
                    <strong>QRR</strong>
                    <span>RISK RADAR</span>
                </Link>
                <div className="noc-status">
                    <span className="live-pip" aria-hidden />
                    <span>LINK NOMINAL</span>
                    <span>NET // QUBIC</span>
                    <span className="clock">{now}</span>
                </div>
            </header>

            <div className="noc-mid">
                <nav className="noc-rail" aria-label="Console">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => (isActive ? 'active' : undefined)}
                        >
                            <span className="idx">{item.idx}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                    <div className="rail-foot">
                        <div>{user?.email || 'OPERATOR / LOCAL'}</div>
                        {isAuthenticated ? (
                            <button type="button" className="linkish" onClick={logout}>
                                Sign off
                            </button>
                        ) : (
                            <Link to="/login">AUTH</Link>
                        )}
                    </div>
                </nav>
                <main className="noc-pane">
                    <Outlet />
                </main>
            </div>

            <footer className="noc-bot">
                <div className="noc-ticker">
                    QRR WATCH // INGEST WEBHOOKS · RULE EVAL · INCIDENT QUEUE · DISPATCH DISCORD/TELEGRAM · OPTIONAL GEMINI SCORING · SELF-HOSTED FASTAPI · NO VENDOR LOCK
                </div>
            </footer>
        </div>
    )
}
