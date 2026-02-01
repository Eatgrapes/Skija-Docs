# Schatten in Skija

Skija bietet zwei verschiedene Möglichkeiten, Schatten zu zeichnen: **2D Schlagschatten** (über ImageFilters) und **3D Höhenschatten** (über ShadowUtils).

## 1. 2D Schlagschatten (ImageFilter)

Dies ist die Standardmethode, um einem bestimmten Zeichenvorgang einen Schatten hinzuzufügen. Der Schatten folgt der Form der gezeichneten Geometrie oder des Bildes.

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // Versatz (dx, dy)
    3.0f, 3.0f,   // Unschärfe (sigmaX, sigmaY)
    0x80000000    // Schattenfarbe (50% transparentes Schwarz)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### Nur Schlagschatten
Wenn Sie nur den Schatten ohne das ursprüngliche Objekt zeichnen möchten (z.B. für komplexe Ebenen), verwenden Sie `makeDropShadowOnly`.

---

## 2. 3D Höhenschatten (ShadowUtils)

`ShadowUtils` bietet ein physikalisch basierteres Schattenmodell, ähnlich dem Material Design Elevation. Es berechnet, wie eine Lichtquelle an einer bestimmten 3D-Position einen Schatten von einem "Okkluder" (einem Pfad) auf die Leinwandebene wirft.

### Grundlegende Verwendung

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Z-Ebene: Höhe des Objekts.
// Normalerweise konstant für flache UI-Elemente: (0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f);

// Lichtposition: 3D-Koordinaten relativ zur Leinwand
Point3 lightPos = new Point3(250, 0, 600);

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas,
    path,
    elevation,
    lightPos,
    lightRadius,
    ambientColor,
    spotColor,
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// Hinweis: drawShadow zeichnet NUR den Schatten.
// Sie müssen das Objekt selbst noch zeichnen:
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### Ambient vs. Spot Schatten
- **Ambienter Schatten**: Ein weicher, nicht-gerichteter Schatten, verursacht durch indirektes Licht.
- **Spot-Schatten**: Ein gerichteter Schatten, verursacht durch die spezifische Lichtquellenposition.
Die Kombination beider erzeugt einen realistischen Tiefeneffekt.

### Schatten-Flags
- `TRANSPARENT_OCCLUDER`: Verwenden Sie dies, wenn Ihr Objekt halbtransparent ist, damit der Schatten nicht unter dem Objekt abgeschnitten wird.
- `GEOMETRIC_ONLY`: Optimierung, wenn Sie keine hochwertige Unschärfe benötigen.
- `DIRECTIONAL_LIGHT`: Behandelt das Licht als unendlich weit entfernt (wie Sonnenlicht).

## Vergleich

| Merkmal | Schlagschatten (ImageFilter) | Höhenschatten (ShadowUtils) |
| :--- | :--- | :--- |
| **Modell** | 2D Gaußsche Unschärfe | 3D Perspektivische Projektion |
| **Leistung** | Schnell (von Skia gecached) | Komplexer, aber hochoptimiert |
| **Verwendung** | Auf `Paint` setzen | Direkter Aufruf von `ShadowUtils` |
| **Am besten für** | Text, einfache UI-Glows, Icons | Material Design Buttons, Karten, Tiefeneffekte |

## Visuelles Beispiel

Um diese Schatten in Aktion zu sehen, führen Sie die **Scenes** Beispiel-App aus und wählen Sie die **ShadowUtils** Szene.

**Quellcode:** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*Abbildung: Vergleich verschiedener ShadowUtils-Flags und Lichtpositionen.*