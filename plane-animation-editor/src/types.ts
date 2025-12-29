export interface Destination {
  id: string;
  name: string;
  region: string;
  coordinates: { x: number; y: number }; // Percentage
}

export interface Keyframe {
  id: string;
  time: number; // 0-100 (percentage of animation duration)

  // Position
  pathProgress: number; // 0-1 (position along path)

  // 2D Rotation
  rotationZ: number; // degrees

  // 3D Transforms
  rotationX: number; // degrees (pitch)
  rotationY: number; // degrees (yaw)

  // Scale and Flip
  scaleX: number; // -1 for horizontal flip, 1 for normal
  scaleY: number; // -1 for vertical flip, 1 for normal
  scale: number; // overall scale multiplier
}

export interface AnimationData {
  version: string;
  duration: number; // total animation duration in seconds
  fps: number; // frames per second for playback
  keyframes: Keyframe[];
}

export interface PlanePosition {
  x: number;
  y: number;
}
