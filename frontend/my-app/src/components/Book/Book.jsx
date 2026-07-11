import { useState } from 'react';
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
  const [nextTrigger, setNextTrigger] = useState(0);
  const [prevTrigger, setPrevTrigger] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const navigate = useNavigate();

  const totalSpreads = bookSpreads.length;
  const spread = bookSpreads[currentSpread];

  const handleExplore = () => navigate('/explore');

  const handleNextClick = () => {
    if (isTurning || currentSpread >= totalSpreads - 1) return;
    setIsTurning(true);
    setNextTrigger((n) => n + 1);
  };

  const handlePrevClick = () => {
    if (isTurning) return;
    if (currentSpread === 0) {
      setIsOpen(false);
      return;
    }
    setIsTurning(true);
    setPrevTrigger((n) => n + 1);
  };

  const handleNextComplete = () => {
    setCurrentSpread((c) => Math.min(c + 1, totalSpreads - 1));
    setIsTurning(false);
  };

  const handlePrevComplete = () => {
    if (currentSpread === 0) {
      setIsOpen(false);
      setIsTurning(false);
      return;
    }
    setCurrentSpread((c) => Math.max(c - 1, 0));
    setIsTurning(false);
  };

  return (
    <div className="book-container">
      <div className="book-frame">
        <div className="book-stage">
          <div className={`book-spread ${!isOpen ? 'book-spread-closed' : ''}`}>
            <div className={`page-flip-wrapper ${!isOpen ? 'page-hidden' : ''}`}>
              <Page content={spread.left} onExplore={handleExplore} />
              {isOpen && (
                <PageFlip
                  side="left"
                  frontContent={spread.left}
                  onComplete={handlePrevComplete}
                  disabled={false}
                  triggerCount={prevTrigger}
                  onExplore={handleExplore}
                />
              )}
            </div>
            <div className="book-spine" />
            <div className="page-flip-wrapper">
              <Page content={spread.right} onExplore={handleExplore} />
              {isOpen && (
                <PageFlip
                  side="right"
                  frontContent={spread.right}
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
                <Cover onOpen={() => setIsOpen(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isOpen && (
          <div className="book-nav">
            <button className="nav-btn" onClick={handlePrevClick} disabled={isTurning}>
              Prev
            </button>
            <button
              className="nav-btn"
              onClick={handleNextClick}
              disabled={isTurning || currentSpread === totalSpreads - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Book;