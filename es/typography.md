# Tipografía y Texto

El texto es una de las partes más complejas de cualquier biblioteca de gráficos. Skija proporciona una API de alto nivel para manejar todo, desde etiquetas simples hasta diseños de texto complejos de varias líneas.

## La Tipografía (El "Qué")

Un `Typeface` representa un archivo de fuente específico (como "Inter-Bold.ttf"). Define la forma de los glifos.

### Cargar Tipografías
Puedes cargarlas desde archivos, recursos o el administrador de fuentes del sistema.

```java
// Desde un archivo
Typeface inter = Typeface.makeFromFile("fonts/Inter.ttf");

// Desde el sistema (forma segura)
Typeface sans = FontMgr.getDefault().matchFamilyStyle("sans-serif", FontStyle.NORMAL);
```

**Error Común:** No asumas que una fuente existe en el sistema del usuario. Siempre proporciona una alternativa o incluye tus fuentes como recursos.

## La Fuente (El "Cómo")

Una `Font` toma un `Typeface` y le da un tamaño y otros atributos de renderizado.

```java
Font font = new Font(inter, 14f);
```

### Posicionar Texto: Métricas de Fuente

Si quieres centrar texto o alinearlo con precisión, necesitas entender `FontMetrics`.

```java
FontMetrics metrics = font.getMetrics();
// metrics.getAscent()  -> Distancia desde la línea base hacia arriba (negativa)
// metrics.getDescent() -> Distancia desde la línea base hacia abajo (positiva)
// metrics.getLeading() -> Espacio sugerido entre líneas
```

**Ejemplo: Centrado Vertical Perfecto**
Para centrar texto verticalmente en `y`, generalmente quieres desplazarlo por la mitad de la altura del "cap height" (altura de las letras mayúsculas).

```java
float centerY = rect.getMidY() - metrics.getCapHeight() / 2f;
canvas.drawString("HELLO", rect.getLeft(), centerY, font, paint);
```

## Texto Avanzado: Párrafo

Para cualquier cosa más compleja que una sola palabra o línea, usa la API de **Párrafo**. Maneja:
- Ajuste de línea
- Múltiples estilos (negrita, cursiva, colores) en un bloque
- Texto de derecha a izquierda (RTL)
- Soporte para emojis

Consulta la [**Referencia de la API de Párrafo**](api/Paragraph.md) para más detalles.

## Texto Interactivo: TextLine

Si necesitas una sola línea de texto pero necesitas saber exactamente dónde está cada carácter (por ejemplo, para un cursor o selección en un campo de texto), usa `TextLine`.

```java
TextLine line = TextLine.make("Interact with me", font);

// Obtener propiedades visuales
float width = line.getWidth();
float height = line.getHeight();

// Prueba de impacto: Obtener índice del carácter en una coordenada de píxel
int charIndex = line.getOffsetAtCoord(45.0f);

// Obtener coordenada de píxel para un índice de carácter
float xCoord = line.getCoordAtOffset(5);

// Renderizado
canvas.drawTextLine(line, 20, 50, paint);
```

### Ejemplos Visuales

**Línea de Texto Interactiva:**
Consulta [`examples/scenes/src/TextLineScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextLineScene.java) para ver una demostración de posicionamiento del cursor, pruebas de impacto y diseño de texto multi-escritura.

**Efectos de Blob de Texto:**
Consulta [`examples/scenes/src/TextBlobScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/TextBlobScene.java) para ver ejemplos de texto en ruta, texto ondulado y posicionamiento personalizado.

## Mejores Prácticas

1.  **Almacena en caché tus Fuentes/Tipografías:** Crear un `Typeface` implica analizar un archivo y puede ser lento. Guárdalos en una caché estática o en un administrador de temas.
2.  **Usa Sugerencia/Antialiasing:** Para texto pequeño en pantallas, asegúrate de que el antialiasing esté habilitado en tu `Paint` para mantenerlo legible.
3.  **Mide antes de Dibujar:** Usa `font.measureTextWidth(string)` para calcular los diseños antes de dibujarlos realmente en el lienzo.