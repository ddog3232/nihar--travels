import React, { useState, useRef, useEffect } from 'react';
import { Keyframe } from '../types';

interface TimelineProps {
  keyframes: Keyframe[];
  currentTime: number;
  onTimeChange: (time: number) => void;
  onKeyframeClick: (keyframeId: string) => void;
  selectedKeyframeId: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  keyframes,
  currentTime,
  onTimeChange,
  onKeyframeClick,
  selectedKeyframeId,
  isPlaying,
  onPlayPause,
  playbackSpeed,
  onSpeedChange,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateTimeFromMouse(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateTimeFromMouse(e as any);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateTimeFromMouse = (e: React.MouseEvent | MouseEvent) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onTimeChange(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Add wheel scroll support
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newTime = Math.max(0, Math.min(100, currentTime + delta));
    onTimeChange(newTime);
  };

  const speeds = [0.25, 0.5, 1, 2];

  return (
    <div className="bg-editor-panel border-t border-editor-border p-4">
      <div className="flex items-center gap-4 mb-3">
        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTimeChange(0)}
            className="px-3 py-1 bg-editor-dark hover:bg-gray-700 rounded text-white text-sm"
            title="Reset to start"
          >
            ⏮
          </button>
          <button
            onClick={onPlayPause}
            className="px-4 py-1 bg-editor-accent hover:bg-blue-600 rounded text-white font-medium"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => onTimeChange(100)}
            className="px-3 py-1 bg-editor-dark hover:bg-gray-700 rounded text-white text-sm"
            title="Jump to end"
          >
            ⏭
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-editor-dark text-white px-2 py-1 rounded text-sm"
          >
            {speeds.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>

        {/* Time display */}
        <div className="ml-auto text-white font-mono text-sm">
          {currentTime.toFixed(1)}%
        </div>
      </div>

      {/* Timeline track */}
      <div
        ref={timelineRef}
        className="relative h-12 bg-gray-800 rounded cursor-pointer"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Timeline background with tick marks */}
        <div className="absolute inset-0 flex">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="absolute h-full border-l border-gray-700"
              style={{ left: `${tick}%` }}
            >
              <span className="absolute top-0 -translate-x-1/2 text-gray-500 text-xs mt-1">
                {tick}%
              </span>
            </div>
          ))}
        </div>

        {/* Keyframe markers */}
        {keyframes.map((kf) => (
          <div
            key={kf.id}
            className={`absolute top-0 bottom-0 w-2 cursor-pointer transition-all ${
              kf.id === selectedKeyframeId
                ? 'bg-yellow-400 scale-125'
                : 'bg-editor-accent hover:bg-blue-400'
            }`}
            style={{ left: `${kf.time}%`, transform: 'translateX(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onKeyframeClick(kf.id);
            }}
            title={`Keyframe at ${kf.time.toFixed(1)}%`}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-xs whitespace-nowrap">
              {kf.id === selectedKeyframeId && `KF ${kf.time.toFixed(0)}%`}
            </div>
          </div>
        ))}

        {/* Current time scrubber */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-red-500 pointer-events-none"
          style={{ left: `${currentTime}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-2 text-gray-500 text-xs">
        Space: Play/Pause • Click timeline to seek • Click markers to select keyframe
      </div>
    </div>
  );
};

export default Timeline;
