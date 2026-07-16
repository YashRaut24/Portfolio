import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Node from './Node';
import ContentPanel from './ContentPanel';
import { hubNodesData } from '../../data/hubNodes';
import './CircularHub.css';
import HubDoodles from './HubDoodles';
import OrbitRing from './OrbitRing';

const ACTIVE_ARC_ANGLE = -Math.PI / 4;

function CircularHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(270);
  const scrollAccum = useRef(0);
  const isAnimating = useRef(false);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);
  const wrapperRef = useRef(null);

  const totalNodes = hubNodesData.length;
  const activeNode = hubNodesData[activeIndex];

  const [rotationOffset, setRotationOffset] = useState(ACTIVE_ARC_ANGLE);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth <= 768;
      setRadius(isMobile ? 140 : 270);
      setRotationOffset(isMobile ? ACTIVE_ARC_ANGLE : 0);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const goToIndex = (newIndex) => {
    const wrapped = ((newIndex % totalNodes) + totalNodes) % totalNodes;
    setActiveIndex(wrapped);
  };

  const advance = (direction) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    goToIndex(activeIndex + direction);
    setTimeout(() => { isAnimating.current = false; }, 350);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = document.activeElement?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if (isTyping) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        advance(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        advance(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleWheelNative = (event) => {
      if (event.cancelable) event.preventDefault();
      if (isAnimating.current) return;

      scrollAccum.current += event.deltaY;
      const threshold = 60;

      if (scrollAccum.current > threshold) {
        advance(-1);
        scrollAccum.current = 0;
      } else if (scrollAccum.current < -threshold) {
        advance(1);
        scrollAccum.current = 0;
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handlePointerDown = (event) => {
    isDragging.current = true;
    dragStartY.current = event.clientY;
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current || isAnimating.current) return;
    const deltaY = event.clientY - dragStartY.current;
    const threshold = 50;

    if (deltaY > threshold) {
      advance(-1);
      dragStartY.current = event.clientY;
    } else if (deltaY < -threshold) {
      advance(1);
      dragStartY.current = event.clientY;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <motion.div
      className="hub-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
          {hubNodesData.map((node, index) => {
            const offset = index - activeIndex;
            const angle = (offset / totalNodes) * 2 * Math.PI + rotationOffset;

            return (
              <Node
                key={node.id}
                ref={(el) => { nodeRefs.current[index] = el; }}
                label={node.label}
                angle={angle}
                radius={radius}
                isActive={index === activeIndex}
                onClick={() => goToIndex(index)}
                accent={node.accent}
              />
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          className="hub-content-wrapper"
          key={activeNode.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <ContentPanel activeNode={activeNode} />
        </motion.div>
      </AnimatePresence>
      <OrbitRing totalNodes={totalNodes} activeIndex={activeIndex} />
    </motion.div>
  );
}

export default CircularHub;
