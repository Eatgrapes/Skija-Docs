# APIリファレンス: SVG

Skiaは主に低レベルの描画エンジンですが、SkijaにはSVGファイルを直接操作できるSVGモジュールが含まれています。これはアイコン、シンプルなイラスト、ロゴに最適です。

## 読み込みとレンダリング

SkijaでのSVGは`SVGDOM`クラスによって管理されます。

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. SVGデータを読み込む
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. ビューポートサイズを定義
// これは重要です！SVGはしばしば固定サイズを持ちません。
svg.setContainerSize(200, 200);

// 3. Canvasにレンダリング
svg.render(canvas);
```

## SVGのスケーリング

SVGはベクターベースであるため、品質を損なうことなく任意のサイズに拡大縮小できます。レンダリング前に`setContainerSize`を変更するか、`canvas.scale()`を使用するだけです。

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // 2倍の大きさにする
svg.render(canvas);
canvas.restore();
```

## ルート要素へのアクセス

元の寸法やその他のメタデータをクエリするために、ルートの`<svg>`要素を取得できます。

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // SVGファイルで定義されたサイズを取得
}
```

## パフォーマンスのヒント: 「ラスターキャッシュ」

SVGのレンダリングは驚くほど高コストになる可能性があります。なぜなら、SkiaはXMLのような構造を解析し、毎回多くの描画コマンドを実行する必要があるからです。

**ベストプラクティス:** ファイルマネージャーのフォルダアイコンのように、何度も表示されるアイコンがある場合、すべてのインスタンスに対して`svg.render()`を呼び出さないでください。代わりに、オフスクリーンの`Image`に一度レンダリングし、その画像を描画します。

```java
// 一度だけ実行
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// レンダリングループで使用
canvas.drawImage(cachedIcon, x, y);
```

## 制限事項

SkijaのSVG実装は、完全なSVG仕様の「サブセット」です。ほとんどの一般的な機能（形状、パス、塗りつぶし、グラデーション）をサポートしていますが、以下には対応できない場合があります:
- 複雑なCSSスタイリング
- スクリプティング（SVG内のJavaScript）
- 一部の特殊なフィルター効果

ほとんどのUIアイコンやロゴでは、完璧に動作します。