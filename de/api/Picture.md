# API-Referenz: Picture & PictureRecorder

Wenn Sie dieselbe komplexe Szene mehrmals zeichnen müssen – oder wenn Sie einen statischen Hintergrund haben, der sich nicht ändert – sollten Sie `Picture` verwenden. Es zeichnet Ihre Zeichenbefehle in einem hochoptimierten Format auf, das Skia viel schneller "abspielen" kann, als wenn es in jedem Frame einzelne Java-Aufrufe ausführen müsste.

## Der Arbeitsablauf

Das Aufzeichnen eines Bildes erfolgt mit einem `PictureRecorder`, um einen temporären `Canvas` zu erhalten.

```java
PictureRecorder recorder = new PictureRecorder();

// 1. Definieren Sie den "Cull Rect" (den Bereich, den Sie zeichnen möchten)
Canvas recordingCanvas = recorder.beginRecording(Rect.makeWH(500, 500));

// 2. Führen Sie Ihre Zeichenbefehle wie gewohnt aus
Paint p = new Paint().setColor(0xFF4285F4);
recordingCanvas.drawCircle(250, 250, 100, p);
// ... weitere Zeichenbefehle ...

// 3. Beenden Sie die Aufzeichnung und erhalten Sie das Picture-Objekt
Picture picture = recorder.finishRecordingAsPicture();
```

## PictureRecorder API

Der `PictureRecorder` ist das zustandsbehaftete Objekt, das zum Aufzeichnen von Befehlen verwendet wird.

- `beginRecording(bounds)`: Startet die Aufzeichnung. Gibt einen `Canvas` zurück, in den Sie zeichnen können. Alle an diesen Canvas gesendeten Zeichenbefehle werden gespeichert.
- `getRecordingCanvas()`: Gibt den aktiven Aufzeichnungs-Canvas zurück oder `null`, wenn nicht aufgezeichnet wird.
- `finishRecordingAsPicture()`: Beendet die Aufzeichnung und gibt das unveränderliche `Picture`-Objekt zurück. Macht den Aufzeichnungs-Canvas ungültig.
- `finishRecordingAsPicture(cullRect)`: Beendet die Aufzeichnung, überschreibt jedoch den im Bild gespeicherten Cull Rect.

## Bilder erstellen (Serialisierung)

- `makePlaceholder(cullRect)`: Erstellt ein Platzhalterbild, das nichts zeichnet, aber bestimmte Grenzen hat.
- `makeFromData(data)`: Deserialisiert ein Bild aus einem `Data`-Objekt (erstellt über `serializeToData`).

## Das Bild zeichnen

Sobald Sie ein `Picture`-Objekt haben, können Sie es auf jeden anderen `Canvas` zeichnen.

```java
canvas.drawPicture(picture);
```

## Warum Picture verwenden?

1.  **Leistung:** Wenn Sie 1.000 Zeichenaufrufe haben, muss Java pro Frame 1.000 Mal in nativen Code aufrufen. Wenn Sie diese in ein `Picture` aufzeichnen, ist es nur **ein** nativer Aufruf pro Frame.
2.  **Thread-Sicherheit:** Während ein `Canvas` an einen Thread gebunden ist, ist ein `Picture` unveränderlich und kann von jedem Thread aus gezeichnet werden (normalerweise zeichnen Sie es jedoch in Ihrem Haupt-Rendering-Thread).
3.  **Tessellierungs-Caching:** Skia kann die komplexe Geometrie (wie Pfade) innerhalb eines `Picture` besser zwischenspeichern als bei einzelnen Aufrufen.

## Best Practices & Fallstricke

- **Nicht alles aufzeichnen:** Wenn sich Ihr Inhalt in jedem einzelnen Frame ändert (wie eine sich bewegende Figur), könnte das Aufzeichnen eines neuen `Picture` jedes Mal aufgrund des Overheads des Recorders tatsächlich *langsamer* sein.
- **Canvas-Lebensdauer:** Der `Canvas`, den Sie von `beginRecording()` erhalten, ist nur gültig, bis Sie `finishRecordingAsPicture()` aufrufen. Versuchen Sie nicht, eine Referenz darauf zu behalten!
- **Speicher:** Pictures belegen nativen Speicher. Wenn Sie viele kleine Bilder erstellen, denken Sie daran, sie mit `close()` zu schließen, wenn sie nicht mehr benötigt werden.