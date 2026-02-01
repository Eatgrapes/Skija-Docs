# API Reference: PathBuilder

`PathBuilder` is the modern, recommended way to construct `Path` objects in Skija. It provides a fluent API and is designed specifically for path construction, separating the building process from the immutable `Path` result.

## Basic Commands

Movement and Lines:
- `moveTo(x, y)`: Starts a new contour.
- `lineTo(x, y)`: Adds a line segment.
- `polylineTo(points)`: Adds multiple line segments.
- `closePath()`: Closes the current contour.

Relative Commands (offsets from current point):
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## Curves

Quadratic Bézier (1 control point):
- `quadTo(x1, y1, x2, y2)`: Absolute coordinates.
- `rQuadTo(dx1, dy1, dx2, dy2)`: Relative coordinates.

Cubic Bézier (2 control points):
- `cubicTo(x1, y1, x2, y2, x3, y3)`: Absolute.
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)`: Relative.

Conic (Quadratic with weight):
- `conicTo(x1, y1, x2, y2, w)`: Useful for exact circles/ellipses.
- `rConicTo(...)`: Relative version.

## Arcs

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)`: Adds an arc confined to the given oval.
- `tangentArcTo(p1, p2, radius)`: Adds an arc tangent to lines (current -> p1) and (p1 -> p2).
- `ellipticalArcTo(...)`: Adds an SVG-style arc.

## Adding Shapes

`PathBuilder` allows adding entire shapes as new contours.

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)`: Rounded Rectangle.
- `addPolygon(points, close)`: Adds a sequence of points as a contour.
- `addPath(path, mode)`: Appends another path's contours to this one.

## Transformations (Builder-State)

These methods affect the points *currently* in the builder.

- `offset(dx, dy)`: Translates all existing points in the builder.
- `transform(matrix)`: Applies a matrix to all existing points.

## Builder Management

- `reset()`: Clears the builder to an empty state (retains memory).
- `incReserve(points, verbs)`: Pre-allocates memory to avoid resizing during building.
- `setFillMode(mode)`: Sets the fill rule (`WINDING`, `EVEN_ODD`, etc.).
- `setVolatile(boolean)`: Hints that the resulting path should not be cached (useful for one-off animation paths).

## Output Methods

- **`snapshot()`**: Returns a `Path` and keeps the builder state intact.
- **`detach()`**: Returns a `Path` and resets the builder (most efficient).
- **`build()`**: Returns a `Path` and closes the builder (cannot use afterwards).

## Example: Basic Building

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // Returns the Path
```

## Example: Transformations

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // Returns path and resets builder
```

## Visual Example

See [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) for various path combinations and filling rules.