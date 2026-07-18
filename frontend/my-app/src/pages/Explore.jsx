import CircularHub from '../components/CircularHub/CircularHub';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import Header from '../components/Header/Header';
import './Explore.css';
import SEO from '../seo/SEO';
import GrainOverlay from '../components/GrainOverlay/GrainOverlay';
import SoundToggle from "../components/SoundToggle/SoundToggle";

function Explore() {
  return (
    <div className="explore-page">
      <SEO title="Explore | Yash's Portfolio" description="Skills, projects, achievements, and contact." />
      <Header />
      <ThemeToggle />
      <SoundToggle />
      <CircularHub />
      <GrainOverlay />
    </div>
  );
}

export default Explore;