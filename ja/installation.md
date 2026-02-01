# インストール

SkijaはMaven Centralを通じて配布されています。使用を開始するには、プロジェクトのビルド設定に適切な依存関係を追加する必要があります。

## 依存関係の管理

Skijaはプラットフォーム固有のアーティファクトを提供します。ターゲットのオペレーティングシステムとアーキテクチャに一致するアーティファクトを含める必要があります。

### Maven

`pom.xml`に以下を追加します：

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

`skija-windows-x64`をプラットフォームに適したアーティファクトに置き換えてください：
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

`build.gradle`に以下を追加します：

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## サポートされているプラットフォーム

Skijaは現在以下をサポートしています：
- **Windows**: x64
- **Linux**: x64, arm64
- **macOS**: x64, arm64 (Apple Silicon)
- **Android**: x64, arm64

## 初期化

Skijaクラスを使用する前に、ネイティブライブラリをロードする必要があります。Skijaは、ネイティブコードに依存するクラス（例：`Canvas`、`Surface`、`Paint`）にアクセスするときにこれを自動的に処理します。

通常は、パッケージをインポートするだけで十分です：

```java
import io.github.humbleui.skija.*;
```

ライブラリが明示的にロードされていることを確認する必要がある場合は、以下を呼び出すことができます：

```java
Library.staticLoad();
```