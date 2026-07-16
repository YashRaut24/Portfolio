import { useState } from 'react';
import './Node.css';

function Node({ label, angle, radius, isActive, onClick }) {
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x: rippleX, y: rippleY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick();
  };

  return (
    <button
      className={`hub-node ${isActive ? 'hub-node-active' : ''}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={handleClick}
    >
      {label}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="hub-node-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </button>
  );
}

export default Node;