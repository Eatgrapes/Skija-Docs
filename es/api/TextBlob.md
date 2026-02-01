# Referencia de la API: TextBlob & Builder

Un `TextBlob` es una representación inmutable y optimizada de un conjunto de glifos. Es la forma más rápida de dibujar texto en Skija si el diseño del texto (posición de los glifos) no cambia.

## TextBlob

`TextBlob` combina glifos, posiciones y fuentes en un único objeto que puede reutilizarse.

### Propiedades
- `getBounds()`: Devuelve el cuadro delimitador conservador del blob.
- `getUniqueId()`: Devuelve un identificador único para almacenamiento en caché.
- `serializeToData()`: Serializa el blob a un objeto `Data`.

### Creación desde Posiciones
Si ya has calculado las posiciones de los glifos (por ejemplo, usando `Shaper` o manualmente), puedes crear un blob directamente.

```java
// Solo posiciones horizontales (y es constante)
TextBlob blob = TextBlob.makeFromPosH(glyphs, xPositions, y, font);

// Posiciones completas (x, y) para cada glifo
TextBlob blob2 = TextBlob.makeFromPos(glyphs, points, font);

// RSXform (Rotación + Escala + Traslación) para cada glifo
TextBlob blob3 = TextBlob.makeFromRSXform(glyphs, xforms, font);
```

### Dibujo
```java
canvas.drawTextBlob(blob, x, y, paint);
```

---

## TextBlobBuilder

`TextBlobBuilder` te permite construir un `TextBlob` añadiendo múltiples "secuencias" de texto. Una "secuencia" es una sucesión de glifos que comparten la misma Fuente y Pintura.

### Uso Básico

```java
TextBlobBuilder builder = new TextBlobBuilder();

// Añade una secuencia de texto
builder.appendRun(font, "Hello ", 0, 0);

// Añade otra secuencia (por ejemplo, estilo o posición diferente)
builder.appendRun(boldFont, "World!", 100, 0);

// Construye el TextBlob inmutable
TextBlob blob = builder.build();
```

### Añadido Avanzado
- `appendRun(font, glyphs, x, y, bounds)`: Añade glifos con un origen compartido.
- `appendRunPosH(...)`: Añade glifos con posiciones X explícitas.
- `appendRunPos(...)`: Añade glifos con posiciones (X, Y) explícitas.
- `appendRunRSXform(...)`: Añade glifos con transformaciones afines completas (rotación/escala).

### Consejo de Rendimiento
Si vas a dibujar el mismo párrafo de texto múltiples veces (incluso si el lienzo se mueve), crea un `TextBlob` una vez y reutilízalo. Esto evita tener que recalcular las posiciones y formas de los glifos.