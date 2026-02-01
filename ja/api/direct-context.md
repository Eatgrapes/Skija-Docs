# API リファレンス: DirectContext (GL ステート & コンテキスト)

`DirectContext` クラスは GPU への橋渡し役です。これは基盤となるグラフィックス API (OpenGL、Metal、Vulkan、または Direct3D) への接続を管理し、GPU リソースのライフサイクルを処理します。

## コンテキストの作成

通常、アプリケーションごとに 1 つの `DirectContext` を作成し、そのライフタイム全体で再利用します。

```java
// OpenGL の場合
DirectContext context = DirectContext.makeGL();

// Metal の場合 (macOS/iOS)
DirectContext context = DirectContext.makeMetal(devicePtr, queuePtr);
```

## コマンドの送信

Skia は描画コマンドを内部バッファに記録します。これらのコマンドを GPU に送信するよう、明示的に Skia に指示する必要があります。

- `flush()`: 記録されたコマンドを GPU ドライバのバッファに送信します。
- `submit()`: GPU が実際にコマンドの処理を開始することを保証します。
- `flushAndSubmit(syncCpu)`: フレームを完了する最も一般的な方法です。`syncCpu` が true の場合、GPU が完全に終了するまでブロックします。

```java
context.flushAndSubmit(true);
```

## GL ステートの管理

Skija が他の OpenGL コード (ゲームエンジンやカスタム UI など) と併用される場合、外部コードが OpenGL ステート (別のプログラムをバインドしたり、ビューポートを変更したりするなど) を変更する可能性があります。Skia はレンダリングエラーを避けるために、これらの変更を知る必要があります。

### ステートのリセット

あなたまたは使用しているライブラリが OpenGL ステートを変更した場合、**必ず** Skia に通知する必要があります:

```java
// すべての OpenGL ステートが変更された可能性があることを Skia に通知
context.resetGLAll();

// または、パフォーマンス向上のために、より具体的に指定
context.reset(BackendState.GL_PROGRAM, BackendState.GL_TEXTURE_BINDING);
```

### コンテキストの破棄

基盤となる GPU コンテキストが失われた場合 (ウィンドウが破棄された、ドライバがクラッシュしたなど)、`abandon()` を使用して、Skia がクラッシュを引き起こす可能性のあるネイティブ呼び出しをこれ以上行わないようにします。

```java
context.abandon();
```

## ベストプラクティス

1.  **スレッドセーフ:** `DirectContext` は**スレッドセーフではありません**。これへのすべての呼び出し、およびこれに関連付けられたサーフェスへのすべての描画は、同じスレッドで行う必要があります。
2.  **ステートの健全性:** Skija と生の OpenGL 呼び出しを混在させる場合は、Skija に制御を戻す前に常に `context.resetGLAll()` を呼び出してください。
3.  **サーフェスのフラッシュ:** 複数のサーフェスがある場合、個別にフラッシュできます: `context.flush(surface)`。