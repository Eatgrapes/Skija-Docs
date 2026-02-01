# API Reference: Path

The `Path` class represents complex, compound geometric paths composed of straight line segments, quadratic curves, and cubic curves.

> **Note:** For building new paths, it is highly recommended to use [**PathBuilder**](path-builder.md) instead of calling methods directly on `Path`. `PathBuilder` provides a better fluent API and ensures the resulting `Path` is immutable.

## Building a Path (Static Factories)

While `PathBuilder` is preferred for complex paths, `Path` offers efficient static factories for common shapes.

- `makeRect(rect)`: Creates a path from a rectangle.
- `makeOval(rect)`: Creates a path from an oval.
- `makeCircle(x, y, radius)`: Creates a path from a circle.
- `makeRRect(rrect)`: Creates a path from a rounded rectangle.
- `makeLine(p1, p2)`: Creates a path from a single line segment.
- `makePolygon(points, closed)`: Creates a path from a sequence of points.
- `makeFromSVGString(svgString)`: Parses an SVG path string (e.g., `"M10 10 L50 50 Z"`).

## Path Information & Metrics

- `getBounds()`: Returns the conservative bounding box (fast, cached).
- `computeTightBounds()`: Returns the precise bounding box (slower).
- `isEmpty()`: Returns true if the path contains no verbs.
- `isConvex()`: Returns true if the path defines a convex shape.
- `isRect()`: Returns the `Rect` if the path represents a simple rectangle, or null.
- `isOval()`: Returns the bounding `Rect` if the path is an oval, or null.
- `isFinite()`: Returns true if all points in the path are finite.

## Hit Testing

- `contains(x, y)`: Returns true if the specified point is inside the path (based on the current Fill Type).
- `conservativelyContainsRect(rect)`: Returns true if the rect is definitely inside the path (fast rejection test).

## Boolean Operations

Paths can be combined using logical operations. These create a **new** `Path` object.

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

Available `PathOp`s:
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A

## Transformations & Modification

These methods return a **new** `Path` instance with the transformation applied.

- `makeTransform(matrix)`: Applies a `Matrix33` to all points in the path.
- `makeOffset(dx, dy)`: Translates the path.
- `makeScale(s)`: Scales the path.

## Interpolation (Morphing)

You can interpolate between two compatible paths (useful for animations).

```java
// Interpolate 50% between pathA and pathB
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## Serialization

- `serializeToBytes()`: Serializes the path to a byte array.
- `makeFromBytes(bytes)`: Reconstructs a path from bytes.
- `dump()`: Prints the path structure to standard output (for debugging).

## Measuring and Iteration

- `PathMeasure`: Used to calculate the length of a path and find positions/tangents along its length.
- `PathSegmentIterator`: Allows you to iterate over the individual verbs and points that make up the path.

## Example

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## Fill Type

The fill type determines which areas are considered "inside" the path for filling operations.
- `WINDING` (Default): Uses the winding number rule.
- `EVEN_ODD`: Uses the even-odd rule.
- `INVERSE_WINDING`: Inverts the winding rule (fills outside).
- `INVERSE_EVEN_ODD`: Inverts the even-odd rule.

## Visual Example

See [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) for examples of creating, modifying, and combining paths.
