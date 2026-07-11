import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import Page from './Page';
import './PageFlip.css';

function PageFlip({ side, frontContent, onComplete, disabled, triggerCount, onExplore }) {
  const isRight = side === 'right';
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, isRight ? [-300, 0] : [0, 300], isRight ? [-180, 0] : [0, 180]);
  const [isAnimating, setIsAnimating] = useState(false);

  const finishFlip = () => {
    onComplete();
    dragX.set(0);
    setIsAnimating(false);
  };

  useEffect(() => {
    if (triggerCount > 0 && !isAnimating) {
      setIsAnimating(true);
      const target = isRight ? -300 : 300;
      animate(dragX, target, { duration: 0.45, ease: 'easeInOut', onComplete: finishFlip });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCount]);

  const handleDrag = (event, info) => {
    if (isAnimating || disabled) return;
    const clamped = isRight
      ? Math.min(0, Math.max(-300, info.offset.x))
      : Math.max(0, Math.min(300, info.offset.x));
    dragX.set(clamped);
  };

  const handleDragEnd = (event, info) => {
    if (isAnimating || disabled) return;
    const passed = isRight ? info.offset.x < -150 : info.offset.x > 150;
    if (passed) {
      setIsAnimating(true);
      const target = isRight ? -300 : 300;
      animate(dragX, target, { duration: 0.35, ease: 'easeInOut', onComplete: finishFlip });
    } else {
      animate(dragX, 0, { duration: 0.25, ease: 'easeOut' });
    }
  };

  return (
    <motion.div
      className="page-leaf"
      style={{ rotateY, transformOrigin: isRight ? 'left center' : 'right center' }}
      drag={disabled || isAnimating ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="page-leaf-face page-leaf-front">
        <Page content={frontContent} onExplore={onExplore} />
      </div>
      <div className="page-leaf-face page-leaf-back" />
    </motion.div>
  );
}

export default PageFlip;