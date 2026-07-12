import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Cover from './Cover';
import Page from './Page';
import { bookSpreads } from '../../data/bookSpreads';
import './Book.css';

function TurningPage({ content, origin, targetRotate, onComplete, onExplore }) {
  return (
    <motion.div
      className="turning-page"
      style={{ transformOrigin: origin, backfaceVisibility: 'hidden' }}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: targetRotate }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
    >
      <Page content={content} onExplore={onExplore} />
    </motion.div>
  );
}

function Book() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [turning, setTurning] = useState(null);
  const navigate = useNavigate();

  const totalSpreads = bookSpreads.length;
  const spread = bookSpreads[currentSpread];

  const handleNext = () => {
    if (turning || currentSpread >= totalSpreads - 1) return;
    setTurning({ side: 'right', fromIndex: currentSpread, toIndex: currentSpread + 1 });
  };

  const handlePrev = () => {
    if (turning || currentSpread <= 0) return;
    setTurning({ side: 'left', fromIndex: currentSpread, toIndex: currentSpread - 1 });
  };

  const finishTurn = () => {
    setCurrentSpread(turning.toIndex);
    setTurning(null);
  };

  const handleExplore = () => {
    navigate('/explore');
  };

  const leftContent = turning && turning.side === 'left' ? bookSpreads[turning.toIndex].left : spread.left;
  const rightContent = turning && turning.side === 'right' ? bookSpreads[turning.toIndex].right : spread.right;

  return (
    <div className="book-container">
      <div className="book-frame">
        <div className={`book-spread ${!isOpen ? 'book-spread-closed' : ''}`}>
        <div className={`page-flip-wrapper ${!isOpen ? 'page-hidden' : ''}`}>
          <Page content={leftContent} onExplore={handleExplore} />
          {turning && turning.side === 'left' && (
            <TurningPage
              content={bookSpreads[turning.fromIndex].left}
              origin="right center"
              targetRotate={180}
              onComplete={finishTurn}
              onExplore={handleExplore}
            />
          )}
        </div>
          <div className="book-spine" />
          <div className="page-flip-wrapper">
            <Page content={rightContent} onExplore={handleExplore} />
            {turning && turning.side === 'right' && (
              <TurningPage
                content={bookSpreads[turning.fromIndex].right}
                origin="left center"
                targetRotate={-180}
                onComplete={finishTurn}
                onExplore={handleExplore}
              />
            )}
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
            <button className="nav-btn" onClick={handlePrev} disabled={currentSpread === 0 || !!turning}>
              Prev
            </button>
            <button className="nav-btn" onClick={handleNext} disabled={currentSpread === totalSpreads - 1 || !!turning}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Book;