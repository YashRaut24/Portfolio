
import './FloatingDoodles.css';

const types = [
  // original set
  'plane', 'feather', 'coffee', 'bookmark', 'star', 'lightbulb', 'pencil', 'heart', 'cloud', 'key', 'glasses', 'compass',
  // writing & stationery
  'inkwell', 'nib', 'paperclip', 'eraser', 'ruler', 'scissors', 'tape', 'stickynote',
  // book & reading
  'openbook', 'readingglasses', 'magnifier', 'candle', 'hourglass',
  // nature & atmosphere
  'sun', 'moon', 'raindrop', 'tree', 'butterfly',
  // personal / whimsical
  'camera', 'musicnote', 'giftbox', 'umbrella', 'ticket', 'backpack',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDoodles(count) {
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

  // Precompute the actual jittered position for every doodle up front,
  // since type-assignment below needs real coordinates (not just grid
  // cells) to enforce spacing between repeats of the same icon.
  const positions = chosenCells.map((cell) => {
    const jitterX = 0.15 + Math.random() * 0.7;
    const jitterY = 0.15 + Math.random() * 0.7;
    return {
      top: Math.min(96, Math.max(2, (cell.r + jitterY) * cellH)),
      left: Math.min(96, Math.max(2, (cell.c + jitterX) * cellW)),
    };
  });

  // Build a pool where every type appears as evenly as possible (hard
  // cap of ceil(count/types.length) uses per icon), then shuffle the
  // whole pool before trimming so no particular icon is systematically
  // favored or shorted.
  const cap = Math.ceil(count / types.length);
  let pool = [];
  for (let t = 0; t < cap; t++) {
    pool = pool.concat(types);
  }
  pool = shuffle(pool).slice(0, count);

  // Minimum on-screen distance (in the same % units as top/left) that
  // two doodles of the same icon must keep from each other. Scaled to
  // the grid so it spans a few cells, not just one.
  const minDist = Math.min(cellW, cellH) * 2.2;

  const posOrder = shuffle(positions.map((_, i) => i));
  const assigned = new Array(count).fill(null);
  const remainingPool = [...pool];
  const placedByType = {};

  posOrder.forEach((idx) => {
    const pos = positions[idx];
    let pickIdx = remainingPool.findIndex((t) => {
      const placed = placedByType[t];
      if (!placed) return true;
      return placed.every((p2) => {
        const dx = p2.left - pos.left;
        const dy = p2.top - pos.top;
        return Math.sqrt(dx * dx + dy * dy) >= minDist;
      });
    });
    if (pickIdx === -1) pickIdx = 0; // no conflict-free option left, just take one

    const [type] = remainingPool.splice(pickIdx, 1);
    assigned[idx] = type;
    (placedByType[type] = placedByType[type] || []).push(pos);
  });

  return positions.map((pos, i) => ({
    id: i,
    type: assigned[i],
    top: `${pos.top}%`,
    left: `${pos.left}%`,
    duration: 18 + Math.random() * 16,
    delay: Math.random() * 8,
    scale: 0.7 + Math.random() * 0.6,
  }));
}

const doodles = generateDoodles(100);

function PlaneIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M4 20L36 6L24 34L20 22L4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 22L36 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FeatherIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M30 6C18 10 10 22 8 34C20 32 32 24 34 10C34 10 32 8 30 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 34L26 12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="20" rx="16" ry="10" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="10" ry="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M10 4H30V36L20 28L10 36V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 4L23 17L36 20L23 23L20 36L17 23L4 20L17 17L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 6C13 6 9 11 9 17C9 22 12 25 14 28V32H26V28C28 25 31 22 31 17C31 11 27 6 20 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 34H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 37H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M6 34L8 27L27 8L32 13L13 32L6 34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 12L28 17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 34C20 34 6 25 6 15C6 10 10 6 14 6C17 6 19 8 20 11C21 8 23 6 26 6C30 6 34 10 34 15C34 25 20 34 20 34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M11 26C7 26 4 23 4 19C4 15 7 12 11 12C12 8 16 5 20 5C25 5 29 9 29 14C33 14 36 17 36 21C36 25 33 28 29 28H11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="12" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 20H34" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 20V26" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 20V24" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GlassesIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="11" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="29" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 18C19 16 21 16 22 18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 18L1 15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M36 18L39 15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 14L18 18L15 26L22 22L25 14Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* ---------- Writing & stationery ---------- */

function InkwellIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M10 18H30L28 34H12L10 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="20" cy="18" rx="10" ry="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 10L30 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 10L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NibIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 4L30 16L20 36L10 16L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 16V32" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M13 20V10C13 6 16 4 19 4C22 4 25 6 25 10V26C25 29 23 31 20 31C17 31 15 29 15 26V13C15 11 16 10 18 10C20 10 21 11 21 13V24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="8" y="14" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" transform="rotate(-10 20 20)" />
      <path d="M8 20H32" stroke="currentColor" strokeWidth="1" transform="rotate(-10 20 20)" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="16" width="32" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 16V20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 16V20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M19 16V22" stroke="currentColor" strokeWidth="1.2" />
      <path d="M24 16V20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M29 16V20" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 12L34 28" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 28L34 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TapeIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function StickyNoteIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M8 8H32V32H14L8 26V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 32V26H8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Book & reading ---------- */

function OpenBookIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M20 10C17 7 12 6 6 7V30C12 29 17 30 20 33C23 30 28 29 34 30V7C28 6 23 7 20 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M20 10V33" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ReadingGlassesIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="11" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="29" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 18C19 16 21 16 22 18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20C2 22 2 26 4 30" stroke="currentColor" strokeWidth="1.2" />
      <path d="M36 20C38 22 38 26 36 30" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="17" cy="17" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 25L35 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CandleIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="15" y="16" width="10" height="20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 16V10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 10C18 7 20 4 20 4C20 4 22 7 20 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M10 6H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 34H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 6C11 14 19 18 19 20C19 22 11 26 11 34" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M29 6C29 14 21 18 21 20C21 22 29 26 29 34" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Nature & atmosphere ---------- */

function SunIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 32V36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 20H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 20H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 28L31 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M31 9L28 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 28L9 31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M26 6C18 6 12 12 12 20C12 28 18 34 26 34C20 31 16 26 16 20C16 14 20 9 26 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RaindropIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M20 5C20 5 10 19 10 26C10 32 15 36 20 36C25 36 30 32 30 26C30 19 20 5 20 5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 36V22" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ButterflyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 12C18 6 8 4 6 10C4 16 12 20 20 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 12C22 6 32 4 34 10C36 16 28 20 20 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 20C18 26 8 28 6 24C4 20 12 18 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 20C22 26 32 28 34 24C36 20 28 18 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 8V28" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- Personal / whimsical ---------- */

function CameraIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="4" y="12" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 12L17 7H23L26 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="20" cy="23" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="12" cy="30" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 30V8L30 5V26" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="25" cy="26" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GiftBoxIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="6" y="16" width="28" height="18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 22H34" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 16V34" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 16C16 16 13 13 13 10C13 8 15 7 17 8C19 9 20 13 20 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 16C24 16 27 13 27 10C27 8 25 7 23 8C21 9 20 13 20 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UmbrellaIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M4 20C4 11 11 5 20 5C29 5 36 11 36 20H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 20V32C20 34 18 35 16 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 5V20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M4 14C6 14 6 18 4 18V26C6 26 6 30 4 30H36C34 30 34 26 36 26V18C34 18 34 14 36 14H4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 14V30" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  );
}

function BackpackIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M11 14C11 9 14 6 20 6C26 6 29 9 29 14V32C29 34 27 36 25 36H15C13 36 11 34 11 32V14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 14H26" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 20H25V28H15V20Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 6C13 6 12 4 12 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M25 6C27 6 28 4 28 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const iconMap = {
  plane: PlaneIcon,
  feather: FeatherIcon,
  coffee: CoffeeIcon,
  bookmark: BookmarkIcon,
  star: StarIcon,
  lightbulb: LightbulbIcon,
  pencil: PencilIcon,
  heart: HeartIcon,
  cloud: CloudIcon,
  key: KeyIcon,
  glasses: GlassesIcon,
  compass: CompassIcon,

  inkwell: InkwellIcon,
  nib: NibIcon,
  paperclip: PaperclipIcon,
  eraser: EraserIcon,
  ruler: RulerIcon,
  scissors: ScissorsIcon,
  tape: TapeIcon,
  stickynote: StickyNoteIcon,

  openbook: OpenBookIcon,
  readingglasses: ReadingGlassesIcon,
  magnifier: MagnifierIcon,
  candle: CandleIcon,
  hourglass: HourglassIcon,

  sun: SunIcon,
  moon: MoonIcon,
  raindrop: RaindropIcon,
  tree: TreeIcon,
  butterfly: ButterflyIcon,

  camera: CameraIcon,
  musicnote: MusicNoteIcon,
  giftbox: GiftBoxIcon,
  umbrella: UmbrellaIcon,
  ticket: TicketIcon,
  backpack: BackpackIcon,
};

function FloatingDoodles() {
  return (
    <div className="doodles-layer">
      {doodles.map((doodle) => {
        const Icon = iconMap[doodle.type];
        return (
          <div
            key={doodle.id}
            className={`doodle doodle-${doodle.type}`}
            style={{
              top: doodle.top,
              left: doodle.left,
              animationDuration: `${doodle.duration}s`,
              animationDelay: `${doodle.delay}s`,
              transform: `scale(${doodle.scale})`,
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}

export default FloatingDoodles;
