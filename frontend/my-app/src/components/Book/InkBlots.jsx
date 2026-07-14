import './InkBlots.css';

const types = ['blot', 'underline', 'circle-scribble', 'asterisk'];

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

function UnderlineIcon() {
  return (
    <svg viewBox="0 0 80 16" fill="none">
      <path d="M2 8C15 4 25 12 40 8C55 4 65 12 78 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

const iconMap = {
  blot: BlotIcon,
  underline: UnderlineIcon,
  'circle-scribble': CircleScribbleIcon,
  asterisk: AsteriskIcon,
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