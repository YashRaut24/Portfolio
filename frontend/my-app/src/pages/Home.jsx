import Book from '../components/Book/Book';
import SEO from '../seo/SEO';
import FloatingDoodles from '../components/Book/FloatingDoodles';
// import InkBlots from '../components/Book/InkBlots';

import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <SEO title="Yash | Portfolio" description="AI Engineer and Full-Stack Developer portfolio." />
      <FloatingDoodles />
      {/* <InkBlots /> */}
      <Book />
    </div>
  );
}

export default Home;