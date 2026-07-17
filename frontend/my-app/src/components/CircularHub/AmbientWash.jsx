import { AnimatePresence, motion } from 'framer-motion';
import './AmbientWash.css';

function AmbientWash({ color }) {
    return (
        <div className="ambient-wash-layer" aria-hidden="true">
            <AnimatePresence mode="wait">
                <motion.div
                    key={color}
                    className="ambient-wash"
                    style={{
                        '--wash-color': color,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                    }}
                />
            </AnimatePresence>
        </div>
    );
}

export default AmbientWash;