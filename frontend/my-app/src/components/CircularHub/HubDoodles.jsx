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

/* ================= Existing icons (unchanged) ================= */

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

/* ================= New icons: About ================= */

function IdCardIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="10" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" /><circle cx="13" cy="20" r="4" stroke="currentColor" strokeWidth="1.4" /><path d="M21 16H31M21 20H31M21 24H27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function CompassIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.6" /><path d="M25 14L18 18L15 26L22 22L25 14Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>); }
function LocationPinIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 4C13 4 8 9 8 16C8 25 20 36 20 36C20 36 32 25 32 16C32 9 27 4 20 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="20" cy="16" r="4" stroke="currentColor" strokeWidth="1.4" /></svg>); }
function CoffeeMugIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M8 14H26V25C26 29 23 32 17 32C11 32 8 29 8 25V14Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M26 17H30C32 17 33 19 33 21C33 23 32 25 30 25H26" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function NotebookIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 10C17 7 12 6 6 7V30C12 29 17 30 20 33C23 30 28 29 34 30V7C28 6 23 7 20 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M20 10V33" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function PencilIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M6 34L8 27L27 8L32 13L13 32L6 34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M23 12L28 17" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function HeadphonesIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M6 22C6 12 12 6 20 6C28 6 34 12 34 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><rect x="4" y="20" width="8" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" /><rect x="28" y="20" width="8" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function PlantIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 34V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M20 20C20 20 10 20 10 12C18 12 20 18 20 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M20 22C20 22 30 22 30 14C22 14 20 20 20 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>); }
function LightbulbIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 6C13 6 9 11 9 17C9 22 12 25 14 28V32H26V28C28 25 31 22 31 17C31 11 27 6 20 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M14 34H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M17 37H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>); }
function HeartOutlineIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 34C20 34 6 25 6 15C6 10 10 6 14 6C17 6 19 8 20 11C21 8 23 6 26 6C30 6 34 10 34 15C34 25 20 34 20 34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>); }

/* ================= New icons: Skills ================= */

function BracesIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M16 6C12 6 11 8 11 12V16C11 19 9 20 8 20C9 20 11 21 11 24V28C11 32 12 34 16 34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 6C28 6 29 8 29 12V16C29 19 31 20 32 20C31 20 29 21 29 24V28C29 32 28 34 24 34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function BracketsIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M16 6H10V34H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 6H30V34H24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function AtomIcon() { return (<svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.4" /><ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.4" transform="rotate(60 20 20)" /><ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.4" transform="rotate(120 20 20)" /><circle cx="20" cy="20" r="2.2" fill="currentColor" /></svg>); }
function PythonIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 4C14 4 14 8 14 8V12H24V14H10C10 14 6 14 6 20C6 26 10 26 10 26H13V22C13 22 13 18 17 18H23C23 18 27 18 27 14V8C27 8 27 4 20 4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M20 36C26 36 26 32 26 32V28H16V26H30C30 26 34 26 34 20C34 14 30 14 30 14H27V18C27 18 27 22 23 22H17C17 22 13 22 13 26V32C13 32 13 36 20 36Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>); }
function NodeHexIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>); }
function LeafIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M8 32C8 20 16 8 32 8C32 24 24 32 8 32Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M8 32C14 26 20 18 30 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function GearIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M20 4V9M20 31V36M4 20H9M31 20H36M8.5 8.5L12 12M28 28L31.5 31.5M31.5 8.5L28 12M12 28L8.5 31.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>); }
function DatabaseIcon() { return (<svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="9" rx="14" ry="5" stroke="currentColor" strokeWidth="1.5" /><path d="M6 9V31C6 33.5 12 36 20 36C28 36 34 33.5 34 31V9" stroke="currentColor" strokeWidth="1.5" /><path d="M6 20C6 22.5 12 25 20 25C28 25 34 22.5 34 20" stroke="currentColor" strokeWidth="1.4" /></svg>); }
function ApiArrowsIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M6 14H30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M24 8L30 14L24 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M34 26H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M16 20L10 26L16 32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function PuzzleIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M10 10H17C17 7 19 6 21 6C23 6 25 8 25 10H32V17C34 17 35 19 35 21C35 23 34 25 32 25V32H25C25 34 23 35 21 35C19 35 17 34 17 32H10V25C8 25 7 23 7 21C7 19 8 17 10 17V10Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function BrainIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M15 8C11 8 8 11 8 15C6 16 5 18 5 20C5 22 6 24 8 25C8 29 11 32 15 32H25C29 32 32 29 32 25C34 24 35 22 35 20C35 18 34 16 32 15C32 11 29 8 25 8C22 8 20 9 20 9C20 9 18 8 15 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M20 9V31" stroke="currentColor" strokeWidth="1.2" /><circle cx="13" cy="18" r="1.2" fill="currentColor" /><circle cx="27" cy="22" r="1.2" fill="currentColor" /></svg>); }
function KeyboardIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="12" width="32" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M9 18H10M15 18H16M21 18H22M27 18H28M30 18H31M9 23H14M18 23H22M26 23H31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function PackageIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 5L34 12V28L20 35L6 28V12L20 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M6 12L20 19L34 12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M20 19V35" stroke="currentColor" strokeWidth="1.4" /></svg>); }

/* ================= New icons: Projects ================= */

function DocumentIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M10 4H24L30 10V36H10V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M24 4V10H30" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M14 18H26M14 24H26M14 30H21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function BrowserWindowIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="8" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M4 15H36" stroke="currentColor" strokeWidth="1.4" /><circle cx="9" cy="11.5" r="1" fill="currentColor" /><circle cx="13" cy="11.5" r="1" fill="currentColor" /><circle cx="17" cy="11.5" r="1" fill="currentColor" /></svg>); }
function MobileFrameIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="11" y="4" width="18" height="32" rx="3" stroke="currentColor" strokeWidth="1.6" /><path d="M17 32H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>); }
function KanbanIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="5" y="6" width="9" height="28" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><rect x="16" y="6" width="9" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><rect x="27" y="6" width="9" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.4" /></svg>); }
function GlobeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5" /><path d="M5 20H35" stroke="currentColor" strokeWidth="1.3" /><path d="M20 5C25 10 25 30 20 35C15 30 15 10 20 5Z" stroke="currentColor" strokeWidth="1.3" /></svg>); }
function DeployArrowIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 34V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M10 18L20 8L30 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 34H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>); }
function BuildingBlocksIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="6" y="22" width="10" height="10" stroke="currentColor" strokeWidth="1.5" /><rect x="17" y="22" width="10" height="10" stroke="currentColor" strokeWidth="1.5" /><rect x="11.5" y="10" width="10" height="10" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function WrenchIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M24 8C27 5 32 5 34 8C36 11 35 15 32 16L18 30L10 34L6 30L10 22L24 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M27 11L29 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>); }
function BlueprintIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="5" y="6" width="30" height="28" stroke="currentColor" strokeWidth="1.5" /><path d="M12 12H22M12 18H28M12 24H20M12 30H24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>); }
function WireframeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="5" y="6" width="30" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M5 14H35" stroke="currentColor" strokeWidth="1.3" /><path d="M12 20H18V28H12V20Z" stroke="currentColor" strokeWidth="1.2" /><path d="M22 20H28M22 24H28M22 28H26" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>); }

/* ================= New icons: Achievements ================= */

function RibbonIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M14 21L9 36L20 30L31 36L26 21" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function BullseyeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.4" /><circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.3" /><circle cx="20" cy="20" r="3" fill="currentColor" /></svg>); }
function FlagIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M10 4V36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M10 6C16 3 20 9 26 6C30 4 32 6 32 6V20C32 20 30 18 26 20C20 23 16 17 10 20V6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function CrownIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M6 30L8 14L16 22L20 10L24 22L32 14L34 30H6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M6 30H34" stroke="currentColor" strokeWidth="1.4" /></svg>); }
function DiamondIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M11 14H29L34 20L20 35L6 20L11 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M6 20H34M15 14L20 20L25 14M20 20L20 35" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>); }
function FlameIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 4C24 10 16 14 16 20C16 24 18 26 20 26C22 26 24 24 24 21C27 24 28 27 28 30C28 34 24 36 20 36C13 36 9 31 9 25C9 17 16 12 20 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function ConfettiIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="6" y="8" width="4" height="4" transform="rotate(20 8 10)" stroke="currentColor" strokeWidth="1.2" /><rect x="28" y="6" width="4" height="4" transform="rotate(-15 30 8)" stroke="currentColor" strokeWidth="1.2" /><circle cx="20" cy="10" r="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="10" cy="26" r="2" stroke="currentColor" strokeWidth="1.2" /><rect x="24" y="24" width="4" height="4" transform="rotate(30 26 26)" stroke="currentColor" strokeWidth="1.2" /><path d="M18 30L20 34L22 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>); }
function SparklesIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M14 6L16 12L22 14L16 16L14 22L12 16L6 14L12 12L14 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M28 20L29.5 24L34 25.5L29.5 27L28 31L26.5 27L22 25.5L26.5 24L28 20Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>); }
function BadgeCheckIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M20 5L24 9L30 8L30 14L34 18L30 22L30 28L24 27L20 31L16 27L10 28L10 22L6 18L10 14L10 8L16 9L20 5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M14 18L18 22L27 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function AwardSealIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="11" stroke="currentColor" strokeWidth="1.4" /><path d="M14 25L11 35L20 30L29 35L26 25" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M20 10L21.6 14L26 14.5L22.8 17.4L23.7 21.8L20 19.5L16.3 21.8L17.2 17.4L14 14.5L18.4 14L20 10Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></svg>); }

/* ================= New icons: Experience ================= */

function TeamIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="14" cy="13" r="5" stroke="currentColor" strokeWidth="1.5" /><circle cx="27" cy="13" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M4 34C4 27 9 23 14 23C17 23 19 24 21 26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M36 34C36 27 31 23 26 23C23 23 21 24 19 26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function HandshakeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M4 18L12 12L18 16L14 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M36 18L28 12L22 16L26 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 22L18 26C19 27 21 27 22 26L26 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 24L12 28M24 24L28 28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function OfficeBuildingIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="8" y="8" width="24" height="28" stroke="currentColor" strokeWidth="1.5" /><path d="M14 14H18M22 14H26M14 20H18M22 20H26M14 26H18M22 26H26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M16 36V30H24V36" stroke="currentColor" strokeWidth="1.4" /></svg>); }
function CalendarIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="5" y="9" width="30" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M5 16H35" stroke="currentColor" strokeWidth="1.4" /><path d="M12 5V12M28 5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 22H16M20 22H24M28 22H29" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function ClockIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5" /><path d="M20 11V20L27 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ChartIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="6" y="6" width="28" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M12 24V18M20 24V14M28 24V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M16 34L20 28L24 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ClipboardIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="9" y="8" width="22" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" /><rect x="15" y="4" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M14 18H26M14 24H26M14 30H21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function LaptopIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="8" y="8" width="24" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M4 30H36L33 24H7L4 30Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>); }
function WorkflowArrowsIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="16" width="8" height="8" stroke="currentColor" strokeWidth="1.4" /><rect x="16" y="6" width="8" height="8" stroke="currentColor" strokeWidth="1.4" /><rect x="16" y="26" width="8" height="8" stroke="currentColor" strokeWidth="1.4" /><rect x="28" y="16" width="8" height="8" stroke="currentColor" strokeWidth="1.4" /><path d="M12 20H16M20 14V16M20 24V26M24 20H28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function LadderIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M12 4L8 36M28 4L24 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M9 10H27M8.5 18H26.5M8 26H26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function StickyNoteIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M8 8H32V32H14L8 26V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M14 32V26H8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>); }

/* ================= New icons: Contact ================= */

function MailboxIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M8 18C8 12 12 8 18 8H24V32H8V18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M24 14H32V22H24" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 36V32M20 36V32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function SignalIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M8 30V26M16 30V20M24 30V14M32 30V8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>); }
function LinkIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="4" y="14" width="16" height="12" rx="6" stroke="currentColor" strokeWidth="1.6" transform="rotate(-30 12 20)" /><rect x="20" y="14" width="16" height="12" rx="6" stroke="currentColor" strokeWidth="1.6" transform="rotate(-30 28 20)" /></svg>); }
function SendArrowIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M4 20L36 6L24 34L20 22L4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M20 22L36 6" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function WaveIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M14 34V16C14 14 16 12 18 12C20 12 22 14 22 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M22 22V10C22 8 24 6 26 6C28 6 30 8 30 10V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M30 22V14C30 12 32 10 34 10C36 10 38 12 38 14V26C38 32 33 36 27 36H22C17 36 14 33 14 28" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function LetterIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M10 6H26L30 10V34H10V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M26 6V10H30" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M14 18H26M14 24H22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }

/* ================= New icons: GitHub ================= */

function MergeArrowsIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="32" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="30" cy="20" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M10 11C10 20 10 20 27 20" stroke="currentColor" strokeWidth="1.5" /><path d="M10 29C10 20 10 20 27 20" stroke="currentColor" strokeWidth="1.5" /></svg>); }
function CommitTreeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="10" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="26" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="26" cy="26" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 10.5V17.5M10 22.5V29.5" stroke="currentColor" strokeWidth="1.4" /><path d="M12 18L24 15M12 22L24 25" stroke="currentColor" strokeWidth="1.3" /></svg>); }
function BugIcon() { return (<svg viewBox="0 0 40 40" fill="none"><ellipse cx="20" cy="22" rx="9" ry="11" stroke="currentColor" strokeWidth="1.5" /><path d="M20 11V8M14 14L9 9M26 14L31 9M11 22H5M35 22H29M14 30L9 35M26 30L31 35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function CodeFileIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M10 4H24L30 10V36H10V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M24 4V10H30" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M15 22L12 25L15 28M25 22L28 25L25 28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function MonitorIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="5" y="7" width="30" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M15 33H25M20 27V33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>); }
function ContributionGraphIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="6" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="12" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="18" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="24" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="30" y="8" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="14" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="12" y="14" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="18" y="14" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="24" y="14" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="30" y="14" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="20" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="12" y="20" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="18" y="20" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="24" y="20" width="4" height="4" stroke="currentColor" strokeWidth="1" />
      <rect x="30" y="20" width="4" height="4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ================= New icons: Lab ================= */

function FlaskIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M16 6H24V16L32 32C33 34 31 36 29 36H11C9 36 7 34 8 32L16 16V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M14 6H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 26H28" stroke="currentColor" strokeWidth="1.3" /></svg>); }
function BeakerIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M14 6H26V20L32 32C33 34 31 36 28 36H12C9 36 7 34 8 32L14 20V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M11 6H29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M13 24H16M13 29H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>); }
function DnaIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M12 4C12 10 28 10 28 16C28 22 12 22 12 28C12 34 28 34 28 36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M28 4C28 10 12 10 12 16C12 22 28 22 28 28C28 34 12 34 12 36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M14 8H26M13 16H27M13 24H27M14 32H26" stroke="currentColor" strokeWidth="1.1" /></svg>); }
function MicroscopeIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M18 34H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 34C16 34 14 30 16 26L22 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="24" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M18 20H26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M10 34C10 30 13 27 17 27" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function RobotHeadIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="8" y="12" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="15" cy="21" r="2.2" fill="currentColor" /><circle cx="25" cy="21" r="2.2" fill="currentColor" /><path d="M15 27H25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M20 12V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="20" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" /></svg>); }
function ChipIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="12" y="12" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M12 16H6M12 22H6M34 16H28M34 22H28M16 12V6M22 12V6M16 34V28M22 34V28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>); }
function SatelliteIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="15" y="16" width="10" height="8" rx="1.5" transform="rotate(-30 20 20)" stroke="currentColor" strokeWidth="1.4" /><path d="M25 12L30 6M15 28L10 34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M28 8L34 4M6 36L12 32" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M10 16L14 20M26 24L30 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>); }
function SensorIcon() { return (<svg viewBox="0 0 40 40" fill="none"><path d="M8 24C8 15 14 9 20 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M4 24C4 13 12 5 20 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="20" cy="24" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M20 27V34M14 34H26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>); }
function NeuralNodesIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="8" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="30" r="2.5" stroke="currentColor" strokeWidth="1.4" /><circle cx="20" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.4" /><circle cx="20" cy="25" r="2.5" stroke="currentColor" strokeWidth="1.4" /><circle cx="32" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10 10L18 15M10 20L18 15M10 20L18 25M10 30L18 25M22 15L30 20M22 25L30 20" stroke="currentColor" strokeWidth="1.1" /></svg>); }
function BatteryIcon() { return (<svg viewBox="0 0 40 40" fill="none"><rect x="6" y="12" width="26" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M32 17H36V23H32" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 20H14M18 20H24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>); }
function OrbitIcon() { return (<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="3" fill="currentColor" /><ellipse cx="20" cy="20" rx="16" ry="7" stroke="currentColor" strokeWidth="1.3" transform="rotate(20 20 20)" /><ellipse cx="20" cy="20" rx="16" ry="7" stroke="currentColor" strokeWidth="1.3" transform="rotate(-20 20 20)" /></svg>); }

/* ================= Pools ================= */

const pools = {
  about: {
    icons: [UserIcon, QuoteIcon, IdCardIcon, CompassIcon, LocationPinIcon, CoffeeMugIcon, NotebookIcon, PencilIcon, HeadphonesIcon, RocketIcon, PlantIcon, LightbulbIcon, HeartOutlineIcon],
    texts: ['Yash', 'AI Engineer', 'Full-Stack Dev', 'Mumbai'],
  },
  skills: {
    icons: [CodeIcon, TerminalIcon, BracesIcon, BracketsIcon, AtomIcon, PythonIcon, NodeHexIcon, LeafIcon, GearIcon, DatabaseIcon, ApiArrowsIcon, PuzzleIcon, BrainIcon, KeyboardIcon, PackageIcon],
    texts: ['Python', 'React', 'FastAPI', 'JavaScript', 'Node.js', 'MongoDB'],
  },
  projects: {
    icons: [FolderIcon, RocketIcon, DocumentIcon, BrowserWindowIcon, MobileFrameIcon, KanbanIcon, GlobeIcon, BranchIcon, PackageIcon, DeployArrowIcon, BuildingBlocksIcon, PuzzleIcon, WrenchIcon, BlueprintIcon, WireframeIcon],
    texts: ['Ventra AI', 'Findly', 'Docwise', 'v1.0'],
  },
  achievements: {
    icons: [TrophyIcon, MedalIcon, StarIcon, RibbonIcon, BullseyeIcon, GraphIcon, FlagIcon, CrownIcon, DiamondIcon, FlameIcon, ConfettiIcon, SparklesIcon, BadgeCheckIcon, AwardSealIcon],
    texts: ['Hackathon', 'Winner', 'BAH 2026', 'Top Team'],
  },
  experience: {
    icons: [BriefcaseIcon, SchoolIcon, TeamIcon, HandshakeIcon, OfficeBuildingIcon, CalendarIcon, ClockIcon, ChartIcon, ClipboardIcon, LaptopIcon, PhoneIcon, WorkflowArrowsIcon, LadderIcon, StickyNoteIcon],
    texts: ['Internship', 'College', '2023 - 2026', 'B.E. Computer'],
  },
  contact: {
    icons: [EnvelopeIcon, ChatIcon, PhoneIcon, MailboxIcon, SignalIcon, LocationPinIcon, GlobeIcon, LinkIcon, SendArrowIcon, MobileFrameIcon, HeartOutlineIcon, WaveIcon, LetterIcon],
    texts: ['hello@yash.dev', '+91 98XXX XXXXX', 'Say hi', "Let's talk"],
  },
  stats: {
    icons: [GraphIcon, BranchIcon, StarIcon],
    texts: ['commits', 'repos', 'streak', '#YashRaut24'],
  },
  github: {
    icons: [BranchIcon, MergeArrowsIcon, CommitTreeIcon, TerminalIcon, BugIcon, PackageIcon, CodeFileIcon, MonitorIcon, GearIcon, PuzzleIcon, ContributionGraphIcon, WrenchIcon],
    texts: ['open source', 'PRs merged', 'commits', 'contributions'],
  },
  lab: {
    icons: [AtomIcon, FlaskIcon, BeakerIcon, DnaIcon, MicroscopeIcon, RobotHeadIcon, BrainIcon, ChipIcon, LightbulbIcon, SatelliteIcon, SensorIcon, NeuralNodesIcon, BatteryIcon, OrbitIcon, GraphIcon],
    texts: ['experiments', 'AI/ML', 'research', 'prototype'],
  },
};

/* ================= Generation (icons/text kept far apart & capped) ================= */

function iconKey(Icon) {
  return `icon:${Icon.displayName || Icon.name || Math.random()}`;
}

function buildCandidatePool(pool, count) {
  const hasTexts = pool.texts && pool.texts.length > 0;
  let textCount = hasTexts ? Math.round(count * 0.45) : 0;
  let iconCount = count - textCount;

  const iconCap = Math.ceil(iconCount / pool.icons.length) || 0;
  let iconSeq = [];
  for (let t = 0; t < iconCap; t++) iconSeq = iconSeq.concat(pool.icons);
  const iconCandidates = shuffle(iconSeq)
    .slice(0, iconCount)
    .map((Icon) => ({ kind: 'icon', key: iconKey(Icon), Icon }));

  let textCandidates = [];
  if (hasTexts) {
    const textCap = Math.ceil(textCount / pool.texts.length);
    let textSeq = [];
    for (let t = 0; t < textCap; t++) textSeq = textSeq.concat(pool.texts);
    textCandidates = shuffle(textSeq)
      .slice(0, textCount)
      .map((text) => ({ kind: 'text', key: `text:${text}`, text }));
  }

  return shuffle([...iconCandidates, ...textCandidates]).slice(0, count);
}

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

  // Real jittered positions computed up front so type-assignment can
  // enforce actual on-screen spacing between repeats of the same icon
  // or text, not just avoid literal neighboring grid cells.
  const positions = chosenCells.map((cell) => {
    const jitterX = 0.15 + Math.random() * 0.7;
    const jitterY = 0.15 + Math.random() * 0.7;
    return {
      top: Math.min(94, Math.max(2, (cell.r + jitterY) * cellH)),
      left: Math.min(90, Math.max(2, (cell.c + jitterX) * cellW)),
      rotate: Math.random() * 16 - 8,
    };
  });

  const candidates = buildCandidatePool(pool, count);
  const minDist = Math.min(cellW, cellH) * 2.2;

  const posOrder = shuffle(positions.map((_, i) => i));
  const assigned = new Array(count).fill(null);
  const remaining = [...candidates];
  const placedByKey = {};

  posOrder.forEach((idx) => {
    const pos = positions[idx];
    let pickIdx = remaining.findIndex((cand) => {
      const placed = placedByKey[cand.key];
      if (!placed) return true;
      return placed.every((p2) => {
        const dx = p2.left - pos.left;
        const dy = p2.top - pos.top;
        return Math.sqrt(dx * dx + dy * dy) >= minDist;
      });
    });
    if (pickIdx === -1) pickIdx = 0; // no conflict-free option left, accept it

    const [chosen] = remaining.splice(pickIdx, 1);
    assigned[idx] = chosen;
    (placedByKey[chosen.key] = placedByKey[chosen.key] || []).push(pos);
  });

  return positions.map((pos, i) => {
    const item = assigned[i];
    return {
      id: i,
      isText: item.kind === 'text',
      Icon: item.kind === 'icon' ? item.Icon : null,
      text: item.kind === 'text' ? item.text : null,
      top: `${pos.top}%`,
      left: `${pos.left}%`,
      duration: 18 + Math.random() * 16,
      delay: Math.random() * 8,
      scale: 0.75 + Math.random() * 0.5,
      rotate: pos.rotate,
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