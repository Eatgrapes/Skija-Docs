# APIリファレンス: Document (PDF生成)

`Document`クラスを使用すると、描画コマンドをキャプチャして、主に**PDF**などのベクターベースの形式で保存できます。ピクセルにレンダリングする`Surface`とは異なり、`Document`は描画のベクター特性を保持します。

## PDFの作成

PDFを作成するには、出力を受け取る`WStream`（書き込みストリーム）が必要です。

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. ページを開始
    Canvas canvas = doc.beginPage(595, 842); // A4サイズ（ポイント単位）
    
    // 2. ページキャンバスに描画
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. ページを終了
    doc.endPage();
    
    // 4. ドキュメントを閉じてファイルを確定
    doc.close();
}
```

## メタデータの追加

ドキュメント作成時にPDFメタデータ（タイトル、著者など）を含めることができます：

```java
Document doc = Document.makePDF(stream, 
    "My Skija Document", // タイトル
    "Skija Developer",    // 著者
    "Graphics Demo",     // 件名
    "vector, skia, java", // キーワード
    "Skija Engine",      // 作成者
    "Skija PDF Producer", // プロデューサー
    System.currentTimeMillis(), // 作成日
    System.currentTimeMillis()  // 更新日
);
```

## 重要な考慮事項

- **座標系**: PDFはデフォルトの単位として**ポイント**（1/72インチ）を使用します。
- **キャンバスの有効期間**: `beginPage()`によって返される`Canvas`は、`endPage()`を呼び出すまでしか有効ではありません。ページが終了した後に使用しようとしないでください。
- **フォント**: PDFでテキストを描画する場合、Skijaは必要なフォントデータの埋め込みを試みます。埋め込みが許可されている書体を使用していることを確認してください。
- **ベクター vs. ラスター**: ほとんどのSkija操作（線、形状、テキスト）はPDFでベクターとして保持されます。ただし、一部の複雑な効果（特定のImageFilterやShaderなど）は、Skiaがページの一部をラスタライズする原因となる可能性があります。