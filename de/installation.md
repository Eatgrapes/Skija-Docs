# Installation

Skija wird über Maven Central verteilt. Um es zu verwenden, müssen Sie die entsprechende Abhängigkeit zur Build-Konfiguration Ihres Projekts hinzufügen.

## Abhängigkeitsverwaltung

Skija stellt plattformspezifische Artefakte bereit. Sie sollten das Artefakt einbinden, das Ihrem Zielbetriebssystem und Ihrer Zielarchitektur entspricht.

### Maven

Fügen Sie Folgendes zu Ihrer `pom.xml` hinzu:

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

Ersetzen Sie `skija-windows-x64` durch das passende Artefakt für Ihre Plattform:
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

In Ihrer `build.gradle`:

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## Unterstützte Plattformen

Skija unterstützt derzeit:
- **Windows**: x64
- **Linux**: x64, arm64
- **macOS**: x64, arm64 (Apple Silicon)
- **Android**: x64, arm64

## Initialisierung

Bevor Sie eine Skija-Klasse verwenden können, muss die native Bibliothek geladen werden. Skija erledigt dies automatisch, wenn Sie auf eine Klasse zugreifen, die von nativem Code abhängt (z.B. `Canvas`, `Surface`, `Paint`).

Typischerweise müssen Sie nur das Paket importieren:

```java
import io.github.humbleui.skija.*;
```

Wenn Sie die Bibliothek explizit laden müssen, können Sie aufrufen:

```java
Library.staticLoad();
```