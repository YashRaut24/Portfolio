import { achievementsData } from '../../data/achievements';
import './Achievements.css';

function Achievements() {
  return (
    <div className="achievements-list">
      {achievementsData.map((item, index) => (
        <div
          key={index}
          className="achievement-item stagger-item"
          style={{ '--stagger-index': index }}
        >
          <div className="achievement-header">
            <h4 className="achievement-title">{item.title}</h4>
          </div>
          
          <div className="achievement-org">
            <span className="org-name">{item.organization}</span>
          </div>
          
          <p className="achievement-desc">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Achievements;