import './Page.css';
import { useState } from 'react';

function Page({ content, onExplore, onNavigate, onUnlock, pageSide }) {
  const [burst, setBurst] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);

  const handleExploreClick = () => {
    setBurst(true);
    setTimeout(() => onExplore(), 950);
  };

  const FACT_ICONS = {
    pin: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21C12 21 19 14.5 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 9L4 13L8 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 9L20 13L16 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 6L10.5 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    spark: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    rocket: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 15C15 15 18 12.5 18.5 6.5C12.5 7 10 10 13C10 13.8 10.1 14.4 10.3 15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M10.3 15L7 15.5L6 18.5L9 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M12 15L11.5 18.5L14.5 17.5L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="14.5" cy="9.5" r="1.3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6.5 18.5C5.5 19 4.5 21 4.5 21C4.5 21 6.5 20 7 19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11V19H5.5C4.7 19 4 18.3 4 17.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 5.5C20 4.7 19.3 4 18.5 4H13V19H18.5C19.3 19 20 18.3 20 17.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 4C11 4 12 4.6 12 6C12 4.6 13 4 13 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    gamepad: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 9H17C19 9 20.5 10.8 20.5 13.5C20.5 15.4 19.4 16.5 18.2 16.5C17.4 16.5 16.9 16.1 16.3 15.4L15 14H9L7.7 15.4C7.1 16.1 6.6 16.5 5.8 16.5C4.6 16.5 3.5 15.4 3.5 13.5C3.5 10.8 5 9 7 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7.8 11V13.2M6.7 12.1H8.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="16" cy="11.3" r="0.6" fill="currentColor" />
        <circle cx="17.6" cy="12.9" r="0.6" fill="currentColor" />
      </svg>
    ),
  };

  const handleEasterEggClick = () => {
    setEggClicks((c) => {
      const next = c + 1;
      if (next >= 5) {
        onUnlock && onUnlock();
        return 0;
      }
      return next;
    });
  };

  if (!content) {
    return <div className="page page-blank" />;
  }

  const annotation = content.annotation && (
      <span className={`page-annotation page-annotation-${content.annotationPosition || 'top-right'}`}>
        {content.annotation}
      </span>
    );

  // Physical page number shown in the footer of every numbered page (front and back faces alike).
  // Left-hand pages get it in the bottom-left corner, right-hand pages bottom-right —
  // matching how page numbers sit in a real book. Defaults to the right corner
  // when no side is known (e.g. the single-column mobile notepad view).
  const pageNumberEl = content.pageNumber ? (
    <span
      className={`page-number ${pageSide === 'left' ? 'page-number-left' : 'page-number-right'}`}
      aria-hidden="true"
    >
      {String(content.pageNumber).padStart(2, '0')}
    </span>
  ) : null;

  if (content.type === 'blank') {
    return <div className="page page-blank" />;
  }

  if (content.type === 'inside-cover') {
      return <div className="page page-inside-cover" />;
  }

  if (content.type === 'transparent') {
    return <div className="page page-transparent" />;
  }

  if (content.type === 'placeholder') {
        return (
          <div className="page page-type-placeholder">
            <div className="page-doodle-cluster" style={{ opacity: 0.85 }} aria-hidden="true">
              <svg viewBox="0 0 400 460" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                
                {/* ========================================================= */}
                {/* 1. FAINT BACKGROUND FILLERS (No overlap)                  */}
                {/* ========================================================= */}
                <g className="doodle-faint" strokeWidth="1">
                  <circle cx="30" cy="30" r="1.5" /> <circle cx="38" cy="26" r="1" />
                  <circle cx="370" cy="40" r="1.5" /> <circle cx="362" cy="46" r="1" />
                  <rect x="30" y="420" width="3" height="3" /> <rect x="38" y="426" width="2" height="2" />
                  <circle cx="370" cy="430" r="1.5" /> <rect x="360" y="422" width="3" height="3" />

                  <path d="M90,20 L96,20 M93,17 L93,23" />
                  <path d="M310,20 L316,20 M313,17 L313,23" />
                  <path d="M90,430 L96,430 M93,427 L93,433" />
                  <path d="M310,430 L316,430 M313,427 L313,433" />
                  
                  <text x="20" y="160" fontSize="10" fontFamily="monospace" stroke="none" fill="currentColor" transform="rotate(-15 20 160)">0110</text>
                  <text x="360" y="160" fontSize="10" fontFamily="monospace" stroke="none" fill="currentColor" transform="rotate(15 360 160)">1001</text>
                </g>

                {/* ========================================================= */}
                {/* 2. DENSE ISOLATED TECHNICAL DOODLES                       */}
                {/* ========================================================= */}
                
                {/* Top Left: Gears */}
                <g transform="translate(60, 60) scale(0.65)">
                  <circle cx="0" cy="0" r="22" />
                  <circle cx="0" cy="0" r="8" />
                  <path d="M-27,-5 L-32,-10 L-23,-23 L-13,-23 L-5,-27 L5,-27 L13,-23 L23,-23 L32,-10 L27,-5 L27,5 L32,10 L23,23 L13,23 L5,27 L-5,27 L-13,23 L-23,23 L-32,10 L-27,5 Z" />
                </g>

                {/* Mid-Top Left: Component Atom */}
                <g transform="translate(45, 120) scale(0.65)">
                  <ellipse cx="0" cy="0" rx="14" ry="5" transform="rotate(30)" strokeWidth="1.5"/>
                  <ellipse cx="0" cy="0" rx="14" ry="5" transform="rotate(90)" strokeWidth="1.5"/>
                  <ellipse cx="0" cy="0" rx="14" ry="5" transform="rotate(150)" strokeWidth="1.5"/>
                  <circle cx="0" cy="0" r="2.5" fill="currentColor"/>
                </g>

                {/* Top Center: Cloud Computing */}
                <g transform="translate(170, 35) scale(0.65)">
                  <path d="M25,45 Q10,25 35,5 Q65,-15 95,5 Q125,-5 135,25 Q160,40 135,65 L20,65 Q-15,65 0,35 Z" />
                  <circle cx="80" cy="35" r="16" />
                  <path d="M64,35 Q80,51 96,35 M64,35 Q80,19 96,35 M80,19 L80,51" strokeWidth="1.2" />
                </g>

                {/* Top Center-Right: Neural Network Nodes */}
                <g transform="translate(240, 85) scale(0.6)">
                  <circle cx="0" cy="0" r="3"/> <circle cx="0" cy="20" r="3"/>
                  <circle cx="20" cy="-10" r="3"/> <circle cx="20" cy="10" r="3"/> <circle cx="20" cy="30" r="3"/>
                  <circle cx="40" cy="10" r="3"/>
                  <line x1="3" y1="0" x2="17" y2="-10"/> <line x1="3" y1="0" x2="17" y2="10"/>
                  <line x1="3" y1="20" x2="17" y2="10"/> <line x1="3" y1="20" x2="17" y2="30"/>
                  <line x1="23" y1="-10" x2="37" y2="10"/> <line x1="23" y1="10" x2="37" y2="10"/> <line x1="23" y1="30" x2="37" y2="10"/>
                </g>

                {/* Top Right: Terminal Window */}
                <g transform="translate(320, 40) scale(0.6)">
                  <rect x="0" y="0" width="60" height="40" rx="3" strokeWidth="2" />
                  <line x1="0" y1="12" x2="60" y2="12" strokeWidth="2" />
                  <circle cx="8" cy="6" r="1.5" fill="currentColor" />
                  <circle cx="14" cy="6" r="1.5" fill="currentColor" />
                  <path d="M5,22 L10,27 L5,32" strokeWidth="2" />
                  <line x1="14" y1="32" x2="22" y2="32" strokeWidth="2" />
                </g>

                {/* Mid-Top Right: AI Robot Face */}
                <g transform="translate(350, 110) scale(0.6) rotate(5)">
                  <rect x="0" y="0" width="24" height="20" rx="4" strokeWidth="2"/>
                  <line x1="12" y1="0" x2="12" y2="-6" strokeWidth="2"/>
                  <circle cx="12" cy="-8" r="2.5" fill="currentColor"/>
                  <circle cx="7" cy="8" r="2.5" fill="currentColor"/>
                  <circle cx="17" cy="8" r="2.5" fill="currentColor"/>
                  <line x1="8" y1="15" x2="16" y2="15" strokeWidth="2"/>
                </g>

                {/* Mid Left: Server Rack */}
                <g transform="translate(25, 200) scale(0.8)">
                  <rect x="0" y="0" width="36" height="10" rx="1" />
                  <rect x="0" y="14" width="36" height="10" rx="1" />
                  <rect x="0" y="28" width="36" height="10" rx="1" />
                  <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="5" cy="19" r="1.5" fill="currentColor" />
                  <circle cx="5" cy="33" r="1.5" fill="currentColor" />
                  <line x1="12" y1="5" x2="30" y2="5" />
                  <line x1="12" y1="19" x2="30" y2="19" />
                  <line x1="12" y1="33" x2="30" y2="33" />
                </g>

                {/* Inner Mid Left: Architecture Flowchart */}
                <g transform="translate(85, 215) scale(0.55)">
                  <rect x="0" y="0" width="16" height="10" strokeWidth="2"/>
                  <rect x="-15" y="20" width="16" height="10" strokeWidth="2"/>
                  <rect x="15" y="20" width="16" height="10" strokeWidth="2"/>
                  <line x1="8" y1="10" x2="8" y2="15" strokeWidth="2"/>
                  <line x1="-7" y1="15" x2="23" y2="15" strokeWidth="2"/>
                  <line x1="-7" y1="15" x2="-7" y2="20" strokeWidth="2"/>
                  <line x1="23" y1="15" x2="23" y2="20" strokeWidth="2"/>
                </g>

                {/* Mid Right: Microchip */}
                <g transform="translate(340, 190) scale(0.7)">
                  <rect x="0" y="0" width="40" height="40" rx="3" strokeWidth="2" />
                  <rect x="10" y="10" width="20" height="20" rx="1" />
                  <path d="M -5,10 L 0,10 M -5,20 L 0,20 M -5,30 L 0,30" strokeWidth="2"/>
                  <path d="M 40,10 L 45,10 M 40,20 L 45,20 M 40,30 L 45,30" strokeWidth="2"/>
                  <path d="M 10,-5 L 10,0 M 20,-5 L 20,0 M 30,-5 L 30,0" strokeWidth="2"/>
                  <path d="M 10,40 L 10,45 M 20,40 L 20,45 M 30,40 L 30,45" strokeWidth="2"/>
                </g>

                {/* Inner Mid Right: Debugging Bug */}
                <g transform="translate(360, 260) scale(0.55) rotate(-15)">
                  <path d="M0,0 Q10,-10 20,0 L20,15 Q10,25 0,15 Z" strokeWidth="2"/>
                  <line x1="10" y1="-5" x2="10" y2="20" strokeWidth="2"/>
                  <line x1="-5" y1="5" x2="0" y2="5" strokeWidth="2"/>
                  <line x1="20" y1="5" x2="25" y2="5" strokeWidth="2"/>
                  <line x1="-5" y1="10" x2="0" y2="10" strokeWidth="2"/>
                  <line x1="20" y1="10" x2="25" y2="10" strokeWidth="2"/>
                  <path d="M5,-5 Q5,-10 0,-15 M15,-5 Q15,-10 20,-15" strokeWidth="1.5"/>
                </g>

                {/* Bottom Left: Data Graph */}
                <g transform="translate(35, 370) scale(0.65)">
                  <polyline points="0,40 40,40 40,0" strokeWidth="2" />
                  <rect x="5" y="20" width="8" height="20" />
                  <rect x="17" y="10" width="8" height="30" />
                  <rect x="29" y="25" width="8" height="15" />
                  <polyline points="5,15 17,5 29,20 40,5" strokeWidth="2" className="doodle-accent" />
                </g>

                {/* Inner Bottom Left: NoSQL Database Leaf */}
                <g transform="translate(60, 310) scale(0.7) rotate(20)">
                  <path d="M0,20 Q-15,5 0,-10 Q15,5 0,20 Z" strokeWidth="2"/>
                  <path d="M0,-10 L0,25" strokeWidth="2"/>
                </g>

                {/* Center Bottom Left: Audit/Scan Document */}
                <g transform="translate(100, 410) scale(0.65) rotate(-10)">
                  <rect x="0" y="0" width="20" height="25" rx="2" strokeWidth="2"/>
                  <line x1="4" y1="6" x2="16" y2="6" strokeWidth="1.5"/> 
                  <line x1="4" y1="12" x2="10" y2="12" strokeWidth="1.5"/>
                  <circle cx="18" cy="18" r="6" fill="#fff" strokeWidth="2"/>
                  <line x1="22" y1="22" x2="28" y2="28" strokeWidth="2"/>
                </g>

                {/* Bottom Center: Database Cylinder */}
                <g transform="translate(180, 380) scale(1.1)">
                  <ellipse cx="10" cy="5" rx="14" ry="5" />
                  <path d="M-4,5 L-4,20 A14,5 0 0,0 24,20 L24,5" />
                  <path d="M-4,12 A14,5 0 0,0 24,12" />
                </g>

                {/* Small Isolated Network Node (Bottom Center-Right) */}
                <g transform="translate(260, 350) scale(0.9)">
                  <circle cx="0" cy="0" r="2.5" />
                  <circle cx="15" cy="-10" r="2.5" />
                  <circle cx="15" cy="10" r="2.5" />
                  <line x1="2" y1="-2" x2="13" y2="-8" />
                  <line x1="2" y1="2" x2="13" y2="8" />
                </g>

                {/* Center Bottom Right: Settings Gear */}
                <g transform="translate(265, 420) scale(0.55)">
                  <circle cx="0" cy="0" r="12" strokeWidth="2"/>
                  <circle cx="0" cy="0" r="4" strokeWidth="2"/>
                  <path d="M-15,-3 L-18,-6 L-13,-13 L-10,-10 L-3,-15 L-6,-18 L2,-18 L5,-15 L10,-10 L13,-13 L18,-6 L15,-3 L15,3 L18,6 L13,13 L10,10 L5,15 L2,18 L-6,18 L-3,15 L-10,10 L-13,13 L-18,6 L-15,3 Z" strokeWidth="1.5"/>
                </g>

                {/* Bottom Right: Security Shield */}
                <g transform="translate(320, 360) scale(0.7)">
                  <path d="M0,0 L24,0 L24,12 Q24,30 12,42 Q0,30 0,12 Z" strokeWidth="2" />
                  <path d="M6,18 L10,22 L18,12" strokeWidth="2" />
                </g>

                {/* Edge Bottom Right: Clinical/Data Doc */}
                <g transform="translate(365, 410) scale(0.65) rotate(10)">
                  <path d="M0,0 L14,0 L22,8 L22,28 L0,28 Z" strokeWidth="2"/>
                  <path d="M14,0 L14,8 L22,8" strokeWidth="2"/>
                  <line x1="11" y1="13" x2="11" y2="21" strokeWidth="2"/>
                  <line x1="7" y1="17" x2="15" y2="17" strokeWidth="2"/>
                </g>

                {/* Small Code Branch (Top Center-Left) */}
                <g transform="translate(110, 110)">
                  <circle cx="0" cy="0" r="2.5" />
                  <circle cx="15" cy="0" r="2.5" />
                  <circle cx="15" cy="-10" r="2.5" />
                  <line x1="3" y1="0" x2="12" y2="0" />
                  <path d="M3,0 L8,0 L8,-10 L12,-10" />
                </g>

                {/* ========================================================= */}
                {/* 3. NEATLY PLACED SYNTAX & TEXT                            */}
                {/* ========================================================= */}
                
                <text x="175" y="135" fontSize="16" fontFamily="sans-serif" fontWeight="bold" stroke="none" fill="currentColor">CODE</text>
                <text x="250" y="135" fontSize="16" fontFamily="sans-serif" fontWeight="bold" stroke="none" fill="currentColor">AI</text>
                
                <text x="35" y="270" fontSize="14" fontFamily="sans-serif" fontWeight="bold" stroke="none" fill="currentColor">API</text>
                <text x="340" y="325" fontSize="14" fontFamily="sans-serif" fontWeight="bold" stroke="none" fill="currentColor">TECH</text>

                <text x="80" y="150" fontSize="26" fontFamily="monospace" fontWeight="bold" stroke="none" fill="currentColor" className="doodle-accent">{'{ }'}</text>
                <text x="290" y="140" fontSize="26" fontFamily="monospace" fontWeight="bold" stroke="none" fill="currentColor" className="doodle-accent">{'</>'}</text>

                <text x="135" y="345" fontSize="13" fontFamily="sans-serif" fontWeight="bold" stroke="none" fill="currentColor">INNOVATION</text>

                <text x="20" y="340" fontSize="14" fontFamily="monospace" stroke="none" fill="currentColor">&&</text>
                <text x="375" y="340" fontSize="14" fontFamily="monospace" stroke="none" fill="currentColor">||</text>
                <text x="80" y="190" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">[]</text>
                <text x="305" y="220" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">()</text>
                <text x="40" y="220" fontSize="14" fontFamily="monospace" stroke="none" fill="currentColor" transform="rotate(-90 40 220)">//</text>

                {/* ========================================================= */}
                {/* 4. CENTER LAPTOP (Untouched, completely clear boundary)   */}
                {/* ========================================================= */}
                <g transform="translate(110, 165)">
                  <rect x="0" y="0" width="180" height="110" rx="6" strokeWidth="1.8" />
                  <path d="M-15,110 L195,110 L175,130 L5,130 Z" strokeWidth="1.8" />
                  <line x1="5" y1="120" x2="175" y2="120" strokeWidth="1.2" />
                  <line x1="30" y1="115" x2="150" y2="115" strokeWidth="1.2" strokeDasharray="4 2" />
                  <text x="15" y="25" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">{'<script>'}</text>
                  <text x="15" y="45" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">console.log('AI');</text>
                  <text x="15" y="65" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">class {'{'} </text>
                  <text x="25" y="85" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">  build();</text>
                  <text x="15" y="100" fontSize="12" fontFamily="monospace" stroke="none" fill="currentColor">{'}'}</text>
                </g>

                {/* ========================================================= */}
                {/* 5. GOLDEN SPARKLES (Safely in empty corners)              */}
                {/* ========================================================= */}
                <g className="doodle-accent">
                  <path d="M30,100 Q34,100 34,96 Q34,100 38,100 Q34,100 34,104 Q34,100 30,100 Z" fill="currentColor" stroke="none" />
                  <path d="M375,150 Q379,150 379,146 Q379,150 383,150 Q379,150 379,154 Q379,150 375,150 Z" fill="currentColor" stroke="none" />
                  <path d="M70,440 Q74,440 74,436 Q74,440 78,440 Q74,440 74,444 Q74,440 70,440 Z" fill="currentColor" stroke="none" />
                  <path d="M280,310 Q284,310 284,306 Q284,310 288,310 Q284,310 284,314 Q284,310 280,310 Z" fill="currentColor" stroke="none" />
                </g>

              </svg>
            </div>
            {pageNumberEl}
          </div>
        );
    }
  
  if (content.type === 'quick-facts') {
    return (
      <div className="page page-type-quick-facts">
        <div className="page-quick-facts-content">
          <h2 className="page-quick-facts-title">{content.title}</h2>
          <ul className="page-quick-facts-list">
            {content.facts.map((fact, index) => (
              <li key={index} className="page-quick-facts-item">
                <span className="page-quick-facts-icon">{FACT_ICONS[fact.icon]}</span>
                <span className="page-quick-facts-text">{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>
        {pageNumberEl}
      </div>
    );
  }

if (content.type === 'cover-face') {
    return (
      <div className="page page-cover-face">
        <img
          src="/assets/images/YashPhoto_.jpg"
          alt="Portrait of Yash Raut"
          className="cover-photo"
          loading="lazy"
          decoding="async"
          onError={(e) => e.target.style.display = 'none'}
        />
        <h1 className="cover-name">Yash Raut</h1>
        <p className="cover-edu">B.E Computer Engineering</p>
        <p className="cover-year">2023 - 2027</p>
        
        <div className="cover-role-stack">
          <span>Full-Stack Developer</span>
          <span className="cover-ampersand">&</span>
          <span>Aspiring AIML Engineer</span>
        </div>
        
<a 
          href="https://www.linkedin.com/in/yash-raut-240505-yr30" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cover-social"
          onPointerDown={(e) => e.stopPropagation()} 
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>
    );
  }
if (content.type === 'intro') {
    return (
      <div className="page page-type-intro">
        {annotation}
        <p className="page-quote">
          "<span className="page-quote-highlight" key={content.quote}>{content.quote}</span>"
        </p>
        <p className="page-description">{content.description}</p>

        {content.focusAreas && (
          <div className="page-focus-block">
            <span className="page-focus-label">Focus areas</span>
            <ul className="page-keywords">
              {content.focusAreas.map((item, index) => (
                <li key={index} className="page-keyword">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {content.currentlyExploring && (
          <p className="page-currently-exploring">{content.currentlyExploring}</p>
        )}

        <svg
          className="page-easter-egg page-easter-egg-clickable"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
          onClick={handleEasterEggClick}
        >
          <path d="M20 8C14 8 10 13 10 19C10 23 12 26 14 29V33H26V29C28 26 30 23 30 19C30 13 26 8 20 8Z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M14 35H26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {pageNumberEl}
      </div>
    );
}

if (content.type === 'timeline') {
      return (
        <div className="page page-type-timeline">
          {annotation}
          <span className="page-year">{content.year}</span>
          <h2 className="page-title">
            <span className="page-title-wrap" key={content.title}>
              <span className="page-title-text">{content.title}</span>
              <svg className="page-title-pencil" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20L5 15L16 4L20 8L9 19L4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
          </h2>
          
          {/* Description moved ABOVE keywords */}
          {content.description && (
            <p className="page-description page-timeline-description">{content.description}</p>
          )}

          {/* Keywords moved BELOW description */}
          <ul className="page-keywords">
            {content.keywords.map((item, index) => (
              <li key={index} className="page-keyword">{item}</li>
            ))}
          </ul>
          
          {pageNumberEl}
        </div>
      );
  }

  if (content.type === 'toc') {
      return (
        <div className="page page-type-toc">
          <h2 className="page-title">{content.title}</h2>
          <ul className="page-toc-list">
            {content.entries.map((entry, index) => (
              <li key={index}>
                <button
                  className="page-toc-item"
                  onClick={() => onNavigate && onNavigate(entry.spreadIndex)}
                >
                  <span className="page-toc-label">{entry.label}</span>
                  <span className="page-toc-dots" aria-hidden="true" />
                  {entry.pageNumber && (
                    <span className="page-toc-pagenum">
                      {String(entry.pageNumber).padStart(2, '0')}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {pageNumberEl}
        </div>
      );
  }

if (content.type === 'cta') {
      return (
        <div className="page page-cta page-type-cta">
          {annotation}
          
          <div className="cta-cards-container">
            {/* GitHub Instagram-Style Card */}
            <a href="https://github.com/YashRaut24" target="_blank" rel="noopener noreferrer" className="insta-card">
              <div className="insta-card-image-wrap">
                {/* Replace src with a screenshot of your GitHub or a relevant graphic */}
                <img 
                  src="/assets/images/GitHub.jpg" 
                  alt="GitHub Profile Repository Preview" 
                  className="insta-card-img" 
                  loading="lazy"
                  decoding="async"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <div className="insta-card-footer">
                <span className="insta-card-title">github.com/yourusername</span>
                <p className="insta-card-caption">Check out my full-stack MERN repos and AI projects 🚀</p>
              </div>
            </a>

            {/* Resume Instagram-Style Card */}
            <a href="https://drive.google.com/file/d/1-OrBoy4DUnNzyjTSTsX26KAoA424KdgH/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="insta-card">
              <div className="insta-card-image-wrap">
                {/* Replace src with a thumbnail image of your Resume */}
                <img 
                  src="/assets/images/Resume.png" 
                  alt="Resume Document Preview" 
                  className="insta-card-img" 
                  loading="lazy"
                  decoding="async"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <div className="insta-card-footer">
                <span className="insta-card-title">My Resume.pdf</span>
                <p className="insta-card-caption">View my full experience and education📄</p>
              </div>
            </a>
          </div>

          {/* Text moved below the cards */}
          <p className="page-cta-text">Ready to see what I've built?</p>

          <div className="explore-btn-wrap cta-btn-shifted">
            <button className="explore-btn" onClick={handleExploreClick}>Explore My Work</button>
            {burst && (
              <span className="confetti-burst" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={`confetti-piece confetti-${i}`} />
                ))}
              </span>
            )}
          </div>
          {pageNumberEl}
        </div>
      );
    }

  return null;
}

export default Page;