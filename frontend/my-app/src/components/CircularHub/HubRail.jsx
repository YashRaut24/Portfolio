import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './HubRail.css';

const ITEM_SPACING = 58;

function HubRail({ nodes, activeIndex, direction, onSelect }) {
    const total = nodes.length;
    const shouldReduceMotion = useReducedMotion();

    const activePointerIdRef = useRef(null);
    const scrollAccum = useRef(0);
    const dragStartY = useRef(0);
    const isDragging = useRef(false);

    // Track which item the user's cursor is currently resting on
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Helper to calculate the next index circularly
    const advance = (step) => {
        let nextIndex = activeIndex + step;
        if (nextIndex >= total) nextIndex = 0;
        if (nextIndex < 0) nextIndex = total - 1;
        onSelect(nextIndex);
    };

    const handleWheel = (e) => {
        scrollAccum.current += e.deltaY;
        if (scrollAccum.current > 60) {
            advance(-1); // Scrolling down moves the rail down
            scrollAccum.current = 0;
        } else if (scrollAccum.current < -60) {
            advance(1); // Scrolling up moves the rail up
            scrollAccum.current = 0;
        }
    };

    // --- MOBILE TOUCH EVENTS (Guarantees smooth mobile swiping) ---
    const handleTouchStart = (e) => {
        isDragging.current = true;
        dragStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        const deltaY = e.touches[0].clientY - dragStartY.current;
        
        if (deltaY > 40) {
            advance(-1); // Swipe down
            dragStartY.current = e.touches[0].clientY;
        } else if (deltaY < -40) {
            advance(1);  // Swipe up
            dragStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
    };

    // --- DESKTOP MOUSE DRAG EVENTS ---
    const handlePointerDown = (e) => {
        if (e.pointerType === 'touch') return; 
        if (activePointerIdRef.current !== null) return;
        
        activePointerIdRef.current = e.pointerId;
        isDragging.current = true;
        dragStartY.current = e.clientY;
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current || e.pointerType === 'touch') return;
        if (activePointerIdRef.current !== e.pointerId) return;
        
        const deltaY = e.clientY - dragStartY.current;
        
        if (deltaY > 40) {
            advance(-1);
            dragStartY.current = e.clientY;
        } else if (deltaY < -40) {
            advance(1); 
            dragStartY.current = e.clientY;
        }
    };

    const handlePointerUp = (e) => {
        if (e.pointerType === 'touch') return;
        if (activePointerIdRef.current !== e.pointerId) return;
        
        activePointerIdRef.current = null;
        isDragging.current = false;
    };

    return (
        <div 
            className="hub-rail"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {nodes.map((node, index) => {
                const Icon = node.icon;

                // shortest circular distance
                let offset = index - activeIndex;

                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                // Logic checks
                const isActive = index === activeIndex;
                const isHovered = index === hoveredIndex;

                return (
                    <motion.button
                        type="button"
                        tabIndex={0}
                        aria-label={node.label}
                        aria-current={isActive ? "true" : undefined}
                        key={node.id}
                        className={`hub-rail-item ${isActive ? 'active' : ''} ${isHovered && !isActive ? 'hovered' : ''}`}
                        style={{
                            '--rail-accent': node.accent,
                        }}
                        animate={{
                            y: offset * ITEM_SPACING,
                            opacity: Math.abs(offset) > 3 ? 0 : (isActive || isHovered) ? 1 : 0.3,
                            scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
                        }}
                        transition={
                            shouldReduceMotion
                                ? { duration: 0 }
                                : {
                                    type: 'spring',
                                    stiffness: 240,
                                    damping: 24,
                                }
                        }
                        whileTap={
                            shouldReduceMotion
                                ? undefined
                                : { scale: 0.9 }
                        }
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onFocus={() => setHoveredIndex(index)}
                        onBlur={() => setHoveredIndex(null)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelect(index);
                            }
                        }}
                        onClick={() => onSelect(index)}
                    >
                        <Icon />
                    </motion.button>
                );
            })}
        </div>
    );
}

export default HubRail;