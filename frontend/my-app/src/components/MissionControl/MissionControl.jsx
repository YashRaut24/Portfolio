import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MissionControl.css';

// Sound synthesizer using Web Audio API
function playSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'reconnect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.35);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'slider') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'decrypt') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500 + Math.random() * 400, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Audio context not allowed or unsupported; fail silently
  }
}

function MissionControl({ starFieldRef }) {
  const [activeTab, setActiveTab] = useState('satellite'); // 'satellite' | 'universe' | 'transmission'

  // =========================================================================
  // 1. 🛰️ LOST SATELLITE STATE
  // =========================================================================
  const radarRef = useRef(null);
  const [satellitePos, setSatellitePos] = useState({ x: -130, y: -90 });
  const [satelliteDistance, setSatelliteDistance] = useState(160);
  const [signalStrength, setSignalStrength] = useState(14);
  const [isReconnected, setIsReconnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetSatellite = () => {
    setIsReconnected(false);
    setSatellitePos({ x: -140 + Math.random() * 40, y: -100 + Math.random() * 30 });
    setSignalStrength(15);
    setSatelliteDistance(170);
    playSound('beep');
  };

  const handleSatelliteDrag = (event, info) => {
    if (!radarRef.current || isReconnected) return;
    setIsDragging(true);

    const rect = radarRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate current position relative to center hub
    const currentX = satellitePos.x + info.offset.x;
    const currentY = satellitePos.y + info.offset.y;

    const dist = Math.sqrt(currentX * currentX + currentY * currentY);
    setSatelliteDistance(Math.round(dist));

    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const strength = Math.max(10, Math.min(100, Math.round(100 - (dist / maxDist) * 90)));
    setSignalStrength(strength);

    // Reconnection threshold: within 52px of center
    if (dist < 52 && !isReconnected) {
      setIsReconnected(true);
      setSatellitePos({ x: 0, y: 0 });
      setSignalStrength(100);
      playSound('reconnect');
      starFieldRef?.current?.triggerStarBurst?.();
    }
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (isReconnected) return;

    const newX = satellitePos.x + info.offset.x;
    const newY = satellitePos.y + info.offset.y;
    const dist = Math.sqrt(newX * newX + newY * newY);

    if (dist < 55) {
      setIsReconnected(true);
      setSatellitePos({ x: 0, y: 0 });
      setSignalStrength(100);
      playSound('reconnect');
      starFieldRef?.current?.triggerStarBurst?.();
    } else {
      setSatellitePos({ x: newX, y: newY });
    }
  };

  // =========================================================================
  // 2. 🌌 CHANGE THE UNIVERSE STATE
  // =========================================================================
  const [universeParams, setUniverseParams] = useState({
    starDensity: 1.0,   // 0.5 - 2.5
    orbitSpeed: 1.0,    // 0.5 - 4.0
    chaosHue: 0,        // 0 - 360 deg
    hyperMode: false,
  });
  const [universeModified, setUniverseModified] = useState(false);

  // Apply universe changes to root CSS properties
  useEffect(() => {
    const root = document.documentElement;
    if (universeModified) {
      root.style.setProperty('--star-glow', `rgba(255, 213, 79, ${0.4 * universeParams.starDensity})`);
      root.style.setProperty('--constellation-color', `rgba(255, 213, 79, ${0.15 * universeParams.starDensity})`);
      root.style.setProperty(
        '--galaxy-cloud-1',
        `hsla(${universeParams.chaosHue + 220}, 75%, 50%, ${0.12 * universeParams.starDensity})`
      );
      root.style.setProperty(
        '--galaxy-cloud-2',
        `hsla(${universeParams.chaosHue + 280}, 80%, 45%, ${0.15 * universeParams.starDensity})`
      );
    } else {
      root.style.removeProperty('--star-glow');
      root.style.removeProperty('--constellation-color');
      root.style.removeProperty('--galaxy-cloud-1');
      root.style.removeProperty('--galaxy-cloud-2');
    }

    return () => {
      root.style.removeProperty('--star-glow');
      root.style.removeProperty('--constellation-color');
      root.style.removeProperty('--galaxy-cloud-1');
      root.style.removeProperty('--galaxy-cloud-2');
    };
  }, [universeParams, universeModified]);

  const updateUniverseParam = (key, value) => {
    setUniverseParams((prev) => ({ ...prev, [key]: value }));
    setUniverseModified(true);
    playSound('slider');
  };

  const handleTriggerStarBurst = () => {
    starFieldRef?.current?.triggerStarBurst?.();
    playSound('reconnect');
  };

  const resetUniverse = () => {
    setUniverseParams({
      starDensity: 1.0,
      orbitSpeed: 1.0,
      chaosHue: 0,
      hyperMode: false,
    });
    setUniverseModified(false);
    playSound('beep');
  };

  // =========================================================================
  // 3. 📡 INTERCEPTED TRANSMISSION STATE
  // =========================================================================
  const [transmissionSeen, setTransmissionSeen] = useState(() => {
    try {
      return localStorage.getItem('yash_portfolio_transmission_seen') === 'true';
    } catch {
      return false;
    }
  });
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decodedProgress, setDecodedProgress] = useState(transmissionSeen ? 100 : 0);
  const [revealedLines, setRevealedLines] = useState(transmissionSeen ? 4 : 0);

  const startDecryption = useCallback(() => {
    if (isDecrypting) return;
    setIsDecrypting(true);
    setDecodedProgress(0);
    setRevealedLines(0);
    playSound('beep');

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      playSound('decrypt');
      setDecodedProgress(Math.min(100, Math.round((step / 16) * 100)));

      if (step === 4) setRevealedLines(1);
      if (step === 8) setRevealedLines(2);
      if (step === 12) setRevealedLines(3);
      if (step >= 16) {
        clearInterval(interval);
        setRevealedLines(4);
        setIsDecrypting(false);
        setTransmissionSeen(true);
        playSound('reconnect');
        try {
          localStorage.setItem('yash_portfolio_transmission_seen', 'true');
        } catch {
          // localStorage disabled
        }
      }
    }, 110);
  }, [isDecrypting]);

  return (
    <div className="mission-control-section easter-egg-hub">
      {/* HUD WINDOW SHELL */}
      <div className="terminal-hud-window egg-window">
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="tdot tdot-red" title="Station offline"></span>
            <span className="tdot tdot-amber" title="Standby telemetry"></span>
            <span className="tdot tdot-green" title="Uplink armed"></span>
          </div>

          <div className="terminal-title">
            <span className="terminal-sys-icon">⚡</span>
            <span>MISSION_CONTROL // SECRET_LAB_SECTOR_08</span>
          </div>

          <div className="telemetry-badge-group">
            <span className="station-code-chip">STATION: YASH-01</span>
          </div>
        </div>

        {/* PROTOCOL SELECTOR TABS */}
        <div className="egg-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'satellite'}
            className={`egg-tab-btn ${activeTab === 'satellite' ? 'active' : ''}`}
            onClick={() => { setActiveTab('satellite'); playSound('beep'); }}
          >
            <span className="tab-icon">🛰️</span>
            <span className="tab-name">01. Lost Satellite</span>
            <span className={`tab-status-pill ${isReconnected ? 'pill-done' : 'pill-drift'}`}>
              {isReconnected ? 'RESTORED' : 'DRIFTING'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'universe'}
            className={`egg-tab-btn ${activeTab === 'universe' ? 'active' : ''}`}
            onClick={() => { setActiveTab('universe'); playSound('beep'); }}
          >
            <span className="tab-icon">🌌</span>
            <span className="tab-name">02. Change Universe</span>
            <span className={`tab-status-pill ${universeModified ? 'pill-done' : 'pill-default'}`}>
              {universeModified ? 'MODIFIED' : 'DEFAULT'}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'transmission'}
            className={`egg-tab-btn ${activeTab === 'transmission' ? 'active' : ''}`}
            onClick={() => { setActiveTab('transmission'); playSound('beep'); }}
          >
            <span className="tab-icon">📡</span>
            <span className="tab-name">03. Transmission</span>
            <span className={`tab-status-pill ${transmissionSeen ? 'pill-done' : 'pill-ping'}`}>
              {transmissionSeen ? 'DECODED' : 'ENCRYPTED'}
            </span>
          </button>
        </div>

        {/* ACTIVE PROTOCOL WORKSPACE */}
        <div className="egg-content-viewport">
          <AnimatePresence mode="wait">
            {/* =========================================================================
                TAB 1: 🛰️ LOST SATELLITE
               ========================================================================= */}
            {activeTab === 'satellite' && (
              <motion.div
                key="satellite-tab"
                className="egg-panel satellite-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="egg-panel-header">
                  <div className="panel-title-wrap">
                    <span className="egg-badge">EXPERIMENT 01</span>
                    <h3 className="egg-heading">Drifting Orbital Satellite</h3>
                  </div>
                  <div className="signal-hud-metric">
                    <span className="metric-label">SIGNAL STRENGTH:</span>
                    <span className={`metric-value ${signalStrength >= 90 ? 'strong' : ''}`}>
                      {signalStrength}%
                    </span>
                  </div>
                </div>

                <p className="egg-instruction">
                  {isReconnected
                    ? '✦ Satellite locked with Station YASH-01. Telemetry signal stream established!'
                    : 'A drifting satellite is off-course. Drag it toward the central hub beacon to restore uplink.'}
                </p>

                {/* Radar Grid Field */}
                <div className="radar-arena-wrapper" ref={radarRef}>
                  <div className="radar-grid-rings" aria-hidden="true">
                    <div className="radar-ring r1"></div>
                    <div className="radar-ring r2"></div>
                    <div className="radar-ring r3"></div>
                    <div className="radar-crosshair-h"></div>
                    <div className="radar-crosshair-v"></div>
                    <div className="radar-sweep-beam"></div>
                  </div>

                  {/* Central Hub Station (Docking target) */}
                  <div className={`hub-dock-target ${isReconnected ? 'dock-locked' : ''}`}>
                    <div className="hub-target-beacon"></div>
                    <div className="hub-target-rings"></div>
                    <div className="hub-dock-label">
                      <span className="hub-icon-core">⚡</span>
                      <span>YASH-01 HUB</span>
                    </div>
                  </div>

                  {/* Draggable Satellite */}
                  <motion.div
                    className={`draggable-satellite-node ${isReconnected ? 'satellite-docked' : ''} ${
                      isDragging ? 'is-dragging' : ''
                    }`}
                    drag={!isReconnected}
                    dragConstraints={radarRef}
                    dragElastic={0.15}
                    onDrag={handleSatelliteDrag}
                    onDragEnd={handleDragEnd}
                    animate={
                      isReconnected
                        ? { x: 0, y: 0, scale: [1, 1.15, 1], rotate: 360 }
                        : {
                            x: satellitePos.x,
                            y: satellitePos.y,
                            rotate: [0, 5, -5, 0],
                          }
                    }
                    transition={
                      isReconnected
                        ? { duration: 0.8, ease: 'easeOut' }
                        : {
                            rotate: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
                          }
                    }
                    whileHover={{ scale: 1.08 }}
                    whileDrag={{ scale: 1.18, cursor: 'grabbing' }}
                  >
                    <div className="satellite-visual">
                      <div className="sat-panel sat-panel-left"></div>
                      <div className="sat-chassis">
                        <span className="sat-beacon-dot"></span>
                        🛰️
                      </div>
                      <div className="sat-panel sat-panel-right"></div>
                    </div>
                    <div className="satellite-tag">
                      {isReconnected ? 'LOCKED' : 'DRAG ME'}
                    </div>
                  </motion.div>
                </div>

                {/* REVEAL TEXT ON RECONNECT */}
                {isReconnected ? (
                  <motion.div
                    className="egg-reveal-box reveal-success"
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="reveal-header">
                      <span className="reveal-badge-ok">✓ UPLINK NOMINAL</span>
                      <button
                        type="button"
                        className="reveal-reset-btn"
                        onClick={resetSatellite}
                      >
                        ↺ Drift Again
                      </button>
                    </div>

                    <div className="reveal-content-body">
                      <h4 className="reveal-title">SIGNAL RESTORED</h4>
                      <div className="reveal-meta-row">
                        <span className="reveal-meta-key">Origin:</span>
                        <span className="reveal-meta-val origin-val">YASH-01</span>
                      </div>
                      <div className="reveal-meta-row">
                        <span className="reveal-meta-key">Status:</span>
                        <span className="reveal-meta-val status-val">Still building things.</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="radar-status-bar">
                    <span className="status-item">TARGET DISTANCE: {satelliteDistance}px</span>
                    <span className="status-item">PROXIMITY: {signalStrength}%</span>
                    <span className="status-item hint">DRAG SATELLITE TO CENTER</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* =========================================================================
                TAB 2: 🌌 CHANGE THE UNIVERSE
               ========================================================================= */}
            {activeTab === 'universe' && (
              <motion.div
                key="universe-tab"
                className="egg-panel universe-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="egg-panel-header">
                  <div className="panel-title-wrap">
                    <span className="egg-badge">EXPERIMENT 02</span>
                    <h3 className="egg-heading">Cosmic Spacetime Synthesizer</h3>
                  </div>
                  <button
                    type="button"
                    className="burst-trigger-btn"
                    onClick={handleTriggerStarBurst}
                    title="Trigger a live cosmic star burst"
                  >
                    ✨ Star Burst
                  </button>
                </div>

                <p className="egg-instruction">
                  Adjust fundamental cosmological parameters. The live background stars, nebula clouds, and ambient lighting react in real-time.
                </p>

                {/* Interactive Sliders Grid */}
                <div className="universe-controls-grid">
                  {/* Slider 1: Star Density & Luminance */}
                  <div className="universe-slider-card">
                    <div className="slider-label-row">
                      <span className="slider-title">✨ Star Density &amp; Glow</span>
                      <span className="slider-value-badge">{universeParams.starDensity.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.1"
                      value={universeParams.starDensity}
                      onChange={(e) => updateUniverseParam('starDensity', parseFloat(e.target.value))}
                      className="universe-range-input"
                    />
                    <div className="slider-ticks">
                      <span>0.5x (Sparse)</span>
                      <span>1.0x (Nominal)</span>
                      <span>2.5x (Hyper-dense)</span>
                    </div>
                  </div>

                  {/* Slider 2: Orbit Velocity */}
                  <div className="universe-slider-card">
                    <div className="slider-label-row">
                      <span className="slider-title">🪐 Orbit Spacetime Velocity</span>
                      <span className="slider-value-badge">{universeParams.orbitSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="4.0"
                      step="0.2"
                      value={universeParams.orbitSpeed}
                      onChange={(e) => updateUniverseParam('orbitSpeed', parseFloat(e.target.value))}
                      className="universe-range-input"
                    />
                    <div className="slider-ticks">
                      <span>0.5x (Gentle Drift)</span>
                      <span>1.0x (Standard)</span>
                      <span>4.0x (Warp Drive)</span>
                    </div>
                  </div>

                  {/* Slider 3: Nebula Chaos Hue Shift */}
                  <div className="universe-slider-card">
                    <div className="slider-label-row">
                      <span className="slider-title">🌌 Cosmic Chaos / Nebula Hue</span>
                      <span className="slider-value-badge">{universeParams.chaosHue}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={universeParams.chaosHue}
                      onChange={(e) => updateUniverseParam('chaosHue', parseInt(e.target.value, 10))}
                      className="universe-range-input hue-slider"
                    />
                    <div className="slider-ticks">
                      <span>0° (Deep Space)</span>
                      <span>180° (Solar Flare)</span>
                      <span>360° (Supernova)</span>
                    </div>
                  </div>
                </div>

                {/* REVEAL TEXT WHEN MODIFIED */}
                {universeModified ? (
                  <motion.div
                    className="egg-reveal-box reveal-universe"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="reveal-header">
                      <span className="reveal-badge-universe">🌌 COSMOLOGY ALTERED</span>
                      <button
                        type="button"
                        className="reveal-reset-btn"
                        onClick={resetUniverse}
                      >
                        ↺ Reset Reality
                      </button>
                    </div>
                    <div className="reveal-content-body">
                      <h4 className="reveal-title universe-title">UNIVERSE PARAMETERS UPDATED</h4>
                      <p className="reveal-subtitle">Reality successfully modified.</p>
                      <div className="universe-telemetry-tags">
                        <span className="u-tag">Density: {universeParams.starDensity.toFixed(1)}x</span>
                        <span className="u-tag">Speed: {universeParams.orbitSpeed.toFixed(1)}x</span>
                        <span className="u-tag">Hue: {universeParams.chaosHue}°</span>
                        <span className="u-tag live">LIVE ON SCREEN</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="universe-footer-hint">
                    <span>Move any slider above to update the living portfolio universe constants.</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* =========================================================================
                TAB 3: 📡 INTERCEPTED TRANSMISSION
               ========================================================================= */}
            {activeTab === 'transmission' && (
              <motion.div
                key="transmission-tab"
                className="egg-panel transmission-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="egg-panel-header">
                  <div className="panel-title-wrap">
                    <span className="egg-badge">EXPERIMENT 03</span>
                    <h3 className="egg-heading">Encrypted Deep Space Beacon</h3>
                  </div>
                  <div className="frequency-badge">
                    <span className="beacon-pulse-dot"></span>
                    <span>1420.405 MHz (WOW! BAND)</span>
                  </div>
                </div>

                {/* Blinking Signal Intercept Trigger */}
                <div className="transmission-terminal-box">
                  <div className="terminal-decrypt-status">
                    <div className="signal-frequency-bar">
                      <span className="freq-label">SIGNAL STATUS:</span>
                      <span className={`freq-state ${revealedLines >= 4 ? 'state-decoded' : 'state-blinking'}`}>
                        {revealedLines >= 4 ? 'DECRYPTED // ARCHIVED' : isDecrypting ? `DECRYPTING (${decodedProgress}%)` : 'BLINKING ENCRYPTED FREQUENCY'}
                      </span>
                    </div>

                    {!isDecrypting && revealedLines < 4 && (
                      <button
                        type="button"
                        className="decrypt-signal-btn"
                        onClick={startDecryption}
                      >
                        <span className="btn-ping-dot"></span>
                        📡 Click to Decrypt Transmission
                      </button>
                    )}
                  </div>

                  {/* Decrypted Output Screen */}
                  <div className="decrypted-terminal-screen">
                    {revealedLines === 0 && !isDecrypting && (
                      <div className="transmission-idle-message">
                        <span className="scrambled-cipher">
                          %*!#0x7F9A_CIPHER_LOCKED__1420.405_FREQ_STANDBY
                        </span>
                        <p className="idle-subtext">Click the blinking beacon above to begin quantum decryption.</p>
                      </div>
                    )}

                    {isDecrypting && (
                      <div className="decryption-in-progress">
                        <div className="decrypt-progress-bar">
                          <div
                            className="decrypt-progress-fill"
                            style={{ width: `${decodedProgress}%` }}
                          ></div>
                        </div>
                        <span className="decrypt-scramble-text">
                          RUNNING CIPHER MATRIX... [{decodedProgress}%] {Array(12).fill(0).map(() => String.fromCharCode(33 + Math.floor(Math.random() * 60))).join('')}
                        </span>
                      </div>
                    )}

                    {/* Line by line typewriter reveal */}
                    {revealedLines >= 1 && (
                      <div className="transmission-log-line ok-line">
                        <span className="line-prefix">&gt;&gt;&gt;</span>
                        <span>FREQUENCY 1420.405 MHz LOCKED • QUANTUM CIPHER ACCEPTED</span>
                      </div>
                    )}

                    {revealedLines >= 2 && (
                      <div className="transmission-log-line origin-line">
                        <span className="line-prefix">&gt;&gt;&gt;</span>
                        <span>UPLINK ORIGIN: DEEP SPACE RELAY // SECTOR YASH-01</span>
                      </div>
                    )}

                    {revealedLines >= 4 && (
                      <motion.div
                        className="egg-reveal-box reveal-transmission"
                        initial={{ opacity: 0, scale: 0.98, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="reveal-header">
                          <span className="reveal-badge-transmission">📡 SECURE PACKET</span>
                          <button
                            type="button"
                            className="reveal-reset-btn"
                            onClick={startDecryption}
                          >
                            ↺ Replay
                          </button>
                        </div>

                        <div className="reveal-content-body">
                          <h4 className="reveal-title transmission-title">TRANSMISSION DECODED</h4>
                          <blockquote className="transmission-quote">
                            &ldquo;You actually looked deeper than most people do.&rdquo;
                          </blockquote>
                          <div className="transmission-signature">
                            — Yash Raut (Developer &amp; Explorer)
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="transmission-footer-meta">
                  <span>STORAGE: {transmissionSeen ? 'LOCAL_STORAGE [SEEN]' : 'AWAITING FIRST INTERCEPT'}</span>
                  <span>ENCRYPTION: 256-BIT ROTATING RSA</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MissionControl;
