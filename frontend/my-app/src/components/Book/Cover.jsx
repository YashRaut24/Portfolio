import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState } from 'react';
import { prefersReducedMotion, getFlipTransition, getSnapBackTransition } from '../../utils/motionPrefs';
import './Cover.css';

function Cover({ onOpen, onOpenStart }) {
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-300, 0], [-180, 0]);
  const contentOpacity = useTransform(dragX, [-150, -80], [0, 1]);
  const boxShadowOpacity = useTransform(dragX, [-20, 0], [0, 1]);
  const skewY = useTransform(
    dragX,
    [-300, -150, 0],
    prefersReducedMotion() ? [0, 0, 0] : [0, -2.5, 0]
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (_, info) => {
    if (isAnimating) return;
    setIsDragging(true);
    const clamped = Math.min(0, Math.max(-300, info.offset.x));
    dragX.set(clamped);
  };

  const handleDragEnd = (_, info) => {
      if (isAnimating) return;
      if (info.offset.x < -150) {
        setIsAnimating(true);
        onOpenStart && onOpenStart();
        animate(dragX, -300, {
          ...getFlipTransition(),
          onComplete: onOpen,
        });
      } else {
      setIsDragging(false);
      animate(dragX, 0, getSnapBackTransition());
    }
  };

  const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isAnimating) {
        e.preventDefault();
        setIsAnimating(true);
        onOpenStart && onOpenStart();
        animate(dragX, -300, {
          ...getFlipTransition(),
          onComplete: onOpen,
        });
      }
    };

  return (
    <motion.div
      className={`cover ${isDragging ? 'cover-dragging' : ''}`}
      style={{ rotateY, skewY, transformOrigin: 'left center', '--shadow-opacity': boxShadowOpacity }}
      drag={isAnimating ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      role="button"
      tabIndex={0}
      aria-label="Open book cover"
      onKeyDown={handleKeyDown}
    >
      <div className="cover-face cover-face-front">
        <motion.img
          src="/assets/images/YashPhoto_.jpg"
          style={{ opacity: contentOpacity }}
          alt="Profile"
          className="cover-photo"
        />
        <motion.h1 className="cover-name" style={{ opacity: contentOpacity }}>
          Yash
        </motion.h1>
        <motion.p className="cover-role" style={{ opacity: contentOpacity }}>
          AI Engineer & Full-Stack Developer
        </motion.p>
      </div>
      <div className="cover-face cover-face-back" />
    </motion.div>
  );
}

export default Cover;