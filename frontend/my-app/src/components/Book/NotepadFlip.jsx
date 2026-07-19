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

  const scaleY = useTransform(rotateX, [0, -45, -90, -135, -180], [1, 0.62, 0.28, 0.62, 1]);
  const y = useTransform(rotateX, [0, -45, -90, -135, -180], [0, -32, -86, -32, 0]);
  const paperScale = useTransform(rotateX, [0, -90, -180], [1, 0.95, 1]);
  const perspectiveOriginY = useTransform(progress, [0, 0.5, 1], ["0%", "35%", "0%"]);

  const clipPathValues = useTransform(progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 82%, 0% 82%)",
      "polygon(0% 0%, 100% 0%, 100% 48%, 0% 48%)",
      "polygon(0% 0%, 100% 0%, 100% 12%, 0% 12%)",
      "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    ]
  );

  const shadowY = useTransform(progress, [0, 0.5, 1], ["100%", "45%", "0%"]);
  const shadowOpacityCurve = useTransform(progress, [0, 0.1, 0.5, 0.9, 1], [0, 0.95, 1, 0.95, 0]);
  const shadowOpacity = useTransform(rotateX, [-180, -179.5, -90, 0], [0, 0, 0.4, 0.1]);

  const resetIdle = () => {
    dragDirRef.current = null;
    setDirection(null);
    setIsAnimating(false);
    setIsDragging(false);
  };

  const commit = (dir) => {
    setIsAnimating(true);
    if (dir === "next") {
      animate(rotateX, -180, {
        type: "spring",
        stiffness: 110,
        damping: 22,
        mass: 0.65,
        onComplete: () => {
          rotateX.set(0);
          onCommitNext && onCommitNext();
          resetIdle();
        },
      });
    } else {
      animate(rotateX, 0, {
        type: "spring",
        stiffness: 110,
        damping: 22,
        mass: 0.65,
        onComplete: () => {
          rotateX.set(0);
          onCommitPrev && onCommitPrev();
          resetIdle();
        },
      });
    }
  };

  const cancel = (dir) => {
    setIsAnimating(true);
    const target = dir === "next" ? 0 : -180;
    animate(rotateX, target, {
      type: "spring",
      stiffness: 140,
      damping: 20,
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
    const isFlick = dir === "next" ? info.velocity.y < -250 : info.velocity.y > 250;

    if (passed || isFlick) {
      commit(dir);
    } else {
      cancel(dir);
    }
  };

  const frontLeafContent = currentContent;
  const backLeafContent = direction === "next" ? nextContent : prevContent;

  return (
    <motion.div
      className={`notepad-flip ${isBehind ? "notepad-flip-behind" : "notepad-flip-front-layer"}`}
      style={{
        rotateX,
        scaleY,
        y,
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
      <motion.div 
        className="notepad-flip-face notepad-flip-front"
        style={{ clipPath: clipPathValues }}
      >
        <div className={`drag-handle-overlay ${isDragging ? "active" : ""}`} />
        <Page
          content={frontLeafContent}
          onExplore={onExplore}
          onNavigate={onNavigate}
          onUnlock={onUnlock}
        />
        <motion.div 
          className="curl-shadow-overlay" 
          style={{ top: shadowY, opacity: shadowOpacityCurve }}
        />
      </motion.div>

      <motion.div 
        className="notepad-flip-face notepad-flip-back" 
        style={{ clipPath: clipPathValues }}
      >
        <div className={`drag-handle-overlay ${isDragging ? "active" : ""}`} />
        <div className="notepad-flip-back-content">
          <Page
            content={backLeafContent}
            onExplore={onExplore}
            onNavigate={onNavigate}
            onUnlock={onUnlock}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

export default NotepadFlip;