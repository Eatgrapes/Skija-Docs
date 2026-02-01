# API-Referenz: Document (PDF-Generierung)

Die `Document`-Klasse ermöglicht es Ihnen, Zeichenbefehle zu erfassen und in vektorbasierten Formaten zu speichern, vor allem als **PDF**. Im Gegensatz zu einer `Surface`, die in Pixel rendert, bewahrt ein `Document` die vektorielle Natur Ihrer Zeichnungen.

## Erstellen eines PDFs

Um ein PDF zu erstellen, benötigen Sie einen `WStream` (Write-Stream), der die Ausgabe empfängt.

```java
try (FileOutputStream fos = new FileOutputStream("output.pdf");
     WStream stream = new FileOutputStreamWStream(fos);
     Document doc = Document.makePDF(stream)) {
     
    // 1. Eine Seite beginnen
    Canvas canvas = doc.beginPage(595, 842); // A4-Größe in Punkten
    
    // 2. Auf der Seiten-Canvas zeichnen
    Paint paint = new Paint().setColor(0xFF4285F4);
    canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
    
    // 3. Seite beenden
    doc.endPage();
    
    // 4. Dokument schließen, um die Datei abzuschließen
    doc.close();
}
```

## Metadaten hinzufügen

Sie können PDF-Metadaten (Titel, Autor, etc.) bei der Erstellung des Dokuments angeben:

```java
Document doc = Document.makePDF(stream, 
    "Mein Skija-Dokument", // Titel
    "Skija-Entwickler",    // Autor
    "Grafik-Demo",         // Betreff
    "vektor, skia, java",  // Schlüsselwörter
    "Skija Engine",        // Ersteller
    "Skija PDF Producer",  // Hersteller
    System.currentTimeMillis(), // Erstellungsdatum
    System.currentTimeMillis()  // Änderungsdatum
);
```

## Wichtige Hinweise

- **Koordinatensystem**: PDF verwendet standardmäßig **Punkte** (1/72 Zoll) als Einheit.
- **Canvas-Lebensdauer**: Der von `beginPage()` zurückgegebene `Canvas` ist nur gültig, bis Sie `endPage()` aufrufen. Versuchen Sie nicht, ihn nach dem Ende der Seite zu verwenden.
- **Schriftarten**: Beim Zeichnen von Text in einem PDF versucht Skija, die notwendigen Schriftdaten einzubetten. Stellen Sie sicher, dass Sie Schriftarten verwenden, die das Einbetten erlauben.
- **Vektor vs. Raster**: Die meisten Skija-Operationen (Linien, Formen, Text) bleiben im PDF vektoriell. Einige komplexe Effekte (wie bestimmte ImageFilters oder Shader) können jedoch dazu führen, dass Skia einen Teil der Seite rastert.