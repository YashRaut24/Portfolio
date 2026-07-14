import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState } from 'react';
import './Cover.css';

function Cover({ onOpen }) {
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-300, 0], [-180, 0]);
  const contentOpacity = useTransform(dragX, [-150, -80], [0, 1]);
  const boxShadowOpacity = useTransform(dragX, [-20, 0], [0, 1]);

  const [isAnimating, setIsAnimating] = useState(false);

  const handleDrag = (_, info) => {
    if (isAnimating) return;
    const clamped = Math.min(0, Math.max(-300, info.offset.x));
    dragX.set(clamped);
  };

  const handleDragEnd = (_, info) => {
    if (isAnimating) return;
    if (info.offset.x < -150) {
      setIsAnimating(true);
      animate(dragX, -300, {
        duration: 0.35,
        ease: 'easeInOut',
        onComplete: onOpen,
      });
    } else {
      animate(dragX, 0, { duration: 0.25, ease: 'easeOut' });
    }
  };

  return (
    <motion.div
      className="cover"
      style={{ rotateY, transformOrigin: 'left center', '--shadow-opacity': boxShadowOpacity  }}
      drag={isAnimating ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="cover-face cover-face-front">
        <motion.img
          src="/assets/images/profile.jpg"
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