# API 参考：Pixmap

`Pixmap` 类表示内存中的栅格图像。它提供对像素数据的直接访问，以及读取、写入和操作像素的方法。

## 概述

`Pixmap` 将 `ImageInfo`（宽度、高度、颜色类型、透明度类型、色彩空间）与内存中的实际像素数据配对。与 `Image` 不同，`Pixmap` 允许直接访问像素缓冲区。

## 创建

- `make(info, buffer, rowBytes)`：创建一个包装所提供 `ByteBuffer` 的 `Pixmap`。
- `make(info, addr, rowBytes)`：创建一个包装所提供原生内存地址的 `Pixmap`。

## 数据管理

- `reset()`：将 `Pixmap` 清除为空状态。
- `reset(info, buffer, rowBytes)`：重置 `Pixmap` 以包装新提供的缓冲区。
- `setColorSpace(colorSpace)`：更新 `Pixmap` 的色彩空间。
- `extractSubset(subsetPtr, area)`：将 `Pixmap` 的一个子集提取到 `subsetPtr` 指向的内存中。
- `extractSubset(buffer, area)`：将 `Pixmap` 的一个子集提取到提供的 `ByteBuffer` 中。

## 属性

- `getInfo()`：返回描述 `Pixmap` 的 `ImageInfo`（宽度、高度、颜色类型等）。
- `getRowBytes()`：返回每行的字节数。
- `getAddr()`：返回像素数据的原生地址。
- `getRowBytesAsPixels()`：返回每行的像素数（仅适用于某些颜色类型）。
- `computeByteSize()`：计算像素数据的总字节大小。
- `computeIsOpaque()`：如果 `Pixmap` 不透明则返回 true。
- `getBuffer()`：返回包装像素数据的 `ByteBuffer`。

## 访问像素

### 单像素访问

- `getColor(x, y)`：返回 `(x, y)` 处像素的颜色作为整数（ARGB）。
- `getColor4f(x, y)`：返回 `(x, y)` 处像素的颜色作为 `Color4f`。
- `getAlphaF(x, y)`：返回 `(x, y)` 处像素的 alpha 分量作为浮点数。
- `getAddr(x, y)`：返回 `(x, y)` 处像素的原生地址。

### 批量像素操作

- `readPixels(info, addr, rowBytes)`：将像素从 `Pixmap` 复制到目标内存。
- `readPixels(pixmap)`：将像素复制到另一个 `Pixmap`。
- `scalePixels(dstPixmap, samplingMode)`：使用指定的采样模式将像素缩放到适合目标 `Pixmap` 的大小。
- `erase(color)`：用指定颜色填充整个 `Pixmap`。
- `erase(color, subset)`：用指定颜色填充 `Pixmap` 的特定区域。

## 示例

### 修改像素

```java
// 创建一个新的 N32（标准 RGBA/BGRA）Pixmap
try (var pixmap = new Pixmap()) {
    // 为 100x100 像素分配内存
    pixmap.reset(ImageInfo.makeN32Premul(100, 100), Unpooled.malloc(100 * 100 * 4), 100 * 4);
    
    // 填充为白色
    pixmap.erase(0xFFFFFFFF);

    // 将 (10, 10) 处的像素设置为红色
    // 注意：对于批量操作，直接字节操作可能更快，
    // 但 erase/readPixels 是更简单的 API。
    // Skija Pixmap 出于性能原因在托管 API 中没有暴露简单的 setPixel(x,y,color) 方法，
    // 但你可以直接写入 ByteBuffer。
    ByteBuffer buffer = pixmap.getBuffer();
    int offset = (10 * 100 + 10) * 4; // y * width + x * bpp
    buffer.putInt(offset, 0xFFFF0000); // ARGB（红色）
    
    // 从此 pixmap 创建图像以进行绘制
    try (var image = Image.makeFromRaster(pixmap)) {
        canvas.drawImage(image, 0, 0);
    }
}
```

### 读取像素

```java
// 假设你有一个 Pixmap 'pixmap'
int width = pixmap.getInfo().getWidth();
int height = pixmap.getInfo().getHeight();

// 获取特定坐标处的颜色
int color = pixmap.getColor(50, 50);
System.out.println("50,50 处的颜色：" + Integer.toHexString(color));

// 遍历所有像素（注意 Java 中的性能！）
for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
        if (pixmap.getAlphaF(x, y) > 0.5f) {
            // 找到非透明像素
        }
    }
}
```