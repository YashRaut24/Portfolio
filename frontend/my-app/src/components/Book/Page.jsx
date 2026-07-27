import './Page.css';
import { useState } from 'react';

function Page({ content, onExplore, onNavigate, onUnlock, pageSide }) {
  const [burst, setBurst] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);

  const handleExploreClick = () => {
    setBurst(true);
    setTimeout(() => onExplore(), 950);
  };

  const FACT_ICONS = {
    pin: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21C12 21 19 14.5 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 9L4 13L8 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 9L20 13L16 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 6L10.5 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    rocket: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 15C15 15 18 12.5 18.5 6.5C12.5 7 10 10 10 13C10 13.8 10.1 14.4 10.3 15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M10.3 15L7 15.5L6 18.5L9 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M12 15L11.5 18.5L14.5 17.5L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="14.5" cy="9.5" r="1.3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6.5 18.5C5.5 19 4.5 21 4.5 21C4.5 21 6.5 20 7 19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11V19H5.5C4.7 19 4 18.3 4 17.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 5.5C20 4.7 19.3 4 18.5 4H13V19H18.5C19.3 19 20 18.3 20 17.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 4C11 4 12 4.6 12 6C12 4.6 13 4 13 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    gamepad: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 9H17C19 9 20.5 10.8 20.5 13.5C20.5 15.4 19.4 16.5 18.2 16.5C17.4 16.5 16.9 16.1 16.3 15.4L15 14H9L7.7 15.4C7.1 16.1 6.6 16.5 5.8 16.5C4.6 16.5 3.5 15.4 3.5 13.5C3.5 10.8 5 9 7 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7.8 11V13.2M6.7 12.1H8.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="16" cy="11.3" r="0.6" fill="currentColor" />
        <circle cx="17.6" cy="12.9" r="0.6" fill="currentColor" />
      </svg>
    ),
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

  if (content.type === 'quick-facts') {
    return (
      <div className="page page-type-quick-facts">
        <div className="page-quick-facts-content">
          <h2 className="page-quick-facts-title">{content.title}</h2>
          <ul className="page-quick-facts-list">
            {content.facts.map((fact, index) => (
              <li key={index} className="page-quick-facts-item">
                <span className="page-quick-facts-icon">{FACT_ICONS[fact.icon]}</span>
                <span className="page-quick-facts-text">{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>
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

        {content.focusAreas && (
          <div className="page-focus-block">
            <span className="page-focus-label">Focus areas</span>
            <ul className="page-keywords">
              {content.focusAreas.map((item, index) => (
                <li key={index} className="page-keyword">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {content.currentlyExploring && (
          <p className="page-currently-exploring">{content.currentlyExploring}</p>
        )}

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
          {content.description && (
            <p className="page-description page-timeline-description">{content.description}</p>
          )}
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