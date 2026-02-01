# Installation

Skija is distributed via Maven Central. To start using it, you need to add the appropriate dependency to your project's build configuration.

## Dependency Management

Skija provides platform-specific artifacts. You should include the artifact that matches your target operating system and architecture.

### Maven

Add the following to your `pom.xml`:

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

Replace `skija-windows-x64` with the appropriate artifact for your platform:
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

In your `build.gradle`:

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## Supported Platforms

Skija currently supports:
- **Windows**: x64
- **Linux**: x64, arm64
- **macOS**: x64, arm64 (Apple Silicon)
- **Android**: x64, arm64

## Initialization

Before using any Skija classes, the native library must be loaded. Skija handles this automatically when you access any class that depends on native code (e.g., `Canvas`, `Surface`, `Paint`).

Typically, you just need to import the package:

```java
import io.github.humbleui.skija.*;
```

If you need to ensure the library is loaded explicitly, you can call:

```java
Library.staticLoad();
```
