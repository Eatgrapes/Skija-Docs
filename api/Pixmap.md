# API Reference: Pixmap

The `Pixmap` class represents a raster image in memory. It provides direct access to pixel data and methods for reading, writing, and manipulating pixels.

## Overview

A `Pixmap` pairs `ImageInfo` (width, height, color type, alpha type, color space) with the actual pixel data in memory. Unlike `Image`, `Pixmap` allows direct access to the pixel buffer.

## Creation

- `make(info, buffer, rowBytes)`: Creates a `Pixmap` wrapping the provided `ByteBuffer`.
- `make(info, addr, rowBytes)`: Creates a `Pixmap` wrapping the provided native memory address.

## Managing Data

- `reset()`: Clears the `Pixmap` to a null state.
- `reset(info, buffer, rowBytes)`: Resets the `Pixmap` to wrap the new provided buffer.
- `setColorSpace(colorSpace)`: Updates the color space of the `Pixmap`.
- `extractSubset(subsetPtr, area)`: Extracts a subset of the `Pixmap` into the memory pointed to by `subsetPtr`.
- `extractSubset(buffer, area)`: Extracts a subset of the `Pixmap` into the provided `ByteBuffer`.

## Properties

- `getInfo()`: Returns the `ImageInfo` describing the `Pixmap` (width, height, color type, etc.).
- `getRowBytes()`: Returns the number of bytes per row.
- `getAddr()`: Returns the native address of the pixel data.
- `getRowBytesAsPixels()`: Returns the number of pixels per row (only for certain color types).
- `computeByteSize()`: Calculates the total byte size of the pixel data.
- `computeIsOpaque()`: Returns true if the `Pixmap` is opaque.
- `getBuffer()`: Returns a `ByteBuffer` wrapping the pixel data.

## Accessing Pixels

### Single Pixel Access

- `getColor(x, y)`: Returns the color of the pixel at `(x, y)` as an integer (ARGB).
- `getColor4f(x, y)`: Returns the color of the pixel at `(x, y)` as a `Color4f`.
- `getAlphaF(x, y)`: Returns the alpha component of the pixel at `(x, y)` as a float.
- `getAddr(x, y)`: Returns the native address of the pixel at `(x, y)`.

### Bulk Pixel Operations

- `readPixels(info, addr, rowBytes)`: Copies pixels from the `Pixmap` to the destination memory.
- `readPixels(pixmap)`: Copies pixels to another `Pixmap`.
- `scalePixels(dstPixmap, samplingMode)`: Scales the pixels to fit the destination `Pixmap` using the specified sampling mode.
- `erase(color)`: Fills the entire `Pixmap` with the specified color.
- `erase(color, subset)`: Fills a specific area of the `Pixmap` with the specified color.

## Example

### Modifying Pixels

```java
// Create a new N32 (standard RGBA/BGRA) Pixmap
try (var pixmap = new Pixmap()) {
    // Allocate memory for 100x100 pixels
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // Fill with white
    pixmap.erase(0xFFFFFFFF);

    // Set a pixel to red at (10, 10)
    // Note: Direct byte manipulation might be faster for bulk operations, 
    // but erase/readPixels are easier APIs.
    // Skija Pixmap doesn't expose a simple setPixel(x,y,color) for performance reasons
    // in the managed API, but you can write to the ByteBuffer directly.
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * width + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB (Red)
    
    // Create an image from this pixmap to draw it
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### Reading Pixels

```java
// Assuming you have a Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// Get color at specific coordinate
int color = pixmap.getColor(50, 50);
System.out.println("Color at 50,50: " + Integer.toHexString(color));

// Iterate over all pixels (be mindful of performance in Java!)
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // Found a non-transparent pixel
        }
    }
}
```

