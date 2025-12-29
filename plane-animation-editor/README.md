# Plane Animation Editor

A standalone web application for creating and editing keyframe animations for the plane in the NIHAR Holidays website.

## Features

- **Visual Path Canvas**: See the plane animate along the same curved path as your main website
- **Keyframe Timeline**: Scrubber with play/pause controls for previewing animations
- **Full Transform Controls**:
  - Position along path (0-100%)
  - 2D Rotation (Z-axis)
  - 3D Transforms (X/Y rotation for pitch and yaw)
  - Scale and flip (horizontal/vertical mirroring)
- **Export Options**: Download JSON or copy to clipboard
- **Live Preview**: See changes in real-time as you adjust properties

## Getting Started

### Installation

```bash
cd plane-animation-editor
npm install
```

### Run Development Server

```bash
npm run dev
```

The editor will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## How to Use

### 1. Create Animation

1. The editor starts with one keyframe at 0%
2. Use the **Timeline** scrubber to move to a different time
3. Adjust the **Control Panel** sliders to set desired transforms:
   - **Path Progress**: Position along the curved path
   - **Rotation Z**: Roll angle of the plane
   - **Rotation X/Y**: 3D pitch and yaw
   - **Scale X/Y**: Flip horizontally or vertically
   - **Overall Scale**: Resize the plane
4. Click **"+ Add Keyframe at Current Time"** to save this position
5. Repeat steps 2-4 to create more keyframes
6. Click **Play** to preview the animation

### 2. Edit Keyframes

- **Select a keyframe**: Click on the blue markers in the timeline or select from the Keyframe List
- **Modify properties**: Use the Control Panel sliders
- **Delete keyframe**: Select it and click "Delete Selected Keyframe"
- **Jump to keyframe**: Click on keyframe in the list or timeline

### 3. Export Animation

1. Set **Animation Duration** (in seconds) - this will be mapped to scroll duration in your main site
2. Set **FPS** (frames per second) - higher = smoother
3. Click **"Download JSON File"** or **"Copy to Clipboard"**
4. Follow the integration guide below

## Integration with Main Website

### Step 1: Add Keyframe Data to Your Project

1. Export the animation JSON from the editor
2. Open `constants.ts` in your main NIHAR Holidays project
3. Add the exported data:

```typescript
// In constants.ts
export const PLANE_ANIMATION_KEYFRAMES = {
  "version": "1.0",
  "duration": 10,
  "fps": 60,
  "keyframes": [
    // ... paste exported keyframes here
  ]
};
```

### Step 2: Import Animation Engine Utility

Copy the `getFrameAtTime` function from the editor to your main project:

```typescript
// Add to utils/animationEngine.ts in your main project
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function getFrameAtTime(keyframes: any[], time: number) {
  // Copy implementation from plane-animation-editor/src/utils/animationEngine.ts
  // ... (see the full implementation in that file)
}
```

### Step 3: Update CurvedPath.tsx

Modify `CurvedPath.tsx` to use the keyframe data:

```typescript
import { getFrameAtTime } from '../utils/animationEngine';
import { PLANE_ANIMATION_KEYFRAMES } from '../constants';

// Inside CurvedPath component:
const currentFrame = useMemo(() => {
  return getFrameAtTime(
    PLANE_ANIMATION_KEYFRAMES.keyframes,
    scrollProgress * 100  // Convert 0-1 to 0-100
  );
}, [scrollProgress]);

// Apply transforms to the plane:
<g
  transform={`translate(${planePos.x}, ${planePos.y})`}
  style={{
    transform: `
      rotateZ(${currentFrame.rotationZ}deg)
      rotateX(${currentFrame.rotationX}deg)
      rotateY(${currentFrame.rotationY}deg)
      scale(${currentFrame.scaleX * currentFrame.scale}, ${currentFrame.scaleY * currentFrame.scale})
    `,
    transformOrigin: 'center',
    transformStyle: 'preserve-3d',
  }}
>
  {/* Your plane image */}
</g>
```

### Step 4: Add Perspective for 3D Effects

Add perspective to the parent SVG or container:

```typescript
<svg
  // ... other props
  style={{
    perspective: '1000px',
    // ... other styles
  }}
>
```

## Keyboard Shortcuts

- **Space**: Play/Pause animation
- **Left/Right Arrow** (future): Navigate between keyframes

## Project Structure

```
plane-animation-editor/
├── src/
│   ├── components/
│   │   ├── PathCanvas.tsx       # Visual preview with plane
│   │   ├── Timeline.tsx         # Scrubber and playback controls
│   │   ├── ControlPanel.tsx     # Property adjustment sliders
│   │   ├── KeyframeList.tsx     # List of all keyframes
│   │   └── ExportPanel.tsx      # JSON export functionality
│   ├── utils/
│   │   ├── pathCalculations.ts  # Path generation (same as main site)
│   │   ├── animationEngine.ts   # Keyframe interpolation
│   │   └── exportUtils.ts       # JSON formatting
│   ├── data/
│   │   └── destinationsImport.ts # Destinations from main site
│   ├── types.ts                 # TypeScript interfaces
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # Entry point
├── index.html
├── package.json
└── README.md (this file)
```

## Tips for Best Results

1. **Start Simple**: Begin with 2-3 keyframes to establish the basic motion
2. **Test Playback**: Use the play button frequently to preview smoothness
3. **Path Progress**: The plane will follow the exact same curved path as your site
4. **3D Rotation**: Subtle 3D effects (5-15°) work best for realism
5. **Scale Variations**: Keep scale between 0.8x - 1.2x for consistency
6. **Export Often**: Save different versions as you experiment

## Troubleshooting

**Plane not visible?**
- Check that Path Progress is between 0-100%
- Ensure Scale is not set to 0

**Animation too fast/slow?**
- Adjust Animation Duration in Export Panel
- Modify playback speed in Timeline controls

**3D rotation not showing?**
- Make sure perspective is applied to parent SVG
- Check that rotationX and rotationY are non-zero

**Keyframes not interpolating smoothly?**
- Add more intermediate keyframes
- Ensure keyframes are distributed evenly in time

## License

This editor is part of the NIHAR Holidays project.
