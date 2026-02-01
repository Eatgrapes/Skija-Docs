# Referencia de API: TextLine

`TextLine` representa una sola línea de texto con forma (shaped). Normalmente se crea mediante el `Shaper` y proporciona información métrica y capacidades de prueba de aciertos (hit-testing) esenciales para construir editores de texto o etiquetas interactivas.

## Creación

```java
// Dar forma a una sola línea de texto
TextLine line = TextLine.make("Hello World", font);
```

## Métricas

- `getAscent()`: Distancia desde la línea base hasta la parte superior del glifo más alto (negativa).
- `getDescent()`: Distancia desde la línea base hasta la parte inferior del glifo más bajo (positiva).
- `getCapHeight()`: Altura de las letras mayúsculas.
- `getXHeight()`: Altura de la 'x' minúscula.
- `getWidth()`: Ancho total de avance de la línea.
- `getHeight()`: Altura total (descent - ascent).

## Prueba de Aciertos (Interacción)

`TextLine` proporciona métodos para mapear entre coordenadas de píxeles y desplazamientos de caracteres.

```java
// 1. Obtener Desplazamiento desde una Coordenada (Clic)
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // Devuelve el índice del carácter UTF-16
// 'offset' será el más cercano al cursor del ratón

// 2. Obtener Coordenada desde un Desplazamiento (Colocación del Cursor)
float cursorX = line.getCoordAtOffset(offset);
// Dibujar un cursor en (cursorX, baseline)
```

- `getOffsetAtCoord(x)`: Desplazamiento de carácter más cercano.
- `getLeftOffsetAtCoord(x)`: Desplazamiento de carácter estrictamente a la izquierda.
- `getCoordAtOffset(offset)`: Coordenada X en píxeles para un índice de carácter dado.

## Renderizado

```java
// Puedes dibujar la línea directamente
canvas.drawTextLine(line, x, y, paint);

// O extraer el TextBlob para un control más manual
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## Ciclo de Vida
`TextLine` implementa `Managed`. Siempre ciérralo cuando hayas terminado para liberar recursos nativos.

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... usar line ...
}
```