import About from '../About/About';
import Skills from '../Skills/Skills';
import Projects from '../Projects/Projects';
import Achievements from '../Achievements/Achievements';
import Experience from '../Experience/Experience';
import './ContentPanel.css';
import Contact from '../Contact/Contact';
import Stats from '../Stats/Stats';

function AboutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 21C4 16.5 7.5 13.5 12 13.5C16.5 13.5 20 16.5 20 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SkillsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7L2 12L8 17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7L22 12L16 17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 4.5L10.5 19.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 8C3 6.9 3.9 6 5 6H9L11 8H19C20.1 8 21 8.9 21 10V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function AchievementsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3H16V9C16 12 14 15 12 15C10 15 8 12 8 9V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 4.5H4.5C4.5 9 6.5 11.5 8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4.5H19.5C19.5 9 17.5 11.5 16 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15V19M8 22H16L14.5 19H9.5L8 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function ExperienceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 8V6C8.5 5 9.3 4 10.5 4H13.5C14.7 4 15.5 5 15.5 6V8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 7L12 14L21.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 20L9 12L14 16L21 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="12" r="1.6" fill="currentColor" />
      <circle cx="14" cy="16" r="1.6" fill="currentColor" />
      <circle cx="21" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}

const iconMap = {
  about: AboutIcon,
  skills: SkillsIcon,
  projects: ProjectsIcon,
  achievements: AchievementsIcon,
  experience: ExperienceIcon,
  contact: ContactIcon,
  stats: StatsIcon,
};

function ContentPanel({ activeNode }) {
  const TitleIcon = iconMap[activeNode.id];
  const renderContent = () => {
    switch (activeNode.id) {
      case 'about':
        return <About />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'achievements':
        return <Achievements />;
      case 'experience':
        return <Experience />;
      case 'contact':
        return <Contact />;
      case 'stats':
        return <Stats />;
        
      default:
        return (
          <p className="content-panel-placeholder">
            Content for {activeNode.label} goes here.
          </p>
        );
    }
  };

  return (
      <div className="content-panel" style={{ '--panel-accent': activeNode.accent }}>
        <h2 className="content-panel-title">
          {TitleIcon && (
            <span className="content-panel-title-icon">
              <TitleIcon />
            </span>
          )}
          {activeNode.label}
        </h2>
        {renderContent()}
      </div>
    );
}

export default ContentPanel;