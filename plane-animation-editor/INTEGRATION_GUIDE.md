# Integration Guide: Connecting Animation Editor to Main Website

This guide explains how to use the keyframe data from the Plane Animation Editor in your main NIHAR Holidays website.

## Overview

The animation editor creates keyframe data that controls:
- Plane position along the path (pathProgress)
- 2D rotation (rotationZ)
- 3D rotation (rotationX, rotationY)
- Scale and flip (scaleX, scaleY, scale)

You'll integrate this data into your existing `CurvedPath.tsx` component so the plane animates with these custom transforms as the user scrolls.

---

## Step-by-Step Integration

### 1. Export Animation Data

In the animation editor:

1. Create your keyframe animation
2. Click **"Download JSON File"** or **"Copy to Clipboard"**
3. You'll get JSON that looks like this:

```json
{
  "version": "1.0",
  "duration": 10,
  "fps": 60,
  "keyframes": [
    {
      "id": "kf-1",
      "time": 0,
      "pathProgress": 0,
      "rotationZ": 0,
      "rotationX": 0,
      "rotationY": 0,
      "scaleX": 1,
      "scaleY": 1,
      "scale": 1
    },
    {
      "id": "kf-2",
      "time": 50,
      "pathProgress": 0.5,
      "rotationZ": -15,
      "rotationX": 10,
      "rotationY": -5,
      "scaleX": 1,
      "scaleY": 1,
      "scale": 1.2
    }
    // ... more keyframes
  ]
}
```

---

### 2. Add Keyframe Data to Your Project

Open your main project's `constants.ts` file and add the exported data:

```typescript
// constants.ts

// ... existing code ...

export interface PlaneKeyframe {
  id: string;
  time: number;
  pathProgress: number;
  rotationZ: number;
  rotationX: number;
  rotationY: number;
  scaleX: number;
  scaleY: number;
  scale: number;
}

export const PLANE_ANIMATION_KEYFRAMES: PlaneKeyframe[] = [
  // PASTE YOUR EXPORTED KEYFRAMES HERE
  {
    id: "kf-1",
    time: 0,
    pathProgress: 0,
    rotationZ: 0,
    rotationX: 0,
    rotationY: 0,
    scaleX: 1,
    scaleY: 1,
    scale: 1
  },
  // ... rest of your keyframes
];
```

---

### 3. Add Animation Engine to Your Project

Create a new file `utils/animationEngine.ts` in your main project:

```typescript
// utils/animationEngine.ts

import { PlaneKeyframe } from '../constants';

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function getFrameAtTime(
  keyframes: PlaneKeyframe[],
  time: number
): PlaneKeyframe {
  if (keyframes.length === 0) {
    return {
      id: 'default',
      time: 0,
      pathProgress: 0,
      rotationZ: 0,
      rotationX: 0,
      rotationY: 0,
      scaleX: 1,
      scaleY: 1,
      scale: 1,
    };
  }

  if (keyframes.length === 1) {
    return { ...keyframes[0], time };
  }

  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  if (time <= sorted[0].time) {
    return { ...sorted[0], time };
  }

  if (time >= sorted[sorted.length - 1].time) {
    return { ...sorted[sorted.length - 1], time };
  }

  let k1 = sorted[0];
  let k2 = sorted[1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (time >= sorted[i].time && time <= sorted[i + 1].time) {
      k1 = sorted[i];
      k2 = sorted[i + 1];
      break;
    }
  }

  const alpha = (time - k1.time) / (k2.time - k1.time);

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
```

---

### 4. Update types.ts

Add the PlaneKeyframe type if not already in constants:

```typescript
// types.ts

// ... existing interfaces ...

export interface PlaneKeyframe {
  id: string;
  time: number;
  pathProgress: number;
  rotationZ: number;
  rotationX: number;
  rotationY: number;
  scaleX: number;
  scaleY: number;
  scale: number;
}
```

---

### 5. Modify CurvedPath.tsx

Now update your `CurvedPath.tsx` component to use the keyframe data:

