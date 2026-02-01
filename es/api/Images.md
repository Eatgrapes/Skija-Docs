# Imágenes y Mapas de Bits

Manejar imágenes en Skija involucra dos clases principales: `Image` y `Bitmap`. Aunque parecen similares, sirven para propósitos diferentes.

## Image vs. Bitmap

- **`Image`**: Piensa en esto como una textura de solo lectura, potencialmente respaldada por la GPU. Está optimizada para dibujar en un lienzo.
- **`Bitmap`**: Este es un arreglo mutable de píxeles en el lado de la CPU. Lo usas cuando necesitas editar píxeles individuales de manera programática.

## Cargar una Imagen

La forma más común de obtener una imagen es cargarla desde bytes codificados (PNG, JPEG, etc.).

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**Consejo:** `makeDeferredFromEncodedBytes` es "perezoso" (lazy)—no decodificará los píxeles hasta la primera vez que realmente la dibujes, lo que ahorra memoria y tiempo durante la carga inicial.

### Crear desde Píxeles (Ráster)

Si tienes datos de píxeles crudos (por ejemplo, de otra librería o generados proceduralmente):

```java
// Desde un objeto Data (envuelve memoria nativa o un arreglo de bytes)
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// Desde un Bitmap (copia o comparte píxeles)
Image img = Image.makeRasterFromBitmap(bitmap);

// Desde un Pixmap (copia píxeles)
Image img = Image.makeRasterFromPixmap(pixmap);
```

## Codificación (Guardar Imágenes)

Para guardar una `Image` en un archivo o flujo, debes codificarla. Skija proporciona `EncoderJPEG`, `EncoderPNG` y `EncoderWEBP` para un control detallado.

```java
// Codificación Simple (configuración por defecto)
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // Calidad por defecto 100

// Codificación Avanzada (con opciones)
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// Codificación WebP
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // o LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## Dibujar en el Lienzo

Dibujar una imagen es simple, pero presta atención al **Muestreo (Sampling)**.

```java
canvas.drawImage(img, 10, 10);
```

### Modos de Muestreo

Cuando escalas una imagen, necesitas decidir cómo debe ser muestreada:
- `SamplingMode.DEFAULT`: Vecino más cercano. Rápido, pero se ve pixelado al escalar.
- `SamplingMode.LINEAR`: Filtrado bilineal. Suave, pero puede ser un poco borroso.
- `SamplingMode.MITCHELL`: Remuestreo cúbico de alta calidad. Excelente para reducir escala.

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## Crear Shaders desde Imágenes

Puedes usar una imagen como un patrón (por ejemplo, para un fondo en mosaico) convirtiéndola en un shader.

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // Llena todo el lienzo con la imagen en mosaico
```

## Trabajar con Píxeles (Bitmap)

Si necesitas generar una imagen desde cero píxel por píxel:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Ahora puedes dibujar en este bitmap usando un Canvas
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... dibujar cosas ...

// O acceder a los píxeles crudos (avanzado)
ByteBuffer pixels = bmp.peekPixels();
```

## Acceder a Datos de Píxeles (Muestreo)

Para leer píxeles de una `Image` o `Surface`, usa el método `readPixels`.

### Muestreo de Imagen Completa
```java
// Crear un bitmap para contener los píxeles
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// Leer todos los píxeles de la imagen al bitmap
image.readPixels(bmp);
```

### Muestreo de Región
Puedes leer un sub-rectángulo específico de la imagen proporcionando un desplazamiento (x, y).

```java
// Solo queremos una región de 50x50
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// Leer comenzando desde (100, 100) en la imagen fuente
// capturando efectivamente el rectángulo {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## Interoperabilidad OpenGL / Metal

Skija te permite crear objetos `Image` directamente desde texturas de GPU existentes. Esto es útil para integrar con otras librerías gráficas (como LWJGL).

### Crear una Imagen desde una Textura OpenGL

```java
// Necesitas un DirectContext para operaciones de GPU
DirectContext context = ...; 

// Supón que tienes un ID de textura OpenGL de otro lugar
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// Ahora puedes dibujar esta textura usando Skija
canvas.drawImage(glImage, 0, 0);
```

**Nota:** Al adoptar una textura, Skija asume la propiedad. Si quieres envolverla sin tomar propiedad, busca variantes de `makeFromTexture` (si están disponibles) o gestiona el ciclo de vida cuidadosamente.

## Problemas de Rendimiento

1.  **Decodificación en el hilo de la UI:** Decodificar imágenes grandes puede ser lento. Hazlo en segundo plano.
2.  **Cargas de Texturas:** Si estás usando un backend de GPU (como OpenGL), la primera vez que dibujas una `Image` del lado de la CPU, Skia tiene que subirla a la GPU. Para texturas grandes, esto puede causar una caída de fotogramas.
3.  **Bitmaps Grandes:** Los Bitmaps viven en el heap de Java y en memoria nativa. Ten cuidado con dimensiones grandes (por ejemplo, texturas de 8k) ya que pueden llevar rápidamente a errores de OutOfMemory.