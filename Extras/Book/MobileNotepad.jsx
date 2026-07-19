import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotepadCover from "./NotepadCover";
import Page from "./Page";
import NotepadFlip from "./NotepadFlip";
import { bookSpreads, hiddenSpread } from "../../data/bookSpreads";
import "./MobileNotepad.css";

export default function MobileNotepad() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [previewDirection, setPreviewDirection] = useState(null); // 'next' | 'prev' | null

  const flipRef = useRef(null);

  const spreads = useMemo(
    () => (secretUnlocked ? [...bookSpreads, hiddenSpread] : bookSpreads),
    [secretUnlocked]
  );

  // Flatten spreads into a page list, keeping a map from spread index ->
  // the first page index it produced, so the TOC ("toc" page type) can
  // still jump correctly on mobile.
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

  const handlePreviewNext = useCallback(() => setPreviewDirection("next"), []);
  const handlePreviewPrev = useCallback(() => setPreviewDirection("prev"), []);
  const handlePreviewCancel = useCallback(() => setPreviewDirection(null), []);

  const handleCommitNext = useCallback(() => {
    setPageIndex((p) => Math.min(p + 1, pages.length - 1));
    setPreviewDirection(null);
  }, [pages.length]);

  const handleCommitPrev = useCallback(() => {
    setPageIndex((p) => Math.max(p - 1, 0));
    setPreviewDirection(null);
  }, []);

  const handleNextClick = useCallback(() => {
    flipRef.current?.triggerNext();
  }, []);

  const handlePrevClick = useCallback(() => {
    flipRef.current?.triggerPrev();
  }, []);

  const handleNavigate = useCallback(
    (spreadIndex) => {
      const target = spreadIndexToPageIndex[spreadIndex];
      if (target === undefined) return;
      setPreviewDirection(null);
      setPageIndex(Math.max(0, Math.min(target, pages.length - 1)));
    },
    [spreadIndexToPageIndex, pages.length]
  );

  const handleExplore = useCallback(() => navigate("/explore"), [navigate]);
  const handleUnlock = useCallback(() => setSecretUnlocked(true), []);

  if (!opened) {
    return (
      <div className="mobile-notepad">
        <div className="notepad-page">
          <div className="notepad-stack">
            <div className="notepad-stack-sliver notepad-stack-sliver-2" />
            <div className="notepad-stack-sliver notepad-stack-sliver-1" />

            {/* The real first page, waiting underneath the cover so it's
                what gets revealed as the cover folds back, not blank space. */}
            <div className="notepad-base-page">
              <Page
                content={pages[0]}
                onExplore={handleExplore}
                onNavigate={handleNavigate}
                onUnlock={handleUnlock}
              />
            </div>

            <NotepadCover onOpen={() => setOpened(true)} pageIndex={pageIndex} />
          </div>
        </div>
      </div>
    );
  }

  // The base page shows whatever content should already be waiting
  // underneath the flipping leaf: the next page while flipping forward,
  // the previous page while flipping backward, otherwise the current page.
  const baseContent =
    previewDirection === "next" && hasNext
      ? pages[pageIndex + 1]
      : previewDirection === "prev" && hasPrev
      ? pages[pageIndex - 1]
      : pages[pageIndex];

  return (
    <div className="mobile-notepad">
      <div className="notepad-page">
        <div className="notepad-stack">
          <div className="notepad-stack-sliver notepad-stack-sliver-2" />
          <div className="notepad-stack-sliver notepad-stack-sliver-1" />

          <div className="notepad-base-page">
            <Page
              content={baseContent}
              onExplore={handleExplore}
              onNavigate={handleNavigate}
              onUnlock={handleUnlock}
            />
          </div>

          {/* Mount the cover to keep the static top folded strip visible */}
          <NotepadCover onOpen={() => setOpened(true)} pageIndex={pageIndex} />

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
        <button onClick={handlePrevClick} disabled={!hasPrev}>
          ← Prev
        </button>

        <span>
          {pageIndex + 1}/{pages.length}
        </span>

        <button onClick={handleNextClick} disabled={!hasNext}>
          Next →
        </button>
      </div>
    </div>
  );
}