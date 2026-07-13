import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Cover.css';

function Cover({
    onOpen,
    isClosing,
    onCloseComplete
}) {
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-300, 0], [-180, 0]);
  const contentOpacity = useTransform(dragX, [-150, -80], [0, 1]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpenState, setIsOpenState] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    if (!isClosing) return;

    setIsAnimating(true);
    animate(dragX, 0, {
      duration: 0.45,
      ease: 'easeInOut',
      onComplete: () => {
        setIsAnimating(false);
        setIsOpenState(false);
        onCloseComplete();
      },
    });
  }, [dragX, isClosing, onCloseComplete]);

  const handleDrag = (event, info) => {
    if (isAnimating) return;
    const nextOffset = Math.min(0, Math.max(-300, info.offset.x));
    setDragOffset(nextOffset);
    dragX.set(nextOffset);
  };

  const handleDragEnd = (event, info) => {
    if (isAnimating) return;

    const offset = dragOffset;
    if (offset <= -150) {
      setIsAnimating(true);
      animate(dragX, -300, {
        duration: 0.35,
        ease: 'easeInOut',
        onComplete: () => {
          setIsAnimating(false);
          setIsOpenState(true);
          onOpen();
        },
      });
    } else if (isOpenState && offset >= 150) {
      setIsAnimating(true);
      animate(dragX, 0, {
        duration: 0.35,
        ease: 'easeInOut',
        onComplete: () => {
          setIsAnimating(false);
          setIsOpenState(false);
        },
      });
    } else {
      animate(dragX, 0, { duration: 0.25, ease: 'easeOut' });
    }
  };

  return (
    <motion.div
      className="cover"
      style={{ rotateY, transformOrigin: 'left center' }}
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