# Images and Bitmaps

Handling images in Skija involves two main classes: `Image` and `Bitmap`. While they seem similar, they serve different purposes.

## Image vs. Bitmap

- **`Image`**: Think of this as a read-only, potentially GPU-backed texture. It's optimized for drawing onto a canvas.
- **`Bitmap`**: This is a mutable, CPU-side array of pixels. You use this when you need to programmatically edit individual pixels.

## Loading an Image

The most common way to get an image is to load it from encoded bytes (PNG, JPEG, etc.).

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**Tip:** `makeDeferredFromEncodedBytes` is "lazy"—it won't decode the pixels until the first time you actually draw it, which saves memory and time during initial loading.

### Creating from Pixels (Raster)

If you have raw pixel data (e.g., from another library or generated procedurally):

```java
// From a Data object (wraps native memory or byte array)
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// From a Bitmap (copies or shares pixels)
Image img = Image.makeRasterFromBitmap(bitmap);

// From a Pixmap (copies pixels)
Image img = Image.makeRasterFromPixmap(pixmap);
```

## Encoding (Saving Images)

To save an `Image` to a file or stream, you must encode it. Skija provides `EncoderJPEG`, `EncoderPNG`, and `EncoderWEBP` for fine-grained control.

```java
// Simple Encoding (default settings)
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // Default quality 100

// Advanced Encoding (with options)
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// WebP Encoding
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // or LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## Drawing on Canvas

Drawing an image is simple, but pay attention to **Sampling**.

```java
canvas.drawImage(img, 10, 10);
```

### Sampling Modes

When you scale an image, you need to decide how it should be sampled:
- `SamplingMode.DEFAULT`: Nearest neighbor. Fast, but looks blocky when scaled.
- `SamplingMode.LINEAR`: Bilinear filtering. Smooth, but can be a bit blurry.
- `SamplingMode.MITCHELL`: High-quality cubic resampling. Great for downscaling.

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## Creating Shaders from Images

You can use an image as a pattern (e.g., for a tiled background) by turning it into a shader.

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // Fills the whole canvas with the tiled image
```

## Working with Pixels (Bitmap)

If you need to generate an image from scratch pixel-by-pixel:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Now you can draw into this bitmap using a Canvas
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... draw things ...

// Or access raw pixels (advanced)
ByteBuffer pixels = bmp.peekPixels();
```

## Accessing Pixel Data (Sampling)

To read pixels from an `Image` or `Surface`, use the `readPixels` method.

### Full Image Sampling
```java
// Create a bitmap to hold the pixels
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// Read all pixels from the image into the bitmap
image.readPixels(bmp);
```

### Region Sampling
You can read a specific sub-rectangle of the image by providing an (x, y) offset.

```java
// We only want a 50x50 region
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// Read starting from (100, 100) in the source image
// effectively capturing the rectangle {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## OpenGL / Metal Interoperability

Skija allows you to create `Image` objects directly from existing GPU textures. This is useful for integrating with other graphics libraries (like LWJGL).

### Creating an Image from an OpenGL Texture

```java
// You need a DirectContext for GPU operations
DirectContext context = ...; 

// Assume you have an OpenGL texture ID from elsewhere
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// Now you can draw this texture using Skija
canvas.drawImage(glImage, 0, 0);
```

**Note:** When adopting a texture, Skija assumes ownership. If you want to wrap it without taking ownership, look for `makeFromTexture` variants (if available) or manage the lifetime carefully.

## Performance Pitfalls


1.  **Decoding on the UI thread:** Decoding large images can be slow. Do it in the background.
2.  **Texture Uploads:** If you are using a GPU backend (like OpenGL), the first time you draw a CPU-side `Image`, Skia has to upload it to the GPU. For large textures, this can cause a frame drop.
3.  **Large Bitmaps:** Bitmaps live in Java's heap and native memory. Be careful with large dimensions (e.g., 8k textures) as they can quickly lead to OutOfMemory errors.
