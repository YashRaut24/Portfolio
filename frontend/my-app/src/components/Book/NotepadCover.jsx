import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import "./NotepadCover.css";

const DRAG_DISTANCE = 240;
const COMMIT_RATIO = 0.55;

export default function NotepadCover({ onOpen, pageIndex = 0 }) {
  const hasTurnedPages = pageIndex > 0;
  const turnedPagesAttr = hasTurnedPages ? "true" : "false";
  
  const rotateX = useMotionValue(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBehind, setIsBehind] = useState(false);
  const [isOpenComplete, setIsOpenComplete] = useState(false);

  const shadowOpacity = useTransform(
    rotateX,
    [-180, -140, -90, -45, 0],
    [0, 0.12, 0.65, 0.45, 0.28]
  );

  const rollProgress = useTransform(rotateX, [0, -180], [0, 1]);
  const y = useTransform(rotateX, [-180, -90, 0], [-18, -10, 0]);
  const scale = useTransform(rotateX, [-180, -90, 0], [0.985, 1.01, 1]);

  // Fades out the text layout before it rolls over the top ring line
  const contentOpacity = useTransform(rotateX, [0, -60], [1, 0]);

  useEffect(() => {
    const unsub = rotateX.on("change", (v) => setIsBehind(v <= -90));
    return unsub;
  }, [rotateX]);

  useEffect(() => {
    if (rotateX.get() <= -179) {
      setIsOpenComplete(true);
    }
  }, [rotateX]);

  const commitOpenFromCurrent = (info) => {
    if (isAnimating) return;
    setIsAnimating(true);

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
      setIsOpenComplete(false);
      springClosedFromCurrent(info);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isAnimating) {
      e.preventDefault();
      commitOpenFromCurrent({ velocity: { y: -10 } });
    }
  };

  return (
    <motion.div
      data-has-turned-pages={turnedPagesAttr}
      className={`notepad-cover ${
        isOpenComplete ? "notepad-cover-open-strip" : isBehind ? "notepad-cover-behind" : "notepad-cover-front-layer"
      }`}
      style={{
        rotateX,
        height: "100%",
        y: isOpenComplete ? 0 : y,
        scale: isOpenComplete ? 1 : scale,
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
      <div className="notepad-cover-roll-stage" aria-hidden="true">
        <div className="paper-roll paper-roll-front" />
        <div className="paper-roll paper-roll-back" />
        <div className="fold-shadow" />
        <div className="underside-highlight" />
      </div>

      {/* Front Face */}
      <div className="notepad-cover-face notepad-cover-front">
        <motion.div 
          className="paper-face-content"
          style={{ 
            opacity: isOpenComplete ? 0 : contentOpacity,
            display: isOpenComplete ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src="/assets/images/profile.jpg"
            alt="Profile"
            className="notepad-cover-photo"
          />
          <h1 className="notepad-cover-name">Yash</h1>
          <p className="notepad-cover-role">AI Engineer & Full-Stack Developer</p>
          <div className="notepad-cover-hint">Swipe up to open</div>
        </motion.div>
      </div>

      {/* Back Face */}
      <div className="notepad-cover-face notepad-cover-back" />
    </motion.div>
  );
}