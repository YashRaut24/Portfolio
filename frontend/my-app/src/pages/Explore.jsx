import CircularHub from '../components/CircularHub/CircularHub';
import OrbitMenu from "../components/OrbitMenu/OrbitMenu";
import Header from '../components/Header/Header';
import './Explore.css';
import SEO from '../seo/SEO';
import GrainOverlay from '../components/GrainOverlay/GrainOverlay';
import StarField from "../components/StarField/StarField";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Explore() {
  const starFieldRef = useRef(null);
  const navigate = useNavigate();

  const handleReturnToBook = () => {
    navigate("/");
  };
  return (
    <div className="explore-page">
      <SEO title="Explore | Yash's Portfolio" description="Skills, projects, achievements, and contact." />
      <StarField ref={starFieldRef} isDarkMode={true}/>
      <Header />
      <OrbitMenu onExit={handleReturnToBook}/>
      <CircularHub starFieldRef={starFieldRef} />
      <GrainOverlay />
    </div>
  );
}

export default Explore;