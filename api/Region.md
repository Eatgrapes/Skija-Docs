# API Reference: Region

The `Region` class represents a complex area on the canvas, similar to a `Path`, but defined by **integer** coordinates. Regions are highly optimized for boolean operations (like intersection, union, difference) and testing if a point or rectangle is inside the area.

## Overview

Unlike `Path`, which uses floating-point coordinates and can contain curves, a `Region` is fundamentally a collection of horizontal scanlines. It is efficient for hit-testing and clipping.

## Creating and Modifying Regions

```java
// Create an empty region
Region region = new Region();

// Set it to a rectangle
region.setRect(new IRect(0, 0, 100, 100));

// Set it from a Path
// (Requires a 'clip' region to define the maximum bounds)
Path path = new Path().addCircle(50, 50, 40);
Region clip = new Region();
clip.setRect(new IRect(0, 0, 200, 200));
region.setPath(path, clip);
```

## Boolean Operations

The power of `Region` lies in its ability to combine multiple areas using logical operators.

```java
Region regionA = new Region();
regionA.setRect(new IRect(0, 0, 100, 100));

Region regionB = new Region();
regionB.setRect(new IRect(50, 50, 150, 150));

// Intersect: Result is the overlapping area (50, 50, 100, 100)
regionA.op(regionB, RegionOp.INTERSECT);

// Union: Result is the combined area of both
regionA.op(regionB, RegionOp.UNION);

// Difference: Remove B from A
regionA.op(regionB, RegionOp.DIFFERENCE);
```

Available Operations (`RegionOp`):
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A
- `REPLACE`: B

## Hit Testing

You can check if a point or rectangle is inside a region.

```java
if (region.contains(10, 10)) {
    // Point is inside
}

if (region.quickReject(new IRect(200, 200, 300, 300))) {
    // Rectangle is definitely OUTSIDE the region
}
```

## Usage with Canvas

You can use a `Region` to clip the `Canvas`.

```java
canvas.clipRegion(region);
```

**Note:** `Region` operations (like `setPath`) are strictly integer-based. Curves will be approximated by small steps. For high-precision rendering, prefer `Path`. `Region` is best for complex UI hit-testing or pixel-aligned clipping masks.
