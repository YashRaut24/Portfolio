import CircularHub from '../components/CircularHub/CircularHub';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import Header from '../components/Header/Header';
import './Explore.css';
import SEO from '../seo/SEO';

function Explore() {
  return (
    <div className="explore-page">
      <SEO title="Explore | Yash's Portfolio" description="Skills, projects, achievements, and contact." />
      <Header />
      <ThemeToggle />
      <CircularHub />
    </div>
  );
}

export default Explore;