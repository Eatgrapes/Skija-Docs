---
layout: home

hero:
  name: Skija
  text: Java Bindings for Skia
  tagline: High-performance, hardware-accelerated 2D graphics for the JVM.
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/HumbleUI/Skija

features:
  - title: Hardware Accelerated
    details: Leverages OpenGL, Metal, Vulkan, and Direct3D via Skia for buttery smooth performance.
  - title: Rich Typography
    details: Advanced text shaping with HarfBuzz and complex layout with SkParagraph.
  - title: Modern Shaders
    details: Write custom GPU shaders using SkSL (Skia Shading Language).
---

::: warning Unofficial Documentation
This documentation is maintained by the community and is **not** an official publication of the Skia or Skija projects. 
If you find any errors or have suggestions, please report them at [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs).
:::

## Full Documentation Index

### The Essentials

- [**Getting Started**](getting-started.md): A bird's-eye view of how Skija works and where to begin.
- [**Installation**](installation.md): Setting up dependencies for Windows, macOS, and Linux.
- [**Rendering Basics**](rendering-basics.md): Surfaces, Canvases, and your first "Hello World".
- [**Colors and Alpha**](colors.md): Handling transparency, premultiplication, and color spaces.
- [**Animation**](animation.md): Creating movement, game loops, and playing Lottie/GIFs.
- [**Resource Management**](resource-management.md): How Skija handles native memory and the `Managed` lifecycle.

### API Deep Dives

- [**Surface**](api/Surface.md): Creating drawing destinations (Raster, GPU, Wrapped).
- [**Canvas**](api/Canvas.md): Transformations, clipping, and drawing primitives.
- [**Images & Bitmaps**](api/Images.md): Loading, drawing, and manipulating pixel data.
- [**Sampling Mode**](api/SamplingMode.md): Defining how pixels are sampled during scaling.
- [**Cubic Resampler**](api/CubicResampler.md): High-quality bicubic interpolation.
- [**Data**](api/Data.md): Efficient native memory management.
- [**StreamAsset**](api/StreamAsset.md): Seekable read-only data streams.
- [**Matrix**](api/Matrix.md): 3x3 and 4x4 matrix transformations.
- [**Codec (Animations)**](api/Codec.md): Low-level image decoding and GIF/WebP animations.
- [**Paint & Effects**](api/Effects.md): Styles, blurs, shadows, and color filters.
- [**Shadows**](api/Shadows.md): 2D drop shadows and 3D elevation-based shadows.
- [**Paths**](api/Path.md): Creating and combining complex geometric shapes.
- [**PathBuilder**](api/path-builder.md): Fluent API for constructing paths.
- [**PathMeasure**](api/PathMeasure.md): Measuring length and finding points along a path.
- [**Region**](api/Region.md): Integer-based area operations and hit-testing.
- [**Picture**](api/Picture.md): Recording and replaying drawing commands for performance.

### Typography & Text

- [**Typeface**](api/Typeface.md): Font file loading and properties.
- [**Font**](api/Font.md): Font size, metrics, and rendering attributes.
- [**Typography & Fonts**](typography.md): Basics of fonts and metrics.
- [**Text Animation & Clipping**](api/text-animation.md): Using text as masks, wavy text, and variable fonts.
- [**TextBlob & Builder**](api/TextBlob.md): Optimized, reusable glyph runs.
- [**TextLine**](api/TextLine.md): Single-line text layout and hit-testing.
- [**Paragraph (Rich Text)**](api/Paragraph.md): Complex multi-style text layout and line wrapping.
- [**BreakIterator**](api/BreakIterator.md): Locating word, line, and sentence boundaries.

### Advanced Graphics

- [**GPU Rendering**](gpu-rendering.md): Hardware acceleration with OpenGL, Metal, Vulkan, and Direct3D.
- [**DirectContext**](api/direct-context.md): Managing GPU state and command submission.
- [**Shaper**](api/Shaper.md): Text shaping and glyph positioning (HarfBuzz).
- [**SkSL (RuntimeEffect)**](api/runtime-effect.md): Writing custom GPU shaders for ultimate flexibility.
- [**PDF Generation**](api/Document.md): Creating vector-based PDF documents.

### Extensions

- [**SVG**](api/SVG.md): Loading and rendering SVG icons and illustrations.
- [**Lottie**](extensions.md): High-performance vector animations with Skottie.