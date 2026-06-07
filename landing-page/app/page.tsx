import React from 'react';
import { Shield, Zap, Activity, Globe, Database, Fingerprint, ExternalLink, Server } from 'lucide-react';

export default function Home() {
  return (
    <main className="app-container">
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-inner">
          <a href="/" className="brand">
            <Fingerprint className="brand-icon" size={24} />
            Qubic Risk Radar
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#rules" className="nav-link">Rules Engine</a>
            <a href="https://github.com/HarishKarthickS/Qubic-Risk-Radar" target="_blank" rel="noopener noreferrer" className="nav-link">Documentation</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="tag">
              <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', marginRight: 6 }}></span>
              Self-Hosted Monitoring Layer
            </div>
            <h1>Secure your protocol with real-time intelligence.</h1>
            <p>
              An open-source surveillance stack for the Qubic ecosystem. Monitor smart contracts, 
              detect whale movements, and automate threat mitigation instantly.
            </p>
            <div className="hero-actions">
              <a href="#deploy" className="btn btn-primary">
                Deploy Instance
              </a>
              <a href="https://github.com/HarishKarthickS/Qubic-Risk-Radar" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                View Source <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Code Preview */}
          <div className="code-window" id="rules">
            <div className="code-header">
              <div className="window-controls">
                <div className="control close"></div>
                <div className="control min"></div>
                <div className="control max"></div>
              </div>
              <div className="file-name">rules/whale_alert.py</div>
            </div>
            <div className="code-content">
              <div className="code-line">
                <span className="line-num">1</span>
                <span><span className="keyword">from</span> <span className="class">radar.rules</span> <span className="keyword">import</span> BaseRule, Threshold</span>
              </div>
              <div className="code-line">
                <span className="line-num">2</span>
                <span><span className="keyword">from</span> <span className="class">radar.actions</span> <span className="keyword">import</span> DiscordWebhook</span>
              </div>
              <div className="code-line">
                <span className="line-num">3</span>
                <span></span>
              </div>
              <div className="code-line">
                <span className="line-num">4</span>
                <span><span className="keyword">class</span> <span className="class">WhaleMovement</span>(BaseRule):</span>
              </div>
              <div className="code-line">
                <span className="line-num">5</span>
                <span>    <span className="function">name</span> = <span className="string">"Large QUBIC Transfer"</span></span>
              </div>
              <div className="code-line">
                <span className="line-num">6</span>
                <span>    <span className="function">description</span> = <span className="string">"Detects transfers exceeding 10M QUBIC"</span></span>
              </div>
              <div className="code-line">
                <span className="line-num">7</span>
                <span>    </span>
              </div>
              <div className="code-line">
                <span className="line-num">8</span>
                <span>    <span className="keyword">def</span> <span className="function">evaluate</span>(self, event):</span>
              </div>
              <div className="code-line">
                <span className="line-num">9</span>
                <span>        <span className="comment"># Trigger if transfer amount > 10,000,000</span></span>
              </div>
              <div className="code-line">
                <span className="line-num">10</span>
                <span>        <span className="keyword">return</span> event.amount > <span className="number">10_000_000</span></span>
              </div>
              <div className="code-line">
                <span className="line-num">11</span>
                <span></span>
              </div>
              <div className="code-line">
                <span className="line-num">12</span>
                <span>    <span className="keyword">def</span> <span className="function">on_trigger</span>(self, event):</span>
              </div>
              <div className="code-line">
                <span className="line-num">13</span>
                <span>        DiscordWebhook.send(</span>
              </div>
              <div className="code-line">
                <span className="line-num">14</span>
                <span>            channel=<span className="string">"alerts-critical"</span>,</span>
              </div>
              <div className="code-line">
                <span className="line-num">15</span>
                <span>            message=<span className="string">f"Whale Alert: &#123;event.amount&#125; moved from &#123;event.from_address&#125;"</span></span>
              </div>
              <div className="code-line">
                <span className="line-num">16</span>
                <span>        )</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="stats-row">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h4>&lt; 5ms</h4>
              <p>Ingestion Latency</p>
            </div>
            <div className="stat-item">
              <h4>100%</h4>
              <p>Self-Hosted</p>
            </div>
            <div className="stat-item">
              <h4>0</h4>
              <p>Vendor Lock-in</p>
            </div>
            <div className="stat-item">
              <h4>Open</h4>
              <p>Source Architecture</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-head">
            <h2>Industrial-grade infrastructure.</h2>
            <p>Everything you need to monitor the network, built on top of a modern, asynchronous Python stack.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon"><Activity size={24} /></div>
              <h3>Real-time Ingestion</h3>
              <p>Connect directly to Qubic mainnet via EasyConnect webhooks. Capture every tick, transfer, and contract interaction instantly.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon"><Zap size={24} /></div>
              <h3>Custom Rules Engine</h3>
              <p>Write complex evaluation logic in pure Python. Filter events by threshold, address, or historical patterns before they execute.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><Shield size={24} /></div>
              <h3>Multi-channel Dispatch</h3>
              <p>Automate your incident response. Route critical alerts instantly to Discord, Telegram, or internal webhooks.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><Database size={24} /></div>
              <h3>PostgreSQL Persistence</h3>
              <p>Store normalized events safely in a structured database with JSONB indexing for rapid historical analysis and auditing.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><Globe size={24} /></div>
              <h3>REST API</h3>
              <p>Fully documented OpenAPI schema. Integrate the surveillance feed directly into your own trading bots or dashboards.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><Server size={24} /></div>
              <h3>Docker Native</h3>
              <p>Deploy the entire stack (API, DB, Redis) with a single docker-compose command. Total privacy, absolute sovereignty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="brand">
              <Fingerprint className="brand-icon" size={24} />
              Qubic Risk Radar
            </div>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#rules">Rules Engine</a>
              <a href="https://github.com/HarishKarthickS/Qubic-Risk-Radar" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Qubic Risk Radar. Open Source.</p>
            <p>Built for the Qubic Ecosystem.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
