import About from '../About/About';
import Skills from '../Skills/Skills';
import Projects from '../Projects/Projects';
import Achievements from '../Achievements/Achievements';
import Experience from '../Experience/Experience';
import './ContentPanel.css';
import Contact from '../Contact/Contact';

function ContentPanel({ activeNode }) {
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
        
      default:
        return (
          <p className="content-panel-placeholder">
            Content for {activeNode.label} goes here.
          </p>
        );
    }
  };

  return (
    <div className="content-panel">
      <h2 className="content-panel-title">{activeNode.label}</h2>
      {renderContent()}
    </div>
  );
}

export default ContentPanel;