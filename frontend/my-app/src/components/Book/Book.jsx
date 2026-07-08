import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Cover from './Cover';
import Page from './Page';
import { timelineData } from '../../data/timeline';
import './Book.css';

function Book() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const totalPages = timelineData.length;

    const [isExiting, setIsExiting] = useState(false);


  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

    const handleExplore = () => {
    setIsExiting(true);
    setTimeout(() => {
        navigate('/explore');
    }, 500);
    };

  const pageVariants = {
    enter: (dir) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
    }),
  };

    return (
    <motion.div
        className="book-container"
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.5 }}
    >
      {!isOpen ? (
        <Cover onOpen={handleOpen} />
      ) : (
        <div className="book-open">
          <div className="page-flip-wrapper">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ transformOrigin: 'left center' }}
              >
                <Page
                  year={timelineData[currentPage].year}
                  title={timelineData[currentPage].title}
                  keywords={timelineData[currentPage].keywords}
                  isLast={currentPage === totalPages - 1}
                  onExplore={handleExplore}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="book-nav">
            <button
              className="nav-btn"
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              Prev
            </button>
            <button
              className="nav-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Book;