import { useMemo } from "react";
import "./StarField.css";

const STAR_COUNT = 260;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => {
      const layer = Math.random();

      return {
        id: i,
        x: random(0, 100),
        y: random(0, 100),

        size:
          layer < 0.7
            ? random(1, 2)
            : layer < 0.95
            ? random(2, 3.5)
            : random(4, 6),

        opacity:
          layer < 0.7
            ? random(0.35, 0.65)
            : layer < 0.95
            ? random(0.6, 0.9)
            : 1,

        duration: random(2.5, 7),
        delay: random(0, 8),

        layer:
          layer < 0.7
            ? "small"
            : layer < 0.95
            ? "medium"
            : "large",
      };
    });
  }, []);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <span
          key={star.id}
          className={`star ${star.layer}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}