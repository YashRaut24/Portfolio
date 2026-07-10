import Book from '../components/Book/Book';
import SEO from '../seo/SEO';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <SEO title="Yash | Portfolio" description="AI Engineer and Full-Stack Developer portfolio." />
      <Book />
    </div>
  );
}

export default Home;