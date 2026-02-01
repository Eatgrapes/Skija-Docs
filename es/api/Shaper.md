# Referencia de la API: Shaper (Conformación de Texto)

La clase `Shaper` es responsable de la **Conformación de Texto**: el proceso de convertir una cadena de caracteres Unicode en un conjunto de glifos posicionados de una fuente.

## Descripción General

La conformación de texto es necesaria para:
- **Ligaduras**: Convertir "f" + "i" en un solo glifo "fi".
- **Kerning**: Ajustar el espacio entre pares de caracteres específicos (como "AV").
- **Escrituras Complejas**: Manejar árabe, devanagari o tailandés, donde las formas de los glifos cambian según sus vecinos.
- **BiDi**: Manejar texto mixto de Izquierda-a-Derecha (latín) y Derecha-a-Izquierda (árabe/hebreo).

## Conformación Básica

Para obtener simplemente un `TextBlob` (un conjunto de glifos posicionados) que puedas dibujar, usa el método `shape()`.

```java
try (Shaper shaper = Shaper.make()) {
    Font font = new Font(typeface, 24);
    
    // Conformación simple (sin límite de ancho)
    TextBlob blob = shaper.shape("Hello, Skija!", font);
    
    canvas.drawTextBlob(blob, 20, 50, paint);
}
```

## Ajuste de Línea y Conformación Multilínea

`Shaper` también puede calcular saltos de línea basados en un ancho máximo.

```java
float maxWidth = 300f;
TextBlob multiLineBlob = shaper.shape(
    "This is a long sentence that will be wrapped by the shaper.",
    font,
    maxWidth
);

// Nota: El TextBlob resultante contiene todas las líneas posicionadas correctamente entre sí.
canvas.drawTextBlob(multiLineBlob, 20, 100, paint);
```

## Opciones de Conformación

Puedes controlar el comportamiento de la conformación (por ejemplo, la dirección del texto) usando `ShapingOptions`.

```java
ShapingOptions options = ShapingOptions.DEFAULT.withLeftToRight(false); // RTL
TextBlob blob = shaper.shape("مرحبا", font, options, Float.POSITIVE_INFINITY, Point.ZERO);
```

## Conformación Avanzada (RunHandler)

Si necesitas control total sobre el proceso de conformación (por ejemplo, para implementar tu propia selección de texto o un diseño multiestilo personalizado), puedes usar un `RunHandler`.

```java
shaper.shape(text, font, ShapingOptions.DEFAULT, maxWidth, new RunHandler() {
    @Override
    public void beginLine() { ... }

    @Override
    public void runInfo(RunInfo info) {
        // Obtener información sobre la secuencia actual de glifos
        System.out.println("Glyph count: " + info.getGlyphCount());
    }

    @Override
    public void commitRunInfo() { ... }

    @Override
    public Point commitLine() { return Point.ZERO; }

    // ... más métodos ...
});
```

## Rendimiento

- **Almacenamiento en Caché**: La conformación de texto es una operación computacionalmente costosa (involucra HarfBuzz). Si tu texto es estático, confórmalo una vez y almacena el `TextBlob` resultante.
- **Instancia de Shaper**: Crear un `Shaper` implica inicializar HarfBuzz. Se recomienda crear una instancia de `Shaper` y reutilizarla a lo largo de tu aplicación (generalmente es seguro reutilizarla, pero verifica la seguridad de hilos si usas múltiples hilos).

## Shaper vs. Paragraph

- **Usa `Shaper`** para bloques de texto de alto rendimiento y un solo estilo, o cuando necesites acceso de bajo nivel a los glifos.
- **Usa [Paragraph](Paragraph.md)** para texto enriquecido (diferentes colores/fuentes en un bloque), diseños de interfaz de usuario complejos y comportamiento estándar de editores de texto.