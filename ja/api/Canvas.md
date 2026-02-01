# API リファレンス: Canvas

`Canvas` クラスは、Skija におけるすべての描画操作の中心点です。変換やクリッピングを含む描画状態を管理します。

## 概要

`Canvas` はピクセル自体を保持しません。`Surface` や `Bitmap` などの宛先に描画コマンドを指示するインターフェースです。

## 状態管理

Canvas は状態のスタックを維持します。現在の状態（マトリックスとクリップ）を保存し、後で復元できます。

- `save()`: 現在のマトリックスとクリップのコピーをスタックにプッシュします。保存カウントを返します。
- `restore()`: スタックをポップし、マトリックスとクリップを前の状態にリセットします。
- `restoreToCount(count)`: 特定の保存カウントに復元します。
- `getSaveCount()`: 現在のスタックの深さを返します。

### レイヤー

レイヤーは描画用のオフスクリーンバッファを作成し、復元時にメインキャンバスに合成されます。

- `saveLayer(rect, paint)`: 状態を保存し、描画をレイヤーにリダイレクトします。`paint` は、合成時にレイヤーのアルファ/ブレンディングを制御します。
- `saveLayerAlpha(rect, alpha)`: 不透明度のみを変更する簡易版。
- `saveLayer(SaveLayerRec)`: 高度なレイヤー制御（背景、タイルモード）。

```java
// ぼかしフィルターを作成
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
SaveLayerRec rec = new SaveLayerRec(null, null, blur);

canvas.saveLayer(rec);
    // ここで描画されたすべてのものは、ぼかされた背景の上に表示されます
    // （「すりガラス」効果の作成）
    canvas.drawRect(Rect.makeWH(200, 200), new Paint().setColor(0x80FFFFFF));
canvas.restore();
```

## 変換

変換は、以降のすべての描画操作に影響します。

- `translate(dx, dy)`: 原点を移動します。
- `scale(sx, sy)`: 座標をスケーリングします。
- `rotate(degrees)`: 現在の原点を中心に回転します。
- `skew(sx, sy)`: 座標系を傾斜させます。
- `concat(matrix)`: カスタムの `Matrix33` または `Matrix44` で乗算します。
- `setMatrix(matrix)`: 現在のマトリックスを完全に置き換えます。
- `resetMatrix()`: 単位マトリックスにリセットします。
- `getLocalToDevice()`: 現在の総変換マトリックスを返します。

## クリッピング

クリッピングは、描画が発生する領域を制限します。

- `clipRect(rect, mode, antiAlias)`: 矩形にクリップします。
- `clipRRect(rrect, mode, antiAlias)`: 角丸矩形にクリップします。
- `clipPath(path, mode, antiAlias)`: パスにクリップします。
- `clipRegion(region, mode)`: 領域（ピクセル整列）にクリップします。

## 描画メソッド


### 基本プリミティブ

```java
// 点を描画（ペイントのキャップに応じてピクセルまたは円）
canvas.drawPoint(50, 50, new Paint().setColor(0xFF0000FF).setStrokeWidth(5));

// 線を描画
canvas.drawLine(10, 10, 100, 100, paint);

// 矩形を描画（ペイントモードに応じて輪郭または塗りつぶし）
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);

// 円を描画
canvas.drawCircle(100, 100, 40, paint);

// 楕円を描画
canvas.drawOval(Rect.makeXYWH(50, 50, 100, 50), paint);

// 角丸矩形を描画（半径は複雑に設定可能）
canvas.drawRRect(RRect.makeXYWH(50, 50, 100, 100, 10), paint);

// 円弧を描画（扇形またはストローク）
// startAngle: 0 は右、sweepAngle: 時計回りの角度
canvas.drawArc(Rect.makeXYWH(50, 50, 100, 100), 0, 90, true, paint);
```

- `drawPoint(x, y, paint)`: 単一の点を描画します。
- `drawPoints(points, paint)`: 点のコレクションを描画します（ペイントのキャップに応じて線/ポリゴンも可能）。
- `drawLine(x0, y0, x1, y1, paint)`: 線分を描画します。
- `drawLines(points, paint)`: 各点のペアに対して独立した線分を描画します。
- `drawRect(rect, paint)`: 矩形を描画します。
- `drawOval(rect, paint)`: 楕円を描画します。
- `drawCircle(x, y, radius, paint)`: 円を描画します。
- `drawRRect(rrect, paint)`: 角丸矩形を描画します。
- `drawDRRect(outer, inner, paint)`: 2つの角丸矩形の間の領域（環状領域）を描画します。
- `drawArc(rect, startAngle, sweepAngle, useCenter, paint)`: 扇形（パイスライス）または円弧ストロークを描画します。
- `drawPath(path, paint)`: パスを描画します。
- `drawRegion(region, paint)`: 特定の領域を描画します。

### 塗りつぶしとクリア

```java
// キャンバス/レイヤー全体を特定の色で塗りつぶす（既存のコンテンツとブレンド）
canvas.drawColor(0x80FF0000); // 50% 赤のオーバーレイ

// キャンバス全体を透明にクリアする（コンテンツを置き換え、ブレンドなし）
canvas.clear(0x00000000);

// 現在のクリップ領域を特定のペイントで塗りつぶす
// 画面をシェーダーや複雑なペイント効果で塗りつぶすのに便利
canvas.drawPaint(new Paint().setShader(myGradient));
```

- `clear(color)`: クリップ領域全体を色で塗りつぶします（ピクセルを置き換え、ブレンドを無視します）。
- `drawColor(color, mode)`: クリップ領域を色で塗りつぶします（ブレンドを尊重します）。
- `drawPaint(paint)`: クリップ領域を指定されたペイントで塗りつぶします（シェーダーでの塗りつぶしに便利）。

### 画像とビットマップ

```java
// 画像を (0, 0) に描画
canvas.drawImage(image, 0, 0);

// 画像を特定の矩形にスケーリングして描画
canvas.drawImageRect(image, Rect.makeXYWH(0, 0, 200, 200));

// 9スライス画像を描画（スケーラブルなUI要素）
// center: ソース画像の中間のスケーラブル領域
// dst: 描画先のターゲット矩形
canvas.drawImageNine(image, IRect.makeLTRB(10, 10, 20, 20), Rect.makeXYWH(0, 0, 100, 50), FilterMode.LINEAR, null);
```

- `drawImage(image, x, y, paint)`: 座標に画像を描画します。
- `drawImageRect(image, src, dst, sampling, paint, strict)`: 画像の一部をスケーリングして宛先矩形に描画します。
- `drawImageNine(image, center, dst, filter, paint)`: 9スライスのスケーラブルな画像を描画します。
- `drawBitmap(bitmap, x, y, paint)`: ビットマップ（ラスターデータ）を描画します。

### テキスト

```java
// シンプルなテキスト描画
canvas.drawString("Hello World", 50, 50, font, paint);

// TextBlob を使用した高度なテキスト描画（事前計算されたレイアウト）
canvas.drawTextBlob(blob, 50, 50, paint);

// TextLine の描画（Shaper から）
canvas.drawTextLine(line, 50, 50, paint);
```

- `drawString(string, x, y, font, paint)`: シンプルな文字列を描画します。
- `drawTextBlob(blob, x, y, paint)`: 事前計算されたテキストブロブを描画します。
- `drawTextLine(line, x, y, paint)`: シェイプされた `TextLine` を描画します。

### 高度な描画

```java
// 三角形メッシュを描画（カスタム3D効果やワープ用）
canvas.drawVertices(
    new Point[] { new Point(0, 0), new Point(100, 0), new Point(50, 100) },
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF }, // 頂点ごとの色
    null, // テクスチャ座標なし
    null, // インデックスなし（頂点を順番に使用）
    BlendMode.MODULATE,
    new Paint()
);

// 矩形のドロップシャドウを描画
// （手動でシャドウフィルターを作成するよりも簡単）
canvas.drawRectShadow(
    Rect.makeXYWH(50, 50, 100, 100),
    5, 5,  // dx, dy
    10,    // ぼかし
    0,     // 広がり
    0x80000000 // シャドウ色
);
```

- `drawPicture(picture)`: 記録された `Picture` を再生します。
- `drawDrawable(drawable)`: 動的な `Drawable` オブジェクトを描画します。
- `drawVertices(positions, colors, texCoords, indices, mode, paint)`: 三角形メッシュを描画します。
- `drawPatch(cubics, colors, texCoords, mode, paint)`: クーンパッチを描画します。
- `drawRectShadow(rect, dx, dy, blur, spread, color)`: シンプルなドロップシャドウを描画するヘルパー。

## ピクセルアクセス

```java
// キャンバスからピクセルを読み取り、ビットマップに格納
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));
canvas.readPixels(bmp, 0, 0); // キャンバスの (0,0) から読み取り開始

// ピクセルをキャンバスに書き戻す
canvas.writePixels(bmp, 50, 50);
```

- `readPixels(bitmap, srcX, srcY)`: キャンバスからピクセルを読み取り、ビットマップに格納します。
- `writePixels(bitmap, x, y)`: ビットマップからピクセルをキャンバスに書き込みます。