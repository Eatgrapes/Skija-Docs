# API Reference: Data

The `Data` class is an immutable wrapper around a raw memory buffer (byte array). It is used throughout Skija to pass binary data (like encoded images, fonts, or shaders) between Java and the native C++ Skia library efficiently.

## Creation

### From Java Byte Array
Copies the data from a Java `byte[]`.

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### From File
Efficiently maps a file into memory (using `mmap` where possible).

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("File not found");
}
```

### Empty
Creates an empty data object.

```java
Data empty = Data.makeEmpty();
```

## Modification (Subsetting)

Since `Data` is immutable, you cannot change its content, but you can create a view into a subset of it (zero-copy if supported, or cheap copy).

```java
// Create a new Data object representing bytes 10-20
Data subset = data.makeSubset(10, 10);
```

## Accessing Content

### As Byte Array
Copies the native data back into a Java `byte[]`.

```java
byte[] content = data.getBytes();

// Or a range
byte[] part = data.getBytes(0, 10);
```

### As ByteBuffer
Wraps the native memory directly in a Java `ByteBuffer`. This is the most efficient way to read data without copying.

```java
ByteBuffer buffer = data.toByteBuffer();
// Read from buffer...
```

### Size
```java
long size = data.getSize();
```

## Lifecycle

`Data` extends `Managed` and uses native memory. Ideally, use try-with-resources or call `close()` when done, although the garbage collector will eventually free it.

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // use data...
} // data.close() called automatically
```
