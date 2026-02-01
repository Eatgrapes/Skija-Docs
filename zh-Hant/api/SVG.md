# API 參考：SVG

雖然 Skia 主要是一個低階繪圖引擎，但 Skija 包含了一個 SVG 模組，讓你能夠直接處理 SVG 檔案。這非常適合用於圖示、簡單插圖和標誌。

## 載入與渲染

Skija 中的 SVG 由 `SVGDOM` 類別管理。

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. 載入 SVG 資料
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. 定義視埠大小
// 這很重要！SVG 通常沒有固定尺寸。
svg.setContainerSize(200, 200);

// 3. 將其渲染到 Canvas 上
svg.render(canvas);
```

## 縮放 SVG

由於 SVG 是基於向量的，你可以將其縮放到任意尺寸而不會損失品質。只需在渲染前更改 `setContainerSize` 或使用 `canvas.scale()`。

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // 放大兩倍
svg.render(canvas);
canvas.restore();
```

## 存取根元素

你可以取得根 `<svg>` 元素來查詢原始尺寸或其他元資料。

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // 取得 SVG 檔案中定義的尺寸
}
```

## 效能提示：「點陣快取」

渲染 SVG 可能出奇地耗費資源，因為 Skia 每次都需要解析類似 XML 的結構並執行許多繪圖指令。

**最佳實踐：** 如果你有一個會出現多次的圖示（例如檔案管理器中的資料夾圖示），不要為每個實例呼叫 `svg.render()`。相反地，將其渲染到一個離螢幕的 `Image` 一次，然後繪製該圖像。

```java
// 執行一次
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// 在你的渲染迴圈中使用
canvas.drawImage(cachedIcon, x, y);
```

## 限制

Skija 的 SVG 實作是完整 SVG 規範的一個「子集」。它支援大多數常見功能（形狀、路徑、填充、漸變），但可能無法處理：
- 複雜的 CSS 樣式
- 腳本（SVG 內的 JavaScript）
- 某些冷門的濾鏡效果

對於大多數 UI 圖示和標誌，它都能完美運作。