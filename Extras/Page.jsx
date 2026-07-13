import './Page.css';

function Page({ content, onExplore }) {
  if (!content) {
    return <div className="page page-blank" />;
  }

  if (content.type === 'blank') {
    return <div className="page page-blank" />;
  }

  if (content.type === 'inside-cover') {
    return <div className="page page-inside-cover" />;
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
      <div className="page">
        <p className="page-quote">"{content.quote}"</p>
        <p className="page-description">{content.description}</p>
      </div>
    );
  }

  if (content.type === 'timeline') {
    return (
      <div className="page">
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
      <div className="page page-cta">
        <p className="page-cta-text">Ready to see what I've built?</p>
        <button className="explore-btn" onClick={onExplore}>Explore My Work</button>
      </div>
    );
  }

  return null;
}

export default Page;