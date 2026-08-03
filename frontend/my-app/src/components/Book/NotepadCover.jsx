import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./NotepadCover.css";

const DRAG_DISTANCE = 240;
const COMMIT_RATIO = 0.55;
const STRIP_HEIGHT = 45;
const STRIP_COLLAPSE_START = 125;

export default function NotepadCover({
  onOpen,
  pageIndex = 0,
  openStrip = false,
  isClosing = false,          // NEW: Tells the cover to animate shut
  onCloseComplete,            // NEW: Callback for when it finishes closing
  onMotionStart,
  onMotionEnd,
  onStripInteract,
}) {
  const hasTurnedPages = pageIndex > 0;
  const turnedPagesAttr = hasTurnedPages ? "true" : "false";

  // If closing, we must start at 180 degrees so we can animate down
  const rotateX = useMotionValue(openStrip || isClosing ? 180 : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBehind, setIsBehind] = useState(openStrip || isClosing);
  
  // If we are actively closing, it is NOT complete
  const [isOpenComplete, setIsOpenComplete] = useState(openStrip);
  const [isDraggingNow, setIsDraggingNow] = useState(false);
  
  // Synchronous Interaction Locks
  const isAnimatingRef = useRef(false);
  const activePointerIdRef = useRef(null);
  
  const pointerStartY = useRef(0);
  const pointerStartAngle = useRef(0);
  const coverRef = useRef(null);
  const [stripScale, setStripScale] = useState(0.1);

  useEffect(() => {
    const el = coverRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      if (h > 0) setStripScale(STRIP_HEIGHT / h);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shadowOpacity = useTransform(
    rotateX,
    [180, 140, 90, 45, 0],
    [0, 0.15, 0.7, 0.45, 0.28]
  );

  const rollProgress = useTransform(rotateX, [0, 180], [0, 1]);
  const contentOpacity = useTransform(
    rotateX,
    [0, 20, STRIP_COLLAPSE_START],
    [1, 0.4, 0]
  );

  const stripProgress = useTransform(
    rotateX,
    [STRIP_COLLAPSE_START, 180],
    [0, 1],
    { clamp: true }
  );

  const coverScaleY = useTransform(stripProgress, [0, 1], [1, stripScale]);
  const coverScaleX = useTransform(
      rotateX,
   [0, 45, 90, 135, 180],
   [1, 0.94, 0.88, 0.94, 1]
   );
  
  useEffect(() => {
    if (openStrip) return undefined;
    const unsubscribe = rotateX.on("change", (latest) => {
      if (latest >= 175) setIsBehind(true);
      else if (latest <= 170) setIsBehind(false);
    });
    return unsubscribe;
  }, [rotateX, openStrip]);

  const settleTo = (targetAngle, info = null) => {
    if (isAnimatingRef.current || openStrip) return;
    
    // Synchronously lock interactions
    isAnimatingRef.current = true;
    setIsAnimating(true);
    setIsDraggingNow(false);
    onMotionStart && onMotionStart();

    const pixelVelocityY = info?.velocity?.y ?? 0;
    const degreeVelocity = -(pixelVelocityY / DRAG_DISTANCE) * 180;
    const opening = targetAngle >= 180;

    animate(rotateX, targetAngle, {
      type: "spring",
      stiffness: opening ? 95 : 110,
      damping: 18,
      mass: 0.85,
      velocity: degreeVelocity,
      restDelta: 0.001,
      onComplete: () => {
        // Safely release locks
        isAnimatingRef.current = false;
        const nowOpen = targetAngle >= 180;
        setIsOpenComplete(nowOpen);
        setIsAnimating(false);
        onMotionEnd && onMotionEnd();
        
        if (nowOpen) onOpen && onOpen();
        if (!nowOpen && isClosing) onCloseComplete && onCloseComplete();
      },
    });
  };

  // REVERSE ENGINE: If instructed to close, wait 30ms for mount, then fire the physics downwards
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        settleTo(0);
      }, 30);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosing]);

  const handlePointerDown = (e) => {
    if (isAnimatingRef.current) return;
    if (activePointerIdRef.current !== null) return;

    activePointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerStartY.current = e.clientY;
    pointerStartAngle.current = rotateX.get();

    // If it's the open strip, record the initial touch but do not animate the cover physics
    if (openStrip) return;

    setIsOpenComplete(false);
    setIsDraggingNow(true);

    onMotionStart?.();
  };

  const handlePointerMove = (e) => {
    if (isAnimatingRef.current || openStrip) return;
    if (activePointerIdRef.current !== e.pointerId) return;

    const deltaY = e.clientY - pointerStartY.current;

    const next = Math.max(
      0,
      Math.min(
        180,
        pointerStartAngle.current - (deltaY / DRAG_DISTANCE) * 180
      )
    );

    rotateX.set(next);
  };

  const handlePointerUp = (e) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
    
    if (isAnimatingRef.current) return;

    // Trigger physical pull-down if interacting with the open binding strip
    if (openStrip) {
      onStripInteract && onStripInteract();
      return;
    }

    setIsDraggingNow(false);

    const current = rotateX.get();

    if (current >= 90) {
      settleTo(180);
    } else {
      settleTo(0);
    }
  };

  const isStrip = openStrip || isOpenComplete;

  return (
    <motion.div
      ref={coverRef}
      data-has-turned-pages={turnedPagesAttr}
      className={`notepad-cover ${
        isStrip
          ? "notepad-cover-open-strip"
          : isBehind
          ? "notepad-cover-behind"
          : isDraggingNow 
          ? "" 
          : "notepad-cover-front-layer"
      }`}
      transformTemplate={({ rotateX, scaleY, z }) => {
        return `perspective(2500px) translateZ(${z || "0px"}) translateY(${isStrip ? "-3px" : "0px"}) rotateX(${rotateX || "0deg"}) scaleY(${scaleY !== undefined ? scaleY : 1})`;
      }}
      style={{
        rotateX: isStrip ? 0 : rotateX,
        scaleY: isStrip ? 1 : coverScaleY,
        z: isStrip ? 0 : isBehind ? -5 : 5,
        transformOrigin: "50% 0%",
        willChange: "transform",
        "--shadow-opacity": shadowOpacity,
        "--roll-progress": isStrip ? 1 : rollProgress,
        touchAction: "none",
        transformStyle: "preserve-3d",
        transformPerspective: 2500,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="notepad-cover-roll-stage" aria-hidden="true">
        <div className="paper-roll paper-roll-front" />
        <div className="paper-roll paper-roll-back" />
        <div className="fold-shadow" />
        <div className="underside-highlight" />
      </div>

      <motion.div
        className="notepad-ring-tag"
        aria-hidden="true"
        style={{
          opacity: isStrip ? 0 : contentOpacity,
          display: isStrip ? "none" : "flex",
        }}
      >
        <svg
          className="notepad-ring-svg"
          viewBox="0 0 60 40"
          width="52"
          height="34"
        >
          <defs>
            <linearGradient id="ringMetal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f2f2f2" />
              <stop offset="45%" stopColor="#b9b9b9" />
              <stop offset="100%" stopColor="#7c7c7c" />
            </linearGradient>
          </defs>
          <path
            d="M13,31 A17,15 0 1 1 47,31"
            fill="none"
            stroke="url(#ringMetal)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="notepad-tag">Profile</span>
      </motion.div>

      <div className="notepad-cover-face notepad-cover-front">
       <motion.div
          className="paper-face-content"
          style={{
            opacity: isStrip ? 0 : contentOpacity,
            pointerEvents: isStrip ? "none" : "auto",
            display: isStrip ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/images/YashPhoto_.webp"
            alt="Portrait of Yash Raut"
            className="notepad-cover-photo"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            onError={(e) => e.target.style.display = 'none'}
          />
          <h1 className="notepad-cover-name">Yash Raut</h1>
          <p className="notepad-cover-edu">BE Comps</p>
          <p className="notepad-cover-year">2023 - 2027</p>
          
          <div className="notepad-cover-role-stack">
            <span>Full-Stack Developer</span>
            <span className="notepad-cover-ampersand">&</span>
            <span>Aspiring AIML Engineer</span>
          </div>
          
          <a 
            href="https://linkedin.com/in/yash-raut-240505-yr30" 
            target="_blank" 
            rel="noopener noreferrer"
            className="notepad-cover-social"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          
          <div className="notepad-cover-hint">Swipe up to open</div>
        </motion.div>
      </div>

      <div className="notepad-cover-face notepad-cover-back" />
    </motion.div>
  );
}