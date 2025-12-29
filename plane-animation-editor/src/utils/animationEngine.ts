import { Keyframe } from '../types';

/**
 * Linear interpolation
 */
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Get interpolated frame state at given time
 */
export function getFrameAtTime(keyframes: Keyframe[], time: number): Keyframe {
  // Handle no keyframes
  if (keyframes.length === 0) {
    return createDefaultKeyframe(time);
  }

  // Handle single keyframe
  if (keyframes.length === 1) {
    return { ...keyframes[0], time };
  }

  // Sort keyframes by time
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  // Before first keyframe
  if (time <= sorted[0].time) {
    return { ...sorted[0], time };
  }

  // After last keyframe
  if (time >= sorted[sorted.length - 1].time) {
    return { ...sorted[sorted.length - 1], time };
  }

  // Find surrounding keyframes
  let k1 = sorted[0];
  let k2 = sorted[1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (time >= sorted[i].time && time <= sorted[i + 1].time) {
      k1 = sorted[i];
      k2 = sorted[i + 1];
      break;
    }
  }

  // Calculate interpolation factor
  const alpha = (time - k1.time) / (k2.time - k1.time);

  // Interpolate all properties
  return {
    id: `interpolated-${time}`,
    time,
    pathProgress: lerp(k1.pathProgress, k2.pathProgress, alpha),
    rotationZ: lerp(k1.rotationZ, k2.rotationZ, alpha),
    rotationX: lerp(k1.rotationX, k2.rotationX, alpha),
    rotationY: lerp(k1.rotationY, k2.rotationY, alpha),
    scaleX: lerp(k1.scaleX, k2.scaleX, alpha),
    scaleY: lerp(k1.scaleY, k2.scaleY, alpha),
    scale: lerp(k1.scale, k2.scale, alpha),
  };
}

/**
 * Create a default keyframe with neutral values
 */
export function createDefaultKeyframe(time: number): Keyframe {
  return {
    id: `kf-${Date.now()}`,
    time,
    pathProgress: 0,
    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,
    scaleX: 1,
    scaleY: 1,
    scale: 1,
  };
}

/**
 * Create a new keyframe based on current interpolated state
 */
export function createKeyframeAtTime(
  existingKeyframes: Keyframe[],
  time: number
): Keyframe {
  const interpolated = getFrameAtTime(existingKeyframes, time);
  return {
    ...interpolated,
    id: `kf-${Date.now()}`,
    time,
  };
}

/**
 * Ensure keyframes are sorted by time
 */
export function sortKeyframes(keyframes: Keyframe[]): Keyframe[] {
  return [...keyframes].sort((a, b) => a.time - b.time);
}

/**
 * Validate keyframe time is unique
 */
export function isTimeUnique(keyframes: Keyframe[], time: number, excludeId?: string): boolean {
  return !keyframes.some(kf => kf.time === time && kf.id !== excludeId);
}
