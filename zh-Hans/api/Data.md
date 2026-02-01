# API 参考：Data

`Data` 类是一个围绕原始内存缓冲区（字节数组）的不可变包装器。它在 Skija 中广泛用于在 Java 和原生 C++ Skia 库之间高效传递二进制数据（如编码的图像、字体或着色器）。

## 创建

### 从 Java 字节数组
从 Java `byte[]` 复制数据。

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### 从文件
高效地将文件映射到内存中（尽可能使用 `mmap`）。

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("File not found");
}
```

### 空数据
创建一个空的数据对象。

```java
Data empty = Data.makeEmpty();
```

## 修改（子集）

由于 `Data` 是不可变的，你无法更改其内容，但可以创建其子集的视图（如果支持则为零拷贝，否则为廉价复制）。

```java
// 创建一个表示字节 10-20 的新 Data 对象
Data subset = data.makeSubset(10, 10);
```

## 访问内容

### 作为字节数组
将原生数据复制回 Java `byte[]`。

```java
byte[] content = data.getBytes();

// 或一个范围
byte[] part = data.getBytes(0, 10);
```

### 作为 ByteBuffer
将原生内存直接包装在 Java `ByteBuffer` 中。这是无需复制读取数据的最有效方式。

```java
ByteBuffer buffer = data.toByteBuffer();
// 从缓冲区读取...
```

### 大小
```java
long size = data.getSize();
```

## 生命周期

`Data` 继承自 `Managed` 并使用原生内存。理想情况下，应在使用完毕后使用 try-with-resources 或调用 `close()`，尽管垃圾回收器最终会释放它。

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // 使用 data...
} // data.close() 自动调用
```