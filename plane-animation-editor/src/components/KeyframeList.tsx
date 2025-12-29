import React from 'react';
import { Keyframe } from '../types';

interface KeyframeListProps {
  keyframes: Keyframe[];
  selectedKeyframeId: string | null;
  onKeyframeSelect: (keyframeId: string) => void;
  currentTime: number;
}

const KeyframeList: React.FC<KeyframeListProps> = ({
  keyframes,
  selectedKeyframeId,
  onKeyframeSelect,
  currentTime,
}) => {
  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  return (
    <div className="bg-editor-panel h-full overflow-y-auto p-4">
      <h2 className="text-white text-lg font-bold mb-4 border-b border-editor-border pb-2">
        Keyframes ({keyframes.length})
      </h2>

      {keyframes.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          No keyframes yet.
          <br />
          Add your first keyframe to start animating!
        </div>
      ) : (
        <div className="space-y-2">
          {sortedKeyframes.map((kf, index) => {
            const isSelected = kf.id === selectedKeyframeId;
            const isCurrent = Math.abs(kf.time - currentTime) < 0.1;

            return (
              <div
                key={kf.id}
                onClick={() => onKeyframeSelect(kf.id)}
                className={`p-3 rounded cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-editor-accent/20 border-editor-accent'
                    : 'bg-gray-800 border-transparent hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isSelected ? 'bg-editor-accent' : 'bg-gray-600'
                      }`}
                    />
                    <span className="text-white font-medium">
                      Keyframe {index + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-sm font-mono">
                    {kf.time.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">
                    <span className="text-gray-500">Path:</span>{' '}
                    <span className="text-white">{(kf.pathProgress * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Rot Z:</span>{' '}
                    <span className="text-white">{kf.rotationZ.toFixed(0)}°</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">3D:</span>{' '}
                    <span className="text-white">
                      ({kf.rotationX.toFixed(0)}, {kf.rotationY.toFixed(0)})
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Scale:</span>{' '}
                    <span className="text-white">
                      {kf.scaleX > 0 ? '' : '-'}
                      {kf.scaleY > 0 ? '' : '↕'}
                      {kf.scale.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick stats */}
      {keyframes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-editor-border">
          <div className="text-gray-400 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Total keyframes:</span>
              <span className="text-white">{keyframes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="text-white">
                {sortedKeyframes[sortedKeyframes.length - 1].time.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyframeList;
