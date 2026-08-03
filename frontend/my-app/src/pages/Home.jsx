import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Book from '../components/Book/Book';
import SEO from '../seo/SEO';
// FIX: Explicitly add the .jsx extension to the import path
import FloatingDoodles from '../components/Book/FloatingDoodles.jsx';
import HomeLoader from '../components/HomeLoader/HomeLoader';
// import InkBlots from '../components/Book/InkBlots';

import './Home.css';

function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="home-page">
      <SEO title="Yash | Portfolio" description="AI Engineer and Full-Stack Developer portfolio." />
      
      <AnimatePresence mode="wait">
        {loading && (
          <HomeLoader key="home-loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <FloatingDoodles />
      {/* <InkBlots /> */}
      
      <Book />
    </div>
  );
}

export default Home;