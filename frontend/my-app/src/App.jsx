import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from "react";
import { preloadSounds } from './utils/sound';
import LoadingFallback from './components/LoadingFallback/LoadingFallback';

// 1. Eagerly load the Home route so the cinematic loader starts instantly
import Home from './pages/Home';

// 2. Lazy load the heavy secondary routes (CircularHub, StarField, etc.)
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