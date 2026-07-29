import { experienceData } from '../../data/experience';
import './Experience.css';

function Experience() {
  return (
    <div className="experience-list">
      {experienceData.map((item, index) => (
        <div
          key={index}
          className="experience-item stagger-item"
          style={{ '--stagger-index': index }}
        >
          <div className="experience-header">
            <h4 className="experience-title">{item.title}</h4>
            <span className="experience-date">{item.date}</span>
          </div>
          
          <div className="experience-company">
            <span className="company-name">{item.company}</span>
            <span className="company-separator">•</span>
            <span className="company-type">{item.type}</span>
          </div>

          <ul className="experience-bullets">
            {item.bullets.map((bullet, bulletIndex) => (
              <li key={bulletIndex} className="experience-bullet">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Experience;