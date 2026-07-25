import './Page.css';
import { useState } from 'react';

function Page({ content, onExplore, onNavigate, onUnlock, pageSide }) {
  const [burst, setBurst] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);

  const handleExploreClick = () => {
    setBurst(true);
    setTimeout(() => onExplore(), 950);
  };

  const handleEasterEggClick = () => {
    setEggClicks((c) => {
      const next = c + 1;
      if (next >= 5) {
        onUnlock && onUnlock();
        return 0;
      }
      return next;
    });
  };

  if (!content) {
    return <div className="page page-blank" />;
  }

  const annotation = content.annotation && (
      <span className={`page-annotation page-annotation-${content.annotationPosition || 'top-right'}`}>
        {content.annotation}
      </span>
    );

  // Physical page number shown in the footer of every numbered page (front and back faces alike).
  // Left-hand pages get it in the bottom-left corner, right-hand pages bottom-right —
  // matching how page numbers sit in a real book. Defaults to the right corner
  // when no side is known (e.g. the single-column mobile notepad view).
  const pageNumberEl = content.pageNumber ? (
    <span
      className={`page-number ${pageSide === 'left' ? 'page-number-left' : 'page-number-right'}`}
      aria-hidden="true"
    >
      {String(content.pageNumber).padStart(2, '0')}
    </span>
  ) : null;

  if (content.type === 'blank') {
    return <div className="page page-blank" />;
  }

  if (content.type === 'inside-cover') {
      return <div className="page page-inside-cover" />;
  }

  if (content.type === 'transparent') {
    return <div className="page page-transparent" />;
  }

  if (content.type === 'placeholder') {
      return (
        <div className="page page-type-placeholder">
          {pageNumberEl}
        </div>
      );
  }

  if (content.type === 'cover-face') {
    return (
      <div className="page page-cover-face">
        <img src="/assets/images/profile.jpg" alt="Profile" className="page-cover-photo" />
        <h1 className="page-cover-name">Yash</h1>
        <p className="page-cover-role">AI Engineer & Full-Stack Developer</p>
      </div>
    );
  }

  if (content.type === 'intro') {
      return (
        <div className="page page-type-intro">
          {annotation}
          <p className="page-quote">
            "<span className="page-quote-highlight" key={content.quote}>{content.quote}</span>"
          </p>
          <p className="page-description">{content.description}</p>
          <svg
            className="page-easter-egg page-easter-egg-clickable"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
            onClick={handleEasterEggClick}
          >
            <path d="M20 8C14 8 10 13 10 19C10 23 12 26 14 29V33H26V29C28 26 30 23 30 19C30 13 26 8 20 8Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 35H26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {pageNumberEl}
        </div>
      );
  }

  if (content.type === 'timeline') {
      return (
        <div className="page page-type-timeline">
          {annotation}
          <span className="page-year">{content.year}</span>
          <h2 className="page-title">
            <span className="page-title-wrap" key={content.title}>
              <span className="page-title-text">{content.title}</span>
              <svg className="page-title-pencil" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20L5 15L16 4L20 8L9 19L4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
          </h2>
          <ul className="page-keywords">
            {content.keywords.map((item, index) => (
              <li key={index} className="page-keyword">{item}</li>
            ))}
          </ul>
          {pageNumberEl}
        </div>
      );
  }

  if (content.type === 'toc') {
      return (
        <div className="page page-type-toc">
          <h2 className="page-title">{content.title}</h2>
          <ul className="page-toc-list">
            {content.entries.map((entry, index) => (
              <li key={index}>
                <button
                  className="page-toc-item"
                  onClick={() => onNavigate && onNavigate(entry.spreadIndex)}
                >
                  <span className="page-toc-label">{entry.label}</span>
                  <span className="page-toc-dots" aria-hidden="true" />
                  {entry.pageNumber && (
                    <span className="page-toc-pagenum">
                      {String(entry.pageNumber).padStart(2, '0')}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {pageNumberEl}
        </div>
      );
  }

  if (content.type === 'cta') {
      return (
        <div className="page page-cta page-type-cta">
          {annotation}
          <p className="page-cta-text">Ready to see what I've built?</p>
          <div className="explore-btn-wrap">
            <button className="explore-btn" onClick={handleExploreClick}>Explore My Work</button>
            {burst && (
              <span className="confetti-burst" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`confetti-piece confetti-${i}`} />
                ))}
              </span>
            )}
          </div>
          {pageNumberEl}
        </div>
      );
    }

  return null;
}

export default Page;