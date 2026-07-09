import './ProjectCard.css';

function ProjectCard({ title, description, techStack, liveLink, githubLink }) {
  return (
    <div className="project-card">
      <h3 className="project-title">{title}</h3>
      <p className="project-description">{description}</p>
      <ul className="project-tech">
        {techStack.map((tech, index) => (
          <li key={index} className="project-tech-tag">{tech}</li>
        ))}
      </ul>
      <div className="project-links">
        {liveLink && <a href={liveLink} target="_blank" rel="noopener noreferrer" className="project-link">Live Demo</a>}
        {githubLink && <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-link">GitHub</a>}
      </div>
    </div>
  );
}

export default ProjectCard;