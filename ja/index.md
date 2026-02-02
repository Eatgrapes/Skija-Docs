---
layout: home

hero:
  name: Skija
  text: Skia の Java バインディング
  tagline: JVM 上の高性能なハードウェアアクセラレーション対応 2D グラフィックス。
  actions:
    - theme: brand
      text: はじめに
      link: /getting-started
    - theme: alt
      text: GitHub を見る
      link: https://github.com/HumbleUI/Skija

features:
  - title: ハードウェアアクセラレーション
    details: Skia を通じて OpenGL、Metal、Vulkan、Direct3D を活用し、滑らかなパフォーマンスを実現。
  - title: 豊かなタイポグラフィ
    details: HarfBuzz による高度なテキストシェーピングと SkParagraph による複雑なレイアウト。
  - title: 最新のシェーダー
    details: SkSL (Skia Shading Language) を使用してカスタム GPU シェーダーを作成可能。
---

::: warning 非公式ドキュメント
このドキュメントはコミュニティによって管理されており、Skia または Skija プロジェクトの公式出版物では**ありません**。
間違いを見つけた場合や提案がある場合は、[**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs) で報告してください。
:::

## ドキュメント一覧

### 基本

- [**Getting Started**](../getting-started.md): Skija の仕組みの概要と始め方。
- [**Installation**](../installation.md): Windows、macOS、Linux 用のプロジェクト依存関係のセットアップ。
- [**Rendering Basics**](../rendering-basics.md): Surface、Canvas、そして最初の「Hello World」。
- [**Colors and Alpha**](../colors.md): 透明度、プリマルチプライ、色空間の処理。
- [**Color API**](../api/Color.md): High-precision representation, formats, and spaces.
- [**Animation**](../animation.md): 動きの作成、ゲームループ、Lottie/GIF アニメーションの再生。
- [**Resource Management**](../resource-management.md): Skija におけるネイティブメモリと `Managed` ライフサイクルの処理方法。

### API 詳細

- [**Surface**](../api/Surface.md): 描画先の作成（ラスター、GPU、ラップ）。
- [**Canvas**](../api/Canvas.md): 変換、クリッピング、描画プリミティブ。
- [**Images & Bitmaps**](../api/Images.md): ピクセルデータの読み込み、描画、操作。
- [**ImageInfo**](../api/ImageInfo.md): ピクセル寸法とエンコーディング。
- [**ImageFilter**](../api/ImageFilter.md): ピクセルレベルの効果（ぼかし、影）。
- [**IHasImageInfo**](../api/IHasImageInfo.md): ImageInfoを持つオブジェクトのインターフェース。
- [**Data**](../api/Data.md): 効率的なネイティブメモリ管理。
- [**Matrix**](../api/Matrix.md): 3x3 および 4x4 行列変換。
- [**Codec (Animations)**](../api/Codec.md): 低レベル画像デコードと GIF/WebP アニメーション。
- [**Paint & Effects**](../api/Effects.md): スタイル、ブラー、シャドウ、カラーフィルター。
- [**Shadows**](../api/Shadows.md): 2D ドロップシャドウと 3D エレベーションベースのシャドウ。
- [**Paths**](../api/Path.md): 複雑な幾何学的形状の作成と結合。
- [**PathBuilder**](../api/path-builder.md): パスを構築するための流暢な API。
- [**Region**](../api/Region.md): 整数ベースの領域操作とヒットテスト。
- [**Picture**](../api/Picture.md): パフォーマンス向上のための描画コマンドの記録と再生。

### タイポグラフィとテキスト

- [**Typeface**](../api/Typeface.md): フォントファイルの読み込みとプロパティ。
- [**Font**](../api/Font.md): フォントサイズ、メトリクス、およびレンダリング属性。
- [**Typography & Fonts**](../typography.md): フォントとメトリクスの基礎。
- [**Text Animation & Clipping**](../api/text-animation.md): テキストをマスク、波状テキスト、バリアブルフォントとして使用する。
- [**TextBlob & Builder**](../api/TextBlob.md): 最適化された再利用可能なグリフラン。
- [**TextLine**](../api/TextLine.md): 1行のテキストレイアウトとヒットテスト。
- [**Paragraph (Rich Text)**](../api/Paragraph.md): 複雑なマルチスタイルテキストレイアウトと行の折り返し。
- [**BreakIterator**](../api/BreakIterator.md): 単語、行、文の境界を特定する。

### 高度なグラフィックス

- [**GPU Rendering**](../gpu-rendering.md): OpenGL、Metal、Vulkan、Direct3D を使用したハードウェアアクセラレーション。
- [**DirectContext**](../api/direct-context.md): GPU 状態とコマンド送信の管理。
- [**Shaper**](../api/Shaper.md): テキストシェーピングとグリフ配置 (HarfBuzz)。
- [**SkSL (RuntimeEffect)**](../api/runtime-effect.md): 究極の柔軟性のためのカスタム GPU シェーダーの記述。
- [**PDF Generation**](../api/Document.md): ベクターベースの PDF ドキュメントの作成。

### 拡張機能

- [**SVG**](../api/SVG.md): SVG アイコンとイラストの読み込みとレンダリング。
- [**Lottie**](../extensions.md): Skottie を使用した高性能なベクターアニメーションの再生。