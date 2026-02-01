# GPU Rendering

While Skija performs exceptionally well on the CPU, its true power is unleashed when using GPU acceleration through OpenGL, Metal, Vulkan, or Direct3D.

## Concepts

### DirectContext
The `DirectContext` represents the connection to the GPU driver. It manages GPU resources, caches, and the state of the underlying graphics API.

### BackendRenderTarget
A `BackendRenderTarget` represents a buffer (like an OpenGL Framebuffer or a Metal Texture) that Skia can draw into.

## Example: OpenGL with LWJGL

To render to an OpenGL window using LWJGL:

1.  **Initialize OpenGL:** Use LWJGL to create a window and a GL context.
2.  **Create DirectContext:**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **Create Render Target:**
    You need to tell Skia which framebuffer to draw into (usually `0` for the default window).
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* samples */ 
        8, /* stencil */ 
        fbId, /* GL framebuffer id */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **Create Surface:**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## The Render Loop

In a GPU-accelerated environment, you must manually signal Skia to submit commands to the GPU.

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. Draw your content
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. Flush commands to the GPU
    context.flush();
    
    // 3. Swap buffers (graphics API specific)
    window.swapBuffers();
}
```

## Best Practices

- **Reuse the Context:** Creating a `DirectContext` is expensive. Create it once and use it for the lifetime of your application.
- **Handle Resizing:** When the window is resized, you must `close()` the old `Surface` and `BackendRenderTarget` and create new ones that match the new dimensions.
- **Resource Management:** GPU-backed surfaces should be closed when no longer needed to free up VRAM.
