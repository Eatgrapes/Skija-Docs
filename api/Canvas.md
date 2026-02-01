# API Reference: Canvas

The `Canvas` class is the central point for all drawing operations in Skija. It manages the drawing state, including transformations and clipping.

## Overview

A `Canvas` does not hold the pixels themselves; it is an interface that directs drawing commands to a destination, such as a `Surface` or a `Bitmap`.

## State Management

The Canvas maintains a stack of states. You can save the current state (matrix and clip) and restore it later.

- `save()`: Pushes a copy of the current matrix and clip onto the stack. Returns the save count.
- `restore()`: Pops the stack and resets the matrix and clip to the previous state.
- `restoreToCount(count)`: Restores to a specific save count.
- `getSaveCount()`: Returns the current stack depth.

### Layers

Layers create an off-screen buffer for drawing, which is then composited back to the main canvas upon restoration.

- `saveLayer(rect, paint)`: Saves the state and redirects drawing to a layer. The `paint` controls alpha/blending of the layer when composited back.
- `saveLayerAlpha(rect, alpha)`: Simplified version for just changing opacity.
- `saveLayer(SaveLayerRec)`: Advanced layer control (backdrops, tile modes).

```java
// Create a blur filter
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // Everything drawn here will appear on top of a blurred background
    // (creating a "frosted glass" effect)
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## Transformations

Transformations affect all subsequent drawing operations.

- `translate(dx, dy)`: Moves the origin.
- `scale(sx, sy)`: Scales coordinates.
- `rotate(degrees)`: Rotates around the current origin.
- `skew(sx, sy)`: Skews the coordinate system.
- `concat(matrix)`: Multiplies by a custom `Matrix33` or `Matrix44`.
- `setMatrix(matrix)`: Replaces the current matrix entirely.
- `resetMatrix()`: Resets to the identity matrix.
- `getLocalToDevice()`: Returns the current total transformation matrix.

## Clipping

Clipping restricts the area where drawing can occur.

- `clipRect(rect, mode, antiAlias)`: Clips to a rectangle.
- `clipRRect(rrect, mode, antiAlias)`: Clips to a rounded rectangle.
- `clipPath(path, mode, antiAlias)`: Clips to a path.
- `clipRegion(region, mode)`: Clips to a region (pixel-aligned).

## Drawing Methods


### Basic Primitives

```java
// Draw a point (pixel or circle depending on paint cap)
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// Draw a line
canvas.drawLine(10, 10, 100, 100, paint);

// Draw a rectangle (outline or fill depending on paint mode)
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// Draw a circle
canvas.drawCircle(100, 100, 40, paint);

// Draw an oval
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// Draw a rounded rectangle (radii can be complex)
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// Draw an arc (pie slice or stroke)
// startAngle: 0 is right, sweepAngle: clockwise degrees
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: Draws a single point.
- `drawPoints(points, paint)`: Draws a collection of points (or lines/polygons depending on paint cap).
- `drawLine(x0, y0, x1, y1, paint)`: Draws a line segment.
- `drawLines(points, paint)`: Draws separate line segments for each pair of points.
- `drawRect(rect, paint)`: Draws a rectangle.
- `drawOval(rect, paint)`: Draws an oval.
- `drawCircle(x, y, radius, paint)`: Draws a circle.
- `drawRRect(rrect, paint)`: Draws a rounded rectangle.
- `drawDRRect(outer, inner, paint)`: Draws the area between two rounded rectangles (annulus).
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: Draws a wedge (pie slice) or arc stroke.
- `drawPath(path, paint)`: Draws a path.
- `drawRegion(region, paint)`: Draws a specific region.

### Fills & Clears

```java
// Fill the entire canvas/layer with a specific color (blends with existing content)
canvas.drawColor(0x80FF0000); // 50% Red overlay

// Clear the entire canvas to transparent (replaces content, no blending)
canvas.clear(0x00000000);

// Fill the current clip with a specific paint
// Useful for filling the screen with a Shader or complex Paint effect
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: Fills the entire clip region with a color (replaces pixels, ignores blending).
- `drawColor(color, mode)`: Fills the clip with a color (respects blending).
- `drawPaint(paint)`: Fills the clip with the given paint (useful for filling with a Shader).

### Images & Bitmaps

```java
// Draw image at (0, 0)
canvas.drawImage(image, 0, 0);

// Draw image scaled to a specific rectangle
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// Draw 9-slice image (scalable UI element)
// center: the middle scalable region of the source image
// dst: the target rectangle to draw into
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: Draws an image at coordinates.
- `drawImageRect(image, src, dst, sampling, paint, strict)`: Draws a subset of an image scaled to a destination rectangle.
- `drawImageNine(image, center, dst, filter, paint)`: Draws a 9-slice scalable image.
- `drawBitmap(bitmap, x, y, paint)`: Draws a bitmap (raster data).

### Text

```java
// Simple text drawing
canvas.drawString("Hello World", 50, 50, font, paint);

// Advanced text drawing using TextBlob (pre-calculated layout)
canvas.drawTextBlob(blob, 50, 50, paint);

// Drawing a TextLine (from Shaper)
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: Draws a simple string.
- `drawTextBlob(blob, x, y, paint)`: Draws a pre-calculated text blob.
- `drawTextLine(line, x, y, paint)`: Draws a shaped `TextLine`.

### Advanced Drawing

```java
// Draw a triangle mesh (e.g., for custom 3D effects or warping)
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // Per-vertex colors
    null, // No texture coordinates
    null, // No indices (use vertices in order)
    BlendMode.MODULATE,
    new Paint()
);

// Draw a drop shadow for a rectangle
// (Simpler than creating a shadow filter manually)
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // blur
    0,     // spread
    0x80000000 // Shadow color
);
```

- `drawPicture(picture)`: Replays a recorded `Picture`.
- `drawDrawable(drawable)`: Draws a dynamic `Drawable` object.
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: Draws a triangle mesh.
- `drawPatch(cubics, colors, texCoords, mode, paint)`: Draws a Coons patch.
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: Helper to draw a simple drop shadow.

## Pixel Access

```java
// Read pixels from the canvas into a bitmap
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // Read starting from (0,0) on canvas

// Write pixels back to the canvas
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: Reads pixels from the canvas into a bitmap.
- `writePixels(bitmap, x, y)`: Writes pixels from a bitmap onto the canvas.