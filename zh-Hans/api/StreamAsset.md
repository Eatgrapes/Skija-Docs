# API 参考：StreamAsset

`StreamAsset` 表示一个可随机访问的只读数据流。通常用于加载需要随机访问的字体数据或其他资源。

## 概述

`StreamAsset` 提供了在字节流中进行读取、跳过和定位的方法。它是一个“托管”对象，意味着 Skija 将负责处理原生内存的清理。

## 方法

### 读取

- `read(buffer, size)`：读取最多 `size` 个字节到提供的字节数组中。返回实际读取的字节数。
- `peek(buffer, size)`：预览数据而不推进流的位置。
- `isAtEnd()`：如果流已到达末尾，则返回 `true`。

### 导航

- `skip(size)`：跳过指定数量的字节。
- `rewind()`：将流位置移回开头。
- `seek(position)`：定位到特定的绝对位置。
- `move(offset)`：按相对偏移量移动位置。

### 信息

- `getPosition()`：返回流中当前的字节偏移量。
- `getLength()`：返回流的总长度（如果已知）。
- `hasPosition()`：如果流支持定位/位置操作，则返回 `true`。
- `hasLength()`：如果长度已知，则返回 `true`。
- `getMemoryBase()`：如果流基于内存，则返回原生内存地址。

### 复制

- `duplicate()`：创建一个新的 `StreamAsset`，共享相同的数据但具有独立的位置。
- `fork()`：类似于 duplicate，但新流从原始流的当前位置开始。

## 在排版中的使用

`StreamAsset` 在处理 [`Typeface`](Typeface.md) 数据时最常见：

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... 处理字体数据
}
```