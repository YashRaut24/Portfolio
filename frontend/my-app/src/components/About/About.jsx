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
        <h3 className="about-subheading">Who I Am</h3>
        <p className="about-intro">
          Final-year Computer Engineering student transitioning into AI Engineering,
          building full-stack projects with FastAPI and React.
        </p>
        <h3 className="about-subheading">Education</h3>
        <p className="about-education">
          B.E. Computer Engineering — University of Mumbai
        </p>
      </div>
    </div>
  );
}

export default About;