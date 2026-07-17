import { motion } from 'framer-motion';
import './HubRail.css';

function HubRail({ nodes, activeIndex, onSelect }) {
    return (
        <div className="hub-rail">
            {nodes.map((node, index) => {
                const Icon = node.icon;

                return (
                    <motion.button
                        key={node.id}
                        className={`hub-rail-item ${index === activeIndex ? 'active' : ''}`}
                        style={{
                            '--rail-accent': node.accent,
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