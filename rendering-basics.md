# Rendering Basics

This guide covers the fundamental concepts of rendering with Skija, from creating a drawing surface to performing basic drawing operations.

## The Surface and Canvas

In Skia (and Skija), all drawing happens on a **Canvas**. However, a Canvas needs a destination to draw into, which is provided by a **Surface**.

### Off-screen Rendering (Raster)

The simplest way to start is by creating a raster (in-memory) surface. This is ideal for generating images, server-side rendering, or testing.

```java
// Create a 100x100 pixels surface using the default N32 color format (usually RGBA or BGRA)
Surface surface = Surface.makeRasterN32Premul(100, 100);

// Obtain the Canvas from the surface
Canvas canvas = surface.getCanvas();
```

The `Canvas` object is your primary interface for drawing. It maintains the current state (transformations, clipping) and provides the drawing methods.

## Using Paint

While the `Canvas` defines *where* and *what* to draw, the `Paint` object defines *how* to draw it. A `Paint` object holds information about colors, stroke styles, blending modes, and various effects.

```java
Paint paint = new Paint();
paint.setColor(0xFFFF0000); // Fully opaque Red
```

### Working with Colors

Colors in Skija are represented as 32-bit integers in **ARGB** format:
- `0x` followed by `FF` (Alpha), `RR` (Red), `GG` (Green), `BB` (Blue).
- `0xFFFF0000` is Opaque Red.
- `0xFF00FF00` is Opaque Green.
- `0xFF0000FF` is Opaque Blue.
- `0x80000000` is Half-transparent Black.

## Basic Drawing Operations

The `Canvas` provides many methods for drawing primitives.

```java
// Draw a circle at (50, 50) with radius 30
canvas.drawCircle(50, 50, 30, paint);

// Draw a simple line
canvas.drawLine(10, 10, 90, 90, paint);

// Draw a rectangle
canvas.drawRect(Rect.makeXYWH(10, 10, 80, 80), paint);
```

## Capturing and Saving Output

After drawing on a surface, you often want to save the result as an image file.

```java
// 1. Take a snapshot of the current surface content as an Image
Image image = surface.makeImageSnapshot();

// 2. Encode the image into a specific format (e.g., PNG)
Data pngData = image.encodeToData(EncodedImageFormat.PNG);

// 3. Convert the data to a ByteBuffer for writing
ByteBuffer pngBytes = pngData.toByteBuffer();

// 4. Write to a file using standard Java I/O
try {
    java.nio.file.Path path = java.nio.file.Path.of("output.png");
    Files.write(path, pngBytes.array());
} catch (IOException e) {
    e.printStackTrace();
}
```

### Reading Pixels (Screen Capture)

If you need the raw pixel data from the surface (e.g., for processing or inspection) without encoding it to an image format:

```java
// Create a bitmap to store the result
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Read pixels from the surface into the bitmap
// This reads the entire surface if sizes match
surface.readPixels(bitmap, 0, 0);

// For a specific region (e.g., 50x50 area starting at 10, 10)
Bitmap region = new Bitmap();
region.allocPixels(ImageInfo.makeN32Premul(50, 50));
surface.readPixels(region, 10, 10);
```

## Chaining API


Many Skija setters return `this`, allowing for a fluent, builder-style API:

```java
Paint strokePaint = new Paint()
    .setColor(0xFF1D7AA2)
    .setMode(PaintMode.STROKE)
    .setStrokeWidth(2f)
    .setAntiAlias(true);
```
