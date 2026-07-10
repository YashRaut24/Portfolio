import CircularHub from '../components/CircularHub/CircularHub';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import Header from '../components/Header/Header';
import './Explore.css';

function Explore() {
  return (
    <div className="explore-page">
      <Header />
      <ThemeToggle />
      <CircularHub />
    </div>
  );
}

export default Explore;