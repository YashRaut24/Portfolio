import { motion, useMotionValue, useTransform } from 'framer-motion';
import './Cover.css';

function Cover({ onOpen }) {
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-300, 0], [-180, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -120) {
      onOpen();
    }
  };

  return (
    <motion.div
      className="cover"
      style={{ rotateY, x: dragX }}
      drag="x"
      dragConstraints={{ left: -300, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <h1 className="cover-name">Yash</h1>
      <p className="cover-role">AI Engineer & Full-Stack Developer</p>
    </motion.div>
  );
}

export default Cover;