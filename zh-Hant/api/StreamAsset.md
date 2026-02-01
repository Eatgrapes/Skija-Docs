# API 參考：StreamAsset

`StreamAsset` 代表一個可隨機存取、唯讀的資料流。通常用於載入字型資料或其他需要隨機存取的資源。

## 概述

`StreamAsset` 提供在位元組流中讀取、跳過和定位的方法。它是一個「受管理」的物件，意味著 Skija 會處理原生記憶體的清理。

## 方法

### 讀取

- `read(buffer, size)`：讀取最多 `size` 個位元組到提供的位元組陣列中。返回實際讀取的位元組數。
- `peek(buffer, size)`：窺視資料而不推進流的位置。
- `isAtEnd()`：如果流已到達結尾，則返回 `true`。

### 導航

- `skip(size)`：跳過指定數量的位元組。
- `rewind()`：將流位置移回開頭。
- `seek(position)`：定位到特定的絕對位置。
- `move(offset)`：按相對偏移量移動位置。

### 資訊

- `getPosition()`：返回流中當前的位元組偏移量。
- `getLength()`：返回流的總長度（如果已知）。
- `hasPosition()`：如果流支援定位/位置操作，則返回 `true`。
- `hasLength()`：如果長度已知，則返回 `true`。
- `getMemoryBase()`：如果流是基於記憶體的，則返回原生記憶體位址。

### 複製

- `duplicate()`：建立一個新的 `StreamAsset`，它共享相同的資料但具有獨立的位置。
- `fork()`：類似於 duplicate，但新流從原始流的當前位置開始。

## 在排版中的使用

`StreamAsset` 最常在處理 [`Typeface`](Typeface.md) 資料時遇到：

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... 處理字型資料
}
```