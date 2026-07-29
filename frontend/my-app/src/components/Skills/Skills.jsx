import { skillsData } from '../../data/skills';
import './Skills.css';

function Skills() {
  return (
    <div className="skills-section">
      {skillsData.map((group, groupIndex) => (
        <div
          key={group.category}
          className="skills-group stagger-item"
          style={{ '--stagger-index': groupIndex }}
        >
          <h3 className="skills-category">{group.category}</h3>
          <ul className="skills-list">
            {group.items.map((skill, index) => (
              <li
                key={index}
                className="skills-tag stagger-item"
                style={{ '--stagger-index': groupIndex + index * 0.1 }}
              >
                <img src={skill.icon} alt={skill.name} className="skill-icon" />
                <span className="skill-name">{skill.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Skills;