# API 參考：著色器

著色器根據像素在畫布上的位置定義其顏色。主要用於漸變、圖案和噪點。著色器通過 `paint.setShader(shader)` 分配給 `Paint` 物件。

## 漸變

漸變是最常見的著色器類型。Skija 支援以下幾種：

### 線性漸變
在兩點之間建立平滑過渡。

**視覺範例：**
參見 [`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) 以查看線性、徑向、掃描和圓錐漸變以及噪點著色器的範例。

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // 顏色（紅到藍）
);
```

### 徑向漸變
從中心點建立圓形過渡。

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // 中心 x, y, 半徑
    new int[] { 0xFFFFFFFF, 0xFF000000 } // 顏色（白到黑）
);
```

### 掃描漸變
建立圍繞中心點掃描的過渡（類似色輪）。

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // 中心 x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### 雙點圓錐漸變
在兩個圓之間建立過渡（適用於 3D 光照或光暈效果）。

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // 起始 x, y, 半徑
    70, 70, 40,          // 結束 x, y, 半徑
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## 噪點與圖案

### 柏林噪點
生成類似雲、大理石或火焰的紋理。

```java
// 分形噪點
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// 湍流噪點
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### 圖像著色器
將 `Image` 轉換為可平鋪或用於填充形狀的著色器。

```java
// 透過 Image 類別存取
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## 組合與修改

- `Shader.makeBlend(mode, dst, src)`：使用混合模式組合兩個著色器。
- `shader.makeWithLocalMatrix(matrix)`：對著色器的座標系統套用變換。
- `shader.makeWithColorFilter(filter)`：對著色器的輸出套用顏色濾鏡。

## 平鋪模式 (`FilterTileMode`)

當著色器（如漸變或圖像）需要填充大於其定義範圍的區域時：
- `CLAMP`：使用邊緣顏色填充其餘部分。
- `REPEAT`：重複圖案。
- `MIRROR`：重複圖案，並在邊緣處鏡像。
- `DECAL`：在範圍外渲染透明區域。