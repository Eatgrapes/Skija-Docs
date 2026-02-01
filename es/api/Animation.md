# Referencia de API: Animación (Skottie)

La clase `Animation` (en `io.github.humbleui.skija.skottie`) proporciona soporte para cargar y renderizar animaciones Lottie.

## Descripción General

Skottie es un reproductor Lottie de alto rendimiento para Skia. La clase `Animation` te permite cargar animaciones Lottie desde archivos, cadenas de texto o datos, y renderizar fotogramas específicos en un `Canvas`.

## Creación

- `makeFromString(data)`: Crea una `Animation` a partir de una cadena JSON.
- `makeFromFile(path)`: Crea una `Animation` a partir de una ruta de archivo.
- `makeFromData(data)`: Crea una `Animation` a partir de un objeto `Data`.

## Renderizado

- `render(canvas)`: Dibuja el fotograma actual en el lienzo en `(0, 0)` con el tamaño natural de la animación.
- `render(canvas, offset)`: Dibuja el fotograma actual en el desplazamiento `(x, y)` especificado.
- `render(canvas, left, top)`: Dibuja el fotograma actual en las coordenadas especificadas.
- `render(canvas, dst, renderFlags)`: Dibuja el fotograma actual escalado al `Rect` de destino.

## Control de la Reproducción

Para renderizar un fotograma específico, primero debes buscarlo.

- `seek(t)`: Busca un tiempo normalizado `t` en el rango `[0..1]`.
- `seek(t, ic)`: Busca un tiempo normalizado `t` con un `InvalidationController`.
- `seekFrame(t)`: Busca un índice de fotograma específico `t` (relativo a `duration * fps`).
- `seekFrameTime(t)`: Busca un tiempo específico `t` en segundos.

## Propiedades

- `getDuration()`: Devuelve la duración total de la animación en segundos.
- `getFPS()`: Devuelve la tasa de fotogramas (fotogramas por segundo).
- `getInPoint()`: Devuelve el punto de entrada (fotograma inicial) en unidades de índice de fotograma.
- `getOutPoint()`: Devuelve el punto de salida (fotograma final) en unidades de índice de fotograma.
- `getVersion()`: Devuelve la cadena de versión de Lottie.
- `getSize()`: Devuelve el tamaño natural de la animación como un `Point`.
- `getWidth()`: Devuelve el ancho de la animación.
- `getHeight()`: Devuelve la altura de la animación.

## Ejemplo

```java
// Cargar animación desde recursos o sistema de archivos
try (var anim = Animation.makeFromFile("loading.json")) {
    
    // Obtener información de la animación
    float duration = anim.getDuration(); // en segundos
    float width = anim.getWidth();
    float height = anim.getHeight();

    // Preparar para el renderizado
    anim.seek(0.5f); // Ir a la mitad de la animación (50%)

    // Renderizar en el lienzo
    // Asume que tienes una instancia de Canvas 'canvas'
    canvas.save();
    canvas.translate(100, 100); // Posicionar la animación
    anim.render(canvas);
    canvas.restore();
}
```