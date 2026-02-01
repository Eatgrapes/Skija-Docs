# API Reference: Codec (Decoding & Animation)

While `Image.makeDeferredFromEncodedBytes()` is fine for simple static images, you need the `Codec` class when you want more control over the decoding process or when dealing with **animated images** (GIFs, animated WebP).

## Loading a Codec

A `Codec` represents the "source" of an image before it's turned into pixels.

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## Basic Decoding

To get a single static frame from a codec:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // Prepare the memory
codec.readPixels(bmp); // Decode the data into the bitmap
```

## Handling Animations

This is where `Codec` shines. It allows you to iterate through frames of a GIF or WebP.

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1 for infinite

for (int i = 0; i < frameCount; i++) {
    // 1. Get info about this specific frame (duration, etc.)
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // in milliseconds
    
    // 2. Decode the frame
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. Do something with the frame...
}
```

## Advanced Decoding Options

### Scaling during Decode
If you have a 4K image but only need it at 200x200, you can tell the codec to scale it **during** the decoding process. This is much faster and uses way less memory than decoding the full image and then scaling it.

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // Decodes and scales in one step!
```

## Important Notes

- **Stream Rewinding:** Some codecs (depending on the source data) cannot be rewound. If you need to decode frames multiple times, it's safer to keep the `Data` in memory.
- **Color Spaces:** The codec will attempt to respect the color space embedded in the image. You can override this by providing a different `ImageInfo` to `readPixels`.
- **Memory:** `Codec` itself is small, but the `Bitmap` objects you decode into can be very large. Re-use bitmaps where possible.
