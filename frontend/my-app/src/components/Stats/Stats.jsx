import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './Stats.css';

function Stats() {
  const githubUsername = "YashRaut24";
  const shouldReduceMotion = useReducedMotion();

  const facts = useMemo(() => [
    "💡 Did you know? Every project started with a single commit.",
    "⚡ Clean commit history makes debugging much easier.",
    "🚀 Side projects are where most new ideas begin.",
    "🛠️ Consistency beats occasional marathon coding sessions.",
    "📈 GitHub activity tells a story beyond numbers.",
    "🌙 Most coding happens late at night ☕",
  ], []);

  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [facts]);

  return (
    <div className="stats-section">

      <div className="stats-fact-chip">
        <AnimatePresence mode="wait">
          <motion.span
            key={factIndex}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          >
            {facts[factIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* 1. Main Stats */}
      <img
        src={`https://github-stats-extended.vercel.app/api?username=${githubUsername}&theme=transparent&hide_border=true&title_color=ffffff&text_color=a8b2d1&icon_color=8b5cf6&show_icons=true`}
        alt="GitHub Stats"
        className="stats-image stagger-item"
        style={{ '--stagger-index': 0, minHeight: '165px' }}
      />

      {/* 2. Streak Stats */}
      <img
        src={`https://streak-stats.demolab.com/?user=${githubUsername}&theme=transparent&hide_border=true&title_color=ffffff&text_color=a8b2d1&icon_color=8b5cf6&ring=8b5cf6&fire=8b5cf6`}
        alt="GitHub Streak"
        className="stats-image stagger-item"
        style={{ '--stagger-index': 1, minHeight: '165px' }}
      />

      {/* Floating Bottom-Right Sliding GitHub Button */}
      <div className="stats-cta-wrapper stagger-item" style={{ '--stagger-index': 2 }}>
        <a 
          href={`https://github.com/${githubUsername}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-float-btn"
          aria-label="Visit GitHub Profile"
        >
          <span className="github-text">YashRaut24 <span className="arrow">→</span></span>
          <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}

export default Stats;