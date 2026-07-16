function Stats() {
  const githubUsername = "yourusername";

  return (
    <div className="stats-section">
      <img
        src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default`}
        alt="GitHub Stats"
        className="stats-image stagger-item"
        style={{ '--stagger-index': 0 }}
      />
      <img
        src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}`}
        alt="GitHub Streak"
        className="stats-image stagger-item"
        style={{ '--stagger-index': 1 }}
      />
    </div>
  );
}

export default Stats;