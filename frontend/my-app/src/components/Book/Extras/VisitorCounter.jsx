import { useEffect, useState } from 'react';
import { incrementVisitorCount } from '../../../services/api';
import './VisitorCounter.css';

const LEGACY_STORAGE_KEY = 'secretPageVisitorNumber';
const COUNTERS = [
  { scope: 'easterEgg', key: 'easterEggVisitorNumber', label: 'Easter egg visits' },
  { scope: 'portfolio', key: 'portfolioVisitorNumber', label: 'Portfolio visits' },
  { scope: 'github', key: 'githubVisitorNumber', label: 'GitHub visits' },
];

function CounterIcon({ scope }) {
  if (scope === 'easterEgg') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M9 18H15M10 21H14M8 14C6.8 13 6 11.6 6 10C6 6.7 8.7 4 12 4C15.3 4 18 6.7 18 10C18 11.6 17.2 13 16 14C15.3 14.6 15 15.2 15 16H9C9 15.2 8.7 14.6 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (scope === 'github') {
    return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5A9.5 9.5 0 0 0 9 21.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.5-4.5 4.8.4.3.7 1 .7 1.9v2.8c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M3 20C3 16 6 14 9 14C12 14 15 16 15 20M17 15.5C20 15.5 22 17 22 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function VisitorCounter() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const loadCounts = async () => {
      const next = {};
      await Promise.all(COUNTERS.map(async ({ scope, key }) => {
        const legacy = scope === 'portfolio' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null;
        const cached = localStorage.getItem(key) || legacy;
        if (cached) {
          next[scope] = Number(cached);
          return;
        }
        try {
          const data = await incrementVisitorCount(scope);
          next[scope] = data.count;
          localStorage.setItem(key, String(data.count));
        } catch {
          next[scope] = 0;
        }
      }));
      setCounts(next);
    };
    loadCounts();
  }, []);

  return (
    <div className="visitor-counter">
      {COUNTERS.map(({ scope, label }) => {
        const digits = String(counts[scope] ?? 0).padStart(4, '0').split('');
        return (
          <div className="visitor-counter-row" key={scope} aria-label={label}>
            <div className="visitor-counter-icon" aria-hidden="true"><CounterIcon scope={scope} /></div>
            <div className="visitor-counter-digits">
              {digits.map((digit, index) => <span key={index} className="visitor-counter-digit">{digit}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default VisitorCounter;