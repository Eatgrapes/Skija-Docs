# 安裝

Skija 透過 Maven Central 分發。要開始使用它，您需要將適當的依賴項添加到專案的建置配置中。

## 依賴管理

Skija 提供平台特定的構件。您應包含與目標作業系統和架構相符的構件。

### Maven

將以下內容添加到您的 `pom.xml`：

```xml
<dependency>
  <groupId>io.github.humbleui</groupId>
  <artifactId>skija-windows-x64</artifactId>
  <version>${skija.version}</version>
</dependency>
```

將 `skija-windows-x64` 替換為適合您平台的構件：
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

## 支援的平台

Skija 目前支援：
- **Windows**：x64
- **Linux**：x64、arm64
- **macOS**：x64、arm64（Apple Silicon）
- **Android**：x64、arm64

## 初始化

在使用任何 Skija 類別之前，必須載入原生函式庫。當您存取任何依賴原生程式碼的類別（例如 `Canvas`、`Surface`、`Paint`）時，Skija 會自動處理此操作。

通常，您只需要匯入套件：

```java
import io.github.humbleui.skija.*;
```

如果您需要明確確保函式庫已載入，可以呼叫：

```java
Library.staticLoad();
```