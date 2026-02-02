# API リファレンス: カラー & エンコーディング

このページでは、高精度カラー表現、ピクセルフォーマット、アルファチャンネルの解釈、およびカラースペースについて説明します。

---

## Color4f

`Color4f` は、4つの浮動小数点数値（RGBA）を使用して色を表現します。各値は通常 0.0 から 1.0 の範囲を取り、従来の8ビット整数よりもはるかに高い精度を実現します。

### コンストラクタ

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`: 不透明色（アルファ = 1.0）。
- `new Color4f(int color)`: 標準の ARGB 8888 整数を浮動小数点コンポーネントに変換します。

### メソッド

- `toColor()`: ARGB 8888 整数に変換し戻します。
- `makeLerp(other, weight)`: 2色間を線形補間します。

### 例

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// Paintでの使用例
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` は、ピクセル内でのビットの配置方法（例：チャンネルの順序とビット深度）を記述します。

### 一般的なタイプ

- `RGBA_8888`: チャンネルあたり8ビット、赤が先頭。
- `BGRA_8888`: チャンネルあたり8ビット、青が先頭（Windowsで一般的）。
- `N32`: 現在のプラットフォーム用のネイティブ32ビットフォーマット（通常はRGBAまたはBGRAにマッピング）。
- `F16`: チャンネルあたり16ビット半精度浮動小数点（ハイダイナミックレンジ用）。
- `GRAY_8`: グレースケール用の単一8ビットチャンネル。
- `ALPHA_8`: 透明度マスク用の単一8ビットチャンネル。

---

## ColorAlphaType

`ColorAlphaType` は、アルファチャンネルをどのように解釈すべきかを記述します。

- `OPAQUE`: すべてのピクセルが完全に不透明。アルファチャンネルは無視されます。
- `PREMUL`: カラーコンポーネントがアルファ値で乗算済み（Skiaのパフォーマンス上、標準）。
- `UNPREMUL`: カラーコンポーネントはアルファ値から独立しています。

---

## ColorSpace

`ColorSpace` は、色の範囲（色域）と線形性を定義します。

### 一般的なカラースペース

- `ColorSpace.getSRGB()`: Webおよびほとんどのモニター用の標準カラースペース。
- `ColorSpace.getSRGBLinear()`: 線形変換関数を持つsRGB（数値演算/ブレンディングに有用）。
- `ColorSpace.getDisplayP3()`: 最新のAppleデバイスで使用される広色域カラースペース。

### メソッド

- `isSRGB()`: スペースがsRGBの場合にtrueを返します。
- `isGammaLinear()`: 変換関数が線形の場合にtrueを返します。
- `convert(to, color)`: `Color4f` をこのスペースから別のスペースに変換します。

### 使用例

```java
// 特定のエンコーディングでImageInfoを作成
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
```