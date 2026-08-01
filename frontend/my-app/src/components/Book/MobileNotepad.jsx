import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotepadCover from "./NotepadCover";
import Page from "./Page";
import NotepadFlip from "./NotepadFlip";
import { bookSpreads, hiddenSpread } from "../../data/bookSpreads";
import { playSound, SOUNDS } from "../../utils/sound";
import "./MobileNotepad.css";

export default function MobileNotepad() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // NEW: Tracks the physical closing animation
  
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [previewDirection, setPreviewDirection] = useState(null); 
  const [coverMoving, setCoverMoving] = useState(false);
  
  // Orchestrator for sequential rapid-flipping
  const [targetPageIndex, setTargetPageIndex] = useState(null);
  const isTurningRef = useRef(false);

  const flipRef = useRef(null);

  const spreads = useMemo(
    () => (secretUnlocked ? [...bookSpreads, hiddenSpread] : bookSpreads),
    [secretUnlocked]
  );

  const { pages, spreadIndexToPageIndex } = useMemo(() => {
    const arr = [];
    const map = {};

    spreads.forEach((spread, spreadIdx) => {
      const startLength = arr.length;

      if (
        spread.left &&
        spread.left.type !== "placeholder" &&
        spread.left.type !== "inside-cover"
      ) {
        arr.push(spread.left);
      }

      if (spread.right && spread.right.type !== "placeholder") {
        arr.push(spread.right);
      }

      map[spreadIdx] = startLength < arr.length ? startLength : arr.length - 1;
    });

    return { pages: arr, spreadIndexToPageIndex: map };
  }, [spreads]);

  const hasNext = pageIndex < pages.length - 1;
  const hasPrev = pageIndex > 0;

  const handlePreviewNext = useCallback(() => {
    setPreviewDirection("next");
    playSound(SOUNDS.pageFlip, 0.4);
  }, []);

  const handlePreviewPrev = useCallback(() => {
    setPreviewDirection("prev");
    playSound(SOUNDS.pageFlip, 0.4);
  }, []);

  const handlePreviewCancel = useCallback(() => setPreviewDirection(null), []);

  const handleCommitNext = useCallback(() => {
    setPageIndex((p) => Math.min(p + 1, pages.length - 1));
    setPreviewDirection(null);
    isTurningRef.current = false;
  }, [pages.length]);

  const handleCommitPrev = useCallback(() => {
    setPageIndex((p) => Math.max(p - 1, 0));
    setPreviewDirection(null);
    isTurningRef.current = false;
  }, []);

  const handleNextClick = useCallback(() => {
    if (isTurningRef.current) return;
    isTurningRef.current = true;
    flipRef.current?.triggerNext();
  }, []);

  const handlePrevClick = useCallback(() => {
    if (isTurningRef.current) return;
    isTurningRef.current = true;
    flipRef.current?.triggerPrev();
  }, []);

  const handleNavigate = useCallback(
    (spreadIndex) => {
      const target = spreadIndexToPageIndex[spreadIndex];
      if (target === undefined || target === pageIndex) return;
      setPreviewDirection(null);
      setTargetPageIndex(Math.max(0, Math.min(target, pages.length - 1)));
    },
    [spreadIndexToPageIndex, pages.length, pageIndex]
  );
  
  // NEW: Triggers the physical closing animation
  const handleCoverClose = useCallback(() => {
    setCoverMoving(true);
    setIsClosing(true);
    setOpened(false); // Unmounts the "Open" DOM block, mounts the "Closed" DOM block
  }, []);

  // The Sequential Rapid-Flip Engine with a 30ms paint window
  useEffect(() => {
    if (targetPageIndex !== null && !previewDirection && !coverMoving) {
      if (!isTurningRef.current) {
        const timer = setTimeout(() => {
          if (pageIndex < targetPageIndex) {
            handleNextClick();
          } else if (pageIndex > targetPageIndex) {
            handlePrevClick();
          } else {
            setTargetPageIndex(null);
          }
        }, 30);
        return () => clearTimeout(timer);
      }
    }
  }, [pageIndex, targetPageIndex, previewDirection, coverMoving, handleNextClick, handlePrevClick]);

  const handleExplore = useCallback(() => navigate("/explore"), [navigate]);
  const handleUnlock = useCallback(() => setSecretUnlocked(true), []);
  const handleCoverOpen = useCallback(() => {
    setCoverMoving(false);
    setOpened(true);
  }, []);

  const baseContent = useMemo(() => {
    return previewDirection === 'next' && hasNext 
      ? pages[pageIndex + 1] 
      : pages[pageIndex];
  }, [pageIndex, previewDirection, hasNext, pages]);

  if (!opened) {
    return (
      <div className="mobile-notepad mobile-notepad-closed">
        <div className={`notepad-page ${coverMoving ? "notepad-page-cover-moving" : ""}`}>
          <div className="notepad-fixed-header" />
          <div className="notepad-stack">
            <div className="notepad-stack-sliver notepad-stack-sliver-3" />
            <div className="notepad-stack-sliver notepad-stack-sliver-2" />
            <div className="notepad-stack-sliver notepad-stack-sliver-1" />

            <div className="notepad-base-page">
              <Page
                content={pages[0]}
                onExplore={handleExplore}
                onNavigate={handleNavigate}
                onUnlock={handleUnlock}
              />
            </div>

            <NotepadCover
              onOpen={handleCoverOpen}
              isClosing={isClosing}
              onCloseComplete={() => setIsClosing(false)}
              onMotionStart={() => {
                setCoverMoving(true);
                playSound(SOUNDS.coverOpen, 0.6, 1.45);
              }}
              onMotionEnd={() => setCoverMoving(false)}
              pageIndex={pageIndex}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-notepad mobile-notepad-open">
      <div className={`notepad-page ${previewDirection ? "notepad-page-turning" : ""}`}>
        <div className="notepad-stack">
          <div className="notepad-stack-sliver notepad-stack-sliver-2" />
          <div className="notepad-stack-sliver notepad-stack-sliver-1" />
          
          <NotepadCover 
            openStrip 
            onOpen={handleCoverOpen} 
            pageIndex={pageIndex} 
            onStripInteract={() => {
              // If there are turned pages, flip them back.
              // If there are NO turned pages, shut the cover completely.
              if (hasPrev && targetPageIndex === null) {
                handlePrevClick();
              } else if (!hasPrev && targetPageIndex === null) {
                handleCoverClose();
              }
            }}
          />

          <div className="notepad-base-page">
            <Page
              content={baseContent}
              onExplore={handleExplore}
              onNavigate={handleNavigate}
              onUnlock={handleUnlock}
            />
          </div>

          <NotepadFlip
            ref={flipRef}
            currentContent={pages[pageIndex]}
            prevContent={hasPrev ? pages[pageIndex - 1] : null}
            nextContent={hasNext ? pages[pageIndex + 1] : null}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPreviewNext={handlePreviewNext}
            onPreviewPrev={handlePreviewPrev}
            onPreviewCancel={handlePreviewCancel}
            onCommitNext={handleCommitNext}
            onCommitPrev={handleCommitPrev}
            onExplore={handleExplore}
            onNavigate={handleNavigate}
            onUnlock={handleUnlock}
          />
        </div>
      </div>

      <div className="mobile-nav">
        <button onClick={handlePrevClick} disabled={!hasPrev && targetPageIndex === null}>
          ← Prev
        </button>

        <span>
          {pageIndex + 1}/{pages.length}
        </span>

        <button onClick={handleNextClick} disabled={!hasNext && targetPageIndex === null}>
          Next →
        </button>
      </div>
    </div>
  );
}