# API 参考：Picture 与 PictureRecorder

当你需要多次绘制相同的复杂场景时——或者如果你有一个不会改变的静态背景——你应该使用 `Picture`。它会将你的绘制命令记录为高度优化的格式，Skia 可以“回放”这些命令，这比每帧执行单独的 Java 调用要快得多。

## 工作流程

录制一个 Picture 需要使用 `PictureRecorder` 来获取一个临时的 `Canvas`。

```java
PictureRecorder recorder = new PictureRecorder();

// 1. 定义“剔除矩形”（你打算绘制的区域）
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. 像往常一样执行你的绘制命令
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... 更多绘制 ...

// 3. 停止录制并获取 Picture 对象
Picture picture = recorder.finishRecordingAsPicture();
```

## PictureRecorder API

`PictureRecorder` 是用于捕获命令的有状态对象。

- `beginRecording(bounds)`：开始录制。返回一个你可以绘制的 `Canvas`。发送到此画布的所有绘制命令都将被存储。
- `getRecordingCanvas()`：返回当前活动的录制画布，如果未在录制则返回 `null`。
- `finishRecordingAsPicture()`：结束录制并返回不可变的 `Picture` 对象。使录制画布失效。
- `finishRecordingAsPicture(cullRect)`：结束录制，但覆盖存储在 Picture 中的剔除矩形。

## 创建 Picture（序列化）

- `makePlaceholder(cullRect)`：创建一个占位 Picture，它不绘制任何内容但具有特定的边界。
- `makeFromData(data)`：从 `Data` 对象（通过 `serializeToData` 创建）反序列化一个 Picture。

## 绘制 Picture

一旦你有了 `Picture` 对象，你就可以在任何其他 `Canvas` 上绘制它。

```java
canvas.drawPicture(picture);
```

## 为什么使用 Picture？

1.  **性能：** 如果你有 1,000 个绘制调用，Java 每帧需要调用原生代码 1,000 次。如果你将它们录制到一个 `Picture` 中，每帧就只需要 **一次** 原生调用。
2.  **线程安全：** 虽然 `Canvas` 与线程绑定，但 `Picture` 是不可变的，可以从任何线程绘制（尽管通常你会在主渲染线程上绘制它）。
3.  **细分缓存：** Skia 可以更好地缓存 `Picture` 内部的复杂几何图形（如路径），这比缓存单个调用更高效。

## 最佳实践与陷阱

- **不要录制所有内容：** 如果你的内容每帧都变化（比如一个移动的角色），每次录制一个新的 `Picture` 实际上可能*更慢*，因为录制器本身有开销。
- **Canvas 生命周期：** 从 `beginRecording()` 获取的 `Canvas` 仅在调用 `finishRecordingAsPicture()` 之前有效。不要试图保留对它的引用！
- **内存：** Picture 会占用原生内存。如果你创建了许多小的 Picture，请记住在不再需要时调用 `close()` 来释放它们。