# API 参考：编解码器（解码与动画处理）

虽然 `Image.makeDeferredFromEncodedBytes()` 适用于简单的静态图像，但当您需要更多解码过程控制权或处理**动画图像**（GIF、动态 WebP）时，就需要使用 `Codec` 类。

## 加载编解码器

`Codec` 表示图像在转换为像素前的“数据源”。

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## 基础解码

从编解码器获取单个静态帧：

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // 准备内存空间
codec.readPixels(bmp); // 将数据解码到位图中
```

## 处理动画

这是 `Codec` 的亮点所在。它允许您遍历 GIF 或 WebP 的帧序列。

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1 表示无限循环

for (int i = 0; i < frameCount; i++) {
    // 1. 获取当前帧信息（时长等）
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // 单位：毫秒
    
    // 2. 解码该帧
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. 对帧数据进行处理...
}
```

## 高级解码选项

### 解码时缩放
如果图像是 4K 分辨率但您只需要 200x200 尺寸，可以指示编解码器在解码过程中直接缩放。这比完整解码后再缩放要快得多，且内存占用更少。

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // 一步完成解码和缩放！
```

## 重要说明

- **流重置：** 某些编解码器（取决于数据源）不支持重置。如需多次解码帧序列，建议将 `Data` 对象保留在内存中。
- **色彩空间：** 编解码器会尝试遵循图像内嵌的色彩空间。您可以通过向 `readPixels` 提供不同的 `ImageInfo` 来覆盖此行为。
- **内存管理：** `Codec` 本身占用空间小，但解码得到的 `Bitmap` 对象可能非常庞大。请尽可能复用位图对象。