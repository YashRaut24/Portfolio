import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Cover from './Cover';
import PageFlip from './PageFlip';
import Page from './Page';
import { bookSpreads, hiddenSpread } from '../../data/bookSpreads';
import './Book.css';
import { playSound, SOUNDS } from '../../utils/sound';

function PrevArrowIcon() {
  return (
    <svg viewBox="0 0 40 20" fill="none" className="nav-arrow">
      <path d="M18 2C10 6 4 9 2 10C4 11 10 14 18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10H38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function NextArrowIcon() {
  return (
    <svg viewBox="0 0 40 20" fill="none" className="nav-arrow">
      <path d="M22 2C30 6 36 9 38 10C36 11 30 14 22 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10H38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DesktopBook() {
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [rightPreview, setRightPreview] = useState(false);
  const [leftPreview, setLeftPreview] = useState(false);
  const [isTurning, setIsTurning] = useState(false);
  
  // Orchestrator for sequential rapid-flipping
  const [targetSpread, setTargetSpread] = useState(null);
  
  const turnLockRef = useRef(false);
  const leftFlipRef = useRef(null);
  const rightFlipRef = useRef(null);
  
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const effectiveSpreads = useMemo(
    () => (secretUnlocked ? [...bookSpreads, hiddenSpread] : bookSpreads),
    [secretUnlocked]
  );
  const totalSpreads = effectiveSpreads.length;
  const spread = effectiveSpreads[currentSpread];

  const handleExplore = useCallback(() => navigate('/explore'), [navigate]);
  
  const handleOpen = useCallback(() => {
      setIsOpen(true);
  }, []);

  const handleLeftPreview = useCallback(() => {
    turnLockRef.current = true;
    setIsTurning(true);
    setLeftPreview(true);
  }, []);

  const handleLeftPreviewCancel = useCallback(() => {
    turnLockRef.current = false;
    setIsTurning(false);
    setLeftPreview(false);
  }, []);

  const handleRightPreview = useCallback(() => {
    turnLockRef.current = true;
    setIsTurning(true);
    setRightPreview(true);
  }, []);

  const handleRightPreviewCancel = useCallback(() => {
    turnLockRef.current = false;
    setIsTurning(false);
    setRightPreview(false);
  }, []);

  const [endBurst, setEndBurst] = useState(false);

  const handleNextClick = useCallback(() => {
    if (turnLockRef.current || currentSpread >= totalSpreads - 1 || !isOpen) return;
    if (!rightFlipRef.current) return;
    turnLockRef.current = true;
    setIsTurning(true);
    rightFlipRef.current.doFlip();
  }, [currentSpread, totalSpreads, isOpen]);

  const handlePrevClick = useCallback(() => {
    if (turnLockRef.current || !isOpen) return;
    if (!leftFlipRef.current) return;
    turnLockRef.current = true;
    setIsTurning(true);
    leftFlipRef.current.doFlip();
  }, [isOpen]);

  useEffect(() => {
      if (isOpen && !secretUnlocked && currentSpread === totalSpreads - 1) {
        setEndBurst(true);
        const timer = setTimeout(() => setEndBurst(false), 900);
        return () => clearTimeout(timer);
      }
    }, [isOpen, secretUnlocked, currentSpread, totalSpreads]);
      
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNextClick();
      if (e.key === 'ArrowLeft') handlePrevClick();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextClick, handlePrevClick]);

  const handleUnlock = useCallback(() => {
    setSecretUnlocked(true);
  }, []);

  useEffect(() => {
    if (secretUnlocked) {
      setCurrentSpread(effectiveSpreads.length - 1);
      setRightPreview(false);
      setLeftPreview(false);
    }
  }, [secretUnlocked, effectiveSpreads.length]);

  // NEW: Receives payload from Page.jsx and extracts the desktop spreadIndex naturally
  const handleJumpTo = useCallback((payload) => {
    const index = typeof payload === 'object' ? payload.spreadIndex : payload;
    if (turnLockRef.current || index === currentSpread) return;
    setTargetSpread(Math.max(0, Math.min(index, totalSpreads - 1)));
  }, [currentSpread, totalSpreads]);

  // The Sequential Rapid-Flip Engine with a 30ms paint window
  useEffect(() => {
    if (targetSpread !== null && !isTurning) {
      const timer = setTimeout(() => {
        if (currentSpread < targetSpread) {
          handleNextClick();
        } else if (currentSpread > targetSpread) {
          handlePrevClick();
        } else {
          setTargetSpread(null); // Destination reached
        }
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [currentSpread, targetSpread, isTurning, handleNextClick, handlePrevClick]);

  const handleNextComplete = useCallback(() => {
    setCurrentSpread((c) => Math.min(c + 1, totalSpreads - 1));
    setRightPreview(false);
    turnLockRef.current = false;
    setIsTurning(false);
  }, [totalSpreads]);

  const handlePrevComplete = useCallback(() => {
    if (currentSpread === 0) {
      setIsOpen(false);
      setLeftPreview(false);
      turnLockRef.current = false;
      setIsTurning(false);
      return;
    }
    setCurrentSpread((c) => Math.max(c - 1, 0));
    setLeftPreview(false);
    turnLockRef.current = false;
    setIsTurning(false);
  }, [currentSpread]);

  const rightBaseContent = useMemo(() => (
    rightPreview && currentSpread < totalSpreads - 1
      ? effectiveSpreads[currentSpread + 1].right
      : spread.right
  ), [currentSpread, rightPreview, spread, totalSpreads, effectiveSpreads]);

  const leftBaseContent = useMemo(() => (
    currentSpread === 0
      ? (leftPreview ? { type: 'transparent' } : spread.left)
      : (leftPreview ? effectiveSpreads[currentSpread - 1].left : spread.left)
  ), [currentSpread, leftPreview, spread, effectiveSpreads]);

  return (
    <div className="book-container">
      <div className={`book-frame ${isTurning ? 'book-frame-turning' : ''}`}>
        <div className="book-stage">
          <div
            className={`book-spread ${
              isMobile ? "book-spread-mobile" : ""
            } ${!isOpen ? "book-spread-closed" : ""} ${
              isOpen && currentSpread === 0 && leftPreview
                ? "book-spread-closing"
                : ""
            }`}
          >
            {!isMobile && (
              <div className={`page-flip-wrapper ${!isOpen ? 'page-hidden' : ''} ${leftPreview ? 'turning-active' : ''}`}>
                <Page content={leftBaseContent} pageSide="left" onExplore={handleExplore} onNavigate={handleJumpTo} onUnlock={handleUnlock} />
                  {isOpen && (
                    <PageFlip
                      ref={leftFlipRef}
                      side="left"
                      frontContent={spread.left}
                      backContent={currentSpread > 0 ? effectiveSpreads[currentSpread - 1].right : { type: 'cover-face' }}
                      onPreview={handleLeftPreview}
                      onPreviewCancel={handleLeftPreviewCancel}
                      onComplete={handlePrevComplete}
                      disabled={false}
                      onExplore={handleExplore}
                      onNavigate={handleJumpTo}
                      onUnlock={handleUnlock}
                      onFlipStart={() => playSound(currentSpread === 0 ? SOUNDS.coverOpen : SOUNDS.pageFlip, currentSpread === 0 ? 0.5 : 0.4, currentSpread === 0 ? 1.45 : 0)}
                      isClosingFlip={currentSpread === 0}
                    />
                  )}
              </div>
            )}
            {!isMobile && <div className="book-spine" />}
            <div className={`page-flip-wrapper ${rightPreview ? 'turning-active' : ''}`}>
            <Page content={rightBaseContent} pageSide="right" onExplore={handleExplore} onNavigate={handleJumpTo} onUnlock={handleUnlock} />
              {isOpen && (
                <PageFlip
                  ref={rightFlipRef}
                  side="right"  
                  frontContent={spread.right}
                  backContent={currentSpread < totalSpreads - 1 ? effectiveSpreads[currentSpread + 1].left : null}
                  onPreview={handleRightPreview}
                  onPreviewCancel={handleRightPreviewCancel}
                  onComplete={handleNextComplete}
                  disabled={currentSpread >= totalSpreads - 1}
                  onExplore={handleExplore}
                  onNavigate={handleJumpTo}
                  onUnlock={handleUnlock}
                  onFlipStart={() => playSound(SOUNDS.pageFlip, 0.4)}
                />
              )}
            </div>
          </div>

          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="cover-slot"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
               <Cover onOpen={handleOpen} onOpenStart={() => playSound(SOUNDS.coverOpen, 0.6, 1.45)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`book-nav ${!isOpen ? 'book-nav-hidden' : ''}`}>
          <button className="nav-btn nav-btn-prev" onClick={handlePrevClick} disabled={isTurning || !isOpen} aria-label="Previous page">
            <PrevArrowIcon />
            <span>Prev</span>
          </button>
          <span className="page-count">{currentSpread + 1}/{totalSpreads}</span>
          <div className="nav-btn-end-wrap">
            <button
             className={`nav-btn nav-btn-next ${!secretUnlocked && currentSpread === totalSpreads - 1 ? 'nav-btn-end' : ''}`}
              onClick={handleNextClick}
              disabled={isTurning || !isOpen || secretUnlocked || currentSpread === totalSpreads - 1}
              aria-label={currentSpread === totalSpreads - 1 ? 'Book finished' : 'Next page'}
            >
              <span>{!secretUnlocked && currentSpread === totalSpreads - 1 ? 'The End' : 'Next'}</span>
              <NextArrowIcon />
            </button>
            {endBurst && (
              <span className="end-burst" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className={`end-burst-piece end-burst-${i}`} />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopBook;