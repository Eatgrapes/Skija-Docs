# API リファレンス: TextBlob & Builder

`TextBlob` は、一連のグリフの不変で最適化された表現です。テキストのレイアウト（グリフの位置）が変わらない場合、Skija でテキストを描画する最速の方法です。

## TextBlob

`TextBlob` は、グリフ、位置、フォントを単一のオブジェクトに結合し、再利用できるようにします。

### プロパティ
- `getBounds()`: ブロブの保守的なバウンディングボックスを返します。
- `getUniqueId()`: キャッシング用の一意の識別子を返します。
- `serializeToData()`: ブロブを `Data` オブジェクトにシリアライズします。

### 位置からの作成
グリフの位置を（`Shaper` を使用するか手動で）すでに計算している場合は、直接ブロブを作成できます。

```java
// 水平位置のみ（yは一定）
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// 各グリフの完全な (x, y) 位置
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// 各グリフの RSXform (回転 + スケール + 平行移動)
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### 描画
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` を使用すると、複数のテキストの「ラン」を追加することで `TextBlob` を構築できます。「ラン」とは、同じフォントとペイントを共有する一連のグリフです。

### 基本的な使用法

```java
TextBlobBuilder builder = new TextBlobBuilder();

// テキストのランを追加
builder.appendRun(font, "Hello ", 0, 0);

// 別のランを追加（例：異なるスタイルや位置）
builder.appendRun(boldFont, "World!", 100, 0);

// 不変の TextBlob をビルド
TextBlob blob = builder.build();
```

### 高度な追加
- `appendRun(font, glyphs, x, y, bounds)`: 共有された原点を持つグリフを追加します。
- `appendRunPosH(...)`: 明示的な X 位置を持つグリフを追加します。
- `appendRunPos(...)`: 明示的な (X, Y) 位置を持つグリフを追加します。
- `appendRunRSXform(...)`: 完全なアフィン変換（回転/スケール）を持つグリフを追加します。

### パフォーマンスのヒント
同じ段落のテキストを複数回描画する場合（キャンバスが移動しても）、`TextBlob` を一度作成して再利用してください。これにより、グリフの位置と形状の再計算が回避されます。