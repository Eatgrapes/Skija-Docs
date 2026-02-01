# Referencia de la API: Fuente y Gestión

La clase `Font` controla cómo se renderiza el texto, mientras que `FontMgr` maneja el descubrimiento de fuentes y `FontFeature` habilita funciones avanzadas de OpenType.

## Font

Un objeto `Font` toma un [`Typeface`](Typeface.md) y añade tamaño, escala, inclinación y atributos de renderizado.

### Creación

```java
// Fuente por defecto (generalmente sans-serif de 12pt)
Font font = new Font();

// Tipo de letra y tamaño personalizados
Font font = new Font(typeface, 24f);

// Texto condensado/expandido u oblicuo
Font font = new Font(typeface, 24f, 0.8f, -0.25f);
```

- `new Font()`: Inicializa con valores por defecto.
- `new Font(typeface)`: Inicializa con un tipo de letra específico y tamaño por defecto.
- `new Font(typeface, size)`: Inicializa con tipo de letra y tamaño específicos.
- `new Font(typeface, size, scaleX, skewX)`: Constructor completo.

### Métricas y Espaciado

- `getSize()` / `setSize(value)`: Tamaño tipográfico en puntos.
- `getScaleX()` / `setScaleX(value)`: Escala horizontal (1.0 es normal).
- `getSkewX()` / `setSkewX(value)`: Inclinación horizontal (0 es normal).
- `getMetrics()`: Devuelve [`FontMetrics`](#fontmetrics) detalladas.
- `getSpacing()`: Espaciado de línea recomendado (suma de ascenso, descenso y *leading*).

### Banderas de Renderizado

Estas afectan cómo se rasterizan los glifos.

- `setSubpixel(boolean)`: Solicita posicionamiento sub-píxel para texto más suave.
- `setEdging(FontEdging)`: Controla el suavizado de bordes (`ALIAS`, `ANTI_ALIAS`, `SUBPIXEL_ANTI_ALIAS`).
- `setHinting(FontHinting)`: Controla el ajuste del contorno del glifo (`NONE`, `SLIGHT`, `NORMAL`, `FULL`).
- `setEmboldened(boolean)`: Aproxima el negrito aumentando el ancho del trazo.
- `setBaselineSnapped(boolean)`: Ajusta las líneas base a posiciones de píxel.
- `setMetricsLinear(boolean)`: Solicita métricas escalables linealmente (ignora *hinting* y redondeo).
- `setBitmapsEmbedded(boolean)`: Solicita usar mapas de bits en las fuentes en lugar de contornos.

### Medición de Texto

```java
// Medición simple del ancho
float width = font.measureTextWidth("Hello");

// Obtener el cuadro delimitador preciso
Rect bounds = font.measureText("Hello");

// Medir ancho con efectos de pintura específicos
float width = font.measureTextWidth("Hello", paint);
```

- `measureText(string)` / `measureText(string, paint)`: Devuelve el cuadro delimitador.
- `measureTextWidth(string)` / `measureTextWidth(string, paint)`: Devuelve el ancho de avance.
- `getWidths(glyphs)`: Recupera los avances para cada ID de glifo.
- `getBounds(glyphs)` / `getBounds(glyphs, paint)`: Recupera los cuadros delimitadores para cada ID de glifo.

### Acceso a Glifos

- `getStringGlyphs(string)`: Convierte texto en un array de IDs de glifos.
- `getUTF32Glyph(unichar)`: Devuelve el ID de glifo para un solo carácter.
- `getUTF32Glyphs(uni)`: Devuelve IDs de glifos para un array de caracteres.
- `getStringGlyphsCount(string)`: Devuelve el número de glifos representados por el texto.
- `getPath(glyph)`: Devuelve el contorno [`Path`](Path.md) para un solo glifo.
- `getPaths(glyphs)`: Devuelve contornos para un array de glifos.

---

## FontMgr

`FontMgr` (Gestor de Fuentes) maneja el descubrimiento y carga de archivos de fuentes.

### Acceso al Gestor

- `FontMgr.getDefault()`: Devuelve el gestor de fuentes global por defecto.

### Búsqueda de Tipos de Letra

```java
FontMgr mgr = FontMgr.getDefault();

// Coincidencia por nombre y estilo
Typeface inter = mgr.matchFamilyStyle("Inter", FontStyle.BOLD);

// Coincidencia con fuentes de respaldo del sistema para caracteres específicos (ej., Emoji)
Typeface emoji = mgr.matchFamilyStyleCharacter(null, FontStyle.NORMAL, null, "🧛".codePointAt(0));
```

- `matchFamilyStyle(familyName, style)`: Encuentra el tipo de letra que más se aproxima.
- `matchFamiliesStyle(families[], style)`: Intenta múltiples nombres de familia en orden.
- `matchFamilyStyleCharacter(familyName, style, bcp47[], character)`: Encuentra una fuente que soporte un carácter Unicode específico.
- `getFamiliesCount()`: Devuelve el número de familias de fuentes disponibles en el sistema.
- `getFamilyName(index)`: Devuelve el nombre de una familia de fuentes.

### Carga de Fuentes

- `makeFromFile(path)` / `makeFromFile(path, ttcIndex)`: Carga una fuente desde un archivo.
- `makeFromData(data)` / `makeFromData(data, ttcIndex)`: Carga una fuente desde memoria.

---

## FontFeature

`FontFeature` habilita funciones OpenType como ligaduras, kerning o alternativas.

```java
// Habilitar funciones específicas
FontFeature[] features = FontFeature.parse("cv06 cv07 +liga");

// Crear manualmente
FontFeature kernOff = new FontFeature("kern", 0);
```

- `FontFeature.parse(string)`: Analiza funciones desde una cadena (ej., `"+liga -kern"`).
- `new FontFeature(tag)`: Habilita una función (valor = 1).
- `new FontFeature(tag, value)`: Establece una función a un valor específico.
- `new FontFeature(tag, value, start, end)`: Aplica una función a un rango específico de texto.

---

## FontMetrics

Mediciones detalladas escaladas por el tamaño de la fuente.

- `getTop()` / `getBottom()`: Extensiones por encima/por debajo de la línea base (máximas).
- `getAscent()` / `getDescent()`: Extensiones promedio (el ascenso es negativo).
- `getLeading()`: Espacio recomendado entre líneas.
- `getCapHeight()`: Altura de las letras mayúsculas.
- `getXHeight()`: Altura de las letras minúsculas.
- `getThickness()` / `getUnderlinePosition()`: Para dibujar subrayados.