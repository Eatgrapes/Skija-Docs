# API Reference: Drawable

The `Drawable` class allows you to create custom drawing objects that encapsulate their own drawing logic and state. It is similar to `Picture`, but whereas `Picture` is a static recording of drawing commands, `Drawable` calls back into your Java code during rendering, allowing for dynamic behavior.

## Overview

To use `Drawable`, you must subclass it and override two methods:
1.  `onDraw(Canvas canvas)`: The drawing logic.
2.  `onGetBounds()`: Returning the bounding box of the drawing.

## Creating a Custom Drawable

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // This is called whenever the drawable needs to be rendered
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // Return the conservative bounds of what you draw
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## Using a Drawable

You can draw a `Drawable` directly onto a canvas or transform it.

```java
MyDrawable drawable = new MyDrawable();

// Draw at (0, 0)
drawable.draw(canvas);

// Draw at (100, 100)
drawable.draw(canvas, 100, 100);

// Draw with a matrix
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

Alternatively, `Canvas` has a specific method for it:
```java
canvas.drawDrawable(drawable);
```

## State & Invalidation

`Drawable` has a **Generation ID** (`getGenerationId()`) which allows clients to cache the output. If your drawable changes its internal state (e.g., color or text), you must call `notifyDrawingChanged()` to invalidate the cache.

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // Important: Tell Skija that the content has changed!
        notifyDrawingChanged();
    }
    
    // ... onDraw implementation ...
}
```

## Drawable vs. Picture

- **Picture**: Fast playback, immutable, records commands once. Best for complex static content.
- **Drawable**: Dynamic, calls Java code every frame. Best when logic determines what to draw at render time, or for creating re-usable "widgets".
