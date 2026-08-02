import './ProjectCard.css';

// Minimal inline SVG icons for the buttons
function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );
}

function ProjectCard({
    title,
    description,
    techStack,
    liveLink,
    githubLink,
    image, 
}) {
    return (
        <div className="premium-project-card">
            
            {/* HERO IMAGE SECTION */}
            <div className="project-image-wrapper">
                {image ? (
                    <img 
                      src={image} 
                      alt={`Preview of ${title}`} 
                      className="project-image" 
                      loading="lazy" 
                    />
                ) : (
                    <div className="project-image-placeholder">
                        <span>No Preview Available</span>
                    </div>
                )}
            </div>

            {/* TEXT CONTENT SECTION */}
            <div className="project-content">
                <h3 className="project-title">{title}</h3>
                
                <div className="project-tech-stack" aria-label="Technologies used">
                    {techStack.map((tech, index) => (
                        <span key={index} className="tech-pill">{tech}</span>
                    ))}
                </div>

                <p className="project-description">{description}</p>
            </div>

            {/* BOTTOM ACTIONS ROW (Outside content padding for flush edges) */}
            <div className="project-actions">
                <a 
                    href={githubLink || '#'} 
                    target={githubLink ? "_blank" : "_self"} 
                    rel="noreferrer" 
                    className="btn-project btn-outline"
                    aria-disabled={!githubLink}
                    aria-label={`View ${title} source code on GitHub`}
                    onClick={(e) => !githubLink && e.preventDefault()}
                >
                    <GitHubIcon />
                    <span>GitHub</span>
                </a>
                
                <a 
                    href={liveLink || '#'} 
                    target={liveLink ? "_blank" : "_self"} 
                    rel="noreferrer" 
                    className="btn-project btn-filled"
                    aria-disabled={!liveLink}
                    aria-label={`View live demo of ${title}`}
                    onClick={(e) => !liveLink && e.preventDefault()}
                >
                    <ExternalLinkIcon />
                    <span>Live Demo</span>
                </a>
            </div>

        </div>
    );
}

export default ProjectCard;