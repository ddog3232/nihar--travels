import React, { useState } from 'react';
import { Keyframe } from '../types';
import { formatAsJSON, downloadJSON, copyToClipboard } from '../utils/exportUtils';

interface ExportPanelProps {
  keyframes: Keyframe[];
  duration: number;
  fps: number;
  onDurationChange: (duration: number) => void;
  onFpsChange: (fps: number) => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  keyframes,
  duration,
  fps,
  onDurationChange,
  onFpsChange,
}) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const jsonString = formatAsJSON(keyframes, duration, fps);

  const handleDownload = () => {
    downloadJSON(jsonString);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(jsonString);
    setCopyStatus(success ? 'success' : 'error');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div className="bg-editor-panel h-full overflow-y-auto p-4">
      <h2 className="text-white text-lg font-bold mb-4 border-b border-editor-border pb-2">
        Export Animation
      </h2>

      {/* Settings */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="text-white text-sm font-medium block mb-2">
            Animation Duration (seconds)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-editor-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="text-white text-sm font-medium block mb-2">
            Frames Per Second (FPS)
          </label>
          <select
            value={fps}
            onChange={(e) => onFpsChange(Number(e.target.value))}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-editor-accent focus:outline-none"
          >
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
            <option value={120}>120 FPS</option>
          </select>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="space-y-2 mb-6">
        <button
          onClick={handleDownload}
          disabled={keyframes.length === 0}
          className={`w-full py-3 rounded font-medium transition-colors ${
            keyframes.length === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          💾 Download JSON File
        </button>

        <button
          onClick={handleCopy}
          disabled={keyframes.length === 0}
          className={`w-full py-3 rounded font-medium transition-colors ${
            keyframes.length === 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : copyStatus === 'success'
              ? 'bg-green-600 text-white'
              : copyStatus === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-editor-accent hover:bg-blue-600 text-white'
          }`}
        >
          {copyStatus === 'success'
            ? '✓ Copied to Clipboard!'
            : copyStatus === 'error'
            ? '✗ Failed to Copy'
            : '📋 Copy to Clipboard'}
        </button>
      </div>

      {/* JSON Preview */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-2">JSON Preview</h3>
        <div className="bg-gray-900 rounded p-3 max-h-96 overflow-auto">
          <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
            {keyframes.length === 0 ? '// Add keyframes to see preview' : jsonString}
          </pre>
        </div>
      </div>

      {/* Integration Instructions */}
      <div className="mt-6 p-4 bg-gray-900 rounded border border-gray-700">
        <h3 className="text-white text-sm font-semibold mb-2">
          📖 Integration Guide
        </h3>
        <ol className="text-gray-400 text-xs space-y-2 list-decimal list-inside">
          <li>Export JSON using the buttons above</li>
          <li>
            Add the exported data to{' '}
            <code className="text-green-400 bg-gray-800 px-1 rounded">
              constants.ts
            </code>
          </li>
          <li>
            Import in{' '}
            <code className="text-green-400 bg-gray-800 px-1 rounded">
              CurvedPath.tsx
            </code>
          </li>
          <li>
            Use{' '}
            <code className="text-green-400 bg-gray-800 px-1 rounded">
              getFrameAtTime()
            </code>{' '}
            to interpolate
          </li>
          <li>Apply transforms to plane element</li>
        </ol>
      </div>

      {/* Stats */}
      <div className="mt-4 p-3 bg-gray-900 rounded">
        <div className="text-gray-400 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Keyframes:</span>
            <span className="text-white">{keyframes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total frames:</span>
            <span className="text-white">{duration * fps}</span>
          </div>
          <div className="flex justify-between">
            <span>JSON size:</span>
            <span className="text-white">
              {(new Blob([jsonString]).size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
