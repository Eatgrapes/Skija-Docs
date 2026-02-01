# Resource Management

Skija is a Java wrapper around the C++ Skia library. This means that many Java objects are backed by native C++ resources. Understanding how these resources are managed is crucial for building stable and efficient applications.

## Automatic Memory Management

By default, Skija manages memory automatically. Most Skija objects extend the `Managed` class. When a Java object is garbage collected, Skija ensures that the corresponding native C++ resource is also released.

```java
void drawSomething(Canvas canvas) {
    Paint paint = new Paint(); // Native resource allocated
    canvas.drawCircle(50, 50, 20, paint);
} // paint goes out of scope, will be cleaned up by GC eventually
```

For most use cases, this "safe by default" behavior is exactly what you want.

## Manual Resource Release

In performance-critical applications or when dealing with many short-lived objects, you might want to release native resources immediately rather than waiting for the Garbage Collector.

All `Managed` objects implement `AutoCloseable`, so you can use the `try-with-resources` pattern:

```java
void drawCircle(Canvas canvas) {
    try (Paint p = new Paint()) {
        canvas.drawCircle(50, 50, 20, p);
    } // Native resource is freed IMMEDIATELY here
}
```

**Warning:** Once an object is closed, it cannot be used again. Attempting to use a closed object will result in an exception or a crash.

## Reusing Objects

Because creating native objects can have some overhead, it is often better to reuse them, especially in a render loop.

```java
class MyApp {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    void onRender(Canvas canvas) {
        canvas.drawCircle(100, 100, 50, paint); // Reuse the same paint object
    }
}
```

## Encapsulation and Getters

Skija uses a specific convention for its data classes (like `Rect`, `Color4f`). You will often see public fields starting with an underscore (e.g., `_r`, `_g`, `_b` in `Color4f`).

**Convention:**
- Fields starting with `_` should be treated as **private/internal**.
- Always use the provided **getters** (e.g., `getR()`, `getG()`) for public API access.

```java
Color4f color = new Color4f(1f, 0f, 0f);

float r = color._r;    // AVOID: Accessing internal field
float r2 = color.getR(); // RECOMMENDED: Using public getter
```

This approach allows Skija to maintain a stable API even if the internal implementation of these data classes changes in future versions.
