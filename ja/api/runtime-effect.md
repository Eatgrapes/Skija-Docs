# API リファレンス: RuntimeEffect & SkSL

`RuntimeEffect` は **SkSL** (Skia Shading Language) へのゲートウェイです。SkSL は GPU 上で直接実行されるカスタムフラグメントシェーダーを記述できる強力な言語です。

## SkSL を学ぶ

SkSL は GLSL と非常に似ていますが、すべての Skia バックエンド間での移植性のために最適化されています。

- **[公式 SkSL ドキュメント](https://skia.org/docs/user/sksl/)**: SkSL の構文と機能の決定版ガイド。
- **[Skia Fiddle](https://fiddle.skia.org/)**: ブラウザで SkSL コードを記述してテストできるインタラクティブなプレイグラウンド。
- **[The Book of Shaders](https://thebookofshaders.com/)**: GLSL 向けに書かれていますが、概念とコードのほとんどは SkSL に直接適用できます。

## SkSL スクリプトの読み込み

Java で SkSL を文字列としてハードコードすることも*可能*ですが、シンタックスハイライトと保守性を向上させるために、シェーダーは別の `.sksl` ファイルに保存する方がはるかに優れています。

### 推奨パターン

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## SkSL の記述

シェーダー SkSL は `main` 関数を持たなければなりません。

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## 重要な考慮事項

### 座標
`main` に渡される `fragCoord` は**ローカルキャンバス座標**です。正規化された UV (0.0 から 1.0) が必要な場合は、解像度をユニフォームとして渡し、自分で座標を割る必要があります。

### 精度
- `float`: 32 ビット浮動小数点数。
- `half`: 16 ビット浮動小数点数。モバイル GPU のパフォーマンスを向上させるために、色や単純なエフェクトには `half` を使用します。

### 事前乗算済みアルファ
Skia はシェーダーが**事前乗算済みアルファ**形式で色を返すことを期待します。1.0 未満のアルファを返す場合は、R、G、B コンポーネントにそのアルファ値を乗算する必要があります。

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // 赤
    return vec4(color * alpha, alpha); // 正しい事前乗算済みアルファ
}
```

## シェーダーのアニメーション化 (ユニフォーム)

シェーダーをアニメーション化するには、SkSL コードで `uniform` 変数を宣言し、Java から毎フレーム更新します。

### 1. SkSL コード
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // 座標を 0..1 に正規化
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // 動く虹のパターンを作成
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Java コード
ユニフォーム値を渡すには `Data` または `ByteBuffer` を使用します。順序は SkSL での宣言順と一致しなければなりません。

```java
// エフェクトを一度コンパイル
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// アニメーションループ内:
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// ユニフォーム用のバッファを作成: 3 floats * 4 bytes = 12 bytes
// Skija はユニフォームにリトルエンディアンのバイト順を期待
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // 更新されたユニフォームで新しいシェーダーを作成
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // 画面を塗りつぶす
    }
}
```

## RuntimeEffectBuilder

ユニフォーム用にバイト配列を手動でパックするのはエラーが発生しやすいです。`RuntimeEffectBuilder` は、名前でユニフォームを設定できるようにすることでこれを簡素化します。

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// 名前でユニフォームを設定 (型安全)
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// Shader/ColorFilter/Blender を作成
Shader shader = builder.makeShader();
```