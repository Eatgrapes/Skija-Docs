# API-Referenz: Effekte (Filter)

Skija bietet drei Arten von Filtern, die über `Paint` angewendet werden können: **MaskFilter**, **ColorFilter** und **ImageFilter**. Den Unterschied zu verstehen, ist entscheidend, um den gewünschten visuellen Effekt zu erzielen.

## 1. MaskFilter
**Modifikation des Alpha-Kanals.** Beeinflusst die Maske (Geometrie), bevor sie eingefärbt wird. Sie sieht nur die Alpha-Werte.

### Gaußscher Weichzeichner
Die häufigste Anwendung ist die Erzeugung weicher Kanten oder einfacher Leuchteffekte.

```java
// Sigma entspricht etwa 1/3 des Unschärferadius
MaskFilter blur = MaskFilter.makeBlur(FilterBlurMode.NORMAL, 5.0f);
paint.setMaskFilter(blur);
```

**Modi:**
- `NORMAL`: Weichzeichnet innen und außen.
- `SOLID`: Behält die ursprüngliche Form undurchsichtig bei, weichzeichnet nur außen.
- `OUTER`: Nur der unscharfe Teil außerhalb der Form.
- `INNER`: Nur der unscharfe Teil innerhalb der Form.

---

## 2. ColorFilter
**Modifikation des Farbraums.** Transformiert die Farbe jedes Pixels unabhängig.

### Farbmatrix
Nützlich für Graustufen, Sepia oder Farbverschiebungen.

```java
ColorFilter grayscale = ColorFilter.makeMatrix(ColorMatrix.grayscale());
paint.setColorFilter(grayscale);
```

### Mischmodus-Farbfilter
Färbt alles mit einer bestimmten Farbe ein.

```java
ColorFilter tint = ColorFilter.makeBlend(0xFF4285F4, BlendMode.SRC_ATOP);
```

---

## 3. ImageFilter (Pixel-Effekte)

`ImageFilter` arbeitet auf den Pixeln der Zeichnung (oder ihres Hintergrunds). Sie werden häufig für Unschärfen, Schatten und Beleuchtungseffekte verwendet.

### Grundlegende Filter
- `makeBlur(sigmaX, sigmaY, tileMode)`: Gaußsche Unschärfe.
- `makeDropShadow(dx, dy, sigmaX, sigmaY, color)`: Zeichnet Inhalt + Schatten.
- `makeDropShadowOnly(...)`: Zeichnet nur den Schatten (keinen Inhalt).
- `makeDilate(rx, ry)`: Erweitert helle Bereiche (Morphologie).
- `makeErode(rx, ry)`: Erweitert dunkle Bereiche (Morphologie).
- `makeOffset(dx, dy)`: Verschiebt den Inhalt.
- `makeTile(src, dst)`: Kachelt den Inhalt.

### Komposition
- `makeCompose(outer, inner)`: Wendet zuerst `inner`, dann `outer` Filter an.
- `makeMerge(filters)`: Kombiniert Ergebnisse mehrerer Filter (z.B. für mehrere Schatten).
- `makeBlend(mode, bg, fg)`: Mischt zwei Filter mit einem `BlendMode`.
- `makeArithmetic(k1, k2, k3, k4, bg, fg)`: Benutzerdefinierte Pixelkombination: `k1*fg*bg + k2*fg + k3*bg + k4`.

### Farbe & Shader
- `makeColorFilter(cf, input)`: Wendet einen `ColorFilter` auf das ImageFilter-Ergebnis an.
- `makeShader(shader)`: Füllt den Filterbereich mit einem `Shader` (z.B. Verlauf oder Rauschen).
- `makeRuntimeShader(builder, ...)`: Verwendet einen benutzerdefinierten SkSL-Shader als ImageFilter.

### Beleuchtung (Material Design)
Simuliert Licht, das von einer durch den Alphakanal definierten Oberfläche reflektiert wird (Alpha = Höhe).
- `makeDistantLitDiffuse(...)`
- `makePointLitDiffuse(...)`
- `makeSpotLitDiffuse(...)`
- `makeDistantLitSpecular(...)`
- `makePointLitSpecular(...)`
- `makeSpotLitSpecular(...)`

### Beispiel: Milchglas (Hintergrundunschärfe)
Um das, was *hinter* einer Ebene liegt, zu verwischen, verwende `Canvas.saveLayer` mit einem Backdrop-Filter.

```java
ImageFilter blur = ImageFilter.makeBlur(10f, 10f, FilterTileMode.CLAMP);
// Das 'paint'-Argument ist null (kein Alpha/Blending für die Ebene selbst)
// Das 'backdrop'-Argument ist der Unschärfefilter
canvas.saveLayer(new SaveLayerRec(null, null, blur));
    canvas.drawRect(rect, new Paint().setColor(0x40FFFFFF)); // Halbtransparentes Weiß
canvas.restore();
```

## Vergleichszusammenfassung

| Filtertyp | Beeinflusst | Häufige Verwendung |
| :--- | :--- | :--- |
| **MaskFilter** | Nur Alpha | Einfache Unschärfen, Leuchteffekte |
| **ColorFilter** | Pixelfarbe | Graustufen, Einfärbungen, Kontrast |
| **ImageFilter** | Gesamtes Pixel | Schlagschatten, komplexe Unschärfen, Komposition |

## 4. Blender (Fortgeschrittenes Blending)

Während `BlendMode` standardmäßige Porter-Duff-Blending-Modi (wie `SRC_OVER`, `MULTIPLY`) bereitstellt, ermöglicht die Klasse `Blender` programmierbare, benutzerdefinierte Blending-Operationen.

Du weist einem Paint einen Blender mit `paint.setBlender(blender)` zu.

### Arithmetischer Blender
Erlaubt die Definition einer linearen Kombination von Quell- und Zielpixeln:
`result = k1 * src * dst + k2 * src + k3 * dst + k4`

```java
// Beispiel: Linear Dodge (Add) kann angenähert werden
Blender b = Blender.makeArithmetic(0, 1, 1, 0, false);
paint.setBlender(b);
```

### Runtime Blender (SkSL)
Du kannst deine eigene Blend-Funktion in SkSL schreiben! Der Shader erhält `src`- und `dst`-Farben und muss das Ergebnis zurückgeben.

```java
String sksl = "vec4 main(vec4 src, vec4 dst) {" +
              "  return src * dst;" + // Einfache Multiplikation
              "}";
RuntimeEffect effect = RuntimeEffect.makeForBlender(sksl);
Blender myBlender = effect.makeBlender(null);
paint.setBlender(myBlender);
```

## 5. PathEffect (Strich-Modifikatoren)

`PathEffect` modifiziert die Geometrie eines Pfades, *bevor* er gezeichnet wird (umrandet oder gefüllt). Es wird häufig für gestrichelte Linien, abgerundete Ecken oder organische Rauheit verwendet.

### Erstellungsmethoden

**1. Diskret (Rauheit)**
Bricht den Pfad in Segmente und verschiebt sie zufällig.
- `makeDiscrete(segLength, dev, seed)`:
    - `segLength`: Länge der Segmente.
    - `dev`: Maximale Abweichung (Jitter).
    - `seed`: Zufallssamen.

```java
PathEffect rough = PathEffect.makeDiscrete(10f, 4f, 0);
paint.setPathEffect(rough);
```

**2. Ecke (Abrundung)**
Rundet scharfe Ecken ab.
- `makeCorner(radius)`: Radius der abgerundeten Ecke.

```java
PathEffect round = PathEffect.makeCorner(20f);
```

**3. Strich (Gestrichelte Linien)**
Erzeugt gestrichelte oder gepunktete Linien.
- `makeDash(intervals, phase)`:
    - `intervals`: Array von Ein/Aus-Längen (muss gerade Länge haben).
    - `phase`: Versatz in die Intervalle.

```java
// 10px EIN, 5px AUS
PathEffect dash = PathEffect.makeDash(new float[] { 10f, 5f }, 0f);
```

**4. Path1D (Stempel-Pfad)**
Stempelt eine Form entlang des Pfades (wie ein Pinsel).
- `makePath1D(path, advance, phase, style)`

```java
Path shape = new Path().addCircle(0, 0, 3);
PathEffect dots = PathEffect.makePath1D(shape, 10f, 0f, PathEffect1DStyle.TRANSLATE);
```

**5. Path2D (Matrix)**
Transformiert die Pfadgeometrie mit einer Matrix.
- `makePath2D(matrix, path)`

**6. Line2D**
- `makeLine2D(width, matrix)`

### Komposition

Mehrere Pfadeffekte können kombiniert werden.

- `makeSum(second)`: Zeichnet *beide* Effekte (z.B. Füllung + Umrandung).
- `makeCompose(inner)`: Wendet zuerst `inner`, dann `this` an (z.B. raue Umrandung -> gestrichelt).

```java
PathEffect dashed = PathEffect.makeDash(new float[] {10, 5}, 0);
PathEffect corner = PathEffect.makeCorner(10);

// Runde die Ecken, DANN striehle die Linie
PathEffect composed = dashed.makeCompose(corner);
```