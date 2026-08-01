import { useState } from 'react';
import { motion } from 'framer-motion';
import './ProjectCard.css';

function ProjectCard({
    title,
    description,
    techStack,
    liveLink,
    githubLink,
}) {
    const [flipped, setFlipped] = useState(false);

    const handleToggleFlip = () => {
        setFlipped((prev) => !prev);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleFlip();
        }
    };

    return (
        <div
            className="project-card-container"
            role="button"
            tabIndex={0}
            aria-expanded={flipped}
            aria-label={`Project: ${title}. Press Enter to flip for details.`}
            onClick={handleToggleFlip}
            onKeyDown={handleKeyDown}
        >
            <motion.div
                className="project-card-inner"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                {/* FRONT */}

                <div className="project-card project-front" aria-hidden={flipped}>
                    <h3 className="project-title">{title}</h3>

                    <p className="project-description">
                        {description}
                    </p>

                    <span className="project-flip-hint">
                        Click to view details →
                    </span>
                </div>

                {/* BACK */}

                <div className="project-card project-back" aria-hidden={!flipped}>

                    <h4 className="project-back-heading">
                        Tech Stack
                    </h4>

                    <ul className="project-tech" aria-label="Technologies used">
                        {techStack.map((tech, index) => (
                            <li
                                key={index}
                                className="project-tech-tag"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>

                    <div className="project-links">
                        {liveLink && (
                            <a
                                href={liveLink}
                                target="_blank"
                                rel="noreferrer"
                                className="project-link"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                tabIndex={flipped ? 0 : -1}
                            >
                                Live Demo
                            </a>
                        )}

                        {githubLink && (
                            <a
                                href={githubLink}
                                target="_blank"
                                rel="noreferrer"
                                className="project-link"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                tabIndex={flipped ? 0 : -1}
                            >
                                GitHub
                            </a>
                        )}
                    </div>

                    <span className="project-flip-hint">
                        ← Click to go back
                    </span>

                </div>

            </motion.div>
        </div>
    );
}

export default ProjectCard;