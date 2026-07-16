import './InkBlots.css';

const types = ['blot', 'circle-scribble', 'asterisk', 'checkmark', 'spiral', 'tally'];

function generateInkMarks(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      type: types[i % types.length],
      top: `${Math.random() * 92}%`,
      left: `${Math.random() * 92}%`,
      duration: 6 + Math.random() * 5,
      delay: Math.random() * 10,
      scale: 0.7 + Math.random() * 0.7,
      rotate: Math.random() * 40 - 20,
    });
  }
  return items;
}

const inkMarks = generateInkMarks(50);

function BlotIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor">
      <path d="M20 6C24 6 30 10 30 18C30 24 28 30 20 34C12 30 10 24 10 18C10 10 16 6 20 6Z" opacity="0.9" />
      <circle cx="28" cy="12" r="1.6" />
      <circle cx="10" cy="26" r="1.2" />
    </svg>
  );
}

function CircleScribbleIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M20 6C28 6 34 12 33 20C32 28 25 34 18 33C10 32 5 25 7 17C9 10 13 6 20 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AsteriskIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M20 4V36M6 12L34 28M34 12L6 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M8 20L16 30L33 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpiralIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M20 20C20 17 17.5 15 15 16C12 17.5 12 22 15 24C19 27 26 25 27 19C28.5 12 21 6 13 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TallyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <path d="M10 8V32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 8V32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26 8V32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 30L32 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const iconMap = {
  blot: BlotIcon,
  'circle-scribble': CircleScribbleIcon,
  asterisk: AsteriskIcon,
  checkmark: CheckmarkIcon,
  spiral: SpiralIcon,
  tally: TallyIcon,
};

function InkBlots() {
  return (
    <div className="ink-layer">
      {inkMarks.map((mark) => {
        const Icon = iconMap[mark.type];
        return (
          <div
            key={mark.id}
            className={`ink-mark ink-${mark.type}`}
            style={{
              top: mark.top,
              left: mark.left,
              animationDuration: `${mark.duration}s`,
              animationDelay: `${mark.delay}s`,
              transform: `scale(${mark.scale}) rotate(${mark.rotate}deg)`,
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
}

export default InkBlots;