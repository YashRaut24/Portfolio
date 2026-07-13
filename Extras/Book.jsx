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
  const [rightPreview, setRightPreview] = useState(false);
  const [leftPreview, setLeftPreview] = useState(false);
  const [nextTrigger, setNextTrigger] = useState(0);
  const [prevTrigger, setPrevTrigger] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
    setIsTurning(true);
    setPrevTrigger((n) => n + 1);
  };

  const handleNextComplete = () => {
    setCurrentSpread((c) => Math.min(c + 1, totalSpreads - 1));
    setRightPreview(false);
    setIsTurning(false);
  };

const handlePrevComplete = () => {
  if (currentSpread === 0) {
    setIsClosing(true);
  } else {
    setCurrentSpread((c) => Math.max(c - 1, 0));
    setLeftPreview(false);
    setIsTurning(false);
  }
};

  const rightBaseContent = rightPreview && currentSpread < totalSpreads - 1
    ? bookSpreads[currentSpread + 1].right
    : spread.right;

  const leftBaseContent = leftPreview && currentSpread > 0
    ? bookSpreads[currentSpread - 1].left
    : spread.left;

  const leftBackContent = currentSpread === 0
    ? { type: 'cover-face' }
    : bookSpreads[currentSpread - 1].right;

  return (
    <div className="book-container">
      <div className="book-frame">
        <div className="book-stage">
          <div className={`book-spread ${!isOpen ? 'book-spread-closed' : ''}`}>
            <div className={`page-flip-wrapper ${!isOpen ? 'page-hidden' : ''}`}>
              <Page content={leftBaseContent} onExplore={handleExplore} />
              {isOpen && (
                <PageFlip
                  side="left"
                  frontContent={spread.left}
                  backContent={leftBackContent}
                  onPreview={() => setLeftPreview(true)}
                  onPreviewCancel={() => setLeftPreview(false)}
                  onComplete={handlePrevComplete}
                  disabled={false}
                  triggerCount={prevTrigger}
                  onExplore={handleExplore}
                />
              )}
            </div>
            <div className="book-spine" />
            <div className="page-flip-wrapper">
              <Page content={rightBaseContent} onExplore={handleExplore} />
              {isOpen && (
                <PageFlip
                  side="right"
                  frontContent={spread.right}
                  backContent={currentSpread < totalSpreads - 1 ? bookSpreads[currentSpread + 1].left : null}
                  onPreview={() => setRightPreview(true)}
                  onPreviewCancel={() => setRightPreview(false)}
                  onComplete={handleNextComplete}
                  disabled={currentSpread >= totalSpreads - 1}
                  triggerCount={nextTrigger}
                  onExplore={handleExplore}
                />
              )}
            </div>
          </div>

<AnimatePresence>
    {(!isOpen || isClosing) && (
        <motion.div
            className="cover-slot"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <Cover
                onOpen={() => setIsOpen(true)}
                isClosing={isClosing}
                onCloseComplete={() => {
                    setIsOpen(false);
                    setIsClosing(false);
                    setLeftPreview(false);
                    setIsTurning(false);
                }}
            />
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