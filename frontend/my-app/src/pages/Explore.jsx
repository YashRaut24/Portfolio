import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CircularHub from '../components/CircularHub/CircularHub';
import OrbitMenu from "../components/OrbitMenu/OrbitMenu";
import Header from '../components/Header/Header';
import SEO from '../seo/SEO';
import GrainOverlay from '../components/GrainOverlay/GrainOverlay';
import StarField from "../components/StarField/StarField";
import ExploreLoader from '../components/ExploreLoader/ExploreLoader';
import './Explore.css';

function Explore() {
  const [loading, setLoading] = useState(true);
  const starFieldRef = useRef(null);
  const navigate = useNavigate();

  const handleReturnToBook = () => {
    navigate("/");
  };
  
  return (
    <div className="explore-page">
      <SEO title="Explore | Yash's Portfolio" description="Skills, projects, achievements, and contact." />
      
      <AnimatePresence mode="wait">
        {loading && (
          <ExploreLoader key="explore-loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <StarField ref={starFieldRef} isDarkMode={true}/>
      
      <Header />
      
      <nav aria-label="Global Options">
        <OrbitMenu onExit={handleReturnToBook}/>
      </nav>

      <main role="main" aria-label="Interactive Portfolio Hub">
        <CircularHub starFieldRef={starFieldRef} />
      </main>

      <GrainOverlay />
    </div>
  );
}

export default Explore;