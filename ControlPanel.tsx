import { useSpaceConfig, ViewMode } from "@/lib/stores/useSpaceConfig";

interface ControlPanelProps {
  onScreenshot?: () => void;
}

export function ControlPanel({ onScreenshot }: ControlPanelProps) {
  const {
    viewMode,
    setViewMode,
    timeSpeed,
    setTimeSpeed,
    isPaused,
    togglePause,
    showOrbits,
    toggleOrbits,
    showLabels,
    toggleLabels,
    showStarfield,
    toggleStarfield,
  } = useSpaceConfig();

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="control-panel">
      <h2>Space Simulator</h2>
      
      <div className="section">
        <h3>View Mode</h3>
        <div className="button-group">
          <button
            className={viewMode === "solar" ? "active" : ""}
            onClick={() => handleModeChange("solar")}
          >
            Solar System
          </button>
          <button
            className={viewMode === "galaxy" ? "active" : ""}
            onClick={() => handleModeChange("galaxy")}
          >
            Galaxy View
          </button>
          <button
            className={viewMode === "blackhole" ? "active" : ""}
            onClick={() => handleModeChange("blackhole")}
          >
            Focus Black Hole
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Time Control</h3>
        <div className="time-controls">
          <button 
            className={`play-pause ${isPaused ? "" : "active"}`}
            onClick={togglePause}
          >
            {isPaused ? "▶ Play" : "⏸ Pause"}
          </button>
          <div className="slider-container">
            <label>Speed: {timeSpeed.toFixed(1)}x</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={timeSpeed}
              onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Visibility</h3>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={toggleOrbits}
            />
            <span>Show Orbit Paths</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={toggleLabels}
            />
            <span>Show Labels</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showStarfield}
              onChange={toggleStarfield}
            />
            <span>Show Starfield</span>
          </label>
        </div>
      </div>

      <div className="section">
        <h3>Actions</h3>
        <button className="screenshot-btn" onClick={onScreenshot}>
          📷 Take Screenshot
        </button>
      </div>

      <div className="section info">
        <h3>Controls</h3>
        <ul>
          <li>🖱️ Drag to rotate</li>
          <li>🔍 Scroll to zoom</li>
          <li>⌨️ Right-click to pan</li>
          <li>🔘 Click objects for info</li>
        </ul>
      </div>

      <style>{`
        .control-panel {
          position: fixed;
          top: 20px;
          left: 20px;
          width: 280px;
          background: rgba(10, 10, 30, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }

        .control-panel::-webkit-scrollbar {
          width: 6px;
        }

        .control-panel::-webkit-scrollbar-track {
          background: transparent;
        }

        .control-panel::-webkit-scrollbar-thumb {
          background: rgba(100, 150, 255, 0.3);
          border-radius: 3px;
        }

        .control-panel h2 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: #88aaff;
          text-align: center;
          letter-spacing: 1px;
        }

        .section {
          margin-bottom: 20px;
        }

        .section h3 {
          margin: 0 0 12px 0;
          font-size: 13px;
          font-weight: 500;
          color: #8899aa;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .button-group button {
          background: rgba(40, 50, 80, 0.6);
          border: 1px solid rgba(100, 120, 180, 0.3);
          color: #aabbcc;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .button-group button:hover {
          background: rgba(60, 80, 120, 0.6);
          border-color: rgba(100, 150, 220, 0.5);
          color: #ffffff;
        }

        .button-group button.active {
          background: linear-gradient(135deg, #4466aa, #5577cc);
          border-color: #6688dd;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(68, 102, 170, 0.3);
        }

        .time-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .play-pause {
          background: rgba(40, 50, 80, 0.6);
          border: 1px solid rgba(100, 120, 180, 0.3);
          color: #aabbcc;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .play-pause:hover {
          background: rgba(60, 80, 120, 0.6);
        }

        .play-pause.active {
          background: linear-gradient(135deg, #44aa66, #55cc77);
          border-color: #66dd88;
          color: #ffffff;
        }

        .slider-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-container label {
          font-size: 12px;
          color: #8899aa;
        }

        .slider-container input[type="range"] {
          width: 100%;
          height: 6px;
          background: rgba(60, 80, 120, 0.4);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .slider-container input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #5588cc;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 13px;
          color: #aabbcc;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #5588cc;
          cursor: pointer;
        }

        .screenshot-btn {
          width: 100%;
          background: rgba(60, 50, 100, 0.6);
          border: 1px solid rgba(150, 100, 200, 0.3);
          color: #ccbbee;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .screenshot-btn:hover {
          background: rgba(80, 60, 140, 0.6);
          border-color: rgba(180, 120, 255, 0.5);
          color: #ffffff;
        }

        .info ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .info li {
          font-size: 12px;
          color: #7788aa;
          padding: 4px 0;
        }

        @media (max-width: 768px) {
          .control-panel {
            width: 240px;
            padding: 16px;
            top: 10px;
            left: 10px;
          }
        }
      `}</style>
    </div>
  );
}
