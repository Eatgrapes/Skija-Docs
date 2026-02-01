# 资源管理

Skija 是 C++ Skia 库的 Java 封装。这意味着许多 Java 对象背后都有对应的原生 C++ 资源。理解这些资源的管理方式对于构建稳定高效的应用程序至关重要。

## 自动内存管理

默认情况下，Skija 会自动管理内存。大多数 Skija 对象都继承自 `Managed` 类。当 Java 对象被垃圾回收时，Skija 会确保对应的原生 C++ 资源也被释放。

```java
void drawSomething(Canvas canvas) {
    Paint paint = new Paint(); // 分配原生资源
    canvas.drawCircle(50, 50, 20, paint);
} // paint 超出作用域，最终会被 GC 清理
```

对于大多数使用场景，这种"默认安全"的行为正是您所需要的。

## 手动资源释放

在性能要求高的应用程序中，或者处理大量短生命周期对象时，您可能希望立即释放原生资源，而不是等待垃圾回收器。

所有 `Managed` 对象都实现了 `AutoCloseable` 接口，因此您可以使用 `try-with-resources` 模式：

```java
void drawCircle(Canvas canvas) {
    try (Paint p = new Paint()) {
        canvas.drawCircle(50, 50, 20, p);
    } // 原生资源在此处立即释放
}
```

**警告：** 对象一旦被关闭，就不能再次使用。尝试使用已关闭的对象将导致异常或崩溃。

## 重用对象

由于创建原生对象可能带来一些开销，通常最好重用它们，特别是在渲染循环中。

```java
class MyApp {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    void onRender(Canvas canvas) {
        canvas.drawCircle(100, 100, 50, paint); // 重用同一个 paint 对象
    }
}
```

## 封装与获取器

Skija 为其数据类（如 `Rect`、`Color4f`）使用特定的命名约定。您经常会看到以下划线开头的公共字段（例如 `Color4f` 中的 `_r`、`_g`、`_b`）。

**约定：**
- 以下划线 `_` 开头的字段应视为**私有/内部**字段。
- 始终使用提供的**获取器**（如 `getR()`、`getG()`）进行公共 API 访问。

```java
Color4f color = new Color4f(1f, 0f, 0f);

float r = color._r;    // 避免：访问内部字段
float r2 = color.getR(); // 推荐：使用公共获取器
```

这种方法使 Skija 能够保持稳定的 API，即使这些数据类的内部实现在未来版本中发生变化。