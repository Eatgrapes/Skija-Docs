# APIリファレンス: アニメーション (Skottie)

`Animation`クラス（`io.github.humbleui.skija.skottie`内）は、Lottieアニメーションの読み込みとレンダリングをサポートします。

## 概要

SkottieはSkia用の高性能なLottieプレーヤーです。`Animation`クラスを使用すると、ファイル、文字列、またはデータからLottieアニメーションを読み込み、特定のフレームを`Canvas`にレンダリングできます。

## 作成

- `makeFromString(data)`: JSON文字列から`Animation`を作成します。
- `makeFromFile(path)`: ファイルパスから`Animation`を作成します。
- `makeFromData(data)`: `Data`オブジェクトから`Animation`を作成します。

## レンダリング

- `render(canvas)`: 現在のフレームをアニメーションの自然なサイズで`(0, 0)`にキャンバスに描画します。
- `render(canvas, offset)`: 指定された`(x, y)`オフセットに現在のフレームを描画します。
- `render(canvas, left, top)`: 指定された座標に現在のフレームを描画します。
- `render(canvas, dst, renderFlags)`: 現在のフレームを宛先の`Rect`にスケーリングして描画します。

## 再生制御

特定のフレームをレンダリングするには、まずそのフレームにシークする必要があります。

- `seek(t)`: 正規化された時間`t`（範囲`[0..1]`）にシークします。
- `seek(t, ic)`: `InvalidationController`を使用して正規化された時間`t`にシークします。
- `seekFrame(t)`: 特定のフレームインデックス`t`（`duration * fps`に対する相対値）にシークします。
- `seekFrameTime(t)`: 特定の時間`t`（秒単位）にシークします。

## プロパティ

- `getDuration()`: アニメーションの総時間を秒単位で返します。
- `getFPS()`: フレームレート（1秒あたりのフレーム数）を返します。
- `getInPoint()`: インポイント（開始フレーム）をフレームインデックス単位で返します。
- `getOutPoint()`: アウトポイント（終了フレーム）をフレームインデックス単位で返します。
- `getVersion()`: Lottieのバージョン文字列を返します。
- `getSize()`: アニメーションの自然なサイズを`Point`として返します。
- `getWidth()`: アニメーションの幅を返します。
- `getHeight()`: アニメーションの高さを返します。

## 例

```java
// リソースまたはファイルシステムからアニメーションを読み込む
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // アニメーション情報を取得
    float duration = anim.getDuration(); // 秒単位
    float width = anim.getWidth();
    float height = anim.getHeight();

    // レンダリングの準備
    anim.seek(0.5f); // アニメーションの中間点（50%）に移動

    // キャンバスにレンダリング
    // Canvasインスタンス 'canvas' があることを前提
    canvas.save();
    canvas.translate(100, 100); // アニメーションの位置を設定
    anim.render(canvas);
    canvas.restore();
}
```