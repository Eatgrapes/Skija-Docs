# Animation in Skija

"Animation" in Skija kann je nach gewünschtem Ziel drei verschiedene Dinge bedeuten:

1.  **Programmatische Animation:** Formen bewegen oder Farben ändern mit Code (z.B. eine Game Loop).
2.  **Lottie (Skottie):** Abspielen hochwertiger Vektoranimationen, die aus After Effects exportiert wurden.
3.  **Animierte Bilder:** Abspielen von GIFs oder WebP-Bildern.

## 1. Programmatische Animation (Die "Game Loop")

Skija ist ein "Immediate Mode"-Renderer. Das bedeutet, es merkt sich nicht, wo du gestern einen Kreis gezeichnet hast. Um einen Kreis zu bewegen, zeichnest du ihn einfach heute an einer anderen Position.

Um eine Animation zu erstellen, verlässt du dich darauf, dass deine Windowing-Bibliothek (wie JWM oder LWJGL) deine `draw`-Funktion wiederholt aufruft.

### Das Muster

1.  **Zeit ermitteln:** Verwende `System.nanoTime()`, um die aktuelle Zeit zu erhalten.
2.  **Status berechnen:** Bestimme, wo sich deine Objekte basierend auf der Zeit befinden sollten.
3.  **Zeichnen:** Den Frame rendern.
4.  **Nächsten Frame anfordern:** Dem Fenster mitteilen, sich sofort wieder zu aktualisieren.

### Beispiel: Einen Kreis bewegen

```java
// Variable zum Speichern des Status
long startTime = System.nanoTime();

public void onPaint(Canvas canvas) {
    // 1. Fortschritt (0.0 bis 1.0) basierend auf der Zeit berechnen
    long now = System.nanoTime();
    float time = (now - startTime) / 1e9f; // Zeit in Sekunden
    
    // 100 Pixel pro Sekunde bewegen
    float x = 50 + (time * 100) % 500; 
    float y = 100 + (float) Math.sin(time * 5) * 50; // Auf und ab wippen

    // 2. Zeichnen
    Paint paint = new Paint().setColor(0xFFFF0000); // Rot
    canvas.drawCircle(x, y, 20, paint);

    // 3. Nächsten Frame anfordern (Methode hängt von deiner Fensterbibliothek ab)
    window.requestFrame(); 
}
```

## 2. Lottie-Animationen (Skottie)

Für komplexe Vektoranimationen (wie UI-Loader, Icons) verwendet Skija das **Skottie**-Modul. Dies ist viel effizienter, als alles manuell zu zeichnen.

Siehe die [**Animation API-Referenz**](api/Animation.md) für Details zum Laden und Steuern von Lottie-Dateien.

## 3. Animierte Bilder (GIF / WebP)

Um standardmäßige animierte Bildformate wie GIF oder WebP abzuspielen, verwendest du die `Codec`-Klasse, um Frames zu extrahieren.

Siehe die [**Codec API-Referenz**](api/Codec.md) für Details zum Dekodieren und Abspielen von Mehrfachbildern.

---

## Performance-Tipps

-   **Erzeuge keine Objekte in der Schleife:** Verwende `Paint`-, `Rect`- und `Path`-Objekte wieder. Das Erstellen neuer Java-Objekte 60 Mal pro Sekunde löst den Garbage Collector aus und verursacht Ruckler.
-   **Verwende `saveLayer` mit Bedacht:** Es ist rechenintensiv.
-   **V-Sync:** Stelle sicher, dass deine Windowing-Bibliothek V-Sync aktiviert hat, um Screen Tearing zu verhindern.