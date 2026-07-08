import { useState } from 'react';
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
    <div className="hub-container">
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
      <ContentPanel activeNode={activeNode} />
    </div>
  );
}

export default CircularHub;