# API-Referenz: Shader

Shader definieren die Farbe jedes Pixels basierend auf seiner Position auf der Leinwand. Sie werden hauptsächlich für Verläufe, Muster und Rauschen verwendet. Shader werden einem `Paint`-Objekt über `paint.setShader(shader)` zugewiesen.

## Verläufe

Verläufe sind die häufigste Art von Shadern. Skija unterstützt mehrere Typen:

### Linearer Verlauf
Erzeugt einen sanften Übergang zwischen zwei Punkten.

**Visuelles Beispiel:**
Siehe [`examples/scenes/src/ShadersScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadersScene.java) für Beispiele zu linearen, radialen, sweep- und konischen Verläufen sowie Rausch-Shadern.

```java
Shader linear = Shader.makeLinearGradient(
    0, 0, 100, 100,      // x0, y0, x1, y1
    new int[] { 0xFFFF0000, 0xFF0000FF } // Farben (Rot zu Blau)
);
```

### Radialer Verlauf
Erzeugt einen kreisförmigen Übergang von einem Mittelpunkt aus.

```java
Shader radial = Shader.makeRadialGradient(
    50, 50, 30,          // Mittelpunkt x, y, Radius
    new int[] { 0xFFFFFFFF, 0xFF000000 } // Farben (Weiß zu Schwarz)
);
```

### Sweep-Verlauf
Erzeugt einen Übergang, der um einen Mittelpunkt streicht (wie ein Farbrad).

```java
Shader sweep = Shader.makeSweepGradient(
    50, 50,              // Mittelpunkt x, y
    new int[] { 0xFFFF0000, 0xFF00FF00, 0xFF0000FF, 0xFFFF0000 }
);
```

### Zweipunkt-Konischer Verlauf
Erzeugt einen Übergang zwischen zwei Kreisen (nützlich für 3D-ähnliche Beleuchtung oder Lichteffekte).

```java
Shader conical = Shader.makeTwoPointConicalGradient(
    30, 30, 10,          // Start x, y, Radius
    70, 70, 40,          // Ende x, y, Radius
    new int[] { 0xFFFF0000, 0xFF0000FF }
);
```

## Rauschen und Muster

### Perlin-Rauschen
Erzeugt Texturen, die wie Wolken, Marmor oder Feuer aussehen.

```java
// Fraktales Rauschen
Shader noise = Shader.makeFractalNoise(
    0.05f, 0.05f,        // baseFrequencyX, baseFrequencyY
    4,                   // numOctaves
    0.0f                 // seed
);

// Turbulenz
Shader turb = Shader.makeTurbulence(0.05f, 0.05f, 4, 0.0f);
```

### Bild-Shader
Verwandelt ein `Image` in einen Shader, der gekachelt oder zum Füllen von Formen verwendet werden kann.

```java
// Zugriff über die Image-Klasse
Shader imageShader = image.makeShader(
    FilterTileMode.REPEAT, 
    FilterTileMode.REPEAT, 
    SamplingMode.DEFAULT
);
```

## Komposition und Modifikation

- `Shader.makeBlend(mode, dst, src)`: Kombiniert zwei Shader mit einem Blend-Modus.
- `shader.makeWithLocalMatrix(matrix)`: Wendet eine Transformation auf das Koordinatensystem des Shaders an.
- `shader.makeWithColorFilter(filter)`: Wendet einen Farbfilter auf die Ausgabe des Shaders an.

## Kachelmodi (`FilterTileMode`)

Wenn ein Shader (wie ein Verlauf oder Bild) einen Bereich füllen muss, der größer als seine definierten Grenzen ist:
- `CLAMP`: Verwendet die Randfarbe, um den Rest zu füllen.
- `REPEAT`: Wiederholt das Muster.
- `MIRROR`: Wiederholt das Muster und spiegelt es an den Rändern.
- `DECAL`: Rendert Transparenz außerhalb der Grenzen.