import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Node from './Node';
import ContentPanel from './ContentPanel';
import { hubNodesData } from '../../data/hubNodes';
import './CircularHub.css';
import HubDoodles from './HubDoodles';
import OrbitRing from './OrbitRing';
import { playSound, SOUNDS, unlockAudio, preloadSounds } from '../../utils/sound'; // Added preloadSounds
import { prefersReducedMotion } from '../../utils/motionPrefs';
import HubRail from './HubRail';
import AmbientWash from './AmbientWash';

const ACTIVE_ARC_ANGLE = -Math.PI / 4;
const LAB_UNLOCK_TIME = 3600;

// Inertia tuning
const INERTIA_MIN_VELOCITY = 0.35;       
const INERTIA_MAX_STEPS = 4;             
const INERTIA_STEP_DELAYS = [380, 470, 580, 720]; 
const VELOCITY_SAMPLE_WINDOW = 100;      
const STEP_ANIM_MS = 350;                
const TRAIL_FADE_MS = 500;               

function CircularHub({ starFieldRef }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(270);
  const scrollAccum = useRef(0);
  const isAnimating = useRef(false);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);
  const wrapperRef = useRef(null);

  const pointerHistory = useRef([]);
  const inertiaTimeouts = useRef([]);
  const isCoastingRef = useRef(false);

  const [trailingSet, setTrailingSet] = useState(new Set());
  const trailTimeouts = useRef(new Map());
  const prevActiveIndexRef = useRef(activeIndex);

  const nodeRefs = useRef([]);
  const challenge = useRef({
    started: false,
    startTime: 0,
    direction: null,
    visited: new Set(),
  });

  const [labUnlocked, setLabUnlocked] = useState(false);

  const visibleNodes = labUnlocked
    ? hubNodesData
    : hubNodesData.filter((node) => !node.hidden);

  const totalNodes = visibleNodes.length;
  const activeNode = visibleNodes[activeIndex];

  const [rotationOffset, setRotationOffset] = useState(ACTIVE_ARC_ANGLE);
  const [transitionDirection, setTransitionDirection] = useState(1);

  // Preload sounds on mount so they are instantly ready for scrolling
  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const isTablet = width <= 1024 && width > 768;
      const isMobile = width <= 768;
      
      if (isMobile) {
          setRadius(140);
          setRotationOffset(-Math.PI * 0.75); 
      } else if (isTablet) {
          setRadius(170);
          setRotationOffset(-Math.PI * 0.75); 
      } else {
          setRadius(270);
          setRotationOffset(0); 
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    return () => {
      clearInertia();
      trailTimeouts.current.forEach(clearTimeout);
      trailTimeouts.current.clear();
    };
  }, []);

  const clearInertia = () => {
    inertiaTimeouts.current.forEach(clearTimeout);
    inertiaTimeouts.current = [];
    isCoastingRef.current = false;
  };

  const addTrail = (index) => {
    setTrailingSet((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    if (trailTimeouts.current.has(index)) {
      clearTimeout(trailTimeouts.current.get(index));
    }
    const timeoutId = setTimeout(() => {
      setTrailingSet((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      trailTimeouts.current.delete(index);
    }, TRAIL_FADE_MS);
    trailTimeouts.current.set(index, timeoutId);
  };

  useEffect(() => {
    const prev = prevActiveIndexRef.current;
    if (isCoastingRef.current && prev !== activeIndex) {
      addTrail(prev);
    }
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  const trackChallenge = (from, to, direction) => {
    if (labUnlocked) return;

    const state = challenge.current;
    const now = performance.now();
    const expired = state.started && now - state.startTime > LAB_UNLOCK_TIME;
    const directionChanged = state.started && direction !== state.direction;

    if (!state.started || expired || directionChanged) {
      challenge.current = {
        started: true,
        startTime: now,
        direction,
        visited: new Set([from, to]),
      };
    } else {
      state.visited.add(to);
    }

    const current = challenge.current;

    if (current.visited.size === totalNodes) {
      const elapsed = now - current.startTime;
      if (elapsed <= LAB_UNLOCK_TIME) {
        setLabUnlocked(true);
        playSound(SOUNDS.unlock, 0.4);
      }
      resetChallenge();
    }
  };

  const resetChallenge = () => {
    challenge.current = {
      started: false,
      startTime: 0,
      direction: null,
      visited: new Set(),
    };
  };

  const goToIndex = (newIndex, direction = null) => {
    const wrapped = ((newIndex % totalNodes) + totalNodes) % totalNodes;

    if (wrapped === activeIndex) return;

    // Increased volume from 0.18 to 0.4 to prevent it being inaudible on rapid scroll
    playSound(SOUNDS.hubTransition, 0.4);

    if (direction !== null) {
      setTransitionDirection(direction);
      trackChallenge(activeIndex, wrapped, direction);
    } else {
      const forward =
        (wrapped - activeIndex + totalNodes) % totalNodes;

      const backward =
        (activeIndex - wrapped + totalNodes) % totalNodes;

      setTransitionDirection(forward <= backward ? 1 : -1);
    }

    setActiveIndex(wrapped);
    starFieldRef.current?.triggerStarBurst();
  };

  const advance = (direction) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    goToIndex(activeIndex + direction, direction);
    setTimeout(() => { isAnimating.current = false; }, STEP_ANIM_MS);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      unlockAudio(); // Kept here: Keydown is a valid gesture for browser audio unlock
      
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if (isTyping) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        advance(window.innerWidth <= 1024 ? 1 : -1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        advance(window.innerWidth <= 1024 ? -1 : 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleWheelNative = (event) => {
      // Removed unlockAudio() from here because 'wheel' events cannot unlock audio
      // and can throw errors in strict browser environments, silently breaking the scroll.
      
      if (event.cancelable) event.preventDefault();
      if (isAnimating.current) return;

      clearInertia();

      scrollAccum.current += event.deltaY;
      const threshold = 60;

      if (scrollAccum.current > threshold) {
        advance(window.innerWidth <= 1024 ? 1 : -1);
        scrollAccum.current = 0;
      } else if (scrollAccum.current < -threshold) {
        advance(window.innerWidth <= 1024 ? -1 : 1);
        scrollAccum.current = 0;
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
  }, [activeIndex]);

 const handlePointerDown = (event) => {
    unlockAudio(); // Kept here: Clicks and touches are valid gestures for browser audio unlock
    clearInertia();
    isDragging.current = true;
    dragStartY.current = event.clientY;
    pointerHistory.current = [{ y: event.clientY, t: performance.now() }];
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current || isAnimating.current) return;
    const deltaY = event.clientY - dragStartY.current;
    const threshold = 50;

    pointerHistory.current.push({ y: event.clientY, t: performance.now() });
    if (pointerHistory.current.length > 6) pointerHistory.current.shift();

    if (deltaY > threshold) {
      advance(window.innerWidth <= 1024 ? 1 : -1);
      dragStartY.current = event.clientY;
    } else if (deltaY < -threshold) {
      advance(window.innerWidth <= 1024 ? -1 : 1);
      dragStartY.current = event.clientY;
    }
  };

  const getFlickVelocity = () => {
    const history = pointerHistory.current;
    if (history.length < 2) return 0;

    const last = history[history.length - 1];
    let ref = history[0];
    for (let i = history.length - 2; i >= 0; i--) {
      if (last.t - history[i].t <= VELOCITY_SAMPLE_WINDOW) {
        ref = history[i];
      } else {
        break;
      }
    }

    const dt = last.t - ref.t;
    if (dt <= 0) return 0;
    return (last.y - ref.y) / dt; 
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (prefersReducedMotion()) {
      pointerHistory.current = [];
      return;
    }

    const velocity = getFlickVelocity();
    pointerHistory.current = [];

    if (Math.abs(velocity) < INERTIA_MIN_VELOCITY) return;

    const isMobileOrTablet = window.innerWidth <= 1024;
    const direction = velocity > 0 
      ? (isMobileOrTablet ? 1 : -1) 
      : (isMobileOrTablet ? -1 : 1);
      
    const steps = Math.min(
      INERTIA_MAX_STEPS,
      Math.round(Math.abs(velocity) / INERTIA_MIN_VELOCITY)
    );

    if (steps <= 0) return;

    clearInertia();
    isCoastingRef.current = true;

    let cumulativeDelay = 0;
    for (let i = 0; i < steps; i++) {
      cumulativeDelay += INERTIA_STEP_DELAYS[Math.min(i, INERTIA_STEP_DELAYS.length - 1)];
      const timeoutId = setTimeout(() => advance(direction), cumulativeDelay);
      inertiaTimeouts.current.push(timeoutId);
    }

    const stopCoastingId = setTimeout(() => {
      isCoastingRef.current = false;
    }, cumulativeDelay + STEP_ANIM_MS);
    inertiaTimeouts.current.push(stopCoastingId);
  };
  

  return (
    <motion.div
      className="hub-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion()
            ? { duration: 0 }
            : {
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
              }
      }
    >
      <AmbientWash color={visibleNodes[activeIndex].accent}/>
      <HubDoodles activeId={activeNode.id} />
      <div
        className="hub-circle-wrapper"
        ref={wrapperRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="hub-circle">
          {visibleNodes.map((node, index) => {
            const offset = index - activeIndex;
            const angle = (offset / totalNodes) * 2 * Math.PI + rotationOffset;

            return (
              <Node
                key={node.id}
                ref={(el) => { nodeRefs.current[index] = el; }}
                label={node.label}
                Icon={node.icon}
                angle={angle}
                radius={radius}
                isActive={index === activeIndex}
                isTrailing={trailingSet.has(index)}
                onClick={() => goToIndex(index)}
                accent={node.accent}
                planet={node.planet}
              />
            );
          })}
        </div>

      </div>
            <HubRail
              nodes={visibleNodes}
              activeIndex={activeIndex}
              direction={transitionDirection}
              onSelect={goToIndex}
          />
        <AnimatePresence mode="wait" custom={transitionDirection}>
          <motion.div
            key={activeNode.id}
            className="hub-content-wrapper"
            custom={transitionDirection}
            variants={{
              enter: (direction) => ({
                opacity: 0,
                x: direction > 0 ? 50 : -50,
              }),
              center: {
                opacity: 1,
                x: 0,
              },
              exit: (direction) => ({
                opacity: 0,
                x: direction > 0 ? -50 : 50,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
                prefersReducedMotion()
                    ? { duration: 0 }
                    : {
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                      }
            }
          >
            <ContentPanel
              activeNode={activeNode}
              history={history}
            />
          </motion.div>
        </AnimatePresence>

      <OrbitRing totalNodes={totalNodes} activeIndex={activeIndex} />
    </motion.div>
  );
}

export default CircularHub;