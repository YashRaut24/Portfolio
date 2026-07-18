import './Header.css';

function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="header-btn-icon" aria-hidden="true">
      <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17V19C4 20 5 21 6 21H18C19 21 20 20 20 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="header-btn-icon" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.21C2 16.72 4.87 20.53 8.84 21.87C9.34 21.96 9.52 21.65 9.52 21.38C9.52 21.14 9.51 20.35 9.51 19.51C7 20.02 6.35 18.9 6.15 18.32C6.04 18.02 5.53 17.12 5.08 16.88C4.71 16.68 4.18 16.17 5.07 16.16C5.91 16.15 6.51 16.96 6.71 17.28C7.66 18.9 9.17 18.44 9.75 18.16C9.84 17.46 10.11 16.99 10.41 16.72C8.07 16.45 5.62 15.53 5.62 11.47C5.62 10.32 6.02 9.37 6.73 8.63C6.62 8.36 6.27 7.28 6.83 5.82C6.83 5.82 7.71 5.53 9.52 6.77C10.28 6.55 11.09 6.44 11.9 6.44C12.71 6.44 13.52 6.55 14.28 6.77C16.09 5.52 16.97 5.82 16.97 5.82C17.53 7.28 17.18 8.36 17.07 8.63C17.78 9.37 18.18 10.31 18.18 11.47C18.18 15.54 15.72 16.45 13.38 16.72C13.76 17.05 14.09 17.7 14.09 18.7C14.09 20.12 14.08 21.03 14.08 21.38C14.08 21.65 14.26 21.97 14.76 21.87C18.74 20.53 21.6 16.72 21.6 12.21C21.6 6.58 17.5 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="header-btn-icon" aria-hidden="true">
      <path d="M6.94 5.5C6.94 6.6 6.06 7.5 4.97 7.5C3.88 7.5 3 6.6 3 5.5C3 4.4 3.88 3.5 4.97 3.5C6.06 3.5 6.94 4.4 6.94 5.5Z" />
      <path d="M3.5 9H6.4V20.5H3.5V9Z" />
      <path d="M10 9H12.77V10.31H12.81C13.2 9.59 14.15 8.83 15.57 8.83C18.5 8.83 19 10.7 19 13.13V20.5H16.1V13.68C16.1 12.53 16.08 11.05 14.42 11.05C12.74 11.05 12.5 12.3 12.5 13.6V20.5H10V9Z" />
    </svg>
  );
}

function Header() {



  return (
    <header className="site-header">
      <div className="header-name">Yash</div>
      <div className="header-actions">
         <a href="/assets/resume.pdf"
          download
          className="header-btn header-btn-primary"
         >
          <ResumeIcon />
          Resume
        </a>

         <a href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
        >
          <GitHubIcon />
          GitHub
        </a>

         <a href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="header-btn"
        >
          <LinkedInIcon />
          LinkedIn
        </a>
      </div>
    </header>
  );
}

export default Header;