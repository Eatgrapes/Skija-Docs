# 拡張機能: Lottie & SVG

Skijaは、Lottie（Skottie経由）やSVGなどの人気のあるベクター形式を高レベルでサポートしており、複雑なアニメーションやアイコンをJavaアプリケーションに簡単に統合できます。

## Lottieアニメーション (Skottie)

SkottieはSkiaのLottieプレーヤーです。After EffectsからエクスポートされたJSONベースのアニメーションを読み込んで再生できます。

### アニメーションの読み込み

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### 再生とレンダリング

アニメーションを再生するには、特定の時間またはフレームに「シーク」してから、キャンバスにレンダリングする必要があります。

```java
// 正規化された時間: 0.0 (開始) から 1.0 (終了)
anim.seek(currentTime); 

// または特定のフレームインデックスにシーク
anim.seekFrame(24);

// キャンバスの特定の矩形領域にレンダリング
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## SVGサポート

SkijaはSVGファイルを解析してレンダリングできるSVG DOMを提供します。

### SVGの読み込みとレンダリング

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// SVGがレンダリングされるコンテナのサイズを設定
svg.setContainerSize(100, 100);

// キャンバスに描画
svg.render(canvas);
```

### SVGとのインタラクション

SVGのルート要素にアクセスして、固有サイズなどのプロパティをクエリできます。

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## いつ何を使うべきか？

- **Lottie:** 複雑なUIアニメーション、キャラクターアニメーション、表現豊かなトランジションに最適。
- **SVG:** 静的アイコン、シンプルなロゴ、イラストレーションに最適。
- **カスタムシェーダー (SkSL):** 手続き的に生成される背景、リアルタイムエフェクト、高度に動的なビジュアルに最適。