# Getting Started with Skija

Skija brings the power of the Skia Graphics Engine to the Java Virtual Machine. This guide provides a high-level overview of how to start drawing with Skija.

## Core Concepts

Before diving into code, it's helpful to understand the primary players in the Skija ecosystem:

- **Surface**: The destination for your drawing (like a sheet of paper).
- **Canvas**: The interface used to perform drawing operations (like your hand).
- **Paint**: Defines the color, style, and effects of what you draw (like your pen or brush).

## Quick Start Path

To get your first "Hello World" on the screen or in an image file, we recommend following these steps:

1.  **[Installation](installation.md)**: Set up your project dependencies for your specific platform (Windows, macOS, or Linux).
2.  **[Rendering Basics](rendering-basics.md)**: Learn how to create a simple in-memory Surface and draw your first primitive shapes.
3.  **[Typography](typography.md)**: Add text to your creations using system fonts or custom font files.
4.  **[GPU Rendering](gpu-rendering.md)**: For interactive applications, learn how to harness the power of your graphics card.

## Resource Management

Skija is a high-performance wrapper around a C++ library. While it manages memory automatically for you, understanding the [Resource Management](resource-management.md) principles is recommended for building robust applications.

## Deep Dives

Once you are comfortable with the basics, explore our detailed API references:

- [**Canvas API**](api/Canvas.md): Detailed look at transformations, clipping, and drawing methods.
- [**Paint & Effects**](api/Effects.md): Master blurs, shadows, and color matrices.
- [**Shaders**](api/Shader.md): Create beautiful gradients and procedural textures.
- [**SkSL**](api/runtime-effect.md): Write custom GPU shaders for ultimate flexibility.

---

### Ready to build something amazing?
Check out the [**Full Documentation Index**](/) for a complete list of guides and references.