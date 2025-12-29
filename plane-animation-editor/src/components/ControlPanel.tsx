import React from 'react';
import { Keyframe } from '../types';

interface ControlPanelProps {
  currentFrame: Keyframe;
  onFrameUpdate: (updates: Partial<Keyframe>) => void;
  onAddKeyframe: () => void;
  onDeleteKeyframe: () => void;
  canDelete: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  currentFrame,
  onFrameUpdate,
  onAddKeyframe,
  onDeleteKeyframe,
  canDelete,
}) => {
  const SliderControl = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = '',
    defaultValue,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    defaultValue?: number;
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
      const newValue = Number((e.target as HTMLInputElement).value);
      onChange(newValue);
    };

    const resetValue = defaultValue !== undefined ? defaultValue : (min + max) / 2;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-white text-sm font-medium">{label}</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-mono">
              {value.toFixed(step < 1 ? 2 : 0)}
              {unit}
            </span>
            <button
              onClick={() => onChange(resetValue)}
              className="text-xs px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              title={`Reset to ${resetValue}${unit}`}
            >
              ↺
            </button>
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onInput={handleChange}
          onMouseDown={(e) => e.currentTarget.focus()}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-editor-accent slider-smooth"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    );
  };

  const FlipButtons = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="mb-4">
      <label className="text-white text-sm font-medium block mb-2">{label}</label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(-1)}
          className={`flex-1 py-2 rounded ${value === -1 ? 'bg-editor-accent text-white' : 'bg-gray-700 text-gray-300'
            } hover:bg-opacity-80`}
        >
          Flipped (-1)
        </button>
        <button
          onClick={() => onChange(1)}
          className={`flex-1 py-2 rounded ${value === 1 ? 'bg-editor-accent text-white' : 'bg-gray-700 text-gray-300'
            } hover:bg-opacity-80`}
        >
          Normal (1)
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-editor-panel h-full overflow-y-auto p-4">
      <h2 className="text-white text-lg font-bold mb-4 border-b border-editor-border pb-2">
        Keyframe Properties
      </h2>

      {/* Position Section */}
      <div className="mb-6">
        <h3 className="text-editor-accent text-sm font-semibold mb-3 uppercase tracking-wide">
          Position
        </h3>
        <SliderControl
          label="Path Progress"
          value={currentFrame.pathProgress * 100}
          onChange={(val) => onFrameUpdate({ pathProgress: val / 100 })}
          min={0}
          max={100}
          step={0.1}
          unit="%"
          defaultValue={0}
        />
      </div>

      {/* 2D Rotation Section */}
      <div className="mb-6">
        <h3 className="text-editor-accent text-sm font-semibold mb-3 uppercase tracking-wide">
          2D Rotation
        </h3>
        <SliderControl
          label="Rotation Z (Roll)"
          value={currentFrame.rotationZ}
          onChange={(val) => onFrameUpdate({ rotationZ: val })}
          min={-180}
          max={180}
          step={1}
          unit="°"
          defaultValue={0}
        />
      </div>

      {/* 3D Rotation Section */}
      <div className="mb-6">
        <h3 className="text-editor-accent text-sm font-semibold mb-3 uppercase tracking-wide">
          3D Transforms
        </h3>
        <SliderControl
          label="Rotation X (Pitch)"
          value={currentFrame.rotationX}
          onChange={(val) => onFrameUpdate({ rotationX: val })}
          min={-180}
          max={180}
          step={1}
          unit="°"
          defaultValue={0}
        />
        <SliderControl
          label="Rotation Y (Yaw)"
          value={currentFrame.rotationY}
          onChange={(val) => onFrameUpdate({ rotationY: val })}
          min={-180}
          max={180}
          step={1}
          unit="°"
          defaultValue={0}
        />
      </div>

      {/* Scale Section */}
      <div className="mb-6">
        <h3 className="text-editor-accent text-sm font-semibold mb-3 uppercase tracking-wide">
          Scale & Flip
        </h3>
        <FlipButtons
          label="Horizontal Flip (Scale X)"
          value={currentFrame.scaleX}
          onChange={(val) => onFrameUpdate({ scaleX: val })}
        />
        <FlipButtons
          label="Vertical Flip (Scale Y)"
          value={currentFrame.scaleY}
          onChange={(val) => onFrameUpdate({ scaleY: val })}
        />
        <SliderControl
          label="Overall Scale"
          value={currentFrame.scale}
          onChange={(val) => onFrameUpdate({ scale: val })}
          min={0.1}
          max={3}
          step={0.1}
          unit="x"
          defaultValue={1}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-2">
        <button
          onClick={onAddKeyframe}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
        >
          + Add Keyframe at Current Time
        </button>
        <button
          onClick={onDeleteKeyframe}
          disabled={!canDelete}
          className={`w-full py-3 rounded font-medium transition-colors ${canDelete
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          Delete Selected Keyframe
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onFrameUpdate({
            rotationZ: 0,
            rotationX: 0,
            rotationY: 0,
            scaleX: 1,
            scaleY: 1,
            scale: 1,
          })
        }
        className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
      >
        Reset Transforms
      </button>
    </div>
  );
};

export default ControlPanel;
