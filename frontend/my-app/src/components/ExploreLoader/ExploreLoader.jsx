import { useEffect, useState, useMemo } from "react";
import { motion, useAnimate, AnimatePresence, stagger } from "framer-motion";
import { prefersReducedMotion } from "../../utils/motionPrefs";
import "./ExploreLoader.css";

const EXPLORE_MESSAGES = [
  "Charting constellations...",
  "Mapping the universe...",
  "Initializing orbit...",
  "Scanning galaxies..."
];

export default function ExploreLoader({ onComplete }) {
  const [scope, animate] = useAnimate();
  const [msgIndex, setMsgIndex] = useState(0);

  // Background stars generated once deterministically for the loader session
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 1
    }));
  }, []);

  // Cycle typography
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % EXPLORE_MESSAGES.length);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Cinematic Timeline
  useEffect(() => {
    const runAnimation = async () => {
      // 1. Accessibility Guard
      if (prefersReducedMotion()) {
        await animate(".loader-status-text", { opacity: 1 }, { duration: 0.5 });
        await new Promise(r => setTimeout(r, 600));
        onComplete();
        return;
      }

      // Premium, floating easing curve
      const cinematicEase = [0.22, 1, 0.36, 1];

      // A. Tiny stars appear one by one
      animate(".loader-tiny-star", 
        { opacity: [0, 0.8, 0.4] }, 
        { duration: 1.2, delay: stagger(0.03) }
      );

      // B. Soft nebula glow develops
      animate(".explore-loader-nebula", 
        { opacity: [0, 1] }, 
        { duration: 1.5, ease: "easeOut" }
      );

      // C. Galaxy smoothly rotates while rings emerge
      animate(".loader-galaxy-group", 
        { rotate: [45, 0] }, 
        { duration: 1.9, ease: cinematicEase }
      );
      animate(".loader-ring", 
        { opacity: [0, 1], scale: [0.85, 1] }, 
        { duration: 0.9, ease: cinematicEase, delay: stagger(0.1) }
      );

      // D. Constellation lines draw themselves
      animate(".loader-constellation", 
        { pathLength: [0, 1], opacity: [0, 1] }, 
        { duration: 1.0, ease: "easeInOut", delay: 0.3 }
      );

      // E. Central core lights up
      animate(".loader-core", 
        { scale: [0, 1.4, 1], opacity: [0, 1] }, 
        { duration: 0.6, ease: "easeOut", delay: 0.5 }
      );

      // F. Each node appears one by one on the orbit
      animate(".loader-node", 
        { scale: [0, 1.5, 1], opacity: [0, 1] }, 
        { duration: 0.4, ease: "easeOut", delay: stagger(0.08, { startDelay: 0.7 }) }
      );

      // Await completion (Total duration ~ 1.9s)
      await new Promise(r => setTimeout(r, 1900));
      onComplete();
    };

    runAnimation();
  }, [animate, onComplete]);

  return (
    <motion.div
      ref={scope}
      className="explore-loader-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
    >
      {/* Background Starfield */}
      {backgroundStars.map(star => (
        <div 
          key={star.id} 
          className="loader-tiny-star" 
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`
          }}
        />
      ))}

      {/* Nebula Aura */}
      <div className="explore-loader-nebula" />

      {/* Galaxy Geometry */}
      <svg className="explore-loader-svg" viewBox="0 0 280 280">
         <g className="loader-galaxy-group">
            {/* Concentric Orbits */}
            <circle className="loader-ring loader-ring-dashed" cx="140" cy="140" r="110" />
            <circle className="loader-ring" cx="140" cy="140" r="70" />
            <circle className="loader-ring" cx="140" cy="140" r="35" />

            {/* Constellation Path */}
            <path
              className="loader-constellation"
              d="M 140 30 L 235 95 L 210 195 L 140 105 L 70 195 L 45 95 Z"
            />

            {/* Orbit Nodes */}
            <circle className="loader-node" cx="140" cy="30" r="3.5" />
            <circle className="loader-node" cx="235" cy="95" r="3.5" />
            <circle className="loader-node" cx="210" cy="195" r="3.5" />
            <circle className="loader-node" cx="140" cy="105" r="3.5" />
            <circle className="loader-node" cx="70" cy="195" r="3.5" />
            <circle className="loader-node" cx="45" cy="95" r="3.5" />

            {/* Core Element */}
            <circle className="loader-core" cx="140" cy="140" r="7" />
         </g>
      </svg>

      {/* Dynamic Console Text */}
      <div className="loader-status-text">
        <AnimatePresence mode="wait">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
          >
            {EXPLORE_MESSAGES[msgIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}