```typescript
// components/CurvedPath.tsx

import React, { useMemo, useEffect, useState, useRef } from 'react';
import { DESTINATIONS, PLANE_ANIMATION_KEYFRAMES } from '../constants';
import { getFrameAtTime } from '../utils/animationEngine';

// ... existing interfaces ...

const CurvedPath: React.FC<CurvedPathProps> = ({ scrollProgress, activeIndex }) => {
  // ... existing state ...

  // NEW: Get current keyframe based on scroll progress
  const currentKeyframe = useMemo(() => {
    // Convert scrollProgress (0-1) to time (0-100)
    const time = scrollProgress * 100;
    return getFrameAtTime(PLANE_ANIMATION_KEYFRAMES, time);
  }, [scrollProgress]);

  // NEW: Override pathProgress from keyframe if you want position control
  // Or keep using scrollProgress for position and only use keyframe for transforms
  const effectivePathProgress = currentKeyframe.pathProgress; // Use keyframe position
  // OR: const effectivePathProgress = scrollProgress; // Keep scroll-based position

  // Update plane position calculation to use effectivePathProgress
  const updatePlanePosition = useCallback(() => {
    if (!pathRef.current || pathLength === 0 || !isPathReady) {
      return;
    }

    const path = pathRef.current;
    const clampedProgress = Math.min(Math.max(effectivePathProgress, 0), 1);
    const currentLength = Math.min(clampedProgress * pathLength, pathLength);
    const point = path.getPointAtLength(currentLength);

    // Keep existing angle calculation or override with keyframe
    // Option 1: Use keyframe rotation completely
    const angle = currentKeyframe.rotationZ;

    // Option 2: Add keyframe rotation to path-based rotation
    // const lookAheadDistance = 20;
    // const aheadLength = Math.min(currentLength + lookAheadDistance, pathLength);
    // const aheadPoint = path.getPointAtLength(aheadLength);
    // const dx = aheadPoint.x - point.x;
    // const dy = aheadPoint.y - point.y;
    // const pathAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    // const angle = pathAngle + currentKeyframe.rotationZ;

    setPlanePos({ x: point.x, y: point.y, angle });
  }, [effectivePathProgress, pathLength, isPathReady, currentKeyframe.rotationZ]);

  // ... rest of existing code ...

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full opacity-90"
        style={{
          filter: 'drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.6))',
          perspective: '1000px', // IMPORTANT: Add for 3D effects
        }}
      >
        {/* ... existing path rendering ... */}

        {/* UPDATED: Animated Plane with keyframe transforms */}
        {isPathReady && (
          <g
            transform={`translate(${planePos.x}, ${planePos.y + planeYOffset})`}
            style={{
              transition: 'transform 0.15s ease-out',
              willChange: 'transform',
            }}
          >
            <g
              style={{
                transform: `
                  rotateZ(${currentKeyframe.rotationZ}deg)
                  rotateX(${currentKeyframe.rotationX}deg)
                  rotateY(${currentKeyframe.rotationY}deg)
                  scale(${currentKeyframe.scaleX * currentKeyframe.scale}, ${currentKeyframe.scaleY * currentKeyframe.scale})
                `,
                transformOrigin: 'center',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* Shadow */}
              <ellipse
                cx="0"
                cy={planeSize / 2 + 15}
                rx={planeSize / 3}
                ry={planeSize / 8}
                fill="rgba(0,0,0,0.3)"
                style={{
                  filter: 'blur(4px)',
                  transform: 'translateY(5px)',
                }}
              />

              {/* Plane image */}
              <image
                href="/Images/plane small.png"
                width={planeSize}
                height={planeSize}
                x={-planeSize / 2}
                y={-planeSize / 2}
                className="animate-plane-bounce"
                style={{
                  filter: 'drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.5))',
                }}
              />
            </g>
          </g>
        )}
      </svg>

      {/* ... existing styles ... */}
    </div>
  );
};

export default CurvedPath;
```

---

### 6. Choose Your Integration Approach

You have two options for how to use the keyframe data:

#### **Option A: Full Keyframe Control (Recommended)**

The keyframes control BOTH position and transforms:
- `pathProgress` from keyframe determines position along path
- All rotations and scales from keyframe

```typescript
const effectivePathProgress = currentKeyframe.pathProgress;
const angle = currentKeyframe.rotationZ;
```

**Use when**: You want complete control over the animation in the editor

#### **Option B: Scroll Position + Keyframe Transforms**

Scroll controls position, keyframes only control transforms:
- `scrollProgress` determines position (existing behavior)
- Keyframe adds rotation and 3D effects on top

```typescript
const effectivePathProgress = scrollProgress; // Keep scroll-based position
const angle = pathAngle + currentKeyframe.rotationZ; // Add keyframe rotation to path angle
```

**Use when**: You want to keep the scroll-synchronized position but add custom rotations

---

### 7. Test the Integration

1. Start your main site: `npm run dev`
2. Scroll through the page
3. The plane should now animate with your custom keyframes
4. Check that:
   - Position follows keyframes (if using Option A)
   - Rotations are applied smoothly
   - 3D effects render correctly
   - Scale/flip work as expected

---

## Troubleshooting

### Plane position jumps or glitches

**Problem**: Position interpolation is not smooth
**Solution**:
- Add more keyframes at intermediate positions
- Check that keyframe `time` values are evenly distributed
- Ensure `pathProgress` values increase monotonically (0 → 1)

### 3D rotation not visible

**Problem**: rotationX/Y have no effect
**Solution**:
- Add `perspective: '1000px'` to parent SVG or container
- Ensure `transformStyle: 'preserve-3d'` is on the transformed group
- Check that you're using `<g>` elements, not `<svg>` for transforms

### Plane flips unexpectedly

**Problem**: Horizontal flip logic conflicts with keyframe
**Solution**:
- Remove the old `flipX` state logic from CurvedPath.tsx
- Use only `currentKeyframe.scaleX` for flipping
- Check that scaleX is either 1 or -1 in your keyframes

### Animation is too fast/slow

**Problem**: Scroll-to-time mapping doesn't match
**Solution**:
- Adjust keyframe `time` values (they should span 0-100)
- The `duration` in JSON is for reference; actual speed is scroll-based
- Use more keyframes for slower sections

---

## Advanced Customization

### Easing Functions

For smoother interpolation, replace `lerp` with easing:

```typescript
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpEased(start: number, end: number, t: number): number {
  const easedT = easeInOutCubic(t);
  return start + (end - start) * easedT;
}
```

### Multiple Animation Layers

You can have different keyframe sets for different properties:

```typescript
const rotationKeyframes = PLANE_ROTATION_KEYFRAMES;
const positionKeyframes = PLANE_POSITION_KEYFRAMES;

const rotation = getFrameAtTime(rotationKeyframes, time);
const position = getFrameAtTime(positionKeyframes, time);
```

### Conditional Animations

Apply different animations based on viewport or activeIndex:

```typescript
const keyframeSet = isMobile
  ? PLANE_ANIMATION_MOBILE
  : PLANE_ANIMATION_DESKTOP;

const currentKeyframe = getFrameAtTime(keyframeSet, time);
```

---

## Best Practices

1. **Start Simple**: Begin with 2-3 keyframes, test, then add more
2. **Consistent Timing**: Space keyframes evenly unless you want speed changes
3. **Subtle 3D**: Keep rotationX/Y between -15° to 15° for realism
4. **Test on Mobile**: Check that transforms work on different screen sizes
5. **Version Control**: Save different keyframe exports as you iterate
6. **Performance**: Limit to 10-15 keyframes max for smooth performance

---

## FAQ

**Q: Can I use the same keyframes for different paths?**
A: Yes, but `pathProgress` is path-independent (0-1), so it will work on any path

**Q: How do I animate other properties like opacity?**
A: Add new properties to the Keyframe interface and update the editor

**Q: Can I import existing keyframes into the editor?**
A: Not yet, but you can manually recreate them or extend the editor with import functionality

**Q: Does this work with React Native?**
A: The concept works, but you'll need to adapt the SVG code to React Native SVG components

---

## Next Steps

- Experiment with different rotation values in the editor
- Try creating multiple keyframe sets for different sections
- Add your own custom properties to the keyframe system
- Share your animations by exporting and version controlling the JSON files

For questions or issues, refer to the README.md or create an issue in the project repository.
