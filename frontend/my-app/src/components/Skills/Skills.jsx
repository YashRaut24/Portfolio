import { skillsData } from '../../data/skills';
import './Skills.css';

function Skills() {
  return (
    <div className="skills-section">
      {skillsData.map((group) => (
        <div key={group.category} className="skills-group">
          <h3 className="skills-category">{group.category}</h3>
          <ul className="skills-list">
            {group.items.map((skill, index) => (
              <li key={index} className="skills-tag">{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Skills;