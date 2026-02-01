# Skija 中的动画

在 Skija 中，“动画”根据你想要实现的效果，可能指三种不同的情况：

1.  **程序化动画：** 使用代码移动形状或改变颜色（例如，游戏循环）。
2.  **Lottie (Skottie)：** 播放从 After Effects 导出的高质量矢量动画。
3.  **动态图像：** 播放 GIF 或 WebP 图像。

## 1. 程序化动画（“游戏循环”）

Skija 是一个“立即模式”渲染器。这意味着它不会记住你昨天在哪里画了一个圆。要移动一个圆，你只需在今天把它画在不同的位置。

要创建动画，你需要依赖你的窗口库（如 JWM 或 LWJGL）来反复调用你的 `draw` 函数。

### 模式

1.  **获取时间：** 使用 `System.nanoTime()` 获取当前时间。
2.  **计算状态：** 根据时间确定你的对象应该在什么位置。
3.  **绘制：** 渲染帧。
4.  **请求下一帧：** 告诉窗口立即再次刷新。

### 示例：移动一个圆

```java
// 存储状态的变量
long startTime = System.nanoTime();

public void onPaint(Canvas canvas) {
    // 1. 根据时间计算进度（0.0 到 1.0）
    long now = System.nanoTime();
    float time = (now - startTime) / 1e9f; // 时间，单位秒
    
    // 每秒移动 100 像素
    float x = 50 + (time * 100) % 500; 
    float y = 100 + (float) Math.sin(time * 5) * 50; // 上下浮动

    // 2. 绘制
    Paint paint = new Paint().setColor(0xFFFF0000); // 红色
    canvas.drawCircle(x, y, 20, paint);

    // 3. 请求下一帧（方法取决于你的窗口库）
    window.requestFrame(); 
}
```

## 2. Lottie 动画 (Skottie)

对于复杂的矢量动画（如 UI 加载器、图标），Skija 使用 **Skottie** 模块。这比手动绘制所有内容要高效得多。

有关如何加载和控制 Lottie 文件的详细信息，请参阅 [**动画 API 参考**](api/Animation.md)。

## 3. 动态图像 (GIF / WebP)

要播放 GIF 或 WebP 等标准动态图像格式，你需要使用 `Codec` 类来提取帧。

有关解码和播放多帧图像的详细信息，请参阅 [**编解码器 API 参考**](api/Codec.md)。

---

## 性能提示

-   **不要在循环中创建对象：** 重用 `Paint`、`Rect` 和 `Path` 对象。每秒创建 60 次新的 Java 对象会触发垃圾回收器并导致卡顿。
-   **谨慎使用 `saveLayer`：** 它的开销很大。
-   **垂直同步：** 确保你的窗口库启用了垂直同步，以防止屏幕撕裂。