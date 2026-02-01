# API Reference: PathMeasure

`PathMeasure` is used to calculate the length of a path, and to find the position and tangent at any given distance along the path.

## Overview

A `PathMeasure` object is initialized with a [`Path`](Path.md). It iterates through the contours of the path. If the path has multiple contours, you can move to the next one using `nextContour()`.

## Constructors

- `new PathMeasure()`: Creates an empty `PathMeasure`.
- `new PathMeasure(path)`: Initializes with the specified path.
- `new PathMeasure(path, forceClosed)`: If `forceClosed` is true, the path is treated as if it were closed, even if it isn't.
- `new PathMeasure(path, forceClosed, resScale)`: `resScale` controls the precision of the measurement (default is 1.0).

## Methods

### State Management

- `setPath(path, forceClosed)`: Resets the measure with a new path.
- `nextContour()`: Moves to the next contour in the path. Returns `true` if one exists.
- `isClosed()`: Returns `true` if the current contour is closed.

### Measurements

- `getLength()`: Returns the total length of the current contour.
- `getPosition(distance)`: Returns the `Point` at the specified distance along the path.
- `getTangent(distance)`: Returns the tangent (as a `Point` vector) at the specified distance.
- `getRSXform(distance)`: Returns the `RSXform` at the specified distance.
- `getMatrix(distance, getPosition, getTangent)`: Returns a `Matrix33` representing the position and/or tangent at the distance.

### Extraction

- `getSegment(startD, endD, dst, startWithMoveTo)`: Returns the segment of the path between `startD` and `endD` into the provided `PathBuilder`.

## Example

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // Get point halfway around
Point tan = measure.getTangent(length / 2);   // Get direction at that point
```
