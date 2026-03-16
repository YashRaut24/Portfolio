import './Sidebar.css';
import React from 'react';
import ParchmentMenu from "./ParchmentMenu/ParchmentMenu";

const Sidebar = () => {
return ( <aside className="sidebar" aria-label="Portfolio sidebar">

  {/* Top Section */}
  <div className="top-section">
    <h1 className="raised-text">Portfolio</h1>
  </div>

  {/* Parchment Scroll Navigation */}
  <div className="parchment-wrapper">
    <ParchmentMenu />
  </div>

  {/* Decorative Content */}
  <div className="decorative-content">
    <div className="deco-panel panel-1"></div>
    <div className="deco-panel panel-2"></div>
    <div className="deco-panel panel-3"></div>

    <div className="abstract-shapes">
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
    </div>

    <div className="accent-line vertical"></div>
  </div>

  {/* Footer */}
  <div className="bottom-section">
    <div className="footer-text raised-text">
      © 2026
    </div>
  </div>

</aside>

);
};

export default Sidebar;
