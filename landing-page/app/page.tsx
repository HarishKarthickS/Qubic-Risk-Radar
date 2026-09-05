export default function Home() {
  return (
    <main className="station">
      <header className="topbar">
        <a href="/" className="brand">
          <strong>QRR</strong>
          <span>RISK RADAR</span>
        </a>
        <nav className="links">
          <a href="#watch">Watch</a>
          <a href="#stack">Stack</a>
          <a href="#deploy">Deploy</a>
          <a href="https://github.com/HarishKarthickS/Qubic-Risk-Radar">Source</a>
        </nav>
        <span className="live">
          <span className="pip" aria-hidden />
          Station idle until you host it
        </span>
      </header>

      <section className="hero" id="watch">
        <div>
          <p className="kicker">Qubic network operations // self-hosted</p>
          <h1>Watch the chain. Page on rule fire.</h1>
          <p className="lede">
            FastAPI ingest for EasyConnect webhooks. Rules evaluate transfers and contract
            events, incidents persist, Discord and Telegram get the page. Optional Gemini
            scoring is a flag, not the product.
          </p>
          <div className="actions">
            <a className="btn solid" href="#deploy">Bring up stack</a>
            <a
              className="btn ghost"
              href="https://github.com/HarishKarthickS/Qubic-Risk-Radar"
            >
              Read the tape
            </a>
          </div>
        </div>

        <div className="crt-frame" aria-label="Sample event tape">
          <div className="crt-bar">
            <span>TAPE // SAMPLE</span>
            <span>SEV AS SIGNAL</span>
          </div>
          <div className="log">
            <div className="row">
              <span className="CRIT">CRIT</span>
              <span>WHALE 12.4M QUBIC  src 0xA1.. → sink 0xC9..</span>
            </div>
            <div className="row">
              <span className="HIGH">HIGH</span>
              <span>RULE hit  LargeTransfer  tick 1842291</span>
            </div>
            <div className="row">
              <span className="MED">MED</span>
              <span>HOOK retry  discord  latency 412ms</span>
            </div>
            <div className="row">
              <span className="OK">OK</span>
              <span>INGEST  easyconnect  secret match</span>
            </div>
            <div className="row">
              <span className="OK">OK</span>
              <span>QUEUE  incidents open=0  redis pong</span>
            </div>
          </div>
        </div>
      </section>

      <div className="metrics">
        <div className="metric">
          <b>FASTAPI</b>
          <span>Ingest + rules</span>
        </div>
        <div className="metric">
          <b>SELF</b>
          <span>Hosted by you</span>
        </div>
        <div className="metric">
          <b>0</b>
          <span>Vendor lock</span>
        </div>
        <div className="metric">
          <b>SEV</b>
          <span>Color = function</span>
        </div>
      </div>

      <section className="section" id="stack">
        <h2>What the station actually runs</h2>
        <table className="matrix">
          <thead>
            <tr>
              <th>Lane</th>
              <th>Job</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>INGEST</td>
              <td>Shared-secret webhooks from EasyConnect. Events land in Postgres with JSONB for later queries.</td>
            </tr>
            <tr>
              <td>RULES</td>
              <td>Python evaluators (thresholds, addresses, patterns). Dedup into an incident list operators can scan.</td>
            </tr>
            <tr>
              <td>DISPATCH</td>
              <td>Discord webhook/bot, Telegram, SMTP or SendGrid — only if you configure them.</td>
            </tr>
            <tr>
              <td>CONSOLE</td>
              <td>Vite operator UI: detection tape, hook secrets, severity rollup. Same CRT language as this page.</td>
            </tr>
            <tr>
              <td>OPTIONAL</td>
              <td>Gemini anomaly scoring when ENABLE_AI_DETECTION and GEMINI_API_KEY are set. Off by default.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section" id="deploy">
        <h2>Bring the stack up</h2>
        <div className="deploy">
          <p className="kicker">docker compose // see DEPLOY.md</p>
          <pre>{`cp .env.example .env
docker compose up --build
# console :3000   api :8000`}</pre>
        </div>
      </section>

      <footer className="foot">
        <span>QRR // MIT // Qubic ecosystem</span>
        <span>Not a billed SaaS. Run your own station.</span>
      </footer>
    </main>
  );
}
