# APIリファレンス: Data

`Data`クラスは、生のメモリバッファ（バイト配列）を不変（immutable）にラップするクラスです。Skija全体で、エンコードされた画像、フォント、シェーダーなどのバイナリデータを、JavaとネイティブC++ Skiaライブラリ間で効率的に受け渡すために使用されます。

## 作成

### Javaバイト配列から
Javaの`byte[]`からデータをコピーします。

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### ファイルから
ファイルをメモリに効率的にマッピングします（可能な場合は`mmap`を使用）。

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("File not found");
}
```

### 空のデータ
空のデータオブジェクトを作成します。

```java
Data empty = Data.makeEmpty();
```

## 変更（部分データの取得）

`Data`は不変なので、内容を変更することはできませんが、その一部を参照する新しいビューを作成できます（サポートされている場合はゼロコピー、そうでない場合は安価なコピー）。

```java
// 10〜20バイト目を表す新しいDataオブジェクトを作成
Data subset = data.makeSubset(10, 10);
```

## 内容へのアクセス

### バイト配列として
ネイティブデータをJavaの`byte[]`にコピーして返します。

```java
byte[] content = data.getBytes();

// または範囲指定
byte[] part = data.getBytes(0, 10);
```

### ByteBufferとして
ネイティブメモリを直接Javaの`ByteBuffer`でラップします。これはデータをコピーせずに読み取る最も効率的な方法です。

```java
ByteBuffer buffer = data.toByteBuffer();
// バッファから読み取り...
```

### サイズ
```java
long size = data.getSize();
```

## ライフサイクル

`Data`は`Managed`を継承し、ネイティブメモリを使用します。理想的には、try-with-resourcesを使用するか、使い終わったら`close()`を呼び出してください（ガベージコレクタによって最終的には解放されます）。

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // dataを使用...
} // data.close()が自動的に呼び出される
```