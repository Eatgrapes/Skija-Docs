# Skija 中的陰影

Skija 提供兩種不同的繪製陰影方式：**2D 投影陰影**（透過 ImageFilters）和 **3D 高程陰影**（透過 ShadowUtils）。

## 1. 2D 投影陰影 (ImageFilter)

這是為特定繪製操作添加陰影的標準方式。陰影會跟隨所繪製的幾何形狀或圖像的形狀。

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // 偏移量 (dx, dy)
    3.0f, 3.0f,   // 模糊量 (sigmaX, sigmaY)
    0x80000000    // 陰影顏色 (50% 透明黑色)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### 僅繪製陰影
如果只想繪製陰影而不繪製原始物件（例如，用於複雜的分層），請使用 `makeDropShadowOnly`。

---

## 2. 3D 高程陰影 (ShadowUtils)

`ShadowUtils` 提供了一個更基於物理的陰影模型，類似於 Material Design 的高程概念。它計算特定 3D 位置的光源如何將「遮擋物」（一個 Path）的陰影投射到畫布平面上。

### 基本用法

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Z 平面：物體的高程。
// 對於平坦的 UI 元素通常是常數：(0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f); 

// 光源位置：相對於畫布的 3D 座標
Point3 lightPos = new Point3(250, 0, 600); 

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas, 
    path, 
    elevation, 
    lightPos, 
    lightRadius, 
    ambientColor, 
    spotColor, 
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// 注意：drawShadow 僅繪製陰影。
// 您仍然需要繪製物件本身：
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### 環境陰影 vs. 聚光陰影
- **環境陰影**：由間接光線引起的柔和、非定向陰影。
- **聚光陰影**：由特定光源位置引起的定向陰影。
結合兩者可以創造出逼真的深度效果。

### 陰影標誌
- `TRANSPARENT_OCCLUDER`：如果您的物件是半透明的，請使用此標誌，這樣陰影就不會被裁剪在物件下方。
- `GEOMETRIC_ONLY`：如果您不需要高品質的模糊效果，可以使用此優化標誌。
- `DIRECTIONAL_LIGHT`：將光源視為無限遠（如陽光）。

## 比較

| 特性 | 投影陰影 (ImageFilter) | 高程陰影 (ShadowUtils) |
| :--- | :--- | :--- |
| **模型** | 2D 高斯模糊 | 3D 透視投影 |
| **效能** | 快速（由 Skia 快取） | 更複雜，但高度優化 |
| **用法** | 在 `Paint` 上設定 | 直接呼叫 `ShadowUtils` |
| **最適合** | 文字、簡單的 UI 光暈、圖示 | Material Design 按鈕、卡片、深度效果 |

## 視覺範例

要查看這些陰影的實際效果，請執行 **Scenes** 範例應用程式並選擇 **ShadowUtils** 場景。

**原始碼：** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*圖：各種 ShadowUtils 標誌和光源位置的比較。*