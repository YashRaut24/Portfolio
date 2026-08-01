import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from "react";
import { preloadSounds } from './utils/sound';
import LoadingFallback from './components/LoadingFallback/LoadingFallback';

// Lazy load top-level routes to split the bundle
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

function App() {
  useEffect(() => {
      preloadSounds();
  }, []);
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;