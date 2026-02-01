# API Reference: Surface

The `Surface` class is the destination for all drawing commands. It manages the pixel memory (on CPU or GPU) and provides the `Canvas` you use to draw.

## Overview

A `Surface` is responsible for:
1.  Holding the pixel data (or managing the GPU texture).
2.  Providing a `Canvas` interface to draw into that data.
3.  Snapshotting the current contents into an `Image`.

## Creating a Surface

### 1. Raster Surface (CPU)
The simplest surface. Pixels live in standard system memory (RAM). Best for generating images, server-side rendering, or testing.

```java
// Standard 32-bit RGBA surface
Surface raster = Surface.makeRasterN32Premul(800, 600);

// With custom ImageInfo (e.g., F16 color for HDR)
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. GPU Surface (Render Target)
Used for hardware-accelerated rendering. You need a `DirectContext` (OpenGL/Metal/Vulkan context).

```java
DirectContext context = ...; // Your GPU context

// Create a new texture on the GPU managed by Skia
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgeted? (Should Skia count this against its cache limit?)
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. Wrapping Existing OpenGL/Metal Textures
If you are integrating Skija into an existing game engine or windowing system (like LWJGL or JWM), the window usually provides a "framebuffer" or "texture" ID. You wrap this so Skija can draw directly onto the screen.

```java
// OpenGL example
int framebufferId = 0; // Default screen buffer
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // Width, Height
    0,                 // Sample count (0 for no MSAA)
    8,                 // Stencil bits
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // OpenGL coordinates start at bottom-left
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. Wrapping Raster Pixels (Interop)
If you have a `ByteBuffer` or pointer from another library (like a video frame decoder), you can wrap it directly without copying.

```java
long pixelPtr = ...; // Native pointer to memory
int rowBytes = width * 4; // Bytes per row

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. Null Surface
Creates a surface that does nothing. Useful for measuring or testing without allocating memory.

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## Creating Snapshots (`Image`)

Creating an immutable `Image` from a `Surface` is a cheap operation (Copy-on-Write).

```java
// This doesn't copy pixels immediately!
// It effectively "forks" the surface. Future draws to 'surface' won't affect 'snapshot'.
Image snapshot = surface.makeImageSnapshot();

// You can now use 'snapshot' to draw onto another surface or save to disk.
```

## Interacting with Content

```java
// Get the canvas to draw
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// Read pixels back into a bitmap
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // Pixels successfully read
}

// Write pixels from a bitmap onto the surface
surface.writePixels(bitmap, 10, 10);

// Flush commands to the GPU (important for GPU surfaces)
surface.flush();
```

- `getCanvas()`: Returns the canvas for drawing.
- `readPixels(bitmap, x, y)`: Reads pixels back from the GPU/CPU into a bitmap.
- `writePixels(bitmap, x, y)`: Writes pixels from a bitmap onto the surface.
- `flush()`: Ensures all pending GPU commands are sent to the driver.
- `notifyContentWillChange()`: Call this if you modify the underlying pixel memory directly (bypassing the Canvas).
- `getRecordingContext()`: Returns the `DirectContext` backing this surface (if any).