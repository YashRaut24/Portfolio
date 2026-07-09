import ProjectCard from './ProjectCard';
import { projectsData } from '../../data/projects';
import './Projects.css';

function Projects() {
  return (
    <div className="projects-section">
      {projectsData.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}

export default Projects;