import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ParchmentMenu.css";

const NAV_ITEMS = ["Home", "About", "Technical Skills", "Projects", "Contact"];

// Base64 of the actual parchment texture image
const PARCHMENT_B64 = "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";

const ParchmentMenu = () => {
  const [isOpen, setIsOpen]      = useState(false);
  const [ribbonState, setRibbon] = useState("tied");   // "tied" | "untying" | "gone"
  const [progress, setProgress]  = useState(0);
  const canvasRef                = useRef(null);
  const animRef                  = useRef(null);
  const progressRef              = useRef(0);
  const imgRef                   = useRef(null);

  const W          = 190;
  const ROLL_H     = 52;   // height of the closed rectangular roll
  const FULL_PAPER = 220;

  // Pre-load the parchment texture once
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawFrame(0);
    };
    img.src = "data:image/jpeg;base64," + PARCHMENT_B64;
  }, []);

  // helper: draw a rounded-rect path (replaces ctx.roundRect for compat)
  const rrect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,     y + h, x,     y + h - r, r);
    ctx.lineTo(x,     y + r);
    ctx.arcTo(x,     y,     x + r, y,         r);
    ctx.closePath();
  };

  const drawFrame = (p) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const unrolledH = p * FULL_PAPER;
    // Roll shrinks to zero by p=0.82
    const rollFade  = Math.max(0, 1 - p / 0.82);
    const rollH     = ROLL_H * rollFade;
    const totalH    = Math.ceil(rollH + unrolledH);
    const R         = 7; // corner radius of the roll rect

    canvas.width  = W;
    canvas.height = Math.max(totalH, 1);
    ctx.clearRect(0, 0, W, Math.max(totalH, 1));

    // ── UNROLLED PAPER ──────────────────────────────────
    if (unrolledH > 1) {
      const py = rollH;

      if (imgRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, py, W, unrolledH);
        ctx.clip();
        ctx.drawImage(imgRef.current, 0, py, W, unrolledH);
        ctx.restore();
      } else {
        const pg = ctx.createLinearGradient(0, py, 0, py + unrolledH);
        pg.addColorStop(0, "#eedcaa"); pg.addColorStop(0.5, "#d8ba70"); pg.addColorStop(1, "#eedcaa");
        ctx.fillStyle = pg;
        ctx.fillRect(0, py, W, unrolledH);
      }

      // Left burn edge
      const lg = ctx.createLinearGradient(0, 0, 22, 0);
      lg.addColorStop(0, "rgba(40,18,2,0.72)"); lg.addColorStop(1, "rgba(80,40,8,0)");
      ctx.fillStyle = lg; ctx.fillRect(0, py, 22, unrolledH);

      // Right burn edge
      const rg = ctx.createLinearGradient(W - 22, 0, W, 0);
      rg.addColorStop(0, "rgba(80,40,8,0)"); rg.addColorStop(1, "rgba(40,18,2,0.72)");
      ctx.fillStyle = rg; ctx.fillRect(W - 22, py, 22, unrolledH);

      // Top curl shadow
      const tg = ctx.createLinearGradient(0, py, 0, py + 20);
      tg.addColorStop(0, "rgba(40,18,2,0.5)"); tg.addColorStop(1, "rgba(40,18,2,0)");
      ctx.fillStyle = tg; ctx.fillRect(0, py, W, 20);

      // Bottom burn
      const bg = ctx.createLinearGradient(0, py + unrolledH - 16, 0, py + unrolledH);
      bg.addColorStop(0, "rgba(40,18,2,0)"); bg.addColorStop(1, "rgba(40,18,2,0.55)");
      ctx.fillStyle = bg; ctx.fillRect(0, py + unrolledH - 16, W, 16);

      // Side borders
      ctx.strokeStyle = "rgba(80,40,8,0.5)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0.5, py); ctx.lineTo(0.5, py + unrolledH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 0.5, py); ctx.lineTo(W - 0.5, py + unrolledH); ctx.stroke();

      // Red margin line
      ctx.strokeStyle = "rgba(160,35,35,0.55)"; ctx.lineWidth = 1.2; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(26, py + 8); ctx.lineTo(26, py + unrolledH - 8); ctx.stroke();
    }

    // ── TOP-EDGE CURL (replaces the roll as it fades) ────
    if (unrolledH > 4 && rollFade < 1) {
      const py     = rollH;
      const curlH  = Math.max(4, 10 * rollFade + 5);
      const tg     = ctx.createLinearGradient(0, py, 0, py + curlH);
      tg.addColorStop(0,   "rgba(60,28,4,0.6)");
      tg.addColorStop(0.5, "rgba(90,45,8,0.2)");
      tg.addColorStop(1,   "rgba(90,45,8,0)");
      ctx.fillStyle = tg;
      // curved top-edge using a wide shallow arc
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, py + curlH * 0.4);
      ctx.quadraticCurveTo(W / 2, py - curlH * 0.6, W, py + curlH * 0.4);
      ctx.lineTo(W, py + curlH);
      ctx.lineTo(0, py + curlH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // ── ROUNDED-RECT ROLL ────────────────────────────────
    if (rollH > 2) {
      // Drop shadow
      ctx.save();
      ctx.shadowColor = "rgba(30,12,0,0.45)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
      rrect(ctx, 1, 1, W - 2, rollH - 2, R);
      ctx.fillStyle = "#a07020"; ctx.fill();
      ctx.restore();

      // Main parchment gradient — top-lit paper roll look
      const cg = ctx.createLinearGradient(0, 0, 0, rollH);
      cg.addColorStop(0,    "#7a4c0a");
      cg.addColorStop(0.08, "#b07820");
      cg.addColorStop(0.20, "#e0c878");
      cg.addColorStop(0.36, "#f8ecc8");
      cg.addColorStop(0.50, "#f2e4b8");
      cg.addColorStop(0.68, "#d0a840");
      cg.addColorStop(0.84, "#8a5c12");
      cg.addColorStop(1,    "#5c3808");
      rrect(ctx, 1, 1, W - 2, rollH - 2, R);
      ctx.fillStyle = cg; ctx.fill();

      // Specular glint — clipped to roll rect
      ctx.save();
      rrect(ctx, 1, 1, W - 2, rollH - 2, R);
      ctx.clip();
      const sg = ctx.createLinearGradient(W * 0.15, rollH * 0.12, W * 0.85, rollH * 0.28);
      sg.addColorStop(0,    "rgba(255,248,210,0)");
      sg.addColorStop(0.35, "rgba(255,248,210,0.55)");
      sg.addColorStop(0.65, "rgba(255,248,210,0.6)");
      sg.addColorStop(1,    "rgba(255,248,210,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, rollH * 0.42);
      ctx.restore();

      // Horizontal paper-layer lines on the roll face
      const lineCount = Math.max(0, Math.round((1 - p) * 4));
      for (let i = 0; i < lineCount; i++) {
        const ly = (rollH / (lineCount + 1)) * (i + 1);
        ctx.save();
        rrect(ctx, 1, 1, W - 2, rollH - 2, R);
        ctx.clip();
        ctx.strokeStyle = `rgba(90,50,8,${0.14 - i * 0.02})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(4, ly); ctx.lineTo(W - 4, ly); ctx.stroke();
        ctx.restore();
      }

      // Roll border
      rrect(ctx, 1, 1, W - 2, rollH - 2, R);
      ctx.strokeStyle = "rgba(55,25,4,0.55)"; ctx.lineWidth = 1; ctx.stroke();
    }
  };

  // ── Animation driver ────────────────────────────────
  const animateTo = (target) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const from     = progressRef.current;
    const dur      = 1100;
    const startT   = performance.now();

    // Opening: ease-out-cubic (gravity/falling paper)
    // Closing:  ease-in-cubic  (spring rolling back up)
    const ease = target === 1
      ? (t) => 1 - Math.pow(1 - t, 3)
      : (t) => t * t * t;

    const step = (now) => {
      const raw   = Math.min((now - startT) / dur, 1);
      const val   = from + (target - from) * ease(raw);
      progressRef.current = val;
      setProgress(val);
      drawFrame(val);
      if (raw < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        progressRef.current = target;
        setProgress(target);
        drawFrame(target);
      }
    };
    animRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const handleOpen = () => {
    if (isOpen || ribbonState === "untying") return;
    // Step 1: play untie animation (550ms CSS animation)
    setRibbon("untying");
    setTimeout(() => {
      // Step 2: ribbon gone, now unroll paper
      setRibbon("gone");
      setIsOpen(true);
      animateTo(1);
    }, 520);
  };

  const handleClose = () => {
    setIsOpen(false);
    animateTo(0);
    // Re-tie ribbon after roll-up completes
    setTimeout(() => setRibbon("tied"), 1150);
  };

  return (
    <div className="parchment-container">
      <div className="scroll-outer">

        <div
          className="canvas-host"
          onClick={ribbonState === "tied" ? handleOpen : undefined}
          style={{ cursor: (ribbonState === "tied") ? "pointer" : "default" }}
        >
          <canvas ref={canvasRef} width={W} height={ROLL_H} />
        </div>

        {/* Ribbon — gone once untied */}
        {ribbonState !== "gone" && (
          <div
            className={`ribbon-stage ${ribbonState === "untying" ? "untying" : ""}`}
            style={{ height: ROLL_H }}
            onClick={ribbonState === "tied" ? handleOpen : undefined}
          >
            <div className="ribbon-band"><div className="ribbon-sheen" /></div>
            <div className="bow-center">
              <div className="bow-loop bow-loop--L" />
              <div className="bow-loop bow-loop--R" />
              <div className="bow-knot"><div className="bow-knot-glint" /></div>
              <div className="bow-tail bow-tail--L" />
              <div className="bow-tail bow-tail--R" />
            </div>
          </div>
        )}

        {/* Menu items overlay — appear on the paper section */}
        <AnimatePresence>
          {progress > 0.65 && (
            <motion.div
              className="menu-overlay"
              style={{ top: Math.max(0, ROLL_H * Math.max(0, 1 - progress / 0.82)) + 6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item}
                  className="menu-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.065, duration: 0.22 }}
                >
                  <span className="m-dot" />
                  <span className="m-label">{item}</span>
                </motion.div>
              ))}

              <div className="m-rule" />

              <motion.button
                className="roll-up-btn"
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                  <path d="M2 7.5L7 2.5L12 7.5"
                    stroke="#5a2a08" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>roll up</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ParchmentMenu;