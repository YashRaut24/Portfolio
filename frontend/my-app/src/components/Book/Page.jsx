import './Page.css';
import { useState } from 'react';

function Page({ content, onExplore }) {
  const [burst, setBurst] = useState(false);
  const annotation = content.annotation && (
      <span className={`page-annotation page-annotation-${content.annotationPosition || 'top-right'}`}>
        {content.annotation}
      </span>
    );
  const handleExploreClick = () => {
    setBurst(true);
    setTimeout(() => onExplore(), 950);
  };

  if (!content) {
    return <div className="page page-blank" />;
  }

  if (content.type === 'blank') {
    return <div className="page page-blank" />;
  }

  if (content.type === 'inside-cover') {
      return <div className="page page-inside-cover" />;
  }

  if (content.type === 'transparent') {
    return <div className="page page-transparent" />;
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
          <p className="page-quote">"{content.quote}"</p>
          <p className="page-description">{content.description}</p>
          <svg className="page-easter-egg" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 8C14 8 10 13 10 19C10 23 12 26 14 29V33H26V29C28 26 30 23 30 19C30 13 26 8 20 8Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 35H26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      );
  }

  if (content.type === 'timeline') {
      return (
        <div className="page page-type-timeline">
          {annotation}
          <span className="page-year">{content.year}</span>
          <h2 className="page-title">{content.title}</h2>
          <ul className="page-keywords">
            {content.keywords.map((item, index) => (
              <li key={index} className="page-keyword">{item}</li>
            ))}
          </ul>
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
        </div>
      );
    }

  return null;
}

export default Page;