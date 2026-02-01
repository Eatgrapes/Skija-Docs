# API 参考：Surface

`Surface` 类是所有绘图命令的目标。它管理像素内存（在 CPU 或 GPU 上），并提供用于绘图的 `Canvas`。

## 概述

`Surface` 负责：
1.  保存像素数据（或管理 GPU 纹理）。
2.  提供 `Canvas` 接口以向该数据绘图。
3.  将当前内容快照为 `Image`。

## 创建 Surface

### 1. 光栅 Surface（CPU）
最简单的表面。像素位于标准系统内存（RAM）中。最适合生成图像、服务器端渲染或测试。

```java
// 标准 32 位 RGBA 表面
Surface raster = Surface.makeRasterN32Premul(800, 600);

// 使用自定义 ImageInfo（例如，用于 HDR 的 F16 颜色）
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. GPU Surface（渲染目标）
用于硬件加速渲染。你需要一个 `DirectContext`（OpenGL/Metal/Vulkan 上下文）。

```java
DirectContext context = ...; // 你的 GPU 上下文

// 在 GPU 上创建一个由 Skia 管理的新纹理
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgeted?（Skia 是否应将其计入缓存限制？）
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. 包装现有的 OpenGL/Metal 纹理
如果你将 Skija 集成到现有的游戏引擎或窗口系统（如 LWJGL 或 JWM）中，窗口通常会提供一个“帧缓冲区”或“纹理”ID。你包装这个 ID，以便 Skija 可以直接绘制到屏幕上。

```java
// OpenGL 示例
int framebufferId = 0; // 默认屏幕缓冲区
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // 宽度，高度
    0,                 // 采样计数（0 表示无 MSAA）
    8,                 // 模板位数
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // OpenGL 坐标从底部左侧开始
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. 包装光栅像素（互操作）
如果你有来自其他库（如视频帧解码器）的 `ByteBuffer` 或指针，可以直接包装它而无需复制。

```java
long pixelPtr = ...; // 指向内存的本地指针
int rowBytes = width * 4; // 每行字节数

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. 空 Surface
创建一个不执行任何操作的表面。适用于测量或测试，无需分配内存。

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## 创建快照（`Image`）

从 `Surface` 创建不可变的 `Image` 是一个廉价操作（写时复制）。

```java
// 这不会立即复制像素！
// 它实际上“分叉”了表面。未来对 'surface' 的绘制不会影响 'snapshot'。
Image snapshot = surface.makeImageSnapshot();

// 你现在可以使用 'snapshot' 绘制到另一个表面或保存到磁盘。
```

## 与内容交互

```java
// 获取画布进行绘制
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// 将像素读回位图
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // 像素成功读取
}

// 将位图中的像素写入表面
surface.writePixels(bitmap, 10, 10);

// 将命令刷新到 GPU（对 GPU 表面很重要）
surface.flush();
```

- `getCanvas()`：返回用于绘图的画布。
- `readPixels(bitmap, x, y)`：从 GPU/CPU 读取像素到位图。
- `writePixels(bitmap, x, y)`：将位图中的像素写入表面。
- `flush()`：确保所有挂起的 GPU 命令发送到驱动程序。
- `notifyContentWillChange()`：如果你直接修改底层像素内存（绕过 Canvas），请调用此方法。
- `getRecordingContext()`：返回支持此表面的 `DirectContext`（如果有）。