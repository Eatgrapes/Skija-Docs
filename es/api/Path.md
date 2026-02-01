# Referencia de la API: Path

La clase `Path` representa trayectorias geométricas complejas y compuestas, formadas por segmentos de línea recta, curvas cuadráticas y curvas cúbicas.

> **Nota:** Para construir nuevas trayectorias, se recomienda encarecidamente usar [**PathBuilder**](path-builder.md) en lugar de llamar a los métodos directamente en `Path`. `PathBuilder` proporciona una API fluida mejor y garantiza que el `Path` resultante sea inmutable.

## Construcción de una Trayectoria (Fábricas Estáticas)

Aunque `PathBuilder` es preferible para trayectorias complejas, `Path` ofrece fábricas estáticas eficientes para formas comunes.

- `makeRect(rect)`: Crea una trayectoria a partir de un rectángulo.
- `makeOval(rect)`: Crea una trayectoria a partir de un óvalo.
- `makeCircle(x, y, radius)`: Crea una trayectoria a partir de un círculo.
- `makeRRect(rrect)`: Crea una trayectoria a partir de un rectángulo redondeado.
- `makeLine(p1, p2)`: Crea una trayectoria a partir de un solo segmento de línea.
- `makePolygon(points, closed)`: Crea una trayectoria a partir de una secuencia de puntos.
- `makeFromSVGString(svgString)`: Analiza una cadena de ruta SVG (por ejemplo, `"M10 10 L50 50 Z"`).

## Información y Métricas de la Trayectoria

- `getBounds()`: Devuelve el cuadro delimitador conservador (rápido, en caché).
- `computeTightBounds()`: Devuelve el cuadro delimitador preciso (más lento).
- `isEmpty()`: Devuelve verdadero si la trayectoria no contiene verbos.
- `isConvex()`: Devuelve verdadero si la trayectoria define una forma convexa.
- `isRect()`: Devuelve el `Rect` si la trayectoria representa un rectángulo simple, o nulo.
- `isOval()`: Devuelve el `Rect` delimitador si la trayectoria es un óvalo, o nulo.
- `isFinite()`: Devuelve verdadero si todos los puntos de la trayectoria son finitos.

## Pruebas de Colisión (Hit Testing)

- `contains(x, y)`: Devuelve verdadero si el punto especificado está dentro de la trayectoria (basado en el Tipo de Relleno actual).
- `conservativelyContainsRect(rect)`: Devuelve verdadero si el rectángulo está definitivamente dentro de la trayectoria (prueba de rechazo rápido).

## Operaciones Booleanas

Las trayectorias se pueden combinar usando operaciones lógicas. Estas crean un **nuevo** objeto `Path`.

```java
Path result = Path.makeCombining(pathA, pathB, PathOp.INTERSECT);
```

`PathOp`s disponibles:
- `DIFFERENCE`: A - B
- `INTERSECT`: A & B
- `UNION`: A | B
- `XOR`: (A | B) - (A & B)
- `REVERSE_DIFFERENCE`: B - A

## Transformaciones y Modificación

Estos métodos devuelven una **nueva** instancia de `Path` con la transformación aplicada.

- `makeTransform(matrix)`: Aplica una `Matrix33` a todos los puntos de la trayectoria.
- `makeOffset(dx, dy)`: Traslada la trayectoria.
- `makeScale(s)`: Escala la trayectoria.

## Interpolación (Morphing)

Puedes interpolar entre dos trayectorias compatibles (útil para animaciones).

```java
// Interpola al 50% entre pathA y pathB
if (pathA.isInterpolatable(pathB)) {
    Path midPath = pathA.makeInterpolate(pathB, 0.5f);
}
```

## Serialización

- `serializeToBytes()`: Serializa la trayectoria a un array de bytes.
- `makeFromBytes(bytes)`: Reconstruye una trayectoria a partir de bytes.
- `dump()`: Imprime la estructura de la trayectoria en la salida estándar (para depuración).

## Medición e Iteración

- `PathMeasure`: Se usa para calcular la longitud de una trayectoria y encontrar posiciones/tangentes a lo largo de su longitud.
- `PathSegmentIterator`: Te permite iterar sobre los verbos y puntos individuales que componen la trayectoria.

## Ejemplo

```java
Path path = new Path()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath();

canvas.drawPath(path, paint);
```

## Tipo de Relleno (Fill Type)

El tipo de relleno determina qué áreas se consideran "interiores" de la trayectoria para las operaciones de relleno.
- `WINDING` (Predeterminado): Usa la regla del número de vueltas (winding number).
- `EVEN_ODD`: Usa la regla par-impar.
- `INVERSE_WINDING`: Invierte la regla de vueltas (rellena el exterior).
- `INVERSE_EVEN_ODD`: Invierte la regla par-impar.

## Ejemplo Visual

Consulta [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) para ver ejemplos de creación, modificación y combinación de trayectorias.
