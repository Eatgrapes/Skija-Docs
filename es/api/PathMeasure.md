# Referencia de API: PathMeasure

`PathMeasure` se utiliza para calcular la longitud de una ruta (path) y para encontrar la posición y la tangente en cualquier distancia dada a lo largo de la ruta.

## Descripción General

Un objeto `PathMeasure` se inicializa con un [`Path`](Path.md). Itera a través de los contornos de la ruta. Si la ruta tiene múltiples contornos, puedes pasar al siguiente usando `nextContour()`.

## Constructores

- `new PathMeasure()`: Crea un `PathMeasure` vacío.
- `new PathMeasure(path)`: Se inicializa con la ruta especificada.
- `new PathMeasure(path, forceClosed)`: Si `forceClosed` es verdadero, la ruta se trata como si estuviera cerrada, incluso si no lo está.
- `new PathMeasure(path, forceClosed, resScale)`: `resScale` controla la precisión de la medición (el valor predeterminado es 1.0).

## Métodos

### Gestión del Estado

- `setPath(path, forceClosed)`: Reinicia la medida con una nueva ruta.
- `nextContour()`: Pasa al siguiente contorno en la ruta. Devuelve `true` si existe uno.
- `isClosed()`: Devuelve `true` si el contorno actual está cerrado.

### Mediciones

- `getLength()`: Devuelve la longitud total del contorno actual.
- `getPosition(distance)`: Devuelve el `Point` en la distancia especificada a lo largo de la ruta.
- `getTangent(distance)`: Devuelve la tangente (como un vector `Point`) en la distancia especificada.
- `getRSXform(distance)`: Devuelve el `RSXform` en la distancia especificada.
- `getMatrix(distance, getPosition, getTangent)`: Devuelve una `Matrix33` que representa la posición y/o la tangente en la distancia.

### Extracción

- `getSegment(startD, endD, dst, startWithMoveTo)`: Devuelve el segmento de la ruta entre `startD` y `endD` en el `PathBuilder` proporcionado.

## Ejemplo

```java
Path path = Path.makeCircle(100, 100, 50);
PathMeasure measure = new PathMeasure(path);

float length = measure.getLength();
Point pos = measure.getPosition(length / 2); // Obtiene el punto a mitad de camino
Point tan = measure.getTangent(length / 2);   // Obtiene la dirección en ese punto
```