import { Destination, PlanePosition } from '../types';

/**
 * Generate SVG path data from destinations
 * Same logic as CurvedPath.tsx from the main site
 */
export function generatePathData(
  destinations: Destination[],
  width: number,
  height: number
): string {
  const getX = (p: number) => (p / 100) * width;
  const getY = (p: number) => (p / 100) * height;

  if (destinations.length === 0) return '';

  let d = `M ${getX(destinations[0].coordinates.x)} ${getY(destinations[0].coordinates.y)}`;

  for (let i = 0; i < destinations.length - 1; i++) {
    const p1 = destinations[i].coordinates;
    const p2 = destinations[i + 1].coordinates;

    const x1 = getX(p1.x);
    const y1 = getY(p1.y);
    const x2 = getX(p2.x);
    const y2 = getY(p2.y);

    const cp1y = y1 + (y2 - y1) / 2;
    const cp2y = y1 + (y2 - y1) / 2;

    d += ` C ${x1} ${cp1y}, ${x2} ${cp2y}, ${x2} ${y2}`;
  }
  return d;
}

/**
 * Get position along path at given progress (0-1)
 */
export function getPositionAtProgress(
  pathElement: SVGPathElement | null,
  progress: number
): PlanePosition {
  if (!pathElement) {
    return { x: 0, y: 0 };
  }

  const pathLength = pathElement.getTotalLength();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const currentLength = clampedProgress * pathLength;
  const point = pathElement.getPointAtLength(currentLength);

  return { x: point.x, y: point.y };
}

/**
 * Get path length
 */
export function getPathLength(pathElement: SVGPathElement | null): number {
  if (!pathElement) return 0;
  return pathElement.getTotalLength();
}
