import React, { useState, useEffect, useCallback } from 'react';
import PathCanvas from './components/PathCanvas';
import Timeline from './components/Timeline';
import ControlPanel from './components/ControlPanel';
import KeyframeList from './components/KeyframeList';
import ExportPanel from './components/ExportPanel';
import { Keyframe } from './types';
import {
  getFrameAtTime,
  createDefaultKeyframe,
  createKeyframeAtTime,
  sortKeyframes,
} from './utils/animationEngine';

const INITIAL_KEYFRAME = createDefaultKeyframe(0);

function App() {
  // Animation state
  const [keyframes, setKeyframes] = useState<Keyframe[]>([INITIAL_KEYFRAME]);
  const [currentTime, setCurrentTime] = useState(0); // 0-100
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(INITIAL_KEYFRAME.id);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Export settings
  const [duration, setDuration] = useState(10); // seconds
  const [fps, setFps] = useState(60);

  // Get current frame (interpolated or selected keyframe)
  const currentFrame = getFrameAtTime(keyframes, currentTime);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + (playbackSpeed * 0.5); // Increment based on speed
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle frame update from control panel
  const handleFrameUpdate = useCallback(
    (updates: Partial<Keyframe>) => {
      if (!selectedKeyframeId) {
        // No keyframe selected - user should add one first
        console.warn('No keyframe selected. Add a keyframe first.');
        return;
      }

      // Update the selected keyframe
      setKeyframes((prev) =>
        prev.map((kf) =>
          kf.id === selectedKeyframeId ? { ...kf, ...updates } : kf
        )
      );

      // If updating pathProgress, sync the current time to match
      if (updates.pathProgress !== undefined) {
        // Find the updated keyframe and set currentTime to its position
        const updatedKf = keyframes.find(kf => kf.id === selectedKeyframeId);
        if (updatedKf) {
          setCurrentTime(updatedKf.time);
        }
      }
    },
    [selectedKeyframeId, keyframes]
  );

  // Add keyframe at current time
  const handleAddKeyframe = useCallback(() => {
    const newKeyframe = createKeyframeAtTime(keyframes, currentTime);
    setKeyframes((prev) => sortKeyframes([...prev, newKeyframe]));
    setSelectedKeyframeId(newKeyframe.id);
  }, [keyframes, currentTime]);

  // Delete selected keyframe
  const handleDeleteKeyframe = useCallback(() => {
    if (!selectedKeyframeId || keyframes.length <= 1) return;

    const index = keyframes.findIndex((kf) => kf.id === selectedKeyframeId);
    setKeyframes((prev) => prev.filter((kf) => kf.id !== selectedKeyframeId));

    // Select next or previous keyframe
    const newIndex = Math.max(0, index - 1);
    setSelectedKeyframeId(keyframes[newIndex]?.id || null);
  }, [selectedKeyframeId, keyframes]);

  // Handle keyframe selection
  const handleKeyframeSelect = useCallback((keyframeId: string) => {
    setSelectedKeyframeId(keyframeId);
    const kf = keyframes.find((k) => k.id === keyframeId);
    if (kf) {
      setCurrentTime(kf.time);
    }
  }, [keyframes]);

  return (
    <div className="h-screen w-screen bg-editor-dark flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-editor-panel border-b border-editor-border px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          ✈️ Plane Animation Editor
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Create and export keyframe animations for NIHAR Holidays
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 border-r border-editor-border flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <ControlPanel
              currentFrame={currentFrame}
              onFrameUpdate={handleFrameUpdate}
              onAddKeyframe={handleAddKeyframe}
              onDeleteKeyframe={handleDeleteKeyframe}
              canDelete={keyframes.length > 1 && selectedKeyframeId !== null}
            />
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <PathCanvas
              currentFrame={currentFrame}
              onProgressChange={(progress) => setCurrentTime(progress * 100)}
            />
          </div>

          {/* Timeline */}
          <Timeline
            keyframes={keyframes}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            onKeyframeClick={handleKeyframeSelect}
            selectedKeyframeId={selectedKeyframeId}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying((prev) => !prev)}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
          />
        </div>

        {/* Right Sidebar - Keyframes & Export */}
        <div className="w-80 border-l border-editor-border flex flex-col">
          <div className="flex-1 overflow-y-auto border-b border-editor-border">
            <KeyframeList
              keyframes={keyframes}
              selectedKeyframeId={selectedKeyframeId}
              onKeyframeSelect={handleKeyframeSelect}
              currentTime={currentTime}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ExportPanel
              keyframes={keyframes}
              duration={duration}
              fps={fps}
              onDurationChange={setDuration}
              onFpsChange={setFps}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
