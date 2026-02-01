# 高度なタイポグラフィ：クリッピングとアニメーション

Skijaは、静的なテキストを描画するだけでなく、テキストをクリッピング、マスキング、アニメーションのための幾何学的オブジェクトとして使用するための強力なツールを提供します。

## テキストをクリップ（マスキング）として使用する

テキストをマスクとして使用するには（例：画像を文字の*内側*に表示する）、単純に「テキストにクリップする」ことはできません。代わりに、まずテキストを`Path`に変換する必要があります。

### 1. テキストからパスを取得する
特定のグリフの幾何学的アウトラインを取得するには、`Font.getPath()`を使用します。

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// これらのグリフのパスを取得
// 注：getPathsはパスの配列を返します（グリフごとに1つ）
// 通常、それらを結合するか、単に順番に描画します
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // テキストの位置を設定

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // グリフパスをその位置にオフセットしてメインパスに追加
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. キャンバスをクリップする
`Path`を取得したら、キャンバスをクリップできます。

```java
canvas.save();
canvas.clipPath(textPath);

// ここで画像（またはグラデーション、パターン）を描画
// 文字「MASK」の内側にのみ表示されます
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## テキストのアニメーション

Skijaは、`TextBlob`を介してグリフの位置に低レベルでアクセスすることで、高性能なテキストアニメーションを可能にします。

### 1. グリフごとのアニメーション（波打つテキスト）
文字列を描画する代わりに、各文字の位置を手動で計算します。

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// 各グリフの位置を計算
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 から 1.0

for (int i = 0; i < glyphs.length; i++) {
    // サイン波アニメーション
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// これらの明示的な位置からTextBlobを作成
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// 描画
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. パス上のテキスト（RSXform）
曲線に沿って（かつ曲線に合わせて回転する）テキストには、`RSXform`（回転・スケール・平行移動変換）を使用します。

```java
// APIの'TextBlob.makeFromRSXform'を参照
// これにより、各グリフごとに独立して回転と位置を指定できます。
```

## 可変フォント
可変フォント（`Inter-Variable.ttf`など）がある場合、そのウェイトや傾斜を滑らかにアニメーションさせることができます。

```java
// 1. FontVariationインスタンスを作成
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // ウェイト100から700

// 2. 可変ベースから特定のTypefaceを作成
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. Fontを作成して描画
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## まとめ

- **クリッピング:** テキスト -> グリフ -> パス -> `canvas.clipPath()`に変換。
- **波打つ/移動するテキスト:** `Point[]`の位置を手動で計算し、`TextBlob.makeFromPos()`を使用。
- **パス上のテキスト:** `TextBlob.makeFromRSXform()`を使用。
- **ウェイト/スタイルのアニメーション:** 可変フォントと`makeClone(FontVariation)`を使用。