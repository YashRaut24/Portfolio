import ProjectCard from './ProjectCard';
import { projectsData } from '../../data/projects';
import './Projects.css';

function Projects() {
  return (
    <div className="projects-section">
      {projectsData.map((project, index) => (
        <div key={project.id} className="stagger-item" style={{ '--stagger-index': index }}>
          <ProjectCard {...project} />
        </div>
      ))}
    </div>
  );
}

export default Projects;