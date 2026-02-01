# API Reference: Animation (Skottie)

The `Animation` class (in `io.github.humbleui.skija.skottie`) provides support for loading and rendering Lottie animations.

## Overview

Skottie is a high-performance Lottie player for Skia. The `Animation` class allows you to load Lottie animations from files, strings, or data, and render specific frames to a `Canvas`.

## Creation

- `makeFromString(data)`: Creates an `Animation` from a JSON string.
- `makeFromFile(path)`: Creates an `Animation` from a file path.
- `makeFromData(data)`: Creates an `Animation` from a `Data` object.

## Rendering

- `render(canvas)`: Draws the current frame to the canvas at `(0, 0)` with the animation's natural size.
- `render(canvas, offset)`: Draws the current frame at the specified `(x, y)` offset.
- `render(canvas, left, top)`: Draws the current frame at the specified coordinates.
- `render(canvas, dst, renderFlags)`: Draws the current frame scaled to the destination `Rect`.

## Controlling Playback

To render a specific frame, you must first seek to it.

- `seek(t)`: Seeks to a normalized time `t` in the range `[0..1]`.
- `seek(t, ic)`: Seeks to a normalized time `t` with an `InvalidationController`.
- `seekFrame(t)`: Seeks to a specific frame index `t` (relative to `duration * fps`).
- `seekFrameTime(t)`: Seeks to a specific time `t` in seconds.

## Properties

- `getDuration()`: Returns the total duration of the animation in seconds.
- `getFPS()`: Returns the frame rate (frames per second).
- `getInPoint()`: Returns the in-point (start frame) in frame index units.
- `getOutPoint()`: Returns the out-point (end frame) in frame index units.
- `getVersion()`: Returns the Lottie version string.
- `getSize()`: Returns the natural size of the animation as a `Point`.
- `getWidth()`: Returns the width of the animation.
- `getHeight()`: Returns the height of the animation.

## Example

```java
// Load animation from resources or file system
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // Get animation info
    float duration = anim.getDuration(); // in seconds
    float width = anim.getWidth();
    float height = anim.getHeight();

    // Prepare for rendering
    anim.seek(0.5f); // Go to the middle of the animation (50%)

    // Render to canvas
    // Assumes you have a Canvas instance 'canvas'
    canvas.save();
    canvas.translate(100, 100); // Position the animation
    anim.render(canvas);
    canvas.restore();
}
```

