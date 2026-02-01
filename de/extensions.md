# Erweiterungen: Lottie & SVG

Skija bietet umfangreiche Unterstützung für beliebte Vektorformate wie Lottie (über Skottie) und SVG, sodass Sie komplexe Animationen und Icons einfach in Ihre Java-Anwendungen integrieren können.

## Lottie-Animationen (Skottie)

Skottie ist Skias Lottie-Player. Es kann JSON-basierte Animationen laden und abspielen, die aus After Effects exportiert wurden.

### Eine Animation laden

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### Abspielen und Rendern

Um eine Animation abzuspielen, müssen Sie zu einer bestimmten Zeit oder einem bestimmten Frame "springen" und sie dann auf eine Leinwand rendern.

```java
// Normalisierte Zeit: 0.0 (Start) bis 1.0 (Ende)
anim.seek(currentTime); 

// Oder zu einem bestimmten Frame-Index springen
anim.seekFrame(24);

// In ein bestimmtes Rechteck auf der Leinwand rendern
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## SVG-Unterstützung

Skija stellt eine SVG-DOM bereit, die SVG-Dateien parsen und rendern kann.

### SVG laden und rendern

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// Die Größe des Containers festlegen, in dem das SVG gerendert wird
svg.setContainerSize(100, 100);

// Auf die Leinwand zeichnen
svg.render(canvas);
```

### Mit SVG interagieren

Sie können auf das Wurzelelement des SVGs zugreifen, um dessen Eigenschaften abzufragen, wie z.B. seine intrinsische Größe.

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## Wann was verwenden?

- **Lottie:** Am besten für komplexe UI-Animationen, Charakteranimationen und ausdrucksstarke Übergänge.
- **SVG:** Am besten für statische Icons, einfache Logos und Illustrationen.
- **Benutzerdefinierte Shader (SkSL):** Am besten für prozedural generierte Hintergründe, Echtzeiteffekte und hochdynamische visuelle Darstellungen.