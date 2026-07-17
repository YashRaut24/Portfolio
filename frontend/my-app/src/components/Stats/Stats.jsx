import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './Stats.css';

function Stats() {
  const githubUsername = "yourusername";
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

      <img
        src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default`}
        alt="GitHub Stats"
        className="stats-image stagger-item"
        style={{ '--stagger-index': 0 }}
      />

      <img
        src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}`}
        alt="GitHub Streak"
        className="stats-image stagger-item"
        style={{ '--stagger-index': 1 }}
      />

    </div>
  );
}

export default Stats;