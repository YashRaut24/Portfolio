import './About.css';

function About() {
  return (
    <div className="about-section">
      <img
        src="/assets/images/YashPhoto_.webp"
        alt="Profile"
        className="about-photo"
      />
      <div className="about-text">
        {/* Intro & Traits */}
        <h3 className="about-subheading stagger-item" style={{ '--stagger-index': 0 }}>Who I Am</h3>
        <p className="about-intro stagger-item" style={{ '--stagger-index': 1 }}>
          I am a final-year Computer Engineering student who loves turning ideas into working products. I specialize in full-stack MERN development and have a strong, growing focus on Artificial Intelligence and Machine Learning. I enjoy building real-world projects that combine traditional software engineering with emerging AI technologies like Agentic AI and NLP.
        </p>

        {/* Current Status Card */}
        <div className="about-status-box stagger-item" style={{ '--stagger-index': 2 }}>
          <div className="status-item">
            <span className="status-label">Currently:</span> Final-year Computer Engineering student
          </div>
          <div className="status-item">
            <span className="status-label">Exploring:</span> Agentic AI & applied ML pipelines
          </div>
          <div className="status-item">
            <span className="status-label">Building:</span> Full-stack applications & AI systems
          </div>
          <div className="status-item">
            <span className="status-label">Open to:</span> Software Engineer Trainee / Full-Stack roles
          </div>
        </div>

        {/* Tech Snapshot */}
        <h3 className="about-subheading stagger-item" style={{ '--stagger-index': 3 }}>Tech Snapshot</h3>
        <p className="about-intro stagger-item" style={{ '--stagger-index': 4 }}>
          <strong>Languages:</strong> Java, Python, JavaScript, C/C++<br />
          <strong>Web:</strong> MongoDB, Express.js, React.js, Node.js (MERN)<br />
          <strong>AI/ML:</strong> Scikit-learn, NLP, LLM Integration<br />
          <span className="about-cta-text">👉 Check out the <strong>Skills</strong> tab for my full tech stack, or <strong>Projects</strong> to see what I've built!</span>
        </p>

        {/* Education */}
        <h3 className="about-subheading stagger-item" style={{ '--stagger-index': 5 }}>Education</h3>
        <p className="about-education stagger-item" style={{ '--stagger-index': 6 }}>
          <strong>B.E. in Computer Engineering</strong><br />
          K.C. College of Engineering, Mumbai University (2023 - Present)<br />
          Current CGPA: 8.40
        </p>
      </div>
    </div>
  );
}

export default About;