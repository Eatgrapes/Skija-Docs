# Animation in Skija

"Animation" in Skija can mean three different things depending on what you want to achieve:

1.  **Programmatic Animation:** Moving shapes or changing colors using code (e.g., a game loop).
2.  **Lottie (Skottie):** Playing high-quality vector animations exported from After Effects.
3.  **Animated Images:** Playing GIFs or WebP images.

## 1. Programmatic Animation (The "Game Loop")

Skija is an "immediate mode" renderer. This means it doesn't remember where you drew a circle yesterday. To move a circle, you simply draw it at a different position today.

To create an animation, you rely on your windowing library (like JWM or LWJGL) to call your `draw` function repeatedly.

### The Pattern

1.  **Get Time:** Use `System.nanoTime()` to get the current time.
2.  **Calculate State:** Determine where your objects should be based on the time.
3.  **Draw:** Render the frame.
4.  **Request Next Frame:** Tell the window to refresh again immediately.

### Example: Moving a Circle

```java
// Variable to store state
long startTime = System.nanoTime();

public void onPaint(Canvas canvas) {
    // 1. Calculate progress (0.0 to 1.0) based on time
    long now = System.nanoTime();
    float time = (now - startTime) / 1e9f; // Time in seconds
    
    // Move 100 pixels per second
    float x = 50 + (time * 100) % 500; 
    float y = 100 + (float) Math.sin(time * 5) * 50; // Bob up and down

    // 2. Draw
    Paint paint = new Paint().setColor(0xFFFF0000); // Red
    canvas.drawCircle(x, y, 20, paint);

    // 3. Request next frame (method depends on your window library)
    window.requestFrame(); 
}
```

## 2. Lottie Animations (Skottie)

For complex vector animations (like UI loaders, icons), Skija uses the **Skottie** module. This is much more efficient than drawing everything manually.

See the [**Animation API Reference**](api/Animation.md) for details on how to load and control Lottie files.

## 3. Animated Images (GIF / WebP)

To play standard animated image formats like GIF or WebP, you use the `Codec` class to extract frames.

See the [**Codec API Reference**](api/Codec.md) for details on decoding and playing multi-frame images.

---

## Performance Tips

- **Don't create objects in the loop:** Re-use `Paint`, `Rect`, and `Path` objects. Creating new Java objects 60 times a second triggers the Garbage Collector and causes stutter.
- **Use `saveLayer` carefully:** It's expensive.
- **V-Sync:** Ensure your windowing library has V-Sync enabled to prevent screen tearing.
