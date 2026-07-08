import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Node from './Node';
import ContentPanel from './ContentPanel';
import { hubNodesData } from '../../data/hubNodes';
import './CircularHub.css';

function CircularHub() {
  const [activeNodeId, setActiveNodeId] = useState(hubNodesData[0].id);

  const radius = 180;
  const totalNodes = hubNodesData.length;

  const activeNode = hubNodesData.find((node) => node.id === activeNodeId);

  return (
    <motion.div
      className="hub-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hub-circle-wrapper">
        <div className="hub-circle">
          {hubNodesData.map((node, index) => {
            const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
            return (
              <Node
                key={node.id}
                label={node.label}
                angle={angle}
                radius={radius}
                isActive={node.id === activeNodeId}
                onClick={() => setActiveNodeId(node.id)}
              />
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNodeId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <ContentPanel activeNode={activeNode} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default CircularHub;