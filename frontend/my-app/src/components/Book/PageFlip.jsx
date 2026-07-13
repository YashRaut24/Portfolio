import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Page from './Page';
import './PageFlip.css';

function PageFlip({ side, frontContent, backContent, onPreview, onPreviewCancel, onComplete, disabled, triggerCount, onExplore, isClosingFlip }) {
  const isRight = side === 'right';
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, isRight ? [-300, 0] : [0, 300], isRight ? [-180, 0] : [0, 180]);
  const closingCoverContentOpacity = useTransform(dragX, [150, 220], [0, 1]);
  const [isAnimating, setIsAnimating] = useState(false);
  const previewedRef = useRef(false);

  const [displayFront, setDisplayFront] = useState(frontContent);
  const [displayBack, setDisplayBack] = useState(backContent);

  useEffect(() => {
    if (!isAnimating && !previewedRef.current) {
      setDisplayFront(frontContent);
      setDisplayBack(backContent);
    }
  }, [frontContent, backContent, isAnimating]);

  const finishFlip = () => {
    onComplete();
    if (!isClosingFlip) {
      dragX.set(0);
    }
    setIsAnimating(false);
    previewedRef.current = false;
  };

  useEffect(() => {
    if (triggerCount > 0 && !isAnimating) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnimating(true);
      previewedRef.current = true;
      onPreview && onPreview();
      const target = isRight ? -300 : 300;
      animate(dragX, target, { duration: 0.45, ease: 'easeInOut', onComplete: finishFlip });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerCount]);

  const handleDrag = (_, info) => {
    if (isAnimating || disabled) return;
    if (!previewedRef.current) {
      previewedRef.current = true;
      onPreview && onPreview();
    }
    const clamped = isRight
      ? Math.min(0, Math.max(-300, info.offset.x))
      : Math.max(0, Math.min(300, info.offset.x));
    dragX.set(clamped);
  };

  const handleDragEnd = (_, info) => {
    if (isAnimating || disabled) return;
    const passed = isRight ? info.offset.x < -150 : info.offset.x > 150;
    if (passed) {
      setIsAnimating(true);
      const target = isRight ? -300 : 300;
      animate(dragX, target, { duration: 0.35, ease: 'easeInOut', onComplete: finishFlip });
    } else {
      animate(dragX, 0, { duration: 0.25, ease: 'easeOut' });
      if (previewedRef.current) {
        onPreviewCancel && onPreviewCancel();
        previewedRef.current = false;
      }
    }
  };

  const leafStyle = {
    rotateY,
    transformOrigin: isRight ? 'left center' : 'right center',
  };

  if (isClosingFlip) {
    leafStyle['--cover-content-opacity'] = closingCoverContentOpacity;
  }

  return (
    <motion.div
      className={`page-leaf ${isClosingFlip ? 'page-leaf-closing-cover' : ''}`}
      style={leafStyle}
      drag={disabled || isAnimating ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="page-leaf-face page-leaf-front">
        <Page content={displayFront} onExplore={onExplore} />
      </div>
      <div className="page-leaf-face page-leaf-back">
        <Page content={displayBack} onExplore={onExplore} />
      </div>
    </motion.div>
  );
}

export default PageFlip;
