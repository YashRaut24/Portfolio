import './Node.css';

function Node({ label, angle, radius, isActive, onClick }) {
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  return (
    <button
      className={`hub-node ${isActive ? 'hub-node-active' : ''}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Node;