import { experienceData } from '../../data/experience';
import './Experience.css';

function Experience() {
  return (
    <ul className="experience-list">
      {experienceData.map((item, index) => (
        <li key={index} className="experience-item">
          <span className="experience-date">{item.date}</span>
          <h4 className="experience-title">{item.title}</h4>
          <p className="experience-desc">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}

export default Experience;