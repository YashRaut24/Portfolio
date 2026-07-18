import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './OrbitRing.css';

function OrbitRing({ totalNodes, activeIndex }) {
  const [visited, setVisited] = useState(() => new Set([activeIndex]));
  const [burst, setBurst] = useState(false);
  const hasCompletedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(activeIndex)) return prev;
      const next = new Set(prev);
      next.add(activeIndex);
      return next;
    });
  }, [activeIndex]);

  useEffect(() => {
    if (visited.size >= totalNodes && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setBurst(true);
      const timer = setTimeout(() => {
        setBurst(false);
        setVisited(new Set([activeIndex]));
        hasCompletedRef.current = false;
      }, 1400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited, totalNodes]);

  const ticks = Array.from({ length: totalNodes }, (_, i) => {
    const theta = (i / totalNodes) * 2 * Math.PI - Math.PI / 2;
    const cx = 50 + 40 * Math.cos(theta);
    const cy = 50 + 40 * Math.sin(theta);
    return { cx, cy, isActive: i === activeIndex, isVisited: visited.has(i) };
  });

return (
    <div className="orbit-tracker" aria-label={`Node ${activeIndex + 1} of ${totalNodes}`}>
      <svg className="orbit-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="orbit-ring-track" cx="50" cy="50" r="40" />
        {ticks.map((tick, i) => (
          <motion.circle
            key={i}
            className={`orbit-ring-tick ${tick.isActive ? 'orbit-ring-tick-active' : ''} ${tick.isVisited ? 'orbit-ring-tick-visited' : ''}`}
            cx={tick.cx}
            cy={tick.cy}
            initial={false}
            animate={{ r: tick.isActive ? 4.5 : 3 }}
            transition={
              shouldReduceMotion
                  ? { duration: 0 }
                  : {
                        duration: 0.25,
                        ease: 'easeOut',
                    }
            }
          />
        ))}
      </svg>
      <span className="orbit-tracker-count" aria-hidden="true">
        {totalNodes - activeIndex}
      </span>
      {burst && (
        <span className="orbit-burst" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className={`orbit-burst-piece orbit-burst-${i}`} />
          ))}
        </span>
      )}
    </div>
  );
}

export default OrbitRing;