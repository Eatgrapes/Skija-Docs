# API リファレンス: StreamAsset

`StreamAsset` は、シーク可能な読み取り専用のデータストリームを表します。ランダムアクセスが必要なフォントデータやその他のリソースの読み込みによく使用されます。

## 概要

`StreamAsset` は、バイトストリーム内での読み取り、スキップ、シークのためのメソッドを提供します。これは「Managed」オブジェクトであり、Skija がネイティブメモリのクリーンアップを処理することを意味します。

## メソッド

### 読み取り

- `read(buffer, size)`: 指定されたバイト配列に最大 `size` バイトを読み込みます。実際に読み取られたバイト数を返します。
- `peek(buffer, size)`: ストリームの位置を進めずにデータを覗き見します。
- `isAtEnd()`: ストリームが終端に達している場合に `true` を返します。

### ナビゲーション

- `skip(size)`: 指定されたバイト数をスキップします。
- `rewind()`: ストリームの位置を先頭に戻します。
- `seek(position)`: 特定の絶対位置にシークします。
- `move(offset)`: 相対オフセット分だけ位置を移動します。

### 情報取得

- `getPosition()`: ストリーム内の現在のバイトオフセットを返します。
- `getLength()`: ストリームの合計長を返します（既知の場合）。
- `hasPosition()`: ストリームがシーク/位置指定をサポートしている場合に `true` を返します。
- `hasLength()`: 長さが既知の場合に `true` を返します。
- `getMemoryBase()`: ストリームがメモリバックされている場合、ネイティブメモリアドレスを返します。

### 複製

- `duplicate()`: 同じデータを共有するが独立した位置を持つ新しい `StreamAsset` を作成します。
- `fork()`: 複製と似ていますが、新しいストリームは元のストリームの現在位置から開始します。

## タイポグラフィでの使用

`StreamAsset` は、[`Typeface`](Typeface.md) データを扱う際に最もよく遭遇します:

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... フォントデータを処理
}
```