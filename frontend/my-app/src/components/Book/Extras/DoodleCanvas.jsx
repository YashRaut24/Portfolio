import { useRef, useState, useEffect, useCallback } from 'react';
import './DoodleCanvas.css';

const STORAGE_KEY = 'secretPageDoodleHistory';
const MAX_HISTORY = 6;

function DoodleCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const strokes = useRef([]);
  const [tool, setTool] = useState('pen');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try { return JSON.parse(saved); } catch { return []; }
  });
  const [selectedDoodle, setSelectedDoodle] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = width;
      canvas.height = height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return () => observer.disconnect();
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const startStroke = (e) => {
    isDrawing.current = true;
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = tool === 'eraser' ? 18 : 2.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    strokes.current.push({ tool, points: [{ x, y }] });
  };

  const drawStroke = (e) => {
    if (!isDrawing.current) return;
    const { x, y } = getPos(e);
    const ctx = ctxRef.current;
    ctx.lineTo(x, y);
    ctx.stroke();
    const current = strokes.current[strokes.current.length - 1];
    if (current) current.points.push({ x, y });
  };

  const endStroke = () => { isDrawing.current = false; };

  const redrawFromStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.current.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = stroke.tool === 'eraser' ? 18 : 2.4;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  const handleUndo = () => { strokes.current.pop(); redrawFromStrokes(); };

  const handleClear = () => {
    strokes.current = [];
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const thumb = canvas.toDataURL('image/png');
    const next = [thumb, ...history].slice(0, MAX_HISTORY);
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const deleteDoodle = (indexToDelete) => {
    const next = history.filter((_, i) => i !== indexToDelete);
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (selectedDoodle && selectedDoodle.index === indexToDelete) {
      setSelectedDoodle(null);
    }
  };

  const downloadDoodle = (src, index) => {
    const image = new Image();
    image.onload = () => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = image.naturalWidth;
      exportCanvas.height = image.naturalHeight;
      const exportContext = exportCanvas.getContext('2d');

      exportContext.fillStyle = '#fff';
      exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      exportContext.drawImage(image, 0, 0);

      const link = document.createElement('a');
      link.href = exportCanvas.toDataURL('image/png');
      link.download = `doodle-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    image.src = src;
  };

  return (
    <div className="doodle-canvas-wrap">
      <div className="doodle-rail" aria-hidden="true">
        <span>Doodle It</span>
      </div>
      <div className="doodle-toolbar">
        <button className={`doodle-tool-btn ${tool === 'pen' ? 'doodle-tool-active' : ''}`} onClick={() => setTool('pen')} aria-label="Pen">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 20L5 15L16 4L20 8L9 19L4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        </button>
        <button className={`doodle-tool-btn ${tool === 'eraser' ? 'doodle-tool-active' : ''}`} onClick={() => setTool('eraser')} aria-label="Eraser">
          <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="12" width="14" height="8" rx="1.5" transform="rotate(-15 12 16)" stroke="currentColor" strokeWidth="1.6" /></svg>
        </button>
        <button className="doodle-tool-btn" onClick={handleUndo} aria-label="Undo">
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 9H14C18 9 21 12 21 16C21 20 18 20 18 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
        <button className="doodle-tool-btn" onClick={handleClear} aria-label="Clear">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 7H19M9 7V4H15V7M7 7L8 20H16L17 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className="doodle-tool-btn" onClick={handleSave} aria-label="Save">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 4H16L19 7V20H5V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M8 4V9H15V4" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="doodle-canvas"
        onMouseDown={startStroke}
        onMouseMove={drawStroke}
        onMouseUp={endStroke}
        onMouseLeave={endStroke}
        onTouchStart={startStroke}
        onTouchMove={drawStroke}
        onTouchEnd={endStroke}
      />

      {history.length > 0 && (
        <div className="doodle-history">
          <span className="doodle-history-label">Small Doodles. Big Connections. :)</span>
          <div className="doodle-history-strip">
            {history.map((src, i) => (
              <div key={i} className="doodle-history-item">
                <img src={src} alt={`Doodle ${i + 1}`} className="doodle-history-thumb" />
                <div className="doodle-history-actions">
                  <button type="button" onClick={() => setSelectedDoodle({ src, index: i })} aria-label={`View doodle ${i + 1}`} title="View">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M2.5 12C4.8 7.8 8 5.5 12 5.5S19.2 7.8 21.5 12C19.2 16.2 16 18.5 12 18.5S4.8 16.2 2.5 12Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </button>
                  <button type="button" onClick={() => downloadDoodle(src, i)} aria-label={`Download doodle ${i + 1}`} title="Download">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M12 3V15M7.5 11L12 15.5L16.5 11M4 20H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button type="button" className="doodle-btn-delete" onClick={() => deleteDoodle(i)} aria-label={`Delete doodle ${i + 1}`} title="Delete">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDoodle && (
        <div className="doodle-preview-backdrop" role="presentation" onClick={() => setSelectedDoodle(null)}>
          <div className="doodle-preview-modal" role="dialog" aria-modal="true" aria-label="Doodle preview" onClick={(event) => event.stopPropagation()}>
            <div className="doodle-preview-actions">
              <button type="button" onClick={() => downloadDoodle(selectedDoodle.src, selectedDoodle.index)} aria-label="Download doodle as PNG" title="Download">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 3V15M7.5 11L12 15.5L16.5 11M4 20H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="doodle-btn-delete" onClick={() => deleteDoodle(selectedDoodle.index)} aria-label="Delete doodle" title="Delete">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={() => setSelectedDoodle(null)} aria-label="Close doodle preview" title="Close">×</button>
            </div>
            <img src={selectedDoodle.src} alt="Selected doodle" className="doodle-preview-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DoodleCanvas;