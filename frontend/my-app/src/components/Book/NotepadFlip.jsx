import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import Page from "./Page";
import "./NotepadFlip.css";

const DRAG_DISTANCE = 220;
const COMMIT_RATIO = 0.35;
const STRIP_HEIGHT = 45;
const STRIP_COLLAPSE_START = 125;

const NotepadFlip = forwardRef(function NotepadFlip(
  {
    currentContent,
    prevContent,
    nextContent,
    hasNext,
    hasPrev,
    onPreviewNext,
    onPreviewPrev,
    onPreviewCancel,
    onCommitNext,
    onCommitPrev,
    onExplore,
    onNavigate,
    onUnlock,
  },
  ref
) {
  const rotateX = useMotionValue(0);
  
  // Synchronous Transaction Locks
  const isAnimatingRef = useRef(false);
  const activePointerIdRef = useRef(null);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null); 
  const dragDirRef = useRef(null);
  const dragStartAngleRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isBehind, setIsBehind] = useState(false);

  const flipRefElement = useRef(null);
  const [stripScale, setStripScale] = useState(0.1);

  // Pointer tracking refs
  const pointerStartY = useRef(0);
  const lastPointerY = useRef(0);
  const lastPointerTime = useRef(0);
  const pointerVelocity = useRef(0);

  useEffect(() => {
    const el = flipRefElement.current;
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

  useEffect(() => {
    const unsubscribe = rotateX.on("change", (latest) => {
      setIsBehind((prev) => {
        if (latest >= 90 && !prev) return true;
        if (latest < 90 && prev) return false;
        return prev;
      });
    });
    return unsubscribe;
  }, [rotateX]);

  const stripProgress = useTransform(rotateX, [STRIP_COLLAPSE_START, 180], [0, 1], { clamp: true });
  const scaleY = useTransform(stripProgress, [0, 1], [1, stripScale]);
  
  const progress = useTransform(rotateX, [0, 180], [0, 1]);
  const perspectiveOriginY = useTransform(progress, [0, 0.5, 1], ["0%", "15%", "0%"]);
  const shadowOpacityCurve = useTransform(progress, [0, 0.15, 0.5, 0.85, 1], [0, 0.72, 1, 0.5, 0]);
  const shadowOpacity = useTransform(rotateX, [180, 90, 0], [0.1, 0.4, 0.1]);
  
  const resetIdle = () => {
    dragDirRef.current = null;
    setDirection(null);
    setIsAnimating(false);
    setIsDragging(false);
    isAnimatingRef.current = false;
  };

  const commit = (dir, pixelVelocityY = 0) => {
    isAnimatingRef.current = true;
    setIsAnimating(true);
    const degreeVelocity = -(pixelVelocityY / DRAG_DISTANCE) * 180;

    // Snappy, non-overshooting physics
    const springConfig = {
      type: "spring",
      stiffness: 180,
      damping: 26,
      mass: 0.45,
      velocity: degreeVelocity,
      restDelta: 0.01,
    };

    if (dir === "next") {
      animate(rotateX, 180, {
        ...springConfig,
        onComplete: () => {
          onCommitNext && onCommitNext();
          rotateX.set(0);
          resetIdle();
        },
      });
    } else {
      animate(rotateX, 0, {
        ...springConfig,
        onComplete: () => {
          onCommitPrev && onCommitPrev();
          rotateX.set(0);
          resetIdle();
        },
      });
    }
  };

  const cancel = (dir, pixelVelocityY = 0, startAngle = 0) => {
    isAnimatingRef.current = true;
    setIsAnimating(true);
    const degreeVelocity = -(pixelVelocityY / DRAG_DISTANCE) * 180;

    animate(rotateX, startAngle, {
      type: "spring",
      stiffness: 90,
      damping: 16,
      mass: 0.4,
      velocity: degreeVelocity,
      restDelta: 0.001,
      onComplete: () => {
        onPreviewCancel && onPreviewCancel();
        resetIdle();
      },
    });
  };

  useImperativeHandle(ref, () => ({
    triggerNext: () => {
      // Synchronously reject if animating, physically dragging, or out of bounds
      if (isAnimatingRef.current || activePointerIdRef.current !== null || !hasNext) return;
      
      isAnimatingRef.current = true;
      setIsAnimating(true);
      setDirection("next");
      dragDirRef.current = "next";
      rotateX.set(0);
      onPreviewNext && onPreviewNext();
      commit("next");
    },
    triggerPrev: () => {
      // Synchronously reject if animating, physically dragging, or out of bounds
      if (isAnimatingRef.current || activePointerIdRef.current !== null || !hasPrev) return;
      
      isAnimatingRef.current = true;
      setIsAnimating(true);
      setDirection("prev");
      dragDirRef.current = "prev";
      rotateX.set(180);
      onPreviewPrev && onPreviewPrev();
      commit("prev");
    },
  }));

  const handlePointerDown = (e) => {
    if (isAnimatingRef.current) return;
    if (activePointerIdRef.current !== null) return;
    
    activePointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    
    pointerStartY.current = e.clientY;
    lastPointerY.current = e.clientY;
    lastPointerTime.current = performance.now();
    pointerVelocity.current = 0;
    
    dragStartAngleRef.current = rotateX.get();
    dragDirRef.current = null;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isAnimatingRef.current) return;
    if (activePointerIdRef.current !== e.pointerId) return;

    const now = performance.now();
    const dt = now - lastPointerTime.current;
    if (dt > 0) {
      pointerVelocity.current = ((e.clientY - lastPointerY.current) / dt) * 1000;
    }
    lastPointerY.current = e.clientY;
    lastPointerTime.current = now;

    const deltaY = e.clientY - pointerStartY.current;
    const deltaDeg = -(deltaY / DRAG_DISTANCE) * 180;

    if (!dragDirRef.current) {
      if (deltaDeg > 4 && hasNext) {
        dragDirRef.current = "next";
        setDirection("next");
        onPreviewNext && onPreviewNext();
        dragStartAngleRef.current = 0;
        pointerStartY.current = e.clientY;
      } else if (deltaDeg < -4 && hasPrev) {
        dragDirRef.current = "prev";
        setDirection("prev");
        onPreviewPrev && onPreviewPrev();
        dragStartAngleRef.current = 180;
        rotateX.set(180); 
        pointerStartY.current = e.clientY; 
      } else {
        return;
      }
    }

    const currentDeltaY = e.clientY - pointerStartY.current;
    const currentDeltaDeg = -(currentDeltaY / DRAG_DISTANCE) * 180;
    const next = Math.max(0, Math.min(180, dragStartAngleRef.current + currentDeltaDeg));
    rotateX.set(next);
  };

  const handlePointerUp = (e) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Safely ignore if pointer capture was already implicitly lost by the browser
    }

    setIsDragging(false);

    const dir = dragDirRef.current;
    if (isAnimatingRef.current || !dir) return;

    const startAngle = dragStartAngleRef.current;
    const current = rotateX.get();
    const commitDistance = 180 * COMMIT_RATIO;
    
    const velocityY = pointerVelocity.current;

    const MIN_FLICK_DISTANCE = commitDistance * 0.35;

    if (dir === "next") {
      const traveledTowardOpen = current - startAngle;
      const isFlickNext =
        velocityY < -300 && traveledTowardOpen > MIN_FLICK_DISTANCE;
      if (traveledTowardOpen > commitDistance || isFlickNext) {
        commit("next", velocityY);
      } else {
        cancel("next", velocityY, startAngle);
      }
    } else {
      const traveledTowardPrev = startAngle - current;
      const isFlickPrev =
        velocityY > 300 && traveledTowardPrev > MIN_FLICK_DISTANCE;
      if (traveledTowardPrev > commitDistance || isFlickPrev) {
        commit("prev", velocityY);
      } else {
        cancel("prev", velocityY, startAngle);
      }
    }
  };

  const frontLeafContent = direction === "prev" ? prevContent : currentContent;

  const translateZ = useTransform(rotateX, [0, 20, 60, 120, 180], [0, -12, -42, -18, 0]);
  const translateY = useTransform(rotateX, [0, 25, 90, 180], [0, -11, 22, 0]);  
  
  return (
    <motion.div
      ref={flipRefElement}
      className={`notepad-flip ${
        isBehind ? "notepad-flip-behind" : "notepad-flip-front-layer"
      }`}
      style={{
        rotateX: rotateX,
        scaleY,
        translateZ,
        translateY,
        perspectiveOriginY,
        transformOrigin: "top center",
        touchAction: "none",
        "--shadow-opacity": shadowOpacity,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="notepad-flip-face notepad-flip-front">
        <div className={`drag-handle-overlay ${isDragging ? "active" : ""}`} />
        <Page
          content={frontLeafContent}
          onExplore={onExplore}
          onNavigate={onNavigate}
          onUnlock={onUnlock}
        />
        <motion.div
          className="curl-shadow-overlay"
          style={{ opacity: shadowOpacityCurve }}
        />
      </div>

      <div className="notepad-flip-face notepad-flip-back">
        <div className="notepad-flip-back-blank" />
      </div>
    </motion.div>
  );
});

export default NotepadFlip;