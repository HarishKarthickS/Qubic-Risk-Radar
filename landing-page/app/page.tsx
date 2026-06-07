"use client";

import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Wand2, 
  Orbit, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  Server,
  TerminalSquare,
  Cpu,
  Database,
  HardDrive,
  MessageSquare
} from 'lucide-react'

// Enhanced Procedural Digital Art Component
const DigitalCoreArt = () => {
  return (
    <div className="digital-core-art">
      <div className="core-aura" />
      <div className="core-ring core-ring-1" />
      <div className="core-ring core-ring-2" />
      <div className="core-ring core-ring-3" />
      <div className="core-ring core-ring-4" />
      
      <div className="core-node center-node">
        <Orbit className="h-10 w-10 text-[#0d0614]" />
      </div>
      
      {/* Orbiting Elements */}
      <div className="orbit-track track-1">
        <div className="orbit-node node-a" />
      </div>
      <div className="orbit-track track-2">
        <div className="orbit-node node-b" />
        <div className="orbit-node node-c" />
      </div>
      <div className="orbit-track track-3">
        <div className="orbit-node node-a" style={{ background: '#fff', width: '8px', height: '8px' }} />
      </div>
      
      {/* Digital Beams */}
      <div className="beam beam-1" style={{ '--angle': '45deg' } as React.CSSProperties} />
      <div className="beam beam-2" style={{ '--angle': '-30deg' } as React.CSSProperties} />
      <div className="beam beam-3" style={{ '--angle': '80deg' } as React.CSSProperties} />
    </div>
  )
}

export default function Home() {
  const [logs, setLogs] = useState<{ id: number; tag: string; msg: string; time: string }[]>([])
  
  useEffect(() => {
    const demoLogs = [
      { tag: 'AWAKEN', msg: 'Oracle Core v0.1 synchronized with mainnet.' },
      { tag: 'VISION', msg: 'Scrying 512 active smart contracts for anomalies...' },
      { tag: 'PULSE', msg: 'Captured epoch transition. Matrix Tick 14,209,102.' },
      { tag: 'SCRY', msg: 'Disturbance detected: 25,000,000 QUBIC transfer.' },
      { tag: 'MAGIC', msg: 'Neural mapping applied. Confidence factor: 99.8%' },
      { tag: 'CHARM', msg: 'Incident routed via secure Telegram ward.' },
      { tag: 'WARD', msg: 'Threat mitigated. Ecosystem boundaries secure.' },
      { tag: 'AURA', msg: 'All sensors calm. Magic flowing at optimal levels.' }
    ]

    let i = 0
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, { ...demoLogs[i % demoLogs.length], id: Date.now(), time: new Date().toLocaleTimeString([], { hour12: false }) }]
        return newLogs.slice(-7)
      })
      i++
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* Background Magic */}
      <div className="aurora-bg">
        <div className="aurora-orb orb-1" />
        <div className="aurora-orb orb-2" />
        <div className="aurora-orb orb-3" />
      </div>
      <div className="noise-overlay" />
      <div className="stardust" />

      {/* Elegant Navigation */}
      <nav>
        <div className="container nav-content">
          <div className="logo">
            <Orbit className="h-7 w-7 text-[#ff2a85]" /> QUBIC<span>Radar</span>
          </div>
          <div className="nav-links">
            <a href="#oracle">The Oracle</a>
            <a href="#magic">Witchcraft</a>
            <a href="#deploy">Summon</a>
            <a href="https://github.com/HarishKarthickS/Qubic-Risk-Radar" target="_blank" className="btn-outline" style={{ padding: '0.6rem 1.8rem', borderRadius: '100px', fontSize: '0.75rem' }}>Grimoire (Source)</a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Digital Art */}
      <section className="hero container">
        <div className="hero-split">
          <div className="hero-content reveal">
            <div className="badge">
              <Sparkles size={16} /> Open Source Protocol Sentinel
            </div>
            <h1 style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
              Omnipresent<br/>
              <span className="serif">Awareness.</span><br/>
              Absolute<br/>
              <span className="serif">Security.</span>
            </h1>
            <p style={{ textAlign: 'left', margin: '0 0 3.5rem 0', maxWidth: '540px' }}>
              Transform raw network chaos into actionable, crystal-clear intelligence. 
              Qubic Risk Radar is an enchanting, self-hosted monitoring layer powered 
              by elegant rules and neural magic.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-start' }}>
              <a href="#deploy" className="btn btn-primary">
                Summon Instance <ArrowRight size={20} />
              </a>
              <a href="#magic" className="btn btn-outline">
                Explore Magic
              </a>
            </div>
          </div>
          
          <div className="hero-visual reveal delay-1">
            <DigitalCoreArt />
          </div>
        </div>

        {/* The Oracle Stream */}
        <div className="oracle-window reveal delay-2" id="oracle">
          <div className="oracle-header">
            <div className="oracle-dots">
              <div className="o-dot" style={{ background: '#ff2a85' }} />
              <div className="o-dot" style={{ background: '#ffd700' }} />
              <div className="o-dot" style={{ background: '#00f2ff' }} />
            </div>
            <div className="oracle-title">Oracle Scrying Glass v0.1</div>
            <div style={{ width: '56px' }} />
          </div>
          <div className="oracle-content">
            {logs.map(log => (
              <div key={log.id} className="log-row">
                <div className="log-time">
                  <span className="log-bracket">[</span>{log.time}<span className="log-bracket">]</span>
                </div>
                <div className="log-tag">
                  <span className="log-bracket">[</span>{log.tag}<span className="log-bracket">]</span>
                </div>
                <div className="log-msg">{log.msg}</div>
              </div>
            ))}
            <div style={{ color: 'var(--color-primary)', fontWeight: 800, marginTop: '1.5rem', animation: 'pulse 2s infinite' }}>✧ Listening to the ether...</div>
          </div>
        </div>
      </section>

      {/* Arcane Infrastructure (Tech Stack) */}
      <div className="container reveal" style={{ opacity: 0.8 }}>
        <div className="arcane-stack">
          <div className="stack-title">Constructed with Arcane Infrastructure</div>
          <div className="stack-grid">
            <div className="stack-item"><Cpu size={24} color="var(--color-primary)" /> FastAPI</div>
            <div className="stack-item"><Database size={24} color="var(--color-secondary)" /> PostgreSQL</div>
            <div className="stack-item"><HardDrive size={24} color="var(--color-tertiary)" /> Redis</div>
            <div className="stack-item"><Wand2 size={24} color="var(--color-primary)" /> Gemini AI</div>
            <div className="stack-item"><MessageSquare size={24} color="var(--color-secondary)" /> Discord</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="magic" className="features-section container">
        <div className="section-header reveal">
          <h2>Technical <span className="serif">Witchcraft</span></h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '1.35rem', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            Beautiful on the outside. Industrial-grade Python on the inside. Protect your assets with unmatched elegance.
          </p>
        </div>

        <div className="bento-grid">
          <div className="feature-card reveal">
            <div className="icon-wrapper"><Eye size={36} /></div>
            <h3>All-Seeing Eye</h3>
            <p>Connects directly to the Qubic network firehose. We normalize every transfer, contract call, and tick instantly so you never miss a beat of the consensus.</p>
          </div>

          <div className="feature-card fc-2 reveal delay-1">
            <div className="icon-wrapper"><Wand2 size={36} /></div>
            <h3>Rule Enchantments</h3>
            <p>Draft powerful, custom logic to protect your assets. Automate complex threat detection with our lightning-fast, easy-to-configure Pydantic rule engine.</p>
          </div>

          <div className="feature-card fc-3 reveal delay-2">
            <div className="icon-wrapper"><Orbit size={36} /></div>
            <h3>Neural Alchemy</h3>
            <p>Infused with Gemini Pro AI. We go beyond static rules to map behavioral anomalies, whale movements, and sophisticated attacks using cognitive analysis.</p>
          </div>
        </div>
      </section>

      {/* Deployment Section */}
      <section id="deploy" className="blueprint-section container">
        <div className="blueprint-path" />
        
        <div className="section-header reveal">
          <h2>The <span className="serif">Summoning</span> Ritual</h2>
        </div>

        <div className="step-card reveal">
          <div className="step-content">
            <span className="step-num">01.</span>
            <h4>Prepare the Vessels</h4>
            <p>Deploy the core architecture with a single Docker incantation. This breathes life into the FastAPI core, PostgreSQL vault, and Redis cache, creating a secure environment.</p>
          </div>
          <div className="step-visual">
            <div className="orb-visual"><Server size={56} color="var(--color-primary)" opacity={0.9} /></div>
          </div>
        </div>

        <div className="step-card reveal">
          <div className="step-content">
            <span className="step-num">02.</span>
            <h4>Bind the Network</h4>
            <p>Link your instance to the Qubic mainnet via EasyConnect. Direct the turbulent stream of raw network data into your secure, private sanctuary for normalization.</p>
          </div>
          <div className="step-visual">
            <div className="orb-visual" style={{ borderColor: 'rgba(0,242,255,0.3)' }}><TerminalSquare size={56} color="var(--color-secondary)" opacity={0.9} /></div>
          </div>
        </div>

        <div className="step-card reveal">
          <div className="step-content">
            <span className="step-num">03.</span>
            <h4>Cast the Wards</h4>
            <p>Establish your surveillance rules and notification channels. Ensure alerts flow seamlessly to your Discord, Telegram, or Email when danger approaches your borders.</p>
          </div>
          <div className="step-visual">
            <div className="orb-visual" style={{ borderColor: 'rgba(255,215,0,0.3)' }}><ShieldCheck size={56} color="var(--color-tertiary)" opacity={0.9} /></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-logo">QUBIC<span>Radar</span></div>
          <div className="footer-meta">
            <span>© 2025 OPEN SOURCE</span>
            <span>BUILT WITH MAGIC</span>
            <span>MIT LICENSE</span>
            <span>GITHUB</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
