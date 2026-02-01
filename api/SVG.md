# API Reference: SVG

While Skia is primarily a low-level drawing engine, Skija includes an SVG module that allows you to work with SVG files directly. This is perfect for icons, simple illustrations, and logos.

## Loading and Rendering

SVG in Skija is managed by the `SVGDOM` class.

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. Load the SVG data
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. Define the viewport size
// This is important! SVGs often don't have a fixed size.
svg.setContainerSize(200, 200);

// 3. Render it to a Canvas
svg.render(canvas);
```

## Scaling SVGs

Because SVGs are vector-based, you can scale them to any size without losing quality. Simply change the `setContainerSize` or use `canvas.scale()` before rendering.

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // Make it twice as large
svg.render(canvas);
canvas.restore();
```

## Accessing the Root Element

You can get the root `<svg>` element to query the original dimensions or other metadata.

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // Get the size defined in the SVG file
}
```

## Performance Tip: The "Raster Cache"

Rendering an SVG can be surprisingly expensive because Skia has to parse the XML-like structure and execute many drawing commands every time. 

**Best Practice:** If you have an icon that shows up many times (like a folder icon in a file manager), don't call `svg.render()` for every instance. Instead, render it once to an off-screen `Image` and draw that image.

```java
// Do this once
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// Use this in your render loop
canvas.drawImage(cachedIcon, x, y);
```

## Limitations

The Skija SVG implementation is a "subset" of the full SVG specification. It supports most common features (shapes, paths, fills, gradients), but may struggle with:
- Complex CSS styling
- Scripting (JavaScript inside SVG)
- Some obscure filter effects

For most UI icons and logos, it works perfectly.
