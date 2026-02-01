# Referencia de la API: PathBuilder

`PathBuilder` es la forma moderna y recomendada de construir objetos `Path` en Skija. Proporciona una API fluida y está diseñado específicamente para la construcción de rutas, separando el proceso de construcción del resultado inmutable `Path`.

## Comandos Básicos

Movimiento y Líneas:
- `moveTo(x, y)`: Inicia un nuevo contorno.
- `lineTo(x, y)`: Añade un segmento de línea.
- `polylineTo(points)`: Añade múltiples segmentos de línea.
- `closePath()`: Cierra el contorno actual.

Comandos Relativos (desplazamientos desde el punto actual):
- `rMoveTo(dx, dy)`
- `rLineTo(dx, dy)`

## Curvas

Bézier Cuadrática (1 punto de control):
- `quadTo(x1, y1, x2, y2)`: Coordenadas absolutas.
- `rQuadTo(dx1, dy1, dx2, dy2)`: Coordenadas relativas.

Bézier Cúbica (2 puntos de control):
- `cubicTo(x1, y1, x2, y2, x3, y3)`: Absoluta.
- `rCubicTo(dx1, dy1, dx2, dy2, dx3, dy3)`: Relativa.

Cónica (Cuadrática con peso):
- `conicTo(x1, y1, x2, y2, w)`: Útil para círculos/elipses exactos.
- `rConicTo(...)`: Versión relativa.

## Arcos

- `arcTo(oval, startAngle, sweepAngle, forceMoveTo)`: Añade un arco confinado al óvalo dado.
- `tangentArcTo(p1, p2, radius)`: Añade un arco tangente a las líneas (actual -> p1) y (p1 -> p2).
- `ellipticalArcTo(...)`: Añade un arco al estilo SVG.

## Añadir Formas

`PathBuilder` permite añadir formas completas como nuevos contornos.

- `addRect(rect, direction, startIndex)`
- `addOval(rect, direction, startIndex)`
- `addCircle(x, y, radius, direction)`
- `addRRect(rrect, direction, startIndex)`: Rectángulo Redondeado.
- `addPolygon(points, close)`: Añade una secuencia de puntos como un contorno.
- `addPath(path, mode)`: Añade los contornos de otra ruta a esta.

## Transformaciones (Estado del Constructor)

Estos métodos afectan a los puntos *actualmente* en el constructor.

- `offset(dx, dy)`: Traslada todos los puntos existentes en el constructor.
- `transform(matrix)`: Aplica una matriz a todos los puntos existentes.

## Gestión del Constructor

- `reset()`: Limpia el constructor a un estado vacío (conserva la memoria).
- `incReserve(points, verbs)`: Pre-asigna memoria para evitar redimensionamientos durante la construcción.
- `setFillMode(mode)`: Establece la regla de relleno (`WINDING`, `EVEN_ODD`, etc.).
- `setVolatile(boolean)`: Sugiere que la ruta resultante no debe ser almacenada en caché (útil para rutas de animación de un solo uso).

## Métodos de Salida

- **`snapshot()`**: Devuelve un `Path` y mantiene intacto el estado del constructor.
- **`detach()`**: Devuelve un `Path` y reinicia el constructor (más eficiente).
- **`build()`**: Devuelve un `Path` y cierra el constructor (no se puede usar después).

## Ejemplo: Construcción Básica

```java
Path path = new PathBuilder()
    .moveTo(10, 10)
    .lineTo(100, 10)
    .lineTo(100, 100)
    .quadTo(50, 150, 10, 100)
    .closePath()
    .snapshot(); // Devuelve el Path
```

## Ejemplo: Transformaciones

```java
PathBuilder builder = new PathBuilder();

builder.addRect(Rect.makeXYWH(0, 0, 100, 100))
       .offset(10, 10)
       .transform(Matrix33.makeRotate(45));

Path p = builder.detach(); // Devuelve la ruta y reinicia el constructor
```

## Ejemplo Visual

Consulta [`examples/scenes/src/PathsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/PathsScene.java) para ver varias combinaciones de rutas y reglas de relleno.