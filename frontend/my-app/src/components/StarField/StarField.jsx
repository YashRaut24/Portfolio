import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle  } from "react";
import "./StarField.css";

const STAR_COUNT = 170;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const StarField = forwardRef(({ isDarkMode }, ref) => {

    const target = useRef({ x: 0, y: 0 });
    const current = useRef({ x: 0, y: 0 });
    const burstTimeout = useRef(null);

  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => {
      const layer = Math.random();
      return {
        id: i,
        x: random(0, 100),
        y: random(0, 100),

        size:
        layer < 0.72
            ? random(0.8, 1.6)
            : layer < 0.95
            ? random(1.6, 2.6)
            : random(2.8, 4),

        opacity:
        layer < 0.72
            ? random(0.15, 0.35)
            : layer < 0.95
            ? random(0.35, 0.6)
            : random(0.7, 0.9),

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

  const constellationLines = useMemo(() => {
    const candidates = stars
        .filter((star) => star.layer !== "small")
        .sort(() => Math.random() - 0.5)
        .slice(0, 22);

    return candidates.map((star) => {
        let nearest = null;
        let nearestDistance = Infinity;

        candidates.forEach((other) => {
        if (other.id === star.id) return;

        const dx = star.x - other.x;
        const dy = star.y - other.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < nearestDistance && dist < 18) {
            nearestDistance = dist;
            nearest = other;
        }
        });

        if (!nearest) return null;

        return {
        id: `${star.id}-${nearest.id}`,
        x1: star.x,
        y1: star.y,
        x2: nearest.x,
        y2: nearest.y,
        };
    }).filter(Boolean);
    }, [stars]);

  const [shootingStars, setShootingStars] = useState([]);
    const [burstStars, setBurstStars] = useState(new Set());
const triggerStarBurst = () => {
    const total = stars.length;
    const picked = new Set();

    const burstCount = Math.floor(Math.random() * 8) + 12;

    while (picked.size < burstCount) {
        picked.add(Math.floor(Math.random() * total));
    }

    setBurstStars(picked);

    clearTimeout(burstTimeout.current);

    burstTimeout.current = setTimeout(() => {
        setBurstStars(new Set());
    }, 500);
};
    useEffect(() => {
    const createShootingStar = () => {
        const id = Date.now();

        setShootingStars((prev) => [
        ...prev,
        {
            id,
            top: random(5, 45),
            left: random(35, 95),
            duration: random(1.2, 2),
        },
        ]);

        setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
        }, 2500);

        const next = random(12000, 25000);

        timer = setTimeout(createShootingStar, next);
    };

    let timer = setTimeout(createShootingStar, 6000);

    return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
    const wrappers = () =>
        document.querySelectorAll(".star-wrapper");

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMove);

    let frame;

    const animate = () => {
        current.x += (target.x - current.x) * 0.06;
        current.y += (target.y - current.y) * 0.06;

        wrappers().forEach((star) => {
        const svg = document.querySelector(".constellations");
        if (svg) {
        svg.style.transform = `translate(${-current.x * 8}px, ${-current.y * 8}px)`;
        }
        if (star.classList.contains("small")) {
            star.style.transform = `translate(${-current.x * 15}px, ${-current.y * 3}px)`;
        } else if (star.classList.contains("medium")) {
            star.style.transform = `translate(${-current.x * 20}px, ${-current.y * 6}px)`;
        } else {
            star.style.transform = `translate(${-current.x * 25}px, ${-current.y * 10}px)`;
        }
        });

        frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("mousemove", onMove);
    };
    }, []);
    useEffect(() => {
    return () => {
        clearTimeout(burstTimeout.current);
    };
}, []);
    useImperativeHandle(ref, () => ({
        triggerStarBurst,
    }));
  return (
    <div className={`starfield ${isDarkMode ? "dark" : "light"}`}>
      <svg
        className="constellations"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        >
        {constellationLines.map((line) => (
            <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            />
        ))}
      </svg>
    {stars.map((star) => (
    <div
        key={star.id}
        className={`star-wrapper ${star.layer}`}
        style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        }}
    >
        <span
        className={`star ${star.layer} ${
            burstStars.has(star.id) ? "burst" : ""
        }`}
        style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
        }}
        />
    </div>
    ))}
      {shootingStars.map((star) => (
        <span
            key={star.id}
            className="shooting-star"
            style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
            }}
        />
        ))}
    </div>
  );
});
export default StarField;