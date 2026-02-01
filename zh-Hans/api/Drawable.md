# API 参考：Drawable

`Drawable` 类允许您创建自定义绘图对象，这些对象封装了自身的绘图逻辑和状态。它与 `Picture` 类似，但 `Picture` 是绘图命令的静态记录，而 `Drawable` 在渲染过程中会回调您的 Java 代码，从而实现动态行为。

## 概述

要使用 `Drawable`，您必须继承它并重写两个方法：
1.  `onDraw(Canvas canvas)`：绘图逻辑。
2.  `onGetBounds()`：返回绘图的边界框。

## 创建自定义 Drawable

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // 每当需要渲染 drawable 时，都会调用此方法
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // 返回您所绘制内容的保守边界
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## 使用 Drawable

您可以直接在画布上绘制 `Drawable` 或对其进行变换。

```java
MyDrawable drawable = new MyDrawable();

// 在 (0, 0) 处绘制
drawable.draw(canvas);

// 在 (100, 100) 处绘制
drawable.draw(canvas, 100, 100);

// 使用矩阵进行绘制
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

或者，`Canvas` 有一个专门的方法：
```java
canvas.drawDrawable(drawable);
```

## 状态与失效

`Drawable` 有一个**生成 ID** (`getGenerationId()`)，允许客户端缓存输出。如果您的 drawable 更改了其内部状态（例如颜色或文本），则必须调用 `notifyDrawingChanged()` 来使缓存失效。

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // 重要：告诉 Skija 内容已更改！
        notifyDrawingChanged();
    }
    
    // ... onDraw 实现 ...
}
```

## Drawable 与 Picture 对比

- **Picture**：播放速度快，不可变，一次性记录命令。最适合复杂的静态内容。
- **Drawable**：动态，每帧都会调用 Java 代码。最适合在渲染时由逻辑决定绘制内容，或用于创建可重用的“小部件”。