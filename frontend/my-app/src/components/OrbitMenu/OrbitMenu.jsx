import { useState, useRef, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import "./OrbitMenu.css";
import { Settings, LogOut } from "lucide-react";

function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3V15M12 15L7 10M12 15L17 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 18V20C4 21 5 22 6 22H18C19 22 20 21 20 20V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.2C2 16.7 4.87 20.52 8.84 21.86C9.34 21.95 9.52 21.65 9.52 21.38C9.52 21.14 9.51 20.35 9.51 19.51C7 20.02 6.35 18.9 6.15 18.32C6.04 18.02 5.53 17.12 5.08 16.88C4.71 16.68 4.18 16.17 5.07 16.16C5.91 16.15 6.51 16.96 6.71 17.28C7.66 18.9 9.17 18.44 9.75 18.16C9.84 17.46 10.11 16.99 10.41 16.72C8.07 16.45 5.62 15.53 5.62 11.47C5.62 10.32 6.02 9.37 6.73 8.63C6.62 8.36 6.27 7.28 6.83 5.82C6.83 5.82 7.71 5.53 9.52 6.77C10.28 6.55 11.09 6.44 11.9 6.44C12.71 6.44 13.52 6.55 14.28 6.77C16.09 5.52 16.97 5.82 16.97 5.82C17.53 7.28 17.18 8.36 17.07 8.63C17.78 9.37 18.18 10.31 18.18 11.47C18.18 15.54 15.72 16.45 13.38 16.72C13.76 17.05 14.09 17.7 14.09 18.7C14.09 20.12 14.08 21.03 14.08 21.38C14.08 21.65 14.26 21.97 14.76 21.87C18.74 20.53 21.6 16.72 21.6 12.2C21.6 6.58 17.5 2 12 2Z"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.9 5.5A1.95 1.95 0 1 1 3 5.5a1.95 1.95 0 0 1 3.9 0ZM3.7 9h2.6v11H3.7Zm4.5 0h2.5v1.5h.04c.35-.66 1.22-1.5 2.93-1.5 3.13 0 3.7 2.05 3.7 4.72V20h-2.6v-5.45c0-1.3-.02-2.97-1.8-2.97-1.8 0-2.08 1.4-2.08 2.86V20H8.2Z"/>
    </svg>
  );
}

export default function OrbitMenu({ onExit }) {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile(); // Check on initial load
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const open = isPinned || isHovered;
    const closeTimeoutRef = useRef(null);
    const scale = isMobile ? 0.8 : 1;
const items = [
    {
      label: "Resume",
      icon: <ResumeIcon />,
      action: () => window.location.href = "/assets/resume.pdf",
      x: -115 * scale, // Applied scale
      y: 0 * scale,    // Applied scale
    },
    {
      label: "GitHub",
      icon: <GithubIcon />,
      action: () => window.open("https://github.com/yourusername", "_blank"),
      x: -95 * scale,  // Applied scale
      y: 55 * scale,   // Applied scale
    },
    {
      label: "LinkedIn",
      icon: <LinkedinIcon />,
      action: () => window.open("https://linkedin.com/in/yourusername", "_blank"),
      x: -55 * scale,  // Applied scale
      y: 95 * scale,   // Applied scale
    },
    {
    label: "Exit Orbit",
    action: onExit,
    icon: <LogOut size={18} />,
    x: 0 * scale,
    y: 115 * scale,
  },
  ];

 const handleMenuMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMenuMouseLeave = () => {
    if (isPinned) return;
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

const handleMobileAction = (e, item) => {
  if (!isMobile) return;

  if (activeTooltip !== item.label) {
    e.preventDefault();
    setActiveTooltip(item.label);

    setTimeout(() => {
      setActiveTooltip(null);
    }, 1800);

    return;
  }

  setActiveTooltip(null);
};
  return (
    <div
        className="orbit-menu"
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
    >
        {open && (
          <svg className="orbit-lines" width="60" height="60" style={{ overflow: 'visible' }}>
            {items.map((item, index) => (
              <line
                key={item.label}
                className="orbit-line"
                x1="30"
                y1="30"
                x2={33 + item.x}
                y2={33 + item.y}
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </svg>
        )}
        <motion.button
            className={`orbit-main ${open ? 'orbit-main-active' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                setIsPinned((prev) => {
                    const next = !prev;
                    if (!next) setIsHovered(false);
                    return next;
                });
            }}
        >
            <Settings size={22} />
        </motion.button>
      <AnimatePresence>
        {open &&
          items.map((item, index) => (
            <motion.div
              key={item.label}
              className="orbit-item"
              initial={{
                opacity: 0,
                scale: 0.5,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: item.x,
                y: item.y,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                x: 0,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.05,
              }}
            >
              {item.href ? (
<button
    className="orbit-link"
    onPointerDown={() => {
        if (isMobile) {
            setActiveTooltip(item.label);
        }
    }}
    onPointerUp={() => {
        if (isMobile) {
            setActiveTooltip(null);
        }

        item.action?.();
    }}
    onPointerLeave={() => setActiveTooltip(null)}
    onPointerCancel={() => setActiveTooltip(null)}
>
    {item.icon}

    <span
        className={
            activeTooltip === item.label
                ? "tooltip-visible"
                : ""
        }
    >
        {item.label}
    </span>
</button>
              ) : (
                <button
                    className="orbit-link"
                    onClick={(e) => {
                        handleMobileAction(e, item);
                        if (activeTooltip === item.label) {
                            item.onClick?.();
                        }
                    }}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span
                    className={
                      activeTooltip === item.label
                        ? "tooltip-visible"
                        : ""
                    }
                  >
                    {item.label}
                  </span>
                </button>
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}