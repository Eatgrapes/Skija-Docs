# Animación en Skija

"Animación" en Skija puede significar tres cosas diferentes dependiendo de lo que quieras lograr:

1.  **Animación Programática:** Mover formas o cambiar colores usando código (por ejemplo, un bucle de juego).
2.  **Lottie (Skottie):** Reproducir animaciones vectoriales de alta calidad exportadas desde After Effects.
3.  **Imágenes Animadas:** Reproducir imágenes GIF o WebP.

## 1. Animación Programática (El "Bucle de Juego")

Skija es un renderizador en "modo inmediato". Esto significa que no recuerda dónde dibujaste un círculo ayer. Para mover un círculo, simplemente lo dibujas en una posición diferente hoy.

Para crear una animación, dependes de tu biblioteca de ventanas (como JWM o LWJGL) para que llame a tu función `draw` repetidamente.

### El Patrón

1.  **Obtener el Tiempo:** Usa `System.nanoTime()` para obtener el tiempo actual.
2.  **Calcular el Estado:** Determina dónde deben estar tus objetos basándote en el tiempo.
3.  **Dibujar:** Renderiza el fotograma.
4.  **Solicitar el Siguiente Fotograma:** Indica a la ventana que se actualice de nuevo inmediatamente.

### Ejemplo: Mover un Círculo

```java
// Variable para almacenar el estado
long startTime = System.nanoTime();

public void onPaint(Canvas canvas) {
    // 1. Calcular progreso (0.0 a 1.0) basado en el tiempo
    long now = System.nanoTime();
    float time = (now - startTime) / 1e9f; // Tiempo en segundos
    
    // Mover 100 píxeles por segundo
    float x = 50 + (time * 100) % 500; 
    float y = 100 + (float) Math.sin(time * 5) * 50; // Subir y bajar

    // 2. Dibujar
    Paint paint = new Paint().setColor(0xFFFF0000); // Rojo
    canvas.drawCircle(x, y, 20, paint);

    // 3. Solicitar siguiente fotograma (el método depende de tu biblioteca de ventanas)
    window.requestFrame(); 
}
```

## 2. Animaciones Lottie (Skottie)

Para animaciones vectoriales complejas (como cargadores de interfaz, iconos), Skija usa el módulo **Skottie**. Esto es mucho más eficiente que dibujar todo manualmente.

Consulta la [**Referencia de la API de Animación**](api/Animation.md) para detalles sobre cómo cargar y controlar archivos Lottie.

## 3. Imágenes Animadas (GIF / WebP)

Para reproducir formatos de imagen animada estándar como GIF o WebP, usas la clase `Codec` para extraer los fotogramas.

Consulta la [**Referencia de la API de Codec**](api/Codec.md) para detalles sobre cómo decodificar y reproducir imágenes multifotograma.

---

## Consejos de Rendimiento

-   **No crees objetos en el bucle:** Reutiliza objetos `Paint`, `Rect` y `Path`. Crear nuevos objetos Java 60 veces por segundo activa el Recolector de Basura y causa tartamudeos.
-   **Usa `saveLayer` con cuidado:** Es costoso.
-   **Sincronización Vertical (V-Sync):** Asegúrate de que tu biblioteca de ventanas tenga la Sincronización Vertical habilitada para evitar el efecto tearing en pantalla.