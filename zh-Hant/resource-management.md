# 資源管理

Skija 是 C++ Skia 函式庫的 Java 封裝。這意味著許多 Java 物件背後都有對應的 C++ 原生資源。了解這些資源如何管理對於建構穩定且高效的應用程式至關重要。

## 自動記憶體管理

預設情況下，Skija 會自動管理記憶體。大多數 Skija 物件都繼承自 `Managed` 類別。當 Java 物件被垃圾回收時，Skija 會確保對應的 C++ 原生資源也被釋放。

```java
void drawSomething(Canvas canvas) {
    Paint paint = new Paint(); // 分配原生資源
    canvas.drawCircle(50, 50, 20, paint);
} // paint 超出作用域，最終將由 GC 清理
```

對於大多數使用情境，這種「預設安全」的行為正是您所需要的。

## 手動資源釋放

在效能關鍵的應用程式中，或是處理大量短生命週期物件時，您可能希望立即釋放原生資源，而不是等待垃圾回收器。

所有 `Managed` 物件都實作了 `AutoCloseable` 介面，因此您可以使用 `try-with-resources` 模式：

```java
void drawCircle(Canvas canvas) {
    try (Paint p = new Paint()) {
        canvas.drawCircle(50, 50, 20, p);
    } // 原生資源在此處立即釋放
}
```

**警告：** 物件一旦關閉，就無法再次使用。嘗試使用已關閉的物件將導致異常或程式崩潰。

## 重複使用物件

由於建立原生物件可能帶來一些開銷，通常最好重複使用它們，特別是在渲染迴圈中。

```java
class MyApp {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    void onRender(Canvas canvas) {
        canvas.drawCircle(100, 100, 50, paint); // 重複使用同一個 paint 物件
    }
}
```

## 封裝與 Getter 方法

Skija 對其資料類別（如 `Rect`、`Color4f`）使用特定的命名慣例。您經常會看到以下底線開頭的公開欄位（例如 `Color4f` 中的 `_r`、`_g`、`_b`）。

**慣例：**
- 以下底線 `_` 開頭的欄位應視為**私有/內部**。
- 公開 API 存取時，請一律使用提供的 **getter** 方法（例如 `getR()`、`getG()`）。

```java
Color4f color = new Color4f(1f, 0f, 0f);

float r = color._r;    // 避免：存取內部欄位
float r2 = color.getR(); // 建議：使用公開 getter 方法
```

這種方法讓 Skija 能夠在未來版本中變更這些資料類別的內部實作時，仍保持穩定的 API。