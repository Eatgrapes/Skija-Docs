# API Reference: PathBuilder

`PathBuilder` is a fluent, mutable builder for creating immutable [`Path`](Path.md) objects.

## Overview

Unlike `Path`, which can be modified directly in Skia, Skija encourages using `PathBuilder` to construct a path and then "snapshot" it into an immutable `Path` object. This is more efficient and follows modern Skia best practices.

## Methods

### Movement

- `moveTo(x, y)`: Starts a new contour at (x, y).
- `lineTo(x, y)`: Adds a line segment from the current point to (x, y).
- `quadTo(x1, y1, x2, y2)`: Adds a quadratic Bezier curve.
- `conicTo(x1, y1, x2, y2, w)`: Adds a conic Bezier curve with weight `w`.
- `cubicTo(x1, y1, x2, y2, x3, y3)`: Adds a cubic Bezier curve.
- `closePath()`: Closes the current contour.

### Relative Movement

All absolute methods have relative counterparts (e.g., `rLineTo`, `rCubicTo`) which use coordinates relative to the current point.

### Shapes

- `addRect(rect)`: Adds a rectangle.
- `addOval(rect)`: Adds an oval.
- `addCircle(x, y, radius)`: Adds a circle.
- `addRRect(rrect)`: Adds a rounded rectangle.
- `addPath(path)`: Adds another path to this builder.

### Finalization

- `make()`: Returns a new `Path` object and **resets** the builder.
- `snapshot()`: Returns a new `Path` object **without** resetting the builder.

## Example

```java
Path path = new PathBuilder()
    .moveTo(0, 0)
    .lineTo(100, 0)
    .lineTo(100, 100)
    .closePath()
    .make();
```
