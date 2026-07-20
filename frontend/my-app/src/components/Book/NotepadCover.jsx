import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import "./NotepadCover.css";

const DRAG_DISTANCE = 240;
const COMMIT_RATIO = 0.55;

export default function NotepadCover({
  onOpen,
  pageIndex = 0,
  openStrip = false,
  onMotionStart,
  onMotionEnd,
}) {
  const hasTurnedPages = pageIndex > 0;
  const turnedPagesAttr = hasTurnedPages ? "true" : "false";

  const rotateX = useMotionValue(openStrip ? -180 : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBehind, setIsBehind] = useState(openStrip);
  const [isOpenComplete, setIsOpenComplete] = useState(openStrip);

  const shadowOpacity = useTransform(
    rotateX,
    [-180, -140, -90, -45, 0],
    [0, 0.15, 0.7, 0.45, 0.28]
  );

  const rollProgress = useTransform(rotateX, [0, -180], [0, 1]);
  const contentOpacity = useTransform(rotateX, [0, -28, -76], [1, 0.72, 0]);

  useEffect(() => {
    const unsub = rotateX.on("change", (v) => {
      if (!openStrip) setIsBehind(v <= -90);
    });
    return unsub;
  }, [openStrip, rotateX]);

  const commitOpenFromCurrent = (info = null) => {
    if (isAnimating || openStrip) return;
    setIsAnimating(true);
    onMotionStart && onMotionStart();

    // Preserve gesture velocity for seamless release transition
    const pixelVelocityY = info?.velocity?.y ?? 0;
    const degreeVelocity = (pixelVelocityY / DRAG_DISTANCE) * -180;

    animate(rotateX, -180, {
      type: "spring",
      stiffness: 110,
      damping: 20,
      mass: 0.8,
      velocity: degreeVelocity,
      onComplete: () => {
        setIsAnimating(false);
        setIsBehind(true);
        setIsOpenComplete(true);
        onMotionEnd && onMotionEnd();
        onOpen && onOpen();
      },
    });
  };

  const springClosedFromCurrent = (info = null) => {
    if (isAnimating || openStrip) return;
    setIsAnimating(true);
    onMotionStart && onMotionStart();

    const pixelVelocityY = info?.velocity?.y ?? 0;
    const degreeVelocity = (pixelVelocityY / DRAG_DISTANCE) * -180;

    animate(rotateX, 0, {
      type: "spring",
      stiffness: 130,
      damping: 18,
      mass: 0.8,
      velocity: degreeVelocity,
      onComplete: () => {
        setIsAnimating(false);
        setIsBehind(false);
        setIsOpenComplete(false);
        onMotionEnd && onMotionEnd();
      },
    });
  };

  const handleDragStart = () => {
    if (isAnimating || openStrip) return;
    setIsOpenComplete(false);
    onMotionStart && onMotionStart();
  };

  const handleDrag = (_, info) => {
    if (isAnimating || openStrip) return;
    const clamped = Math.min(0, Math.max(-DRAG_DISTANCE, info.offset.y));
    rotateX.set((clamped / DRAG_DISTANCE) * -180);
  };

  const handleDragEnd = (_, info) => {
    if (isAnimating || openStrip) return;

    const dy = info.offset.y;
    const commitDistance = DRAG_DISTANCE * COMMIT_RATIO;
    const passed = dy < -commitDistance;
    const isFlickUp = info.velocity.y < -250;

    if (passed || isFlickUp) {
      commitOpenFromCurrent(info);
    } else {
      setIsOpenComplete(false);
      springClosedFromCurrent(info);
    }
  };

  const isStrip = openStrip || isOpenComplete;

  return (
    <motion.div
      data-has-turned-pages={turnedPagesAttr}
      className={`notepad-cover ${
        isStrip
          ? "notepad-cover-open-strip"
          : isBehind
          ? "notepad-cover-behind"
          : "notepad-cover-front-layer"
      }`}
      style={{
        rotateX: isStrip ? 0 : rotateX,
        transformOrigin: "top center",
        willChange: "transform",
        "--shadow-opacity": shadowOpacity,
        "--roll-progress": isStrip ? 1 : rollProgress,
        touchAction: "none",
      }}
      drag={!openStrip && !isAnimating ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="notepad-cover-roll-stage" aria-hidden="true">
        <div className="paper-roll paper-roll-front" />
        <div className="paper-roll paper-roll-back" />
        <div className="fold-shadow" />
        <div className="underside-highlight" />
      </div>

      <div className="notepad-cover-face notepad-cover-front">
        <motion.div
          className="paper-face-content"
          style={{
            opacity: isStrip ? 0 : contentOpacity,
            display: isStrip ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/images/profile.jpg"
            alt="Profile"
            className="notepad-cover-photo"
          />
          <h1 className="notepad-cover-name">Yash</h1>
          <p className="notepad-cover-role">
            AI Engineer & Full-Stack Developer
          </p>
          <div className="notepad-cover-hint">Swipe up to open</div>
        </motion.div>
      </div>

      <div className="notepad-cover-face notepad-cover-back" />
    </motion.div>
  );
}