# GPU 渲染

虽然 Skija 在 CPU 上表现卓越，但其真正的威力在于通过 OpenGL、Metal、Vulkan 或 Direct3D 启用 GPU 加速。

## 核心概念

### DirectContext
`DirectContext` 表示与 GPU 驱动的连接。它管理 GPU 资源、缓存以及底层图形 API 的状态。

### BackendRenderTarget
`BackendRenderTarget` 表示一个 Skia 可以绘制到的缓冲区（例如 OpenGL 帧缓冲区或 Metal 纹理）。

## 示例：使用 LWJGL 的 OpenGL

要使用 LWJGL 渲染到 OpenGL 窗口：

1.  **初始化 OpenGL：** 使用 LWJGL 创建窗口和 GL 上下文。
2.  **创建 DirectContext：**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **创建渲染目标：**
    你需要告诉 Skia 要绘制到哪个帧缓冲区（通常窗口的默认帧缓冲区 ID 是 `0`）。
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* 采样数 */ 
        8, /* 模板缓冲位数 */ 
        fbId, /* GL 帧缓冲区 ID */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **创建 Surface：**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## 渲染循环

在 GPU 加速环境中，你必须手动通知 Skia 将命令提交到 GPU。

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. 绘制内容
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. 将命令刷新到 GPU
    context.flush();
    
    // 3. 交换缓冲区（具体操作取决于图形 API）
    window.swapBuffers();
}
```

## 最佳实践

- **复用 Context：** 创建 `DirectContext` 开销很大。应在应用程序生命周期内创建一次并重复使用。
- **处理窗口大小调整：** 当窗口大小改变时，必须 `close()` 旧的 `Surface` 和 `BackendRenderTarget`，并创建与新的尺寸匹配的新对象。
- **资源管理：** 不再需要 GPU 支持的 Surface 时应将其关闭，以释放显存。