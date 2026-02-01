# Farben und Alpha-Transparenz

Das Verständnis, wie Skija Farben und Transparenz behandelt, ist entscheidend für korrekte visuelle Ergebnisse, insbesondere beim Mischen mehrerer Ebenen oder Bilder.

## Farbdarstellung

In Skija werden Farben am häufigsten als 32-Bit-Ganzzahlen im **ARGB**-Format dargestellt.

- **A (Alpha)**: Bits 24-31
- **R (Rot)**: Bits 16-23
- **G (Grün)**: Bits 8-15
- **B (Blau)**: Bits 0-7

Sie können die Hilfsklasse `Color` verwenden, um diese Werte sicher zu manipulieren:

```java
int myColor = Color.makeARGB(255, 66, 133, 244); // Deckendes Blau
int transparentRed = Color.withA(0xFFFF0000, 128); // 50% transparentes Rot
```

## Alpha-Typ: Premultiplied vs. Straight

Eines der wichtigsten Konzepte in Skia ist der **Alpha-Typ** (`ColorAlphaType`).

### Premultiplied (`PREMUL`)
Dies ist das **Standard- und empfohlene** Format für das Rendern. In diesem Format sind die RGB-Komponenten bereits mit dem Alpha-Wert multipliziert.
- **Warum?** Es macht das Mischen viel schneller und verhindert "dunkle Ränder" beim Filtern oder Skalieren von Bildern.
- **Beispiel**: Ein 50% transparentes Weiß (Alpha=128, R=255, G=255, B=255) wird im Premultiplied-Raum zu (128, 128, 128, 128).

### Unpremultiplied (`UNPREMUL`)
Auch bekannt als "Straight Alpha". Die RGB-Komponenten sind unabhängig von Alpha. So speichern die meisten Bilddateien (wie PNG) ihre Daten.
- **Beispiel**: Das gleiche 50% transparente Weiß bleibt (128, 255, 255, 255).

## Farbraum

Skija ist farbraumbewusst. Während Sie mit rohen "naiven" RGB-Werten arbeiten können, sollten Sie für professionelle Ergebnisse einen `ColorSpace` angeben.

- `ColorSpace.getSRGB()`: Der Standard-Farbraum für das Web und die meisten Monitore.
- `ColorSpace.getDisplayP3()`: Für Breitfarbraum-Displays (wie moderne Macs und iPhones).

Berücksichtigen Sie beim Erstellen einer `Surface` oder beim Laden eines `Image` immer den Farbraum, um ein konsistentes Erscheinungsbild auf verschiedenen Geräten zu gewährleisten.

## Best Practices

1.  **Verwenden Sie immer Premultiplied Alpha** für aktives Rendern und Komposition.
2.  **Verwenden Sie `Color4f`**, wenn Sie hochpräzise Farben (Gleitkommazahlen) benötigen oder mit Breitfarbraum-Farbräumen arbeiten.
3.  **Achten Sie auf den Alpha-Modus** beim Erstellen von Snapshots oder beim Auslesen von Pixeln; Sie müssen möglicherweise von `PREMUL` zu `UNPREMUL` konvertieren, wenn Sie die Daten in einer Standard-PNG speichern möchten.