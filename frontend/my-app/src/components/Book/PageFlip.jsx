import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Page from './Page';
import './PageFlip.css';
import { prefersReducedMotion, getFlipTransition, getSnapBackTransition } from '../../utils/motionPrefs';

const PageFlip = forwardRef(({ side, frontContent, backContent, onPreview, onPreviewCancel, onComplete, disabled, onExplore, onNavigate, onUnlock, onFlipStart, isClosingFlip }, ref) => {
  const isRight = side === 'right';
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, isRight ? [-300, 0] : [0, 300], isRight ? [-180, 0] : [0, 180]);
  const closingCoverContentOpacity = useTransform(dragX, [150, 220], [0, 1]);
  const boxShadowOpacity = useTransform(
    dragX,
    isRight ? [-20, 0] : [0, 20],
    isRight ? [0, 1] : [1, 0]
  );
  const skewY = useTransform(
    dragX,
    isRight ? [-300, -150, 0] : [0, 150, 300],
    prefersReducedMotion() ? [0, 0, 0] : (isRight ? [0, -2.5, 0] : [0, 2.5, 0])
  );

  const isAnimatingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const previewedRef = useRef(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const finishFlip = useCallback(() => {
    onComplete();
    if (!isClosingFlip) {
      dragX.set(0);
    }
    isAnimatingRef.current = false;
    setIsAnimating(false);
    isDraggingRef.current = false;
    setIsDragging(false);
    previewedRef.current = false;
  }, [onComplete, isClosingFlip, dragX]);

  useImperativeHandle(ref, () => ({
    doFlip: () => {
      if (isAnimatingRef.current || isDraggingRef.current || disabled) return;
      isAnimatingRef.current = true;
      setIsAnimating(true);
      previewedRef.current = true;
      onPreview && onPreview();
      onFlipStart && onFlipStart();
      const target = isRight ? -300 : 300;
      animate(dragX, target, { type: 'spring', stiffness: 220, damping: 24, onComplete: finishFlip });
    }
  }));

  const handleDrag = (_, info) => {
    if (isAnimatingRef.current || disabled) return;
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }
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
    if (isAnimatingRef.current || disabled) return;
    const passed = isRight ? info.offset.x < -150 : info.offset.x > 150;
    if (passed) {
      isAnimatingRef.current = true;
      setIsAnimating(true);
      isDraggingRef.current = false;
      setIsDragging(false);
      onFlipStart && onFlipStart();
      const target = isRight ? -300 : 300;
      animate(dragX, target, { type: 'spring', stiffness: 260, damping: 22, onComplete: finishFlip });
    } else {
      isDraggingRef.current = false;
      setIsDragging(false);
      animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 26 });
      if (previewedRef.current) {
        onPreviewCancel && onPreviewCancel();
        previewedRef.current = false;
      }
    }
  };

  const leafStyle = {
      rotateY,
      skewY,
      transformOrigin: isRight ? 'left center' : 'right center',
      '--shadow-opacity': boxShadowOpacity,
  };

  if (isClosingFlip) {
    leafStyle['--cover-content-opacity'] = closingCoverContentOpacity;
  }

  return (
    <motion.div
      className={`page-leaf ${isClosingFlip ? 'page-leaf-closing-cover' : ''} ${isDragging ? 'page-leaf-dragging' : ''}`}
      style={leafStyle}
      drag={disabled || isAnimating ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      dragTransition={{ power: 0.2, timeConstant: 200, clamp: true }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div className="page-leaf-face page-leaf-front">
        <Page content={frontContent} pageSide={side} onExplore={onExplore} onNavigate={onNavigate} onUnlock={onUnlock} />
      </div>
      <div className="page-leaf-face page-leaf-back">
        <Page content={backContent} pageSide={isRight ? 'left' : 'right'} onExplore={onExplore} onNavigate={onNavigate} onUnlock={onUnlock} />
      </div>
    </motion.div>
  );
});

export default PageFlip;