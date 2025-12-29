# Quick Start Guide

Get up and running with the Plane Animation Editor in 2 minutes!

## Installation & Launch

```bash
# Navigate to the editor folder
cd plane-animation-editor

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The editor will open at: **http://localhost:5173**

---

## Your First Animation (5 Steps)

### Step 1: Understand the Interface

When you open the editor, you'll see:
- **Left Panel**: Control sliders for adjusting plane properties
- **Center Canvas**: Live preview of the plane on the path
- **Right Panels**: Keyframe list (top) and Export options (bottom)
- **Bottom Timeline**: Scrubber for navigating through the animation

### Step 2: Create Your First Keyframes

The editor starts with 1 keyframe at 0%. Let's add more:

1. **Keyframe 1 (0%)** - Already created
   - This is the starting position
   - Leave it as default (all values at 0)

2. **Move timeline to 50%**
   - Click or drag the timeline scrubber to 50%

3. **Adjust properties**:
   - Path Progress: Move to 50%
   - Rotation Z: Set to -15° (plane tilts)
   - Scale: Set to 1.2 (plane gets bigger)

4. **Click "Add Keyframe at Current Time"**
   - You've now created keyframe 2!

5. **Move timeline to 100%**
   - Drag scrubber all the way to the right

6. **Adjust properties**:
   - Path Progress: Set to 100%
   - Rotation Z: Set to 0° (plane levels out)
   - Rotation X: Set to 10° (slight pitch up)

7. **Click "Add Keyframe at Current Time"**
   - Keyframe 3 created!

### Step 3: Preview Your Animation

1. Click the **"▶ Play"** button in the timeline
2. Watch the plane animate from start to finish
3. Adjust playback speed if needed (0.5x for slower, 2x for faster)

### Step 4: Refine Your Animation

- Click on any keyframe marker (blue bars) in the timeline
- Adjust the sliders in the Control Panel
- Click Play again to see changes
- Add more keyframes for complex movements

### Step 5: Export

1. Scroll down in the right panel to **"Export Animation"**
2. Set duration (e.g., 10 seconds)
3. Click **"Download JSON File"** or **"Copy to Clipboard"**
4. Save the file or paste into your notes

---

## Common First Tasks

### Make the Plane Flip Horizontally

1. Select a keyframe
2. Find "Horizontal Flip (Scale X)"
3. Click the **"Flipped (-1)"** button
4. The plane will mirror horizontally

### Add a Loop-de-Loop Effect

1. Create keyframes at 25%, 50%, 75%
2. At 25%: Set Rotation X to 45°
3. At 50%: Set Rotation X to 90°
4. At 75%: Set Rotation X to 45°
5. Play to see the plane rotate through 3D space

### Make the Plane Grow and Shrink

1. At keyframe 50%: Set Overall Scale to 1.5
2. At keyframe 100%: Set Overall Scale back to 1.0
3. The plane will grow then shrink smoothly

---

## Keyboard Shortcuts

- **Space Bar**: Play/Pause animation
- **Mouse Drag**: Scrub through timeline

---

## What Each Control Does

### Position Section
- **Path Progress**: Where the plane is along the curved path (0% = start, 100% = end)

### 2D Rotation
- **Rotation Z (Roll)**: How much the plane tilts left/right
  - Negative = tilt left
  - Positive = tilt right

### 3D Transforms
- **Rotation X (Pitch)**: Tilt up/down
  - Negative = nose down
  - Positive = nose up
- **Rotation Y (Yaw)**: Turn left/right
  - Negative = turn left
  - Positive = turn right

### Scale & Flip
- **Horizontal Flip**: Mirror the plane left-to-right
- **Vertical Flip**: Flip the plane upside-down
- **Overall Scale**: Make plane bigger or smaller

---

## Tips for Great Animations

✅ **DO:**
- Start with just 3-4 keyframes
- Use subtle rotations (5-15°) for realistic effects
- Preview often using the Play button
- Save multiple JSON versions as you experiment

❌ **DON'T:**
- Create too many keyframes at once (start simple!)
- Use extreme rotations (> 45°) unless going for dramatic effect
- Forget to export your work before closing
- Delete all keyframes (you need at least one)

---

## Next Steps

Once you've created an animation:

1. Export the JSON
2. Follow the **INTEGRATION_GUIDE.md** to add it to your main website
3. See your custom animation come to life on the NIHAR Holidays homepage!

---

## Need Help?

- **Can't see the plane?** Check that Path Progress isn't at 0% with Scale at 0
- **Animation too fast?** Lower the playback speed or add more keyframes
- **3D rotation not working?** Make sure Rotation X or Y are non-zero
- **Keyframe disappeared?** Check the Keyframe List in the right panel

For detailed documentation, see **README.md** and **INTEGRATION_GUIDE.md**.

---

Happy animating! ✈️
