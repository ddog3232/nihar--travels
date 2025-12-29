import { AnimationData, Keyframe } from '../types';

/**
 * Format animation data as JSON string
 */
export function formatAsJSON(
  keyframes: Keyframe[],
  duration: number = 10,
  fps: number = 60
): string {
  const data: AnimationData = {
    version: '1.0',
    duration,
    fps,
    keyframes: keyframes.sort((a, b) => a.time - b.time),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Download JSON file
 */
export function downloadJSON(jsonString: string, filename: string = 'plane-animation.json'): void {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Parse and validate imported JSON
 */
export function parseAnimationJSON(jsonString: string): AnimationData | null {
  try {
    const data = JSON.parse(jsonString);

    // Basic validation
    if (!data.keyframes || !Array.isArray(data.keyframes)) {
      throw new Error('Invalid keyframes array');
    }

    // Validate each keyframe has required properties
    for (const kf of data.keyframes) {
      if (
        typeof kf.time !== 'number' ||
        typeof kf.pathProgress !== 'number' ||
        typeof kf.rotationZ !== 'number'
      ) {
        throw new Error('Invalid keyframe properties');
      }
    }

    return data;
  } catch (err) {
    console.error('Failed to parse JSON:', err);
    return null;
  }
}
