import './ContentPanel.css';

function ContentPanel({ activeNode }) {
  return (
    <div className="content-panel">
      <h2 className="content-panel-title">{activeNode.label}</h2>
      <p className="content-panel-placeholder">
        Content for {activeNode.label} goes here.
      </p>
    </div>
  );
}

export default ContentPanel;