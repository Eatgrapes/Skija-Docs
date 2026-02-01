# Referencia de la API: Párrafo (Diseño de Texto Enriquecido)

Para cualquier texto que requiera más de una línea o múltiples estilos (por ejemplo, una palabra en **negrita** seguida de una en *cursiva*), Skija proporciona la API **Paragraph**. Maneja tareas complejas de diseño como ajuste de línea, soporte RTL y texto multi-escritura.

## Los Tres Pilares de los Párrafos

Crear un párrafo implica tres pasos principales:
1.  **`FontCollection`**: Define de dónde obtiene sus fuentes el párrafo.
2.  **`ParagraphStyle`**: Define configuraciones globales (alineación, líneas máximas, puntos suspensivos).
3.  **`ParagraphBuilder`**: El "ensamblador" del texto y los estilos.

## 1. Configurar la FontCollection

La `FontCollection` es el gestor de fuentes para tus párrafos. Debes indicarle qué `FontMgr` usar.

```java
FontCollection fc = new FontCollection();
fc.setDefaultFontManager(FontMgr.getDefault());
```

## 2. Estilo Global (ParagraphStyle)

Esto define cómo se comporta todo el bloque de texto.

```java
ParagraphStyle style = new ParagraphStyle();
style.setAlignment(Alignment.CENTER);
style.setMaxLinesCount(3);
style.setEllipsis("..."); // Se muestra si el texto es demasiado largo
```

## 3. Ensamblar Texto Enriquecido (ParagraphBuilder)

El `ParagraphBuilder` utiliza un enfoque de estilos basado en pila. "Empujas" un estilo, agregas texto y lo "sacas" para volver al estilo anterior.

```java
ParagraphBuilder builder = new ParagraphBuilder(style, fc);

// Agregar texto por defecto
builder.pushStyle(new TextStyle().setColor(0xFF000000).setFontSize(16f));
builder.addText("Skija es ");

// Agregar texto en negrita
builder.pushStyle(new TextStyle().setColor(0xFF4285F4).setFontWeight(FontWeight.BOLD));
builder.addText("Potente");
builder.popStyle(); // Volver al estilo por defecto (negro, 16pt)

builder.addText(" y fácil de usar.");
```

## 4. Diseño y Renderizado

Un `Paragraph` necesita ser "diseñado" (medido y ajustado) antes de poder dibujarse. Esto requiere un ancho específico.

```java
Paragraph p = builder.build();

// Diseñar el texto para que quepa dentro de 300 píxeles
p.layout(300);

// Dibujarlo en (x, y)
p.paint(canvas, 20, 20);
```

## Métodos Esenciales

- `p.getHeight()`: Obtiene la altura total del texto diseñado.
- `p.getLongestLine()`: Obtiene el ancho de la línea más larga.
- `p.getLineNumber()`: Cuántas líneas generó el ajuste del texto.
- `p.getRectsForRange(...)`: Obtiene los cuadros delimitadores para una selección (útil para resaltar texto).

## Rendimiento y Mejores Prácticas

1.  **Reutiliza FontCollection:** Normalmente solo necesitas una `FontCollection` para toda tu aplicación.
2.  **El diseño es donde está el trabajo:** `p.layout()` es la parte más costosa porque implica medir cada glifo y calcular saltos de línea. Si tu texto no cambia y el ancho es el mismo, no lo llames de nuevo.
3.  **Métricas de Texto:** Usa `p.getLineMetrics()` si necesitas información detallada sobre la posición y altura de cada línea para diseños de UI avanzados.
4.  **Marcadores de Posición:** Puedes usar `builder.addPlaceholder()` para dejar espacio para imágenes en línea o widgets de UI dentro del flujo de texto.