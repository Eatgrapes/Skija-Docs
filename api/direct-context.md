# API Reference: DirectContext (GL State & Context)

The `DirectContext` class is your bridge to the GPU. It manages the connection to the underlying graphics API (OpenGL, Metal, Vulkan, or Direct3D) and handles the lifecycle of GPU resources.

## Creating a Context

You typically create one `DirectContext` per application and reuse it throughout its lifetime.

```java
// For OpenGL
DirectContext context = DirectContext.makeGL();

// For Metal (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## Command Submission

Skia records drawing commands into an internal buffer. You must explicitly tell Skia to send these commands to the GPU.

- `flush()`: Submits recorded commands to the GPU driver's buffer.
- `submit()`: Ensures the GPU actually starts processing the commands.
- `flushAndSubmit(syncCpu)`: The most common way to finish a frame. If `syncCpu` is true, it blocks until the GPU is completely finished.

```java
context.flushAndSubmit(true);
```

## Managing GL State

When Skija is used alongside other OpenGL code (e.g., in a game engine or custom UI), the external code might change the OpenGL state (like binding a different program or changing the viewport). Skia needs to know about these changes to avoid rendering errors.

### Resetting State

If you or a library you use modifies the OpenGL state, you **must** notify Skia:

```java
// Notify Skia that ALL OpenGL states might have changed
context.resetGLAll();

// Or be more specific for better performance
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### Abandoning the Context

If the underlying GPU context is lost (e.g., the window was destroyed or the driver crashed), use `abandon()` to prevent Skia from making any further native calls that might cause a crash.

```java
context.abandon();
```

## Best Practices

1.  **Thread Safety:** A `DirectContext` is **not** thread-safe. All calls to it, and all drawing to surfaces associated with it, must happen on the same thread.
2.  **State Hygiene:** If you mix Skija with raw OpenGL calls, always call `context.resetGLAll()` before returning control to Skija.
3.  **Flush Surface:** If you have multiple surfaces, you can flush them individually: `context.flush(surface)`.
