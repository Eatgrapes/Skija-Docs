# API-Referenz: Farbe & Kodierung

Diese Seite behandelt hochpräzise Farbdarstellung, Pixelformate, Alpha-Interpretation und Farbraum.

---

## Color4f

`Color4f` stellt eine Farbe mit vier Fließkommawerten (RGBA) dar, die typischerweise im Bereich von 0.0 bis 1.0 liegen. Dies ermöglicht eine viel höhere Präzision als traditionelle 8-Bit-Ganzzahlen.

### Konstruktoren

- `new Color4f(r, g, b, a)`
- `new Color4f(r, g, b)`: Deckende Farbe (Alpha = 1.0).
- `new Color4f(int color)`: Konvertiert eine Standard-ARGB-8888-Ganzzahl in Float-Komponenten.

### Methoden

- `toColor()`: Konvertiert zurück in eine ARGB-8888-Ganzzahl.
- `makeLerp(other, weight)`: Führt eine lineare Interpolation zwischen zwei Farben durch.

### Beispiel

```java
Color4f red = new Color4f(1f, 0f, 0f, 1f);
Color4f halfTransparentBlue = new Color4f(0f, 0f, 1f, 0.5f);

// Verwendung in Paint
Paint paint = new Paint().setColor4f(red, ColorSpace.getSRGB());
```

---

## ColorType

`ColorType` beschreibt, wie Bits in einem Pixel angeordnet sind (z.B. Kanalreihenfolge und Bittiefe).

### Häufige Typen

- `RGBA_8888`: 8 Bits pro Kanal, Rot zuerst.
- `BGRA_8888`: 8 Bits pro Kanal, Blau zuerst (häufig unter Windows).
- `N32`: Natives 32-Bit-Format für die aktuelle Plattform (üblicherweise RGBA oder BGRA).
- `F16`: 16-Bit-Halbfeinkomma pro Kanal (High Dynamic Range).
- `GRAY_8`: Einzelner 8-Bit-Kanal für Graustufen.
- `ALPHA_8`: Einzelner 8-Bit-Kanal für Transparenzmasken.

---

## ColorAlphaType

`ColorAlphaType` beschreibt, wie der Alpha-Kanal interpretiert werden soll.

- `OPAQUE`: Alle Pixel sind vollständig deckend; der Alpha-Kanal wird ignoriert.
- `PREMUL`: Farbkomponenten sind mit Alpha multipliziert (Standard für Skia-Leistung).
- `UNPREMUL`: Farbkomponenten sind unabhängig von Alpha.

---

## ColorSpace

`ColorSpace` definiert den Bereich (Gamut) und die Linearität von Farben.

### Häufige Farbraum

- `ColorSpace.getSRGB()`: Der Standardfarbraum für Web und die meisten Monitore.
- `ColorSpace.getSRGBLinear()`: sRGB mit einer linearen Transferfunktion (nützlich für Mathematik/Mischen).
- `ColorSpace.getDisplayP3()`: Weitgamut-Farbraum, der von modernen Apple-Geräten verwendet wird.

### Methoden

- `isSRGB()`: Gibt true zurück, wenn der Raum sRGB ist.
- `isGammaLinear()`: Gibt true zurück, wenn die Transferfunktion linear ist.
- `convert(to, color)`: Konvertiert ein `Color4f` von diesem Raum in einen anderen.

### Verwendungsbeispiel

```java
// Erstellen einer ImageInfo mit spezifischer Kodierung
ImageInfo info = new ImageInfo(
    800, 600, 
    ColorType.N32, 
    ColorAlphaType.PREMUL, 
    ColorSpace.getSRGB()
);
```