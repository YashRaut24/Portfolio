import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Cover from './Cover';
import PageFlip from './PageFlip';
import Page from './Page';
import { bookSpreads } from '../../data/bookSpreads';
import './Book.css';

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
      <div className="book-frame">
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
          <button className="nav-btn" onClick={handlePrevClick} disabled={isTurning || !isOpen}>
            Prev
          </button>
          <button
            className="nav-btn"
            onClick={handleNextClick}
            disabled={isTurning || !isOpen || currentSpread === totalSpreads - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Book;
