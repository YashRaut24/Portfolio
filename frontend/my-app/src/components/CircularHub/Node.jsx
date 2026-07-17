import { useState, useRef } from 'react';
import './Node.css';

function Node({ label, angle, radius, isActive, onClick, accent }) {
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  const [ripples, setRipples] = useState([]);
  const [magnetic, setMagnetic] = useState({ dx: 0, dy: 0, tilt: 0, scale: 1 });
  const rafRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const normX = (e.clientX - cx) / (rect.width / 2);
    const normY = (e.clientY - cy) / (rect.height / 2);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setMagnetic({
        dx: normX * 8,
        dy: normY * 8,
        tilt: normX * 6,
        scale: 1.06,
      });
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setMagnetic({ dx: 0, dy: 0, tilt: 0, scale: 1 });
  };

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
      style={{
        transform: `translate(${x + magnetic.dx}px, ${y + magnetic.dy}px) rotate(${magnetic.tilt}deg) scale(${magnetic.scale})`,
        '--node-accent': accent,
      }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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