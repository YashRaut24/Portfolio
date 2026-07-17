import { motion } from 'framer-motion';
import './HubRail.css';

const ITEM_SPACING = 58;

function HubRail({ nodes, activeIndex, direction, onSelect }) {
    const total = nodes.length;

    return (
        <div className="hub-rail">
            {nodes.map((node, index) => {
                const Icon = node.icon;

                // shortest circular distance
                let offset = index - activeIndex;

                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                return (
                    <motion.button
                        key={node.id}
                        className={`hub-rail-item ${index === activeIndex ? 'active' : ''}`}
                        style={{
                            '--rail-accent': node.accent,
                        }}
                        animate={{
                            y: offset * ITEM_SPACING,
                            opacity: Math.abs(offset) > 3 ? 0 : index === activeIndex ? 1 : 0.3,
                            scale: index === activeIndex ? 1.2 : 1,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 240,
                            damping: 24,
                        }}
                        whileTap={{ scale: 0.9 }}
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