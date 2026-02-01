# Installation

Skija est distribué via Maven Central. Pour commencer à l'utiliser, vous devez ajouter la dépendance appropriée à la configuration de build de votre projet.

## Gestion des dépendances

Skija fournit des artefacts spécifiques à chaque plateforme. Vous devez inclure l'artefact qui correspond à votre système d'exploitation et architecture cibles.

### Maven

Ajoutez ce qui suit à votre `pom.xml` :

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

Remplacez `skija-windows-x64` par l'artefact approprié pour votre plateforme :
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

Dans votre `build.gradle` :

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## Plateformes prises en charge

Skija prend actuellement en charge :
- **Windows** : x64
- **Linux** : x64, arm64
- **macOS** : x64, arm64 (Apple Silicon)
- **Android** : x64, arm64

## Initialisation

Avant d'utiliser une quelconque classe de Skija, la bibliothèque native doit être chargée. Skija gère cela automatiquement lorsque vous accédez à une classe qui dépend du code natif (par exemple, `Canvas`, `Surface`, `Paint`).

Typiquement, vous avez juste besoin d'importer le package :

```java
import io.github.humbleui.skija.*;
```

Si vous avez besoin de vous assurer que la bibliothèque est chargée explicitement, vous pouvez appeler :

```java
Library.staticLoad();
```