import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

// purely internal visual state; does not affect existing drag/open behavior

import "./NotepadCover.css";

const DRAG_DISTANCE = 240;
const COMMIT_RATIO = 0.55;

export default function NotepadCover({ onOpen, pageIndex = 0 }) {
  const hasTurnedPages = pageIndex > 0;
  const turnedPagesAttr = hasTurnedPages ? "true" : "false";
  // rotateX is driven ONLY by drag distance during onDrag.
  // onDragEnd either springs back to 0 or continues from the current rotation
  // to -180. We call onOpen() ONLY after the open animation completes.
  const rotateX = useMotionValue(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBehind, setIsBehind] = useState(false);



  const shadowOpacity = useTransform(
    rotateX,
    [-180, -140, -90, -45, 0],
    [0, 0.12, 0.65, 0.45, 0.28]
  );

  // 0..1 curl progress (derived purely from existing rotateX)
  // rotateX: 0 (closed) -> -180 (open)
  const rollProgress = useTransform(rotateX, [0, -180], [0, 1]);




  const y = useTransform(rotateX, [-180, -90, 0], [-18, -10, 0]);

  const scale = useTransform(rotateX, [-180, -90, 0], [0.985, 1.01, 1]);



  useEffect(() => {
    // Keep layering synced purely to rotation (while dragging or animating)
    // so the page stays hidden beneath the cover until the open finishes.
    const unsub = rotateX.on("change", (v) => setIsBehind(v <= -90));
    return unsub;
  }, [rotateX]);



  const commitOpenFromCurrent = (info) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Continue opening from current rotation to fully open (-180).
    animate(rotateX, -180, {
      type: "spring",
      stiffness: 95,
      damping: 16,
      mass: 0.9,
      velocity: info.velocity?.y ?? 0,
      onComplete: () => {
        setIsAnimating(false);
        setIsOpenComplete(true);
        onOpen && onOpen();
      },
    });
  };

  const springClosedFromCurrent = (info) => {
    if (isAnimating) return;
    setIsAnimating(true);

    animate(rotateX, 0, {
      type: "spring",
      stiffness: 150,
      damping: 17,
      mass: 0.85,
      velocity: info.velocity?.y ?? 0,
      onComplete: () => {
        setIsAnimating(false);
      },
    });
  };

  const handleDrag = (_, info) => {
    if (isAnimating) return;

    // Drive rotation directly from drag distance during drag.
    const clamped = Math.min(0, Math.max(-DRAG_DISTANCE, info.offset.y));
    rotateX.set((clamped / DRAG_DISTANCE) * -180);
  };

  const handleDragEnd = (_, info) => {
    if (isAnimating) return;

    const dy = info.offset.y;
    const commitDistance = DRAG_DISTANCE * COMMIT_RATIO;
    const passed = dy < -commitDistance;

    if (passed) {
      commitOpenFromCurrent(info);
    } else {
      // If user partially opens then cancels back, keep it closed.
      setIsOpenComplete(false);
      springClosedFromCurrent(info);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isAnimating) {
      e.preventDefault();
      // keyboard open = full open
      commitOpenFromCurrent({ velocity: { y: -10 } });
    }
  };

  // Track whether the cover fully finished opening so we keep the rolled strip visible.
  const [isOpenComplete, setIsOpenComplete] = useState(false);

  // Once opened, freeze the cover at the open-complete state.
  // (We do not change the drag/open animation itself; only post-open visibility.)
  useEffect(() => {
    if (rotateX.get() <= -179) {
      setIsOpenComplete(true);
    }
  }, [rotateX]);



  return (
    <motion.div
      data-has-turned-pages={turnedPagesAttr}
      className={`notepad-cover ${
        isOpenComplete ? "notepad-cover-open-strip" : isBehind ? "notepad-cover-behind" : "notepad-cover-front-layer"
      }`}
      style={{
        rotateX,

        // Keep wrapper sizing stable so the absolute layout can stretch to the bottom.
        height: "100%",

        y: isOpenComplete ? 0 : y,
        scale: isOpenComplete ? 1 : scale,

        // Keep animations anchored so the cover snaps flush against the binding loops.
        transformOrigin: "top center",
        willChange: "transform",
        "--shadow-opacity": shadowOpacity,
        "--roll-progress": rollProgress,
        touchAction: "none",
      }}
      drag={!isAnimating ? "y" : false}

      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      role="button"
      tabIndex={0}
      aria-label="Open notebook cover"
      onKeyDown={handleKeyDown}
    >
      {/* Split rendering into real layers so the top curl can deform */}
      <div className="notepad-cover-roll-stage" aria-hidden="true">
        <div className="paper-roll paper-roll-front" />
        <div className="paper-roll paper-roll-back" />
        <div className="fold-shadow" />
        <div className="underside-highlight" />
      </div>

      {/* Front face */}
      <div className="notepad-cover-face notepad-cover-front">
        <div className="paper-face-content">
          <img
            src="/assets/images/profile.jpg"
            alt="Profile"
            className="notepad-cover-photo"
          />
          <h1 className="notepad-cover-name">Yash</h1>
          <p className="notepad-cover-role">AI Engineer & Full-Stack Developer</p>
          <div className="notepad-cover-hint">Swipe up to open</div>
        </div>
      </div>

      {/* Back face */}
      <div className="notepad-cover-face notepad-cover-back" />
    </motion.div>
  );

}

