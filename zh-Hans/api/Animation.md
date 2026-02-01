# API 参考：动画 (Skottie)

`Animation` 类（位于 `io.github.humbleui.skija.skottie` 中）提供了加载和渲染 Lottie 动画的支持。

## 概述

Skottie 是 Skia 的高性能 Lottie 播放器。`Animation` 类允许你从文件、字符串或数据加载 Lottie 动画，并将特定帧渲染到 `Canvas` 上。

## 创建

- `makeFromString(data)`：从 JSON 字符串创建 `Animation`。
- `makeFromFile(path)`：从文件路径创建 `Animation`。
- `makeFromData(data)`：从 `Data` 对象创建 `Animation`。

## 渲染

- `render(canvas)`：将当前帧以动画的自然尺寸绘制到画布的 `(0, 0)` 位置。
- `render(canvas, offset)`：将当前帧绘制到指定的 `(x, y)` 偏移位置。
- `render(canvas, left, top)`：将当前帧绘制到指定的坐标位置。
- `render(canvas, dst, renderFlags)`：将当前帧缩放到目标 `Rect` 并绘制。

## 控制播放

要渲染特定帧，必须先定位到该帧。

- `seek(t)`：定位到归一化时间 `t`，范围在 `[0..1]` 内。
- `seek(t, ic)`：使用 `InvalidationController` 定位到归一化时间 `t`。
- `seekFrame(t)`：定位到特定的帧索引 `t`（相对于 `duration * fps`）。
- `seekFrameTime(t)`：定位到特定的时间 `t`（以秒为单位）。

## 属性

- `getDuration()`：返回动画的总时长（以秒为单位）。
- `getFPS()`：返回帧率（每秒帧数）。
- `getInPoint()`：返回入点（起始帧），以帧索引为单位。
- `getOutPoint()`：返回出点（结束帧），以帧索引为单位。
- `getVersion()`：返回 Lottie 版本字符串。
- `getSize()`：返回动画的自然尺寸，以 `Point` 表示。
- `getWidth()`：返回动画的宽度。
- `getHeight()`：返回动画的高度。

## 示例

```java
// 从资源或文件系统加载动画
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // 获取动画信息
    float duration = anim.getDuration(); // 以秒为单位
    float width = anim.getWidth();
    float height = anim.getHeight();

    // 准备渲染
    anim.seek(0.5f); // 定位到动画的中间位置（50%）

    // 渲染到画布
    // 假设你有一个 Canvas 实例 'canvas'
    canvas.save();
    canvas.translate(100, 100); // 定位动画位置
    anim.render(canvas);
    canvas.restore();
}
```