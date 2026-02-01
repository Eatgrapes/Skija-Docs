# API リファレンス: Typeface

`Typeface` クラスは、特定の書体デザイン（例: "Helvetica Bold"）を表します。フォントファイルデータへのハンドルであり、`Font` インスタンスを作成するために使用されます。

## 作成

### ファイルから
ファイルパスから書体を読み込みます。

```java
// ファイル内の最初のフォントを読み込む（インデックス 0）
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// コレクション（TTC）から特定のフォントインデックスを読み込む
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### データから
`Data` オブジェクト（メモリ）から書体を読み込みます。

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### 名前から（システム）
名前でシステムフォントを検索します。

```java
// "Arial", "Times New Roman" など
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## プロパティ

- `getFamilyName()`: ファミリー名（例: "Inter"）を返します。
- `getFontStyle()`: `FontStyle`（ウェイト、幅、傾斜）を返します。
- `isBold()`: ウェイトが 600 以上の場合に true を返します。
- `isItalic()`: 傾斜が直立でない場合に true を返します。
- `isFixedPitch()`: 文字が同じ幅（等幅）の場合に true を返します。
- `getUnitsPerEm()`: em あたりのフォントユニット数を返します。
- `getBounds()`: フォント内のすべてのグリフのバウンディングボックスを返します。

## グリフアクセス

- `getStringGlyphs(string)`: Java 文字列をグリフ ID の配列（`short[]`）に変換します。
- `getUTF32Glyph(codePoint)`: 単一の Unicode コードポイントに対するグリフ ID を返します。
- `getGlyphsCount()`: 書体内のグリフの総数を返します。

## テーブル

TrueType/OpenType テーブルへの高度なアクセス。

- `getTableTags()`: フォント内のすべてのテーブルタグ（例: "head", "cmap", "glyf"）のリストを返します。
- `getTableData(tag)`: 特定のテーブルの生データを `Data` オブジェクトとして返します。
- `getTableSize(tag)`: 特定のテーブルのサイズを返します。

## クローン作成（可変フォント）

可変フォントの場合、特定の軸の値を持つ書体のクローンを作成できます。

```java
// バリエーションインスタンスを作成（例: Weight = 500）
FontVariation weight = new FontVariation("wght", 500);

// このバリエーションで書体をクローンする
Typeface medium = variableFace.makeClone(weight);
```