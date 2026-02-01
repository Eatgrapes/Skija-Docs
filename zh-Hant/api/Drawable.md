# API 參考：Drawable

`Drawable` 類別允許你建立自訂的繪圖物件，這些物件封裝了自身的繪圖邏輯和狀態。它類似於 `Picture`，但 `Picture` 是繪圖指令的靜態記錄，而 `Drawable` 在渲染過程中會回呼你的 Java 程式碼，從而實現動態行為。

## 概述

要使用 `Drawable`，你必須繼承它並覆寫兩個方法：
1.  `onDraw(Canvas canvas)`：繪圖邏輯。
2.  `onGetBounds()`：回傳繪圖的邊界框。

## 建立自訂 Drawable

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // 每當需要渲染 drawable 時，就會呼叫此方法
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // 回傳你所繪製內容的保守邊界
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## 使用 Drawable

你可以直接將 `Drawable` 繪製到畫布上，或對其進行變換。

```java
MyDrawable drawable = new MyDrawable();

// 在 (0, 0) 位置繪製
drawable.draw(canvas);

// 在 (100, 100) 位置繪製
drawable.draw(canvas, 100, 100);

// 使用矩陣進行繪製
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

或者，`Canvas` 有一個專門的方法：
```java
canvas.drawDrawable(drawable);
```

## 狀態與失效

`Drawable` 有一個**世代 ID** (`getGenerationId()`)，允許客戶端快取輸出。如果你的 drawable 改變了內部狀態（例如顏色或文字），你必須呼叫 `notifyDrawingChanged()` 來使快取失效。

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // 重要：告訴 Skija 內容已變更！
        notifyDrawingChanged();
    }
    
    // ... onDraw 實作 ...
}
```

## Drawable 與 Picture 的比較

- **Picture**：播放速度快、不可變、一次性記錄指令。最適合複雜的靜態內容。
- **Drawable**：動態、每幀都會呼叫 Java 程式碼。最適合在渲染時由邏輯決定繪製內容，或用於建立可重複使用的「小工具」。