# API 参考：DirectContext（GL 状态与上下文）

`DirectContext` 类是您与 GPU 之间的桥梁。它管理与底层图形 API（OpenGL、Metal、Vulkan 或 Direct3D）的连接，并处理 GPU 资源的生命周期。

## 创建上下文

通常，每个应用程序创建一个 `DirectContext` 并在其整个生命周期内重复使用。

```java
// 对于 OpenGL
DirectContext context = DirectContext.makeGL();

// 对于 Metal (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## 命令提交

Skia 将绘制命令记录到内部缓冲区中。您必须明确告诉 Skia 将这些命令发送到 GPU。

- `flush()`：将已记录的命令提交到 GPU 驱动程序的缓冲区。
- `submit()`：确保 GPU 实际开始处理命令。
- `flushAndSubmit(syncCpu)`：完成一帧最常用的方式。如果 `syncCpu` 为 true，它会阻塞直到 GPU 完全完成。

```java
context.flushAndSubmit(true);
```

## 管理 GL 状态

当 Skija 与其他 OpenGL 代码（例如，在游戏引擎或自定义 UI 中）一起使用时，外部代码可能会更改 OpenGL 状态（如绑定不同的程序或更改视口）。Skia 需要了解这些更改以避免渲染错误。

### 重置状态

如果您或您使用的库修改了 OpenGL 状态，您**必须**通知 Skia：

```java
// 通知 Skia 所有 OpenGL 状态可能已更改
context.resetGLAll();

// 或者为了更好的性能，更具体地重置
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### 放弃上下文

如果底层 GPU 上下文丢失（例如，窗口被销毁或驱动程序崩溃），请使用 `abandon()` 以防止 Skia 进行任何可能导致崩溃的进一步本地调用。

```java
context.abandon();
```

## 最佳实践

1.  **线程安全：** `DirectContext` **不是**线程安全的。对它的所有调用，以及所有与其关联的表面的绘制，都必须在同一个线程上进行。
2.  **状态卫生：** 如果您将 Skija 与原始 OpenGL 调用混合使用，在将控制权交还给 Skija 之前，请始终调用 `context.resetGLAll()`。
3.  **刷新表面：** 如果您有多个表面，可以单独刷新它们：`context.flush(surface)`。