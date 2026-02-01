# API 參考：Data

`Data` 類別是一個圍繞原始記憶體緩衝區（位元組陣列）的不可變包裝器。它在 Skija 中廣泛用於在 Java 和原生 C++ Skia 函式庫之間高效傳遞二進位資料（如編碼圖像、字型或著色器）。

## 建立

### 從 Java 位元組陣列
從 Java `byte[]` 複製資料。

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### 從檔案
高效地將檔案映射到記憶體中（盡可能使用 `mmap`）。

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("File not found");
}
```

### 空資料
建立一個空的資料物件。

```java
Data empty = Data.makeEmpty();
```

## 修改（子集）

由於 `Data` 是不可變的，您無法更改其內容，但可以建立其子集的視圖（如果支援則為零複製，否則為低成本複製）。

```java
// 建立一個代表位元組 10-20 的新 Data 物件
Data subset = data.makeSubset(10, 10);
```

## 存取內容

### 作為位元組陣列
將原生資料複製回 Java `byte[]`。

```java
byte[] content = data.getBytes();

// 或一個範圍
byte[] part = data.getBytes(0, 10);
```

### 作為 ByteBuffer
將原生記憶體直接包裝在 Java `ByteBuffer` 中。這是在不複製的情況下讀取資料的最高效方式。

```java
ByteBuffer buffer = data.toByteBuffer();
// 從緩衝區讀取...
```

### 大小
```java
long size = data.getSize();
```

## 生命週期

`Data` 繼承自 `Managed` 並使用原生記憶體。理想情況下，使用 try-with-resources 或在完成時呼叫 `close()`，儘管垃圾收集器最終會釋放它。

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // 使用 data...
} // data.close() 自動呼叫
```