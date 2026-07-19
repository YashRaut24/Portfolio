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
  
  // Track active drag state to conditionally project an invisible mouse-trap over the text fields
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const unsub = rotateX.on("change", (v) => setIsBehind(v <= -90));
    return unsub;
  }, [rotateX]);

  const progress = useTransform(rotateX, [0, -180], [0, 1]);

  // NATURAL CYLINDER FLEX LOOPS: 
  // Compresses the height scale and handles vertical lift to follow the hand curl profile.
  const scaleY = useTransform(rotateX, [0, -90, -180], [1, 0.42, 1]);
  const y = useTransform(rotateX, [0, -90, -180], [0, -58, 0]);

  // Bottom-up sheet clip path rollup mask
  const clipPathValues = useTransform(progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 84%, 0% 84%)",
      "polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)",
      "polygon(0% 0%, 100% 0%, 100% 16%, 0% 16%)",
      "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    ]
  );

  const shadowY = useTransform(progress, [0, 0.5, 1], ["100%", "50%", "0%"]);
  const shadowOpacityCurve = useTransform(progress, [0, 0.1, 0.5, 0.9, 1], [0, 0.85, 1, 0.85, 0]);
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
        stiffness: 140,
        damping: 18,
        mass: 0.8,
        onComplete: () => {
          rotateX.set(0);
          onCommitNext && onCommitNext();
          resetIdle();
        },
      });
    } else {
      animate(rotateX, 0, {
        type: "spring",
        stiffness: 140,
        damping: 18,
        mass: 0.8,
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
      stiffness: 150,
      damping: 19,
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
      {/* Front Face Layer */}
      <motion.div 
        className="notepad-flip-face notepad-flip-front"
        style={{ clipPath: clipPathValues }}
      >
        {/* Invisible pointer catcher block to seamlessly track cursor movement without selection bugs */}
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

      {/* Back Face Layer */}
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