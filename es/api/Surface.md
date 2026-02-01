# Referencia de la API: Surface

La clase `Surface` es el destino de todos los comandos de dibujo. Gestiona la memoria de píxeles (en CPU o GPU) y proporciona el `Canvas` que usas para dibujar.

## Descripción general

Un `Surface` es responsable de:
1.  Contener los datos de píxeles (o gestionar la textura de la GPU).
2.  Proporcionar una interfaz `Canvas` para dibujar en esos datos.
3.  Capturar el contenido actual en una `Image`.

## Crear una Surface

### 1. Surface Raster (CPU)
La superficie más simple. Los píxeles residen en la memoria estándar del sistema (RAM). Es la mejor opción para generar imágenes, renderizado en el servidor o pruebas.

```java
// Superficie estándar RGBA de 32 bits
Surface raster = Surface.makeRasterN32Premul(800, 600);

// Con ImageInfo personalizada (ej., color F16 para HDR)
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. Surface de GPU (Render Target)
Se utiliza para renderizado acelerado por hardware. Necesitas un `DirectContext` (contexto OpenGL/Metal/Vulkan).

```java
DirectContext context = ...; // Tu contexto de GPU

// Crear una nueva textura en la GPU gestionada por Skia
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // ¿Con presupuesto? (¿Debería Skia contar esto contra su límite de caché?)
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. Envolver Texturas OpenGL/Metal Existentes
Si estás integrando Skija en un motor de juego o sistema de ventanas existente (como LWJGL o JWM), la ventana suele proporcionar un ID de "framebuffer" o "textura". Lo envuelves para que Skija pueda dibujar directamente en la pantalla.

```java
// Ejemplo OpenGL
int framebufferId = 0; // Búfer de pantalla por defecto
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // Ancho, Alto
    0,                 // Recuento de muestras (0 para sin MSAA)
    8,                 // Bits de stencil
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // Las coordenadas de OpenGL comienzan en la parte inferior izquierda
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. Envolver Píxeles Raster (Interoperabilidad)
Si tienes un `ByteBuffer` o un puntero de otra biblioteca (como un decodificador de fotogramas de video), puedes envolverlo directamente sin copiar.

```java
long pixelPtr = ...; // Puntero nativo a la memoria
int rowBytes = width * 4; // Bytes por fila

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. Surface Nula
Crea una superficie que no hace nada. Útil para medir o probar sin asignar memoria.

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## Crear Instantáneas (`Image`)

Crear una `Image` inmutable a partir de una `Surface` es una operación económica (Copy-on-Write).

```java
// ¡Esto no copia los píxeles inmediatamente!
// Efectivamente "bifurca" la superficie. Los dibujos futuros en 'surface' no afectarán a 'snapshot'.
Image snapshot = surface.makeImageSnapshot();

// Ahora puedes usar 'snapshot' para dibujar en otra superficie o guardar en disco.
```

## Interactuar con el Contenido

```java
// Obtener el canvas para dibujar
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// Leer píxeles de vuelta a un bitmap
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // Píxeles leídos con éxito
}

// Escribir píxeles desde un bitmap en la superficie
surface.writePixels(bitmap, 10, 10);

// Enviar comandos a la GPU (importante para superficies de GPU)
surface.flush();
```

- `getCanvas()`: Devuelve el canvas para dibujar.
- `readPixels(bitmap, x, y)`: Lee píxeles desde la GPU/CPU hacia un bitmap.
- `writePixels(bitmap, x, y)`: Escribe píxeles desde un bitmap en la superficie.
- `flush()`: Asegura que todos los comandos pendientes de la GPU se envíen al controlador.
- `notifyContentWillChange()`: Llama a esto si modificas la memoria de píxeles subyacente directamente (omitir el Canvas).
- `getRecordingContext()`: Devuelve el `DirectContext` que respalda esta superficie (si lo hay).