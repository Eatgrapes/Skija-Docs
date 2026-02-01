# 图像与位图

在 Skija 中处理图像主要涉及两个类：`Image` 和 `Bitmap`。虽然它们看起来很相似，但用途不同。

## Image 与 Bitmap 的区别

- **`Image`**：可以将其视为只读的、可能由 GPU 支持的纹理。它针对绘制到画布上进行了优化。
- **`Bitmap`**：这是一个可变的、位于 CPU 端的像素数组。当你需要以编程方式编辑单个像素时，会使用它。

## 加载图像

获取图像最常见的方式是从编码字节（PNG、JPEG 等）加载。

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**提示：** `makeDeferredFromEncodedBytes` 是“惰性”的——它不会解码像素，直到你第一次实际绘制它，这在初始加载时节省了内存和时间。

### 从像素（光栅）创建

如果你有原始像素数据（例如，来自另一个库或程序化生成）：

```java
// 从 Data 对象创建（包装本地内存或字节数组）
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// 从 Bitmap 创建（复制或共享像素）
Image img = Image.makeRasterFromBitmap(bitmap);

// 从 Pixmap 创建（复制像素）
Image img = Image.makeRasterFromPixmap(pixmap);
```

## 编码（保存图像）

要将 `Image` 保存到文件或流，必须对其进行编码。Skija 提供了 `EncoderJPEG`、`EncoderPNG` 和 `EncoderWEBP` 用于细粒度控制。

```java
// 简单编码（默认设置）
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // 默认质量 100

// 高级编码（带选项）
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// WebP 编码
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // 或 LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## 在画布上绘制

绘制图像很简单，但要注意**采样**。

```java
canvas.drawImage(img, 10, 10);
```

### 采样模式

缩放图像时，需要决定如何采样：
- `SamplingMode.DEFAULT`：最近邻。速度快，但缩放时看起来有块状感。
- `SamplingMode.LINEAR`：双线性过滤。平滑，但可能有点模糊。
- `SamplingMode.MITCHELL`：高质量三次重采样。非常适合缩小。

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## 从图像创建着色器

你可以通过将图像转换为着色器来将其用作图案（例如，用于平铺背景）。

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // 用平铺图像填充整个画布
```

## 处理像素（Bitmap）

如果需要逐像素从头生成图像：

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// 现在可以使用画布绘制到位图中
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... 绘制内容 ...

// 或者访问原始像素（高级用法）
ByteBuffer pixels = bmp.peekPixels();
```

## 访问像素数据（采样）

要从 `Image` 或 `Surface` 读取像素，请使用 `readPixels` 方法。

### 全图像采样
```java
// 创建一个位图来保存像素
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// 将图像中的所有像素读取到位图中
image.readPixels(bmp);
```

### 区域采样
你可以通过提供 (x, y) 偏移量来读取图像的特定子矩形区域。

```java
// 我们只需要一个 50x50 的区域
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// 从源图像的 (100, 100) 位置开始读取
// 有效地捕获矩形 {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## OpenGL / Metal 互操作性

Skija 允许你直接从现有的 GPU 纹理创建 `Image` 对象。这对于与其他图形库（如 LWJGL）集成非常有用。

### 从 OpenGL 纹理创建图像

```java
// 需要 DirectContext 进行 GPU 操作
DirectContext context = ...; 

// 假设你从其他地方获取了一个 OpenGL 纹理 ID
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// 现在可以使用 Skija 绘制这个纹理
canvas.drawImage(glImage, 0, 0);
```

**注意：** 当采用纹理时，Skija 会取得所有权。如果你想包装它而不取得所有权，请查找 `makeFromTexture` 变体（如果可用）或仔细管理生命周期。

## 性能陷阱

1.  **在 UI 线程上解码：** 解码大图像可能很慢。请在后台进行。
2.  **纹理上传：** 如果你使用 GPU 后端（如 OpenGL），第一次绘制 CPU 端的 `Image` 时，Skia 必须将其上传到 GPU。对于大纹理，这可能导致掉帧。
3.  **大位图：** 位图存在于 Java 堆和本地内存中。对于大尺寸（例如 8k 纹理）要小心，因为它们可能很快导致内存不足错误。