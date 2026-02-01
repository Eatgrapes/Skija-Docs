# GPU 渲染

雖然 Skija 在 CPU 上表現卓越，但其真正的威力在透過 OpenGL、Metal、Vulkan 或 Direct3D 使用 GPU 加速時才能完全發揮。

## 概念

### DirectContext
`DirectContext` 代表與 GPU 驅動程式的連接。它管理 GPU 資源、快取以及底層圖形 API 的狀態。

### BackendRenderTarget
`BackendRenderTarget` 代表一個 Skia 可以繪製到的緩衝區（例如 OpenGL 的 Framebuffer 或 Metal 的 Texture）。

## 範例：使用 LWJGL 的 OpenGL

要使用 LWJGL 渲染到 OpenGL 視窗：

1.  **初始化 OpenGL：** 使用 LWJGL 建立視窗和 GL 上下文。
2.  **建立 DirectContext：**
    ```java
    DirectContext context = DirectContext.makeGL();
    ```
3.  **建立渲染目標：**
    你需要告訴 Skia 要繪製到哪個幀緩衝區（通常是 `0`，代表預設視窗）。
    ```java
    BackendRenderTarget rt = BackendRenderTarget.makeGL(
        width, height, 
        0, /* 樣本數 */ 
        8, /* 模板緩衝位元數 */ 
        fbId, /* GL 幀緩衝區 ID */ 
        FramebufferFormat.GR_GL_RGBA8
    );
    ```
4.  **建立 Surface：**
    ```java
    Surface surface = Surface.makeFromBackendRenderTarget(
        context, rt, 
        SurfaceOrigin.BOTTOM_LEFT, 
        ColorType.RGBA_8888, 
        ColorSpace.getSRGB()
    );
    ```

## 渲染循環

在 GPU 加速環境中，你必須手動通知 Skia 將指令提交給 GPU。

```java
while (!window.shouldClose()) {
    Canvas canvas = surface.getCanvas();
    
    // 1. 繪製你的內容
    canvas.clear(0xFFFFFFFF);
    canvas.drawCircle(50, 50, 30, paint);
    
    // 2. 將指令刷新到 GPU
    context.flush();
    
    // 3. 交換緩衝區（圖形 API 特定操作）
    window.swapBuffers();
}
```

## 最佳實踐

- **重複使用 Context：** 建立 `DirectContext` 的成本很高。請在應用程式生命週期中建立一次並重複使用。
- **處理視窗大小調整：** 當視窗大小改變時，你必須 `close()` 舊的 `Surface` 和 `BackendRenderTarget`，並建立符合新尺寸的新物件。
- **資源管理：** 當不再需要 GPU 支援的 Surface 時，應將其關閉以釋放 VRAM。