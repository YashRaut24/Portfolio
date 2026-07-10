import CircularHub from '../components/CircularHub/CircularHub';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import './Explore.css';

function Explore() {
  return (
    <div className="explore-page">
      <ThemeToggle />
      <CircularHub />
    </div>
  );
}

export default Explore;