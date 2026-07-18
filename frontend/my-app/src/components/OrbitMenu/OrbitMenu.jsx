import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import "./OrbitMenu.css";
import { Settings } from "lucide-react";

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

function ThemeIcon({ dark }) {
  if (dark) {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 1V3M12 21V23M4.2 4.2L5.6 5.6M18.4 18.4L19.8 19.8M1 12H3M21 12H23M4.2 19.8L5.6 18.4M18.4 5.6L19.8 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function OrbitMenu() {
    const [isPinned, setIsPinned] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const open = isPinned || isHovered;
    const closeTimeoutRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

const items = [
    {
      label: "Resume",
      icon: <ResumeIcon />,
      href: "/assets/resume.pdf",
      download: true,
      x: -115,
      y: 0,
    },
    {
      label: "GitHub",
      icon: <GithubIcon />,
      href: "https://github.com/yourusername",
      x: -95,
      y: 55,
    },
    {
      label: "LinkedIn",
      icon: <LinkedinIcon />,
      href: "https://linkedin.com/in/yourusername",
      x: -55,
      y: 95,
    },
    {
      label: "Theme",
      icon: <ThemeIcon dark={theme === "dark"} />,
      onClick: toggleTheme,
      x: 0,
      y: 115,
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
                <a
                  href={item.href}
                  download={item.download}
                  target={item.download ? undefined : "_blank"}
                  rel="noreferrer"
                  className="orbit-link"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  className="orbit-link"
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}