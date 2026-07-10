import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <div className="header-name">Yash</div>
      <div className="header-actions">
         <a href="/assets/resume.pdf"
          download
          className="header-btn header-btn-primary"
         >
          Resume
        </a>
        
         <a href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
        >
          GitHub
        </a>
        
         <a href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
        >
          LinkedIn
        </a>
      </div>
    </header>
  );
}

export default Header;