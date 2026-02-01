# Instalación

Skija se distribuye a través de Maven Central. Para comenzar a usarlo, debes agregar la dependencia apropiada a la configuración de compilación de tu proyecto.

## Gestión de Dependencias

Skija proporciona artefactos específicos para cada plataforma. Debes incluir el artefacto que coincida con tu sistema operativo y arquitectura objetivo.

### Maven

Agrega lo siguiente a tu `pom.xml`:

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

Reemplaza `skija-windows-x64` con el artefacto apropiado para tu plataforma:
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

En tu `build.gradle`:

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## Plataformas Soportadas

Skija actualmente soporta:
- **Windows**: x64
- **Linux**: x64, arm64
- **macOS**: x64, arm64 (Apple Silicon)
- **Android**: x64, arm64

## Inicialización

Antes de usar cualquier clase de Skija, se debe cargar la biblioteca nativa. Skija maneja esto automáticamente cuando accedes a cualquier clase que dependa de código nativo (por ejemplo, `Canvas`, `Surface`, `Paint`).

Normalmente, solo necesitas importar el paquete:

```java
import io.github.humbleui.skija.*;
```

Si necesitas asegurarte de que la biblioteca se cargue explícitamente, puedes llamar:

```java
Library.staticLoad();
```