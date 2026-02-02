---
layout: home

hero:
  name: Skija
  text: Java-Bindings für Skia
  tagline: Hochleistungsfähige, hardwarebeschleunigte 2D-Grafiken für die JVM.
  actions:
    - theme: brand
      text: Los geht's
      link: /getting-started
    - theme: alt
      text: Auf GitHub ansehen
      link: https://github.com/HumbleUI/Skija

features:
  - title: Hardwarebeschleunigt
    details: Nutzt OpenGL, Metal, Vulkan und Direct3D über Skia für eine butterweiche Leistung.
  - title: Reiche Typografie
    details: Fortgeschrittene Textformung mit HarfBuzz und komplexes Layout mit SkParagraph.
  - title: Moderne Shader
    details: Schreiben Sie benutzerdefinierte GPU-Shader mit SkSL (Skia Shading Language).
---

::: warning Inoffizielle Dokumentation
Diese Dokumentation wird von der Community gepflegt und ist **keine** offizielle Veröffentlichung der Skia- oder Skija-Projekte.
Wenn Sie Fehler finden oder Vorschläge haben, melden Sie diese bitte unter [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs).
:::

## Vollständiges Dokumentationsverzeichnis

### Die Grundlagen

- [**Getting Started**](../getting-started.md): Ein Überblick über die Funktionsweise von Skija und den Einstieg.
- [**Installation**](../installation.md): Einrichten von Projektabhängigkeiten für Windows, macOS und Linux.
- [**Rendering Basics**](../rendering-basics.md): Surfaces, Canvases und Ihr erstes „Hello World“.
- [**Colors and Alpha**](../colors.md): Umgang mit Transparenz, Vormultiplikation und Farbräumen.
- [**Animation**](../animation.md): Erstellen von Bewegungen, Spielschleifen und Abspielen von Lottie/GIF-Animationen.
- [**Resource Management**](../resource-management.md): Wie Skija nativen Speicher und den `Managed`-Lebenszyklus handhabt.

### API-Vertiefung

- [**Surface**](../api/Surface.md): Erstellen von Zeichenzielen (Raster, GPU, Wrapped).
- [**Canvas**](../api/Canvas.md): Transformationen, Clipping und Zeichenprimitive.
- [**Images & Bitmaps**](../api/Images.md): Laden, Zeichnen und Manipulieren von Pixeldaten.
- [**ImageInfo**](../api/ImageInfo.md): Pixeldimensionen und Kodierung.
- [**ImageFilter**](../api/ImageFilter.md): Effekte auf Pixelebene (Weichzeichnen, Schatten).
- [**IHasImageInfo**](../api/IHasImageInfo.md): Schnittstelle für Objekte mit ImageInfo.
- [**Data**](../api/Data.md): Effiziente Verwaltung von nativem Speicher.
- [**Matrix**](../api/Matrix.md): 3x3- und 4x4-Matrixtransformationen.
- [**Codec (Animations)**](../api/Codec.md): Bilddecodierung auf niedriger Ebene und GIF/WebP-Animationen.
- [**Paint & Effects**](../api/Effects.md): Stile, Weichzeichner, Schatten und Farbfilter.
- [**Shadows**](../api/Shadows.md): 2D-Schlagschatten und 3D-höhenbasierte Schatten.
- [**Paths**](../api/Path.md): Erstellen und Kombinieren komplexer geometrischer Formen.
- [**PathBuilder**](../api/path-builder.md): Fließende API zum Erstellen von Pfaden.
- [**Region**](../api/Region.md): Ganzzahlbasierte Bereichsoperationen und Treffertests.
- [**Picture**](../api/Picture.md): Aufzeichnen und Wiedergeben von Zeichenbefehlen zur Leistungssteigerung.

### Typografie & Text

- [**Typeface**](../api/Typeface.md): Schriftartdateien laden und Eigenschaften.
- [**Font**](../api/Font.md): Schriftgröße, Metriken und Rendering-Attribute.
- [**Typography & Fonts**](../typography.md): Grundlagen zu Schriftarten und Metriken.
- [**Text Animation & Clipping**](../api/text-animation.md): Verwendung von Text als Masken, wellenförmiger Text und variable Schriftarten.
- [**TextBlob & Builder**](../api/TextBlob.md): Optimierte, wiederverwendbare Glyphenläufe.
- [**TextLine**](../api/TextLine.md): Einzeiliges Textlayout und Treffertests.
- [**Paragraph (Rich Text)**](../api/Paragraph.md): Komplexes mehrstiliges Textlayout und Zeilenumbruch.
- [**BreakIterator**](../api/BreakIterator.md): Lokalisieren von Wort-, Zeilen- und Satzgrenzen.

### Erweiterte Grafik

- [**GPU Rendering**](../gpu-rendering.md): Hardwarebeschleunigung mit OpenGL, Metal, Vulkan und Direct3D.
- [**DirectContext**](../api/direct-context.md): Verwaltung des GPU-Zustands und der Befehlsübermittlung.
- [**Shaper**](../api/Shaper.md): Textformung und Glyphenpositionierung (HarfBuzz).
- [**SkSL (RuntimeEffect)**](../api/runtime-effect.md): Schreiben benutzerdefinierter GPU-Shader für ultimative Flexibilität.
- [**PDF Generation**](../api/Document.md): Erstellen vektorbasiertet PDF-Dokumente.

### Erweiterungen

- [**SVG**](../api/SVG.md): Laden und Rendern von SVG-Symbolen und Illustrationen.
- [**Lottie**](../extensions.md): Wiedergabe von hochleistungsfähigen Vektoranimationen mit Skottie.