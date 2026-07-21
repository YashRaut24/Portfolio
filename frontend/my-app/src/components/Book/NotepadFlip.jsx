import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import Page from "./Page";
import "./NotepadFlip.css";

const DRAG_DISTANCE = 220;
const COMMIT_RATIO = 0.35;
const STRIP_HEIGHT = 30; 
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
        if (latest >= 90 && !prev) return true;   // try bumping 90 → ~160
        if (latest < 90 && prev) return false;    // and this too, to match
        return prev;
      });
    });
    return unsubscribe;
  }, [rotateX]);

  const delayedRotate = useTransform(
    rotateX,
    [0,15,180],
    [0,0,180]
);

  const stripProgress = useTransform(rotateX, [STRIP_COLLAPSE_START, 180], [0, 1], { clamp: true });
  const scaleY = useTransform(stripProgress, [0, 1], [1, stripScale]);
  
  const backContentOpacity = useTransform(rotateX, [90, STRIP_COLLAPSE_START], [1, 0]);
  const progress = useTransform(rotateX, [0, 180], [0, 1]);
  const perspectiveOriginY = useTransform(progress, [0, 0.5, 1], ["0%", "15%", "0%"]);
  const shadowOpacityCurve = useTransform(progress, [0, 0.15, 0.5, 0.85, 1], [0, 0.72, 1, 0.5, 0]);
  const shadowOpacity = useTransform(rotateX, [180, 90, 0], [0.1, 0.4, 0.1]);

  const resetIdle = () => {
    dragDirRef.current = null;
    setDirection(null);
    setIsAnimating(false);
    setIsDragging(false);
  };

  const commit = (dir, pixelVelocityY = 0) => {
    setIsAnimating(true);
    // Negative pixel velocity (moving UP) maps to positive degree velocity
    const degreeVelocity = -(pixelVelocityY / DRAG_DISTANCE) * 180;

    // Thin and soft paper physics
    const springConfig = {
      type: "spring",
      stiffness:60,
      damping:18,
      mass:0.8,
      velocity: degreeVelocity,
      restDelta: 0.001,
    };

    if (dir === "next") {
      animate(rotateX, 188, {
        ...springConfig,
        onComplete: () => {
          rotateX.set(180);
          onCommitNext && onCommitNext();
          rotateX.set(0);
          resetIdle();
        },
      });
    }else {
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
      if (isAnimating || !hasNext) return;
      setDirection("next");
      dragDirRef.current = "next";
      rotateX.set(0);
      onPreviewNext && onPreviewNext();
      commit("next");
    },
    triggerPrev: () => {
      if (isAnimating || !hasPrev) return;
      setDirection("prev");
      dragDirRef.current = "prev";
      rotateX.set(180);
      onPreviewPrev && onPreviewPrev();
      commit("prev");
    },
  }));

  const handlePointerDown = (e) => {
    if (isAnimating) return;
    
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
    if (!isDragging || isAnimating) return;

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
    if (!isDragging) return;
    
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    const dir = dragDirRef.current;
    if (isAnimating || !dir) return;

    const startAngle = dragStartAngleRef.current;
    const current = rotateX.get();
    const commitDistance = 180 * COMMIT_RATIO;
    
    const velocityY = pointerVelocity.current;
    const isFlickNext = dir === "next" && velocityY < -300;
    const isFlickPrev = dir === "prev" && velocityY > 300;

    if (dir === "next") {
      const traveledTowardOpen = current - startAngle;
      if (traveledTowardOpen > commitDistance || isFlickNext) {
        commit("next", velocityY);
      } else {
        cancel("next", velocityY, startAngle);
      }
    } else {
      const traveledTowardPrev = startAngle - current;
      if (traveledTowardPrev > commitDistance || isFlickPrev) {
        commit("prev", velocityY);
      } else {
        cancel("prev", velocityY, startAngle);
      }
    }
  };

  const frontLeafContent = direction === "prev" ? prevContent : currentContent;
  const backLeafContent = direction === "next" ? currentContent : prevContent;
  const translateZ = useTransform(
      rotateX,
      [0, 20, 60, 120, 180],
      [0, -12, -42, -18, 0]
  );

  const translateY = useTransform(
      rotateX,
      [0, 25, 90, 180],
      [0, 10, 22, 0]
  );
  return (
    <motion.div
      ref={flipRefElement}
      className={`notepad-flip ${
        isBehind ? "notepad-flip-behind" : "notepad-flip-front-layer"
      }`}
      style={{
          rotateX: delayedRotate,
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
        <div className="notepad-flip-back-content">
          <motion.div style={{ opacity: backContentOpacity, width: "100%", height: "100%" }}>
            <Page
              content={backLeafContent}
              onExplore={onExplore}
              onNavigate={onNavigate}
              onUnlock={onUnlock}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

export default NotepadFlip;