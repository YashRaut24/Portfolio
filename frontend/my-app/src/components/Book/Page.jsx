import './Page.css';

function Page({ year, title, keywords, isLast, onExplore }) {
  return (
    <div className="page">
      {year && <span className="page-year">{year}</span>}
      {title && <h2 className="page-title">{title}</h2>}
      {keywords && (
        <ul className="page-keywords">
          {keywords.map((item, index) => (
            <li key={index} className="page-keyword">{item}</li>
          ))}
        </ul>
      )}
      {isLast && (
        <button className="explore-btn" onClick={onExplore}>
          Explore My Work
        </button>
      )}
    </div>
  );
}

export default Page;