import About from '../About/About';
import './ContentPanel.css';

function ContentPanel({ activeNode }) {
  const renderContent = () => {
    switch (activeNode.id) {
      case 'about':
        return <About />;
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