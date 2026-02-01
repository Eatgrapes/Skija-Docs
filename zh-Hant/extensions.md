# 擴充功能：Lottie 與 SVG

Skija 內建對熱門向量格式的高階支援，例如 Lottie（透過 Skottie）和 SVG，讓您能輕鬆將複雜的動畫與圖示整合至 Java 應用程式中。

## Lottie 動畫（Skottie）

Skottie 是 Skia 的 Lottie 播放器。它能載入並播放從 After Effects 匯出的 JSON 格式動畫。

### 載入動畫

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### 播放與渲染

要播放動畫，您需要「跳轉」至特定時間或影格，然後將其渲染至畫布上。

```java
// 標準化時間：0.0（開始）至 1.0（結束）
anim.seek(currentTime); 

// 或跳轉至特定影格索引
anim.seekFrame(24);

// 渲染至畫布上的特定矩形區域
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## SVG 支援

Skija 提供 SVG DOM，可解析並渲染 SVG 檔案。

### 載入與渲染 SVG

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// 設定 SVG 將被渲染的容器尺寸
svg.setContainerSize(100, 100);

// 將其繪製至畫布
svg.render(canvas);
```

### 與 SVG 互動

您可以存取 SVG 的根元素以查詢其屬性，例如其固有尺寸。

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## 何時使用何種格式？

- **Lottie：** 最適合複雜的 UI 動畫、角色動畫和富有表現力的轉場效果。
- **SVG：** 最適合靜態圖示、簡單標誌和插圖。
- **自訂著色器（SkSL）：** 最適合程序化生成的背景、即時效果和高度動態的視覺效果。