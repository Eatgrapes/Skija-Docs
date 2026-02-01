# API リファレンス: TextLine

`TextLine` は、整形された単一行のテキストを表します。通常 `Shaper` によって作成され、テキストエディタやインタラクティブなラベルを構築するために不可欠なメトリック情報とヒットテスト機能を提供します。

## 作成

```java
// 単一行のテキストを整形する
TextLine line = TextLine.make("Hello World", font);
```

## メトリクス

- `getAscent()`: ベースラインから最上位グリフの頂点までの距離（負の値）。
- `getDescent()`: ベースラインから最下位グリフの底辺までの距離（正の値）。
- `getCapHeight()`: 大文字の高さ。
- `getXHeight()`: 小文字 'x' の高さ。
- `getWidth()`: 行の合計前進幅。
- `getHeight()`: 合計高さ (descent - ascent)。

## ヒットテスト (インタラクション)

`TextLine` は、ピクセル座標と文字オフセットの間をマッピングするメソッドを提供します。

```java
// 1. 座標からオフセットを取得 (クリック)
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // UTF-16 文字インデックスを返す
// 'offset' はマウスカーソルに最も近い位置になります

// 2. オフセットから座標を取得 (カーソル配置)
float cursorX = line.getCoordAtOffset(offset);
// (cursorX, baseline) にカーソルを描画
```

- `getOffsetAtCoord(x)`: 最も近い文字オフセット。
- `getLeftOffsetAtCoord(x)`: 厳密に左側にある文字オフセット。
- `getCoordAtOffset(offset)`: 指定された文字インデックスのピクセルX座標。

## レンダリング

```java
// 行を直接描画できます
canvas.drawTextLine(line, x, y, paint);

// または、より手動での制御のために TextBlob を抽出します
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## ライフサイクル
`TextLine` は `Managed` を実装しています。ネイティブリソースを解放するため、使用後は必ず閉じてください。

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... line を使用 ...
}
```