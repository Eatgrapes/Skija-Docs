# 安装

Skija 通过 Maven Central 分发。要开始使用它，您需要将相应的依赖项添加到项目的构建配置中。

## 依赖管理

Skija 提供特定于平台的构件。您应包含与目标操作系统和架构匹配的构件。

### Maven

将以下内容添加到您的 `pom.xml` 中：

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

将 `skija-windows-x64` 替换为适合您平台的构件：
- `skija-windows-x64`
- `skija-linux-x64`
- `skija-linux-arm64`
- `skija-macos-x64`
- `skija-macos-arm64`

### Gradle

在您的 `build.gradle` 中：

```gradle
dependencies {
    implementation "io.github.humbleui:skija-macos-arm64:${skijaVersion}"
}
```

## 支持的平台

Skija 目前支持：
- **Windows**: x64
- **Linux**: x64, arm64
- **macOS**: x64, arm64 (Apple Silicon)
- **Android**: x64, arm64

## 初始化

在使用任何 Skija 类之前，必须加载本地库。当您访问任何依赖于本地代码的类（例如 `Canvas`、`Surface`、`Paint`）时，Skija 会自动处理此过程。

通常，您只需要导入包：

```java
import io.github.humbleui.skija.*;
```

如果需要显式确保库已加载，可以调用：

```java
Library.staticLoad();
```