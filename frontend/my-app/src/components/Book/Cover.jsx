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
          src="/assets/images/YashPhoto_.webp"
          style={{ opacity: contentOpacity }}
          alt="Portrait of Yash Raut"
          className="cover-photo"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          onError={(e) => e.target.style.display = 'none'}
        />
        <motion.h1 className="cover-name" style={{ opacity: contentOpacity }}>
          Yash Raut
        </motion.h1>
        <motion.p className="cover-edu" style={{ opacity: contentOpacity }}>
          B.E Computer Engineering
        </motion.p>
        <motion.p className="cover-year" style={{ opacity: contentOpacity }}>
          2023 - 2027
        </motion.p>
        
        <motion.div className="cover-role-stack" style={{ opacity: contentOpacity }}>
          <span>Full-Stack Developer</span>
          <span className="cover-ampersand">&</span>
          <span>Aspiring AIML Engineer</span>
        </motion.div>
        
        <motion.a 
          href="https://linkedin.com/in/yash-raut-240505-yr30" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cover-social"
          style={{ opacity: contentOpacity }}
          onPointerDown={(e) => e.stopPropagation()} 
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </motion.a>
      </div>
      <div className="cover-face cover-face-back" />
    </motion.div>
  );
}

export default Cover;