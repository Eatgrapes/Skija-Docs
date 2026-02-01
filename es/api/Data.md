# Referencia de API: Data

La clase `Data` es un envoltorio inmutable alrededor de un búfer de memoria en bruto (array de bytes). Se utiliza en toda Skija para pasar datos binarios (como imágenes codificadas, fuentes o shaders) entre Java y la biblioteca nativa C++ Skia de manera eficiente.

## Creación

### Desde un Array de Bytes de Java
Copia los datos desde un `byte[]` de Java.

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### Desde un Archivo
Mapea eficientemente un archivo en memoria (usando `mmap` donde sea posible).

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("File not found");
}
```

### Vacío
Crea un objeto data vacío.

```java
Data empty = Data.makeEmpty();
```

## Modificación (Subconjunto)

Dado que `Data` es inmutable, no puedes cambiar su contenido, pero puedes crear una vista de un subconjunto del mismo (sin copia si es compatible, o con una copia económica).

```java
// Crea un nuevo objeto Data que represente los bytes 10-20
Data subset = data.makeSubset(10, 10);
```

## Acceso al Contenido

### Como Array de Bytes
Copia los datos nativos de vuelta a un `byte[]` de Java.

```java
byte[] content = data.getBytes();

// O un rango
byte[] part = data.getBytes(0, 10);
```

### Como ByteBuffer
Envuelve la memoria nativa directamente en un `ByteBuffer` de Java. Esta es la forma más eficiente de leer datos sin copiarlos.

```java
ByteBuffer buffer = data.toByteBuffer();
// Leer desde el buffer...
```

### Tamaño
```java
long size = data.getSize();
```

## Ciclo de Vida

`Data` extiende `Managed` y utiliza memoria nativa. Idealmente, usa try-with-resources o llama a `close()` cuando termines, aunque el recolector de basura eventualmente lo liberará.

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // usar data...
} // data.close() se llama automáticamente
```