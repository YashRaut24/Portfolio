import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './HubDoodles.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function UserIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="1.6" /><path d="M6 34C6 26 12 22 20 22C28 22 34 26 34 34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function QuoteIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M10 14C6 14 4 17 4 21C4 25 7 27 10 26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M24 14C20 14 18 17 18 21C18 25 21 27 24 26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function CodeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M14 12L4 20L14 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M26 12L36 20L26 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 8L17 32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function TerminalIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="8" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M10 16L16 20L10 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 26H28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function FolderIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M4 12C4 10 6 8 8 8H16L20 12H32C34 12 36 14 36 16V30C36 32 34 34 32 34H8C6 34 4 32 4 30V12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function RocketIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 4C26 8 28 16 26 24L20 30L14 24C12 16 14 8 20 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="20" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M14 24L9 30M26 24L31 30M16 30L14 36M24 30L26 36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function TrophyIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M12 6H28V16C28 21 24 25 20 25C16 25 12 21 12 16V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 8H6C6 14 9 17 12 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M28 8H34C34 14 31 17 28 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M20 25V31M14 36H26L24 31H16L14 36Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function MedalIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="24" r="10" stroke="currentColor" strokeWidth="1.6" /><path d="M15 15L11 4M25 15L29 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M20 19L21.8 22.8L26 23.4L23 26.3L23.7 30.5L20 28.5L16.3 30.5L17 26.3L14 23.4L18.2 22.8L20 19Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>); }
function BriefcaseIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="6" y="14" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M14 14V10C14 8.5 15.5 7 17 7H23C24.5 7 26 8.5 26 10V14" stroke="currentColor" strokeWidth="1.6" /><path d="M6 22H34" stroke="currentColor" strokeWidth="1.4" /></svg>); }
function SchoolIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 6L36 14L20 22L4 14L20 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M11 18V27C11 27 15 31 20 31C25 31 29 27 29 27V18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>); }
function EnvelopeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="10" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M4 12L20 24L36 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChatIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M6 10H34V26H16L8 32V26H6V10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function PhoneIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M9 6C7 6 6 7.5 6.5 9.5C8 16 12 24 20 30C28 36 33 34 34 32C35 30 34 27 32 25.5L27 22C25.5 21 24 21.5 23 23L21.5 25C18 23 15 20 13 16.5L15 15C16.5 14 17 12.5 16 11L12.5 6C11 4 9 5 9 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function GraphIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M4 32L14 20L22 26L36 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="14" cy="20" r="1.8" fill="currentColor" /><circle cx="22" cy="26" r="1.8" fill="currentColor" /><circle cx="36" cy="8" r="1.8" fill="currentColor" /></svg>); }
function BranchIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="10" cy="32" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="30" cy="20" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M10 11V29" stroke="currentColor" strokeWidth="1.6" /><path d="M10 20C10 20 14 20 18 20C24 20 27 20 27 20" stroke="currentColor" strokeWidth="1.6" /></svg>); }
function StarIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 4L23 17L36 20L23 23L20 36L17 23L4 20L17 17L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>); }

const pools = {
  about: {
    icons: [UserIcon, QuoteIcon],
    texts: ['Yash', 'AI Engineer', 'Full-Stack Dev', 'Mumbai'],
  },
  skills: {
    icons: [CodeIcon, TerminalIcon],
    texts: ['Python', 'React', 'FastAPI', 'JavaScript', 'Node.js', 'MongoDB'],
  },
  projects: {
    icons: [FolderIcon, RocketIcon],
    texts: ['Ventra AI', 'Findly', 'Docwise', 'v1.0'],
  },
  achievements: {
    icons: [TrophyIcon, MedalIcon, StarIcon],
    texts: ['Hackathon', 'Winner', 'BAH 2026', 'Top Team'],
  },
  experience: {
    icons: [BriefcaseIcon, SchoolIcon],
    texts: ['Internship', 'College', '2023 - 2026', 'B.E. Computer'],
  },
  contact: {
    icons: [EnvelopeIcon, ChatIcon, PhoneIcon],
    texts: ['hello@yash.dev', '+91 98XXX XXXXX', 'Say hi', "Let's talk"],
  },
  stats: {
    icons: [GraphIcon, BranchIcon, StarIcon],
    texts: ['commits', 'repos', 'streak', '#YashRaut24'],
  },
};

function generateItems(pool, count) {
  const cols = Math.ceil(Math.sqrt(count * 1.6));
  const rows = Math.ceil(count / cols);
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c });
    }
  }
  const chosenCells = shuffle(cells).slice(0, count);

  return chosenCells.map((cell, i) => {
    const jitterX = 0.15 + Math.random() * 0.7;
    const jitterY = 0.15 + Math.random() * 0.7;
    const top = (cell.r + jitterY) * cellH;
    const left = (cell.c + jitterX) * cellW;
    const isText = Math.random() < 0.45 && pool.texts.length > 0;
    const Icon = !isText ? pool.icons[i % pool.icons.length] : null;
    const text = isText ? pool.texts[i % pool.texts.length] : null;

    return {
      id: i,
      isText,
      Icon,
      text,
      top: `${Math.min(94, Math.max(2, top))}%`,
      left: `${Math.min(90, Math.max(2, left))}%`,
      duration: 18 + Math.random() * 16,
      delay: Math.random() * 8,
      scale: 0.75 + Math.random() * 0.5,
      rotate: Math.random() * 16 - 8,
    };
  });
}

function HubDoodles({ activeId }) {
  const pool = pools[activeId];
  const items = useMemo(() => (pool ? generateItems(pool, 32) : []), [pool, activeId]);
  if (!pool) return null;

  return (
    <div className="hub-doodles-layer" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className="hub-doodles-set"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`hub-doodle ${item.isText ? 'hub-doodle-text' : 'hub-doodle-icon'}`}
              style={{
                top: item.top,
                left: item.left,
                animationDuration: `${item.duration}s`,
                animationDelay: `${item.delay}s`,
                transform: `scale(${item.scale}) rotate(${item.rotate}deg)`,
              }}
            >
              {item.isText ? item.text : <item.Icon />}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default HubDoodles;