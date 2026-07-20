import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from "react";
import Page from "./Page";
import "./NotepadFlip.css";

const DRAG_DISTANCE = 220;
const COMMIT_RATIO = 0.35;

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
  // Direct motion value driving 3D page flip rotation [0 to -180 deg]
  const rotateX = useMotionValue(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBehind, setIsBehind] = useState(false);
  const [direction, setDirection] = useState(null); // 'next' | 'prev' | null
  const dragDirRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const unsub = rotateX.on("change", (v) => setIsBehind(v <= -90));
    return unsub;
  }, [rotateX]);

  const progress = useTransform(rotateX, [0, -180], [0, 1]);

  // Gentle physical paper flex during mid-flip
  const scaleY = useTransform(rotateX, [0, -90, -180], [1, 0.95, 1]);
  const paperScale = useTransform(rotateX, [0, -90, -180], [1, 0.985, 1]);
  const perspectiveOriginY = useTransform(progress, [0, 0.5, 1], ["0%", "15%", "0%"]);

  // Dynamic shadow opacity scaling with angle
  const shadowOpacityCurve = useTransform(
    progress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, 0.72, 1, 0.5, 0]
  );
  const shadowOpacity = useTransform(
    rotateX,
    [-180, -179.5, -90, 0],
    [0, 0, 0.4, 0.1]
  );

  const resetIdle = () => {
    dragDirRef.current = null;
    setDirection(null);
    setIsAnimating(false);
    setIsDragging(false);
  };

  const commit = (dir, info = null) => {
    setIsAnimating(true);

    // Convert pointer pixel speed into degree velocity for smooth spring handoff
    const pixelVelocityY = info?.velocity?.y ?? 0;
    const degreeVelocity = (pixelVelocityY / DRAG_DISTANCE) * -180;

    if (dir === "next") {
      animate(rotateX, -180, {
        type: "spring",
        stiffness: 115,
        damping: 20,
        mass: 0.75,
        velocity: degreeVelocity,
        onComplete: () => {
          rotateX.set(0);
          onCommitNext && onCommitNext();
          resetIdle();
        },
      });
    } else {
      animate(rotateX, 0, {
        type: "spring",
        stiffness: 115,
        damping: 20,
        mass: 0.75,
        velocity: degreeVelocity,
        onComplete: () => {
          rotateX.set(0);
          onCommitPrev && onCommitPrev();
          resetIdle();
        },
      });
    }
  };

  const cancel = (dir, info = null) => {
    setIsAnimating(true);
    const target = dir === "next" ? 0 : -180;

    const pixelVelocityY = info?.velocity?.y ?? 0;
    const degreeVelocity = (pixelVelocityY / DRAG_DISTANCE) * -180;

    animate(rotateX, target, {
      type: "spring",
      stiffness: 135,
      damping: 19,
      mass: 0.8,
      velocity: degreeVelocity,
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
      rotateX.set(-180);
      onPreviewPrev && onPreviewPrev();
      commit("prev");
    },
  }));

  const handleDragStart = () => {
    if (isAnimating) return;
    dragDirRef.current = null;
    setIsDragging(true);
  };

  const handleDrag = (_, info) => {
    if (isAnimating) return;
    const dy = info.offset.y;

    if (!dragDirRef.current) {
      if (dy < -6 && hasNext) {
        dragDirRef.current = "next";
        setDirection("next");
        rotateX.set(0);
        onPreviewNext && onPreviewNext();
      } else if (dy > 6 && hasPrev) {
        dragDirRef.current = "prev";
        setDirection("prev");
        rotateX.set(-180);
        onPreviewPrev && onPreviewPrev();
      } else {
        return;
      }
    }

    const dir = dragDirRef.current;
    if (dir === "next") {
      const clamped = Math.min(0, Math.max(-DRAG_DISTANCE, dy));
      rotateX.set((clamped / DRAG_DISTANCE) * -180);
    } else if (dir === "prev") {
      const clamped = Math.max(0, Math.min(DRAG_DISTANCE, dy));
      rotateX.set(-180 + (clamped / DRAG_DISTANCE) * 180);
    }
  };

  const handleDragEnd = (_, info) => {
    const dir = dragDirRef.current;
    if (isAnimating || !dir) {
      setIsDragging(false);
      return;
    }

    const dy = info.offset.y;
    const commitDistance = DRAG_DISTANCE * COMMIT_RATIO;

    const passed = dir === "next" ? dy < -commitDistance : dy > commitDistance;
    const isFlick =
      dir === "next" ? info.velocity.y < -250 : info.velocity.y > 250;

    if (passed || isFlick) {
      commit(dir, info);
    } else {
      cancel(dir, info);
    }
  };

  const frontLeafContent = direction === "prev" ? prevContent : currentContent;

  return (
    <motion.div
      className={`notepad-flip ${
        isBehind ? "notepad-flip-behind" : "notepad-flip-front-layer"
      }`}
      style={{
        rotateX, // Restored 3D rotational response for live mouse dragging
        scaleY,
        scale: paperScale,
        perspectiveOriginY,
        transformOrigin: "top center",
        touchAction: "none",
        "--shadow-opacity": shadowOpacity,
      }}
      drag={isAnimating ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      {/* Front Face Sheet */}
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

      {/* Back Face Sheet */}
      <div className="notepad-flip-face notepad-flip-back" />
    </motion.div>
  );
});

export default NotepadFlip;