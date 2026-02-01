# API Reference: Document (PDF Generation)

The `Document` class allows you to capture drawing commands and save them into vector-based formats, most notably **PDF**. Unlike a `Surface`, which renders to pixels, a `Document` preserves the vector nature of your drawings.

## Creating a PDF

To create a PDF, you need a `WStream` (write stream) to receive the output.

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. Start a page
    Canvas canvas = doc.beginPage(595, 842); // A4 size in points
    
    // 2. Draw on the page canvas
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. End the page
    doc.endPage();
    
    // 4. Close the document to finalize the file
    doc.close();
}
```

## Adding Metadata

You can include PDF metadata (Title, Author, etc.) when creating the document:

```java
Document doc = Document.makePDF(stream, 
    "My Skija Document", // Title
    "Skija Developer",    // Author
    "Graphics Demo",     // Subject
    "vector, skia, java", // Keywords
    "Skija Engine",      // Creator
    "Skija PDF Producer", // Producer
    System.currentTimeMillis(), // Creation Date
    System.currentTimeMillis()  // Modified Date
);
```

## Important Considerations

- **Coordinate System**: PDF uses **Points** (1/72 of an inch) as the default unit.
- **Canvas Lifetime**: The `Canvas` returned by `beginPage()` is only valid until you call `endPage()`. Do not attempt to use it after the page has ended.
- **Fonts**: When drawing text in a PDF, Skija will attempt to embed the necessary font data. Ensure you are using typefaces that allow embedding.
- **Vector vs. Raster**: Most Skija operations (lines, shapes, text) will remain vector in the PDF. However, some complex effects (like certain ImageFilters or Shaders) might cause Skia to rasterize a portion of the page.
