# API Reference: Picture & PictureRecorder

When you need to draw the same complex scene multiple times—or if you have a static background that doesn't change—you should use `Picture`. It records your drawing commands into a highly optimized format that Skia can "play back" much faster than executing individual Java calls every frame.

## The Workflow

Recording a picture involves using a `PictureRecorder` to get a temporary `Canvas`.

```java
PictureRecorder recorder = new PictureRecorder();

// 1. Define the "cull rect" (the area you intend to draw in)
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. Perform your drawing commands as usual
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... more drawing ...

// 3. Stop recording and get the Picture object
Picture picture = recorder.finishRecordingAsPicture();
```

## PictureRecorder API

The `PictureRecorder` is the stateful object used to capture commands.

- `beginRecording(bounds)`: Starts recording. Returns a `Canvas` you can draw into. All drawing commands sent to this canvas will be stored.
- `getRecordingCanvas()`: Returns the active recording canvas, or `null` if not recording.
- `finishRecordingAsPicture()`: Ends recording and returns the immutable `Picture` object. Invalidates the recording canvas.
- `finishRecordingAsPicture(cullRect)`: Ends recording, but overrides the cull rect stored in the picture.

## Creating Pictures (Serialization)

- `makePlaceholder(cullRect)`: Creates a placeholder picture that draws nothing but has specific bounds.
- `makeFromData(data)`: Deserializes a picture from a `Data` object (created via `serializeToData`).

## Drawing the Picture

Once you have a `Picture` object, you can draw it onto any other `Canvas`.

```java
canvas.drawPicture(picture);
```

## Why use Picture?

1.  **Performance:** If you have 1,000 drawing calls, Java has to call into native code 1,000 times per frame. If you record them into a `Picture`, it's just **one** native call per frame.
2.  **Thread Safety:** While a `Canvas` is tied to a thread, a `Picture` is immutable and can be drawn from any thread (though usually you draw it on your main rendering thread).
3.  **Tessellation Caching:** Skia can cache the complex geometry (like paths) inside a `Picture` better than it can for individual calls.

## Best Practices & Pitfalls

- **Don't record everything:** If your content changes every single frame (like a moving character), recording a new `Picture` every time might actually be *slower* due to the overhead of the recorder.
- **Canvas Lifetime:** The `Canvas` you get from `beginRecording()` is only valid until you call `finishRecordingAsPicture()`. Don't try to keep a reference to it!
- **Memory:** Pictures take up native memory. If you are creating many small pictures, remember to `close()` them when they are no longer needed.
