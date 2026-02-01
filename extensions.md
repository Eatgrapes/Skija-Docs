# Extensions: Lottie & SVG

Skija includes high-level support for popular vector formats like Lottie (via Skottie) and SVG, allowing you to easily integrate complex animations and icons into your Java applications.

## Lottie Animations (Skottie)

Skottie is Skia's Lottie player. It can load and play JSON-based animations exported from After Effects.

### Loading an Animation

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### Playing and Rendering

To play an animation, you need to "seek" to a specific time or frame and then render it to a canvas.

```java
// normalized time: 0.0 (start) to 1.0 (end)
anim.seek(currentTime); 

// Or seek to a specific frame index
anim.seekFrame(24);

// Render to a specific rectangle on the canvas
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## SVG Support

Skija provides an SVG DOM that can parse and render SVG files.

### Loading and Rendering SVG

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// Set the size of the container where the SVG will be rendered
svg.setContainerSize(100, 100);

// Draw it to the canvas
svg.render(canvas);
```

### Interacting with SVG

You can access the root element of the SVG to query its properties, such as its intrinsic size.

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## When to use what?

- **Lottie:** Best for complex UI animations, character animations, and expressive transitions.
- **SVG:** Best for static icons, simple logos, and illustrations.
- **Custom Shaders (SkSL):** Best for procedurally generated backgrounds, real-time effects, and highly dynamic visuals.
