# API 參考：SamplingMode

`SamplingMode` 是一個介面，定義了當圖片縮放、旋轉或變形時，像素如何被取樣。

## 實作方式

在 Skija 中，主要有三種指定取樣的方式：

1.  **[`FilterMipmap`](#filtermipmap)**：標準的線性/最近鄰過濾，可選是否使用 Mipmap。
2.  **[`CubicResampler`](CubicResampler.md)**：高品質的雙三次插值（Mitchell、Catmull-Rom）。
3.  **`SamplingModeAnisotropic`**：針對銳角視角的紋理進行高品質過濾。

## 常用預設值

- `SamplingMode.DEFAULT`：最近鄰過濾（最快，有鋸齒感）。
- `SamplingMode.LINEAR`：雙線性過濾（平滑，大多數情況下的預設值）。
- `SamplingMode.MITCHELL`：高品質雙三次過濾（平滑且銳利）。
- `SamplingMode.CATMULL_ROM`：非常銳利的雙三次過濾。

## FilterMipmap

這是最常見的取樣模式。它使用兩個參數：

### FilterMode
- `NEAREST`：取樣單個最接近的像素。
- `LINEAR`：在 4 個最接近的像素之間進行插值。

### MipmapMode
- `NONE`：不使用 Mipmap。
- `NEAREST`：從最接近的 Mipmap 層級取樣。
- `LINEAR`：在兩個 Mipmap 層級之間進行插值（三線性過濾）。

## 使用方式

```java
// 雙線性取樣
canvas.drawImage(img, 0, 0, SamplingMode.LINEAR, null);

// 最近鄰取樣（像素藝術風格）
canvas.drawImage(img, 0, 0, SamplingMode.DEFAULT, null);

// 高品質雙三次取樣
canvas.drawImage(img, 0, 0, CubicResampler.MITCHELL, null);
```