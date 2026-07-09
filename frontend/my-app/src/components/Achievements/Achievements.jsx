import { achievementsData } from '../../data/achievements';
import './Achievements.css';

function Achievements() {
  return (
    <ul className="achievements-list">
      {achievementsData.map((item, index) => (
        <li key={index} className="achievement-item">
          <h4 className="achievement-title">{item.title}</h4>
          <p className="achievement-desc">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}

export default Achievements;