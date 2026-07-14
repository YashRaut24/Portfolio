import './FloatingDoodles.css';

const types = ['plane', 'feather', 'coffee', 'bookmark', 'star', 'lightbulb', 'pencil', 'heart', 'cloud', 'key', 'glasses', 'compass'];

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

  const typeSequence = shuffle(Array.from({ length: count }, (_, i) => types[i % types.length]));

  return chosenCells.map((cell, i) => {
    const jitterX = 0.15 + Math.random() * 0.7; 
    const jitterY = 0.15 + Math.random() * 0.7;
    const top = (cell.r + jitterY) * cellH;
    const left = (cell.c + jitterX) * cellW;

    return {
      id: i,
      type: typeSequence[i],
      top: `${Math.min(96, Math.max(2, top))}%`,
      left: `${Math.min(96, Math.max(2, left))}%`,
      duration: 18 + Math.random() * 16,
      delay: Math.random() * 8,
      scale: 0.7 + Math.random() * 0.6,
    };
  });
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

// function SquiggleIcon() {
//   return (
//     <svg viewBox="0 0 60 20" fill="none">
//       <path d="M2 10C8 2 14 18 20 10C26 2 32 18 38 10C44 2 50 18 58 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//     </svg>
//   );
// }



const iconMap = {
  plane: PlaneIcon,
  feather: FeatherIcon,
  coffee: CoffeeIcon,
  bookmark: BookmarkIcon,
  star: StarIcon,
  // squiggle: SquiggleIcon,
  lightbulb: LightbulbIcon,
  pencil: PencilIcon,
  heart: HeartIcon,
  cloud: CloudIcon,
  key: KeyIcon,
  glasses: GlassesIcon,
  compass: CompassIcon,
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