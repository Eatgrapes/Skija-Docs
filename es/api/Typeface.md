# Referencia de API: Typeface

La clase `Typeface` representa un diseño de tipo de letra específico (por ejemplo, "Helvetica Bold"). Es el manejador de los datos del archivo de fuente y se utiliza para crear instancias de `Font`.

## Creación

### Desde Archivo
Carga un tipo de letra desde una ruta de archivo.

```java
// Carga la primera fuente en el archivo (índice 0)
Typeface face = Typeface.makeFromFile("fonts/Inter-Regular.ttf");

// Carga un índice de fuente específico de una colección (TTC)
Typeface faceIndex = Typeface.makeFromFile("fonts/Collection.ttc", 1);
```

### Desde Datos
Carga un tipo de letra desde un objeto `Data` (memoria).

```java
Data data = Data.makeFromFileName("fonts/font.ttf");
Typeface face = Typeface.makeFromData(data);
```

### Desde Nombre (Sistema)
Intenta encontrar una fuente del sistema por su nombre.

```java
// "Arial", "Times New Roman", etc.
Typeface system = Typeface.makeFromName("Arial", FontStyle.NORMAL);
```

## Propiedades

- `getFamilyName()`: Devuelve el nombre de la familia (por ejemplo, "Inter").
- `getFontStyle()`: Devuelve el `FontStyle` (peso, ancho, inclinación).
- `isBold()`: Verdadero si el peso es >= 600.
- `isItalic()`: Verdadero si la inclinación no es vertical.
- `isFixedPitch()`: Verdadero si los caracteres tienen el mismo ancho (monoespaciado).
- `getUnitsPerEm()`: Devuelve el número de unidades de fuente por em.
- `getBounds()`: Devuelve el cuadro delimitador de todos los glifos en la fuente.

## Acceso a Glifos

- `getStringGlyphs(string)`: Convierte una cadena de Java en un array de IDs de glifos (`short[]`).
- `getUTF32Glyph(codePoint)`: Devuelve el ID del glifo para un único punto de código Unicode.
- `getGlyphsCount()`: Devuelve el número total de glifos en el tipo de letra.

## Tablas

Acceso avanzado a las tablas sin procesar de TrueType/OpenType.

- `getTableTags()`: Devuelve una lista de todas las etiquetas de tabla en la fuente (por ejemplo, "head", "cmap", "glyf").
- `getTableData(tag)`: Devuelve los datos sin procesar de una tabla específica como un objeto `Data`.
- `getTableSize(tag)`: Devuelve el tamaño de una tabla específica.

## Clonación (Fuentes Variables)

Para fuentes variables, puedes crear un clon del tipo de letra con valores de eje específicos.

```java
// Crea una instancia de variación (por ejemplo, Peso = 500)
FontVariation weight = new FontVariation("wght", 500);

// Clona el tipo de letra con esta variación
Typeface medium = variableFace.makeClone(weight);
```