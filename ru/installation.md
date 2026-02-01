# Установка

Skija распространяется через Maven Central. Чтобы начать её использовать, необходимо добавить соответствующую зависимость в конфигурацию сборки вашего проекта.

## Управление зависимостями

Skija предоставляет платформо-специфичные артефакты. Вам следует включить артефакт, соответствующий вашей целевой операционной системе и архитектуре.

### Maven

Добавьте следующее в ваш `pom.xml`:

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

Замените `skija-windows-x64` на соответствующий артефакт для вашей платформы:
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

В вашем `build.gradle`:

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## Поддерживаемые платформы

Skija в настоящее время поддерживает:
- **Windows**: x64
- **Linux**: x64, arm64
- **macOS**: x64, arm64 (Apple Silicon)
- **Android**: x64, arm64

## Инициализация

Перед использованием любых классов Skija необходимо загрузить нативную библиотеку. Skija делает это автоматически при обращении к любому классу, зависящему от нативного кода (например, `Canvas`, `Surface`, `Paint`).

Обычно вам достаточно просто импортировать пакет:

```java
import io.github.humbleui.skija.*;
```

Если вам нужно явно убедиться, что библиотека загружена, вы можете вызвать:

```java
Library.staticLoad();
```