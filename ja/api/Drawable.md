# APIリファレンス: Drawable

`Drawable`クラスを使用すると、独自の描画ロジックと状態をカプセル化したカスタム描画オブジェクトを作成できます。これは`Picture`と似ていますが、`Picture`が描画コマンドの静的な記録であるのに対し、`Drawable`はレンダリング中にJavaコードをコールバックするため、動的な動作が可能です。

## 概要

`Drawable`を使用するには、サブクラスを作成して2つのメソッドをオーバーライドする必要があります：
1.  `onDraw(Canvas canvas)`: 描画ロジック
2.  `onGetBounds()`: 描画のバウンディングボックスを返す

## カスタムDrawableの作成

```java
public class MyDrawable extends Drawable {
    private final Paint paint = new Paint().setColor(0xFFFF0000);

    @Override
    public void onDraw(Canvas canvas) {
        // 描画が必要なときに呼び出されます
        canvas.drawCircle(50, 50, 40, paint);
    }

    @Override
    public Rect onGetBounds() {
        // 描画内容の保守的な境界を返します
        return Rect.makeXYWH(10, 10, 80, 80);
    }
}
```

## Drawableの使用

`Drawable`はキャンバスに直接描画したり、変換したりできます。

```java
MyDrawable drawable = new MyDrawable();

// (0, 0)に描画
drawable.draw(canvas);

// (100, 100)に描画
drawable.draw(canvas, 100, 100);

// マトリックスを使用して描画
drawable.draw(canvas, Matrix33.makeScale(2.0f));
```

または、`Canvas`には専用のメソッドもあります：
```java
canvas.drawDrawable(drawable);
```

## 状態と無効化

`Drawable`には**ジェネレーションID**（`getGenerationId()`）があり、クライアントが出力をキャッシュできるようにします。Drawableの内部状態（色やテキストなど）が変更された場合は、`notifyDrawingChanged()`を呼び出してキャッシュを無効化する必要があります。

```java
public class TextDrawable extends Drawable {
    private String text = "Hello";
    
    public void setText(String newText) {
        this.text = newText;
        // 重要: Skijaに内容が変更されたことを伝えます！
        notifyDrawingChanged();
    }
    
    // ... onDrawの実装 ...
}
```

## Drawable vs. Picture

- **Picture**: 高速な再生、不変、コマンドを一度記録。複雑な静的なコンテンツに最適。
- **Drawable**: 動的、毎フレームJavaコードを呼び出し。レンダリング時にロジックで描画内容を決定する場合や、再利用可能な「ウィジェット」の作成に最適。