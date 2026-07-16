import './About.css';

function About() {
  return (
    <div className="about-section">
      <img
        src="/assets/images/profile.jpg"
        alt="Profile"
        className="about-photo"
      />
     <div className="about-text">
        <h3 className="about-subheading stagger-item" style={{ '--stagger-index': 0 }}>Who I Am</h3>
        <p className="about-intro stagger-item" style={{ '--stagger-index': 1 }}>
          Final-year Computer Engineering student transitioning into AI Engineering,
          building full-stack projects with FastAPI and React.
        </p>
        <h3 className="about-subheading stagger-item" style={{ '--stagger-index': 2 }}>Education</h3>
        <p className="about-education stagger-item" style={{ '--stagger-index': 3 }}>
          B.E. Computer Engineering — University of Mumbai
        </p>
      </div>
    </div>
  );
}

export default About;