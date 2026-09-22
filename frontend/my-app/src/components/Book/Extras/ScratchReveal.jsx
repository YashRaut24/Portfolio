import { useRef, useEffect, useState } from 'react';
import './ScratchReveal.css';

function ScratchReveal() {
  const revealRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reveal = revealRef.current;
    const canvas = canvasRef.current;
    if (!reveal || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const resize = () => {
      const rect = reveal.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = '#3b3b3b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e8e4da';
      ctx.textAlign = 'center';
      ctx.font = '600 14px "Kalam", cursive';
      ctx.fillText('Scratch Me!', canvas.width / 2, canvas.height / 2 - 6);
      ctx.font = '400 11px "Kalam", cursive';
      ctx.fillText('reveal a note', canvas.width / 2, canvas.height / 2 + 14);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(reveal);
    return () => observer.disconnect();
  }, []);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 36;
    ctx.beginPath();
    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPoint.current = { x, y };

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 4 * 10) {
      sampled++;
      if (data[i] === 0) cleared++;
    }
    if (sampled > 0 && cleared / sampled > 0.72 && !revealed) {
      setRevealed(true);
    }
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const handleDown = (e) => { isDrawing.current = true; const { x, y } = getPos(e); scratch(x, y); };
  const handleMove = (e) => { if (!isDrawing.current) return; const { x, y } = getPos(e); scratch(x, y); };
  const handleUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div ref={revealRef} className={`scratch-reveal ${revealed ? 'scratch-reveal-done' : ''}`}>
      <div className="scratch-reveal-message">
        <p>A little note for you...</p>
        <span>💛</span>
      </div>
      <canvas
        ref={canvasRef}
        className="scratch-reveal-canvas"
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />
    </div>
  );
}

export default ScratchReveal;