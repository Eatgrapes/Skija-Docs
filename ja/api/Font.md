# API リファレンス: フォントと管理

`Font` クラスはテキストのレンダリング方法を制御し、`FontMgr` はフォントの検出を処理し、`FontFeature` は高度な OpenType 機能を有効にします。

## Font

`Font` は [`Typeface`](Typeface.md) を受け取り、サイズ、スケール、傾斜、およびレンダリング属性を追加します。

### 作成

```java
// デフォルトフォント (通常は 12pt サンセリフ)
Font font = new Font();

// カスタムタイプフェイスとサイズ
Font font = new Font(typeface, 24f);

// コンデンス/エクスパンデッドまたは斜体テキスト
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()`: デフォルト値で初期化します。
- `new Font(typeface)`: 特定のタイプフェイスとデフォルトサイズで初期化します。
- `new Font(typeface, size)`: 特定のタイプフェイスとサイズで初期化します。
- `new Font(typeface, size, scaleX, skewX)`: 完全なコンストラクタ。

### メトリクスと間隔

- `getSize()` / `setSize(value)`: ポイント単位のタイポグラフィサイズ。
- `getScaleX()` / `setScaleX(value)`: 水平スケール (1.0 が通常)。
- `getSkewX()` / `setSkewX(value)`: 水平傾斜 (0 が通常)。
- `getMetrics()`: 詳細な [`FontMetrics`](#fontmetrics) を返します。
- `getSpacing()`: 推奨行間隔 (上昇、下降、およびリーディングの合計)。

### レンダリングフラグ

これらはグリフのラスタライズ方法に影響します。

- `setSubpixel(boolean)`: より滑らかなテキストのためのサブピクセル配置を要求します。
- `setEdging(FontEdging)`: アンチエイリアシングを制御します (`ALIAS`, `ANTI_ALIAS`, `SUBPIXEL_ANTI_ALIAS`)。
- `setHinting(FontHinting)`: グリフアウトライン調整を制御します (`NONE`, `SLIGHT`, `NORMAL`, `FULL`)。
- `setEmboldened(boolean)`: ストローク幅を増やすことで太字を近似します。
- `setBaselineSnapped(boolean)`: ベースラインをピクセル位置にスナップします。
- `setMetricsLinear(boolean)`: 線形にスケーラブルなメトリクスを要求します (ヒンティング/丸めを無視)。
- `setBitmapsEmbedded(boolean)`: アウトラインの代わりにフォント内のビットマップを使用するよう要求します。

### テキストの測定

```java
// 単純な幅の測定
float width = font.measureTextWidth("Hello");

// 正確なバウンディングボックスを取得
Rect bounds = font.measureText("Hello");

// 特定のペイント効果を使用して幅を測定
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)`: バウンディングボックスを返します。
- `measureTextWidth(string)` / `measureTextWidth(string, paint)`: 前進幅を返します。
- `getWidths(glyphs)`: 各グリフ ID の前進幅を取得します。
- `getBounds(glyphs)` / `getBounds(glyphs, paint)`: 各グリフ ID のバウンディングボックスを取得します。

### グリフアクセス

- `getStringGlyphs(string)`: テキストをグリフ ID の配列に変換します。
- `getUTF32Glyph(unichar)`: 単一文字のグリフ ID を返します。
- `getUTF32Glyphs(uni)`: 文字配列のグリフ ID を返します。
- `getStringGlyphsCount(string)`: テキストが表すグリフの数を返します。
- `getPath(glyph)`: 単一グリフのアウトライン [`Path`](Path.md) を返します。
- `getPaths(glyphs)`: グリフ配列のアウトラインを返します。

---

## FontMgr

`FontMgr` (フォントマネージャー) はフォントファイルの検出と読み込みを管理します。

### マネージャーへのアクセス

- `FontMgr.getDefault()`: グローバルデフォルトのフォントマネージャーを返します。

### タイプフェイスの検索

```java
FontMgr mgr = FontMgr.getDefault();

// 名前とスタイルで一致
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// 特定の文字 (例: 絵文字) に対するシステムフォールバックを使用して一致
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)`: 最も近い一致するタイプフェイスを見つけます。
- `matchFamiliesStyle(families[], style)`: 複数のファミリー名を順番に試します。
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)`: 特定の Unicode 文字をサポートするフォントを見つけます。
- `getFamiliesCount()`: システムで利用可能なフォントファミリーの数を返します。
- `getFamilyName(index)`: フォントファミリーの名前を返します。

### フォントの読み込み

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)`: ファイルからフォントを読み込みます。
- `makeFromData(data)` / `makeFromData(data, ttcIndex)`: メモリからフォントを読み込みます。

---

## FontFeature

`FontFeature` は合字、カーニング、または代替文字などの OpenType 機能を有効にします。

```java
// 特定の機能を有効化
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// 手動で作成
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)`: 文字列から機能を解析します (例: `"+liga -kern"`)。
- `new FontFeature(tag)`: 機能を有効にします (値 = 1)。
- `new FontFeature(tag, value)`: 機能を特定の値に設定します。
- `new FontFeature(tag, value, start, end)`: 機能をテキストの特定の範囲に適用します。

---

## FontMetrics

フォントのサイズでスケーリングされた詳細な測定値。

- `getTop()` / `getBottom()`: ベースラインの上/下の範囲 (最大)。
- `getAscent()` / `getDescent()`: 平均範囲 (上昇は負の値)。
- `getLeading()`: 推奨される行間のスペース。
- `getCapHeight()`: 大文字の高さ。
- `getXHeight()`: 小文字の高さ。
- `getThickness()` / `getUnderlinePosition()`: 下線を描画するための値。