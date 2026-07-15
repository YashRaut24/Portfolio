import { useState,useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Cover from './Cover';
import PageFlip from './PageFlip';
import Page from './Page';
import { bookSpreads } from '../../data/bookSpreads';
import './Book.css';

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

function Book() {

  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [rightPreview, setRightPreview] = useState(false);
  const [leftPreview, setLeftPreview] = useState(false);
  const [nextTrigger, setNextTrigger] = useState(0);
  const [prevTrigger, setPrevTrigger] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const navigate = useNavigate();

  const totalSpreads = bookSpreads.length;
  const spread = bookSpreads[currentSpread];

  const handleExplore = useCallback(() => navigate('/explore'), [navigate]);
  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleLeftPreview = useCallback(() => setLeftPreview(true), []);
  const handleLeftPreviewCancel = useCallback(() => setLeftPreview(false), []);
  const handleRightPreview = useCallback(() => setRightPreview(true), []);
  const handleRightPreviewCancel = useCallback(() => setRightPreview(false), []);

  const handleNextClick = useCallback(() => {
    if (isTurning || currentSpread >= totalSpreads - 1) return;
    setIsTurning(true);
    setNextTrigger((n) => n + 1);
  }, [isTurning, currentSpread, totalSpreads]);
  
  const handlePrevClick = useCallback(() => {
    if (isTurning) return;
    setIsTurning(true);
    setPrevTrigger((n) => n + 1);
  }, [isTurning]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNextClick();
      if (e.key === 'ArrowLeft') handlePrevClick();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNextClick, handlePrevClick]);

  const handleNextComplete = () => {
    setCurrentSpread((c) => Math.min(c + 1, totalSpreads - 1));
    setRightPreview(false);
    setIsTurning(false);
  };

  

  const handlePrevComplete = () => {
    if (currentSpread === 0) {
      setIsOpen(false);
      setLeftPreview(false);
      setIsTurning(false);
      return;
    }
    setCurrentSpread((c) => Math.max(c - 1, 0));
    setLeftPreview(false);
    setIsTurning(false);
  };

  const rightBaseContent = useMemo(() => (
    rightPreview && currentSpread < totalSpreads - 1
      ? bookSpreads[currentSpread + 1].right
      : spread.right
  ), [currentSpread, rightPreview, spread, totalSpreads]);

  const leftBaseContent = useMemo(() => (
    currentSpread === 0
      ? (leftPreview ? { type: 'transparent' } : spread.left)
      : (leftPreview ? bookSpreads[currentSpread - 1].left : spread.left)
  ), [currentSpread, leftPreview, spread]);

  return (
    <div className="book-container">
      <div   className={`book-frame ${isTurning ? 'book-frame-turning' : ''}`}>
        <div className="book-stage">
          <div className={`book-spread ${!isOpen ? 'book-spread-closed' : ''} ${isOpen && currentSpread === 0 && leftPreview ? 'book-spread-closing' : ''}`}>
            <div className={`page-flip-wrapper ${!isOpen ? 'page-hidden' : ''} ${leftPreview ? 'turning-active' : ''}`}>
              <Page content={leftBaseContent} onExplore={handleExplore} />
              {isOpen && (
                <PageFlip
                  side="left"
                  frontContent={spread.left}
                  backContent={currentSpread > 0 ? bookSpreads[currentSpread - 1].right : { type: 'cover-face' }}
                  onPreview={handleLeftPreview}
                  onPreviewCancel={handleLeftPreviewCancel}
                  onComplete={handlePrevComplete}
                  disabled={false}
                  triggerCount={prevTrigger}
                  onExplore={handleExplore}
                  isClosingFlip={currentSpread === 0}
                />
              )}
            </div>
            <div className="book-spine" />
            <div className={`page-flip-wrapper ${rightPreview ? 'turning-active' : ''}`}>
              <Page content={rightBaseContent} onExplore={handleExplore} />
              {isOpen && (
                <PageFlip
                  side="right"
                  frontContent={spread.right}
                  backContent={currentSpread < totalSpreads - 1 ? bookSpreads[currentSpread + 1].left : null}
                  onPreview={handleRightPreview}
                  onPreviewCancel={handleRightPreviewCancel}
                  onComplete={handleNextComplete}
                  disabled={currentSpread >= totalSpreads - 1}
                  triggerCount={nextTrigger}
                  onExplore={handleExplore}
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
                <Cover onOpen={handleOpen} />
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
          <button
            className={`nav-btn nav-btn-next ${currentSpread === totalSpreads - 1 ? 'nav-btn-end' : ''}`}
            onClick={handleNextClick}
            disabled={isTurning || !isOpen || currentSpread === totalSpreads - 1}
            aria-label={currentSpread === totalSpreads - 1 ? 'Book finished' : 'Next page'}
          >
            <span>{currentSpread === totalSpreads - 1 ? 'The End' : 'Next'}</span>
            <NextArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Book;
