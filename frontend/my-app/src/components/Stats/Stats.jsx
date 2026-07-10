function Stats() {
  const githubUsername = "yourusername";

  return (
    <div className="stats-section">
      <img
        src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default`}
        alt="GitHub Stats"
        className="stats-image"
      />
      <img
        src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}`}
        alt="GitHub Streak"
        className="stats-image"
      />
    </div>
  );
}

export default Stats;