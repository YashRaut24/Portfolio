import { useState, useEffect, useRef } from 'react';
import './MissionControl.css';

const INITIAL_LOGS = [
  { level: 'OK', text: 'Initializing deep space telemetry protocol...' },
  { level: 'OK', text: 'Mounting StarField particle matrix & orbital physics engine...' },
  { level: 'OK', text: 'Booting neural subsystems & full-stack core services...' },
  { level: 'OK', text: 'Synthesizing Web Audio oscillators & UI frequencies...' },
  { level: 'OK', text: 'Establishing secure uplink with YashRaut24 code repository...' },
  { level: 'SYS', text: 'Sector 08 (Mission Control) telemetry online and nominal.' },
  { level: 'INFO', text: 'Type "help" or click command chips below for diagnostics.' },
];

const PRESET_COMMANDS = ['status', 'stats', 'nodes', 'ping', 'clear'];

function MissionControl() {
  const [logs, setLogs] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [missionTime, setMissionTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mission clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds into T+HH:MM:SS
  const formatMissionTime = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `T+${hrs}:${mins}:${secs}`;
  };

  // Staggered log streaming on boot
  useEffect(() => {
    let timeouts = [];
    INITIAL_LOGS.forEach((logItem, index) => {
      const timeout = setTimeout(() => {
        setLogs((prev) => [...prev, { ...logItem, id: Date.now() + index, time: new Date().toLocaleTimeString() }]);
      }, 200 + index * 260);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCommandSubmit = (cmd) => {
    const trimmed = (cmd || inputVal).trim().toLowerCase();
    if (!trimmed) return;

    const timeStr = new Date().toLocaleTimeString();
    const userLog = { level: 'CMD', text: `> ${trimmed}`, id: Date.now(), time: timeStr };

    if (trimmed === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    }

    let responseLogs = [];

    switch (trimmed) {
      case 'help':
        responseLogs = [
          { level: 'SYS', text: 'AVAILABLE TELEMETRY COMMANDS:' },
          { level: 'INFO', text: '  status  - Read out vessel and neural subsystem health' },
          { level: 'INFO', text: '  stats   - Summary of portfolio codebase metrics' },
          { level: 'INFO', text: '  nodes   - List active planetary orbit sectors' },
          { level: 'INFO', text: '  ping    - Measure communication latency with server' },
          { level: 'INFO', text: '  tech    - Inspect propulsion stack (React 18, Vite, Framer)' },
          { level: 'INFO', text: '  clear   - Purge mission control display buffer' },
        ];
        break;

      case 'status':
        responseLogs = [
          { level: 'OK', text: '[DIAGNOSTIC] All 8 orbital nodes communicating.' },
          { level: 'OK', text: '[MEMORY] WebGL & Canvas buffers: 100% stable.' },
          { level: 'OK', text: '[AUDIO] Sound synthesis engine: Armed & responsive.' },
          { level: 'SYS', text: '[INTEGRITY] Core system operational index: NOMINAL.' },
        ];
        break;

      case 'stats':
        responseLogs = [
          { level: 'SYS', text: 'PORTFOLIO RECURSIVE METRICS:' },
          { level: 'INFO', text: '  • Code Volume: ~12,400+ LOC (JSX, CSS, Config)' },
          { level: 'INFO', text: '  • Modular Components: 40+ active React modules' },
          { level: 'INFO', text: '  • Total Repository Commits: 340+ deploys' },
          { level: 'INFO', text: '  • Orbit Velocity: 60 FPS hardware accelerated' },
        ];
        break;

      case 'nodes':
        responseLogs = [
          { level: 'ORBIT', text: '01: About (Earth Sector // #60A5FA)' },
          { level: 'ORBIT', text: '02: Skills (Gas Sector // #8B5CF6)' },
          { level: 'ORBIT', text: '03: Projects (Forest Sector // #22C55E)' },
          { level: 'ORBIT', text: '04: Achievements (Gold Sector // #F59E0B)' },
          { level: 'ORBIT', text: '05: Experience (Ice Sector // #06B6D4)' },
          { level: 'ORBIT', text: '06: Contact (Lava Sector // #EC4899)' },
          { level: 'ORBIT', text: '07: GitHub (Moon Sector // #6366F1)' },
          { level: 'SYS', text: '08: Mission Control (Sun Sector // #FFD54F) [CURRENT]' },
        ];
        break;

      case 'ping':
        responseLogs = [
          { level: 'OK', text: 'PING yash-portfolio.internal (127.0.0.1): 64 bytes' },
          { level: 'OK', text: 'Uplink round-trip delay: 14.2ms | Packet loss: 0.0%' },
        ];
        break;

      case 'tech':
        responseLogs = [
          { level: 'SYS', text: 'ENGINEERING & PROPULSION SPECIFICATIONS:' },
          { level: 'INFO', text: '  • Framework: React 18 + Vite Bundler' },
          { level: 'INFO', text: '  • Animations: Framer Motion + Kinetic Physics' },
          { level: 'INFO', text: '  • Styling: Pure CSS Custom Design System' },
          { level: 'INFO', text: '  • Audio Engine: Web Audio API Oscillator Matrix' },
        ];
        break;

      default:
        responseLogs = [
          { level: 'WARN', text: `Command not recognized: "${trimmed}". Type "help" for list.` },
        ];
        break;
    }

    setLogs((prev) => [
      ...prev,
      userLog,
      ...responseLogs.map((item, idx) => ({
        ...item,
        id: Date.now() + idx + 1,
        time: timeStr,
      })),
    ]);
    setInputVal('');
  };

  const handleChipClick = (cmd) => {
    handleCommandSubmit(cmd);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText('PORTFOLIO-CORE-SHA256-A9F2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mission-control-section">
      {/* 1. TOP SYSTEM DIAGNOSTICS & TELEMETRY PANEL */}
      <div className="telemetry-hud-card stagger-item" style={{ '--stagger-index': 0 }}>
        {/* Top telemetry status bar */}
        <div className="telemetry-bar">
          <div className="telemetry-status-group">
            <span className="telemetry-beacon"></span>
            <span className="telemetry-status-text">SYSTEM STATUS: NOMINAL</span>
          </div>
          <div className="telemetry-clock-group">
            <span className="telemetry-label">MISSION CLOCK:</span>
            <span className="telemetry-clock-val">{formatMissionTime(missionTime)}</span>
          </div>
          <div className="telemetry-sector-badge">
            ORBIT SECTOR 08 // SOLAR CORE
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="diagnostic-grid">
          {/* Card 1: Total LOC */}
          <div className="diag-metric-box">
            <div className="diag-metric-header">
              <span className="diag-metric-title">CODEBASE VOLUME</span>
              <span className="diag-badge-online">ONLINE</span>
            </div>
            <div className="diag-metric-value">
              12,400<span className="diag-metric-unit">+ LOC</span>
            </div>
            <div className="diag-progress-track">
              <div className="diag-progress-bar bar-jsx" style={{ width: '58%' }} title="JSX / React (58%)"></div>
              <div className="diag-progress-bar bar-css" style={{ width: '32%' }} title="Vanilla CSS (32%)"></div>
              <div className="diag-progress-bar bar-cfg" style={{ width: '10%' }} title="Config & Data (10%)"></div>
            </div>
            <div className="diag-metric-footer">
              <span>React 58%</span>
              <span>CSS 32%</span>
              <span>Data 10%</span>
            </div>
          </div>

          {/* Card 2: Modular Components */}
          <div className="diag-metric-box">
            <div className="diag-metric-header">
              <span className="diag-metric-title">MODULAR MODULES</span>
              <span className="diag-badge-online">ACTIVE</span>
            </div>
            <div className="diag-metric-value">
              40<span className="diag-metric-unit">+ COMPONENTS</span>
            </div>
            <div className="diag-meter-pills">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="diag-meter-node active" title={`Sector ${i + 1} Module`}></span>
              ))}
            </div>
            <div className="diag-metric-footer">
              <span>8 Orbit Sectors</span>
              <span>0 Runtime Faults</span>
            </div>
          </div>

          {/* Card 3: Total Commits */}
          <div className="diag-metric-box">
            <div className="diag-metric-header">
              <span className="diag-metric-title">GIT PROPULSION</span>
              <span className="diag-badge-online">SYNCED</span>
            </div>
            <div className="diag-metric-value">
              340<span className="diag-metric-unit">+ COMMITS</span>
            </div>
            <div className="diag-progress-track">
              <div className="diag-progress-bar bar-gold" style={{ width: '100%' }}></div>
            </div>
            <div className="diag-metric-footer">
              <span>Branch: main @ HEAD</span>
              <span>CI/CD: Passed</span>
            </div>
          </div>

          {/* Card 4: Engine Architecture */}
          <div className="diag-metric-box">
            <div className="diag-metric-header">
              <span className="diag-metric-title">TELEMETRY ENGINE</span>
              <span className="diag-badge-online">60 FPS</span>
            </div>
            <div className="diag-metric-value">
              100<span className="diag-metric-unit">% NOMINAL</span>
            </div>
            <div className="diag-progress-track">
              <div className="diag-progress-bar bar-cyan" style={{ width: '92%' }}></div>
            </div>
            <div className="diag-metric-footer">
              <span>Framer Motion Physics</span>
              <span>Web Audio Synth</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE MISSION CONTROL TERMINAL */}
      <div className="terminal-hud-window stagger-item" style={{ '--stagger-index': 1 }}>
        {/* Terminal Header Bar */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="tdot tdot-red"></span>
            <span className="tdot tdot-amber"></span>
            <span className="tdot tdot-green"></span>
          </div>
          <div className="terminal-title">
            <span className="terminal-sys-icon">⚡</span>
            <span>MISSION_CONTROL // TTY-ALPHA [LIVE FEED]</span>
          </div>
          <button 
            className="terminal-id-chip" 
            onClick={handleCopyHash}
            title="Click to copy telemetry build hash"
          >
            {copied ? 'HASH COPIED!' : '#A9F-2026'}
          </button>
        </div>

        {/* Terminal Output Stream */}
        <div className="terminal-screen" role="log" aria-live="polite">
          {logs.map((log) => {
            let levelClass = 'log-info';
            if (log.level === 'OK') levelClass = 'log-ok';
            if (log.level === 'SYS') levelClass = 'log-sys';
            if (log.level === 'ORBIT') levelClass = 'log-orbit';
            if (log.level === 'WARN') levelClass = 'log-warn';
            if (log.level === 'CMD') levelClass = 'log-cmd';

            return (
              <div key={log.id} className={`terminal-log-line ${levelClass}`}>
                {log.level !== 'CMD' && (
                  <span className="log-badge">[{log.level}]</span>
                )}
                <span className="log-content">{log.text}</span>
              </div>
            );
          })}
          
          <div className="terminal-cursor-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-active-input">{inputVal}</span>
            <span className="blinking-cursor">_</span>
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Bar & Command Quick-Chips */}
        <div className="terminal-footer">
          <form 
            className="terminal-input-form" 
            onSubmit={(e) => {
              e.preventDefault();
              handleCommandSubmit();
            }}
          >
            <span className="prompt-symbol">$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input-field"
              placeholder="Enter telemetry command (e.g. status, stats, nodes, ping, help)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              spellCheck="false"
              autoComplete="off"
            />
            <button type="submit" className="terminal-send-btn" aria-label="Transmit telemetry command">
              TRANSMIT ↵
            </button>
          </form>

          {/* Quick preset chips */}
          <div className="terminal-chips-row">
            <span className="chips-label">QUICK TELEMETRY:</span>
            {PRESET_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                className="telemetry-chip-btn"
                onClick={() => handleChipClick(cmd)}
              >
                [{cmd}]
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissionControl;
