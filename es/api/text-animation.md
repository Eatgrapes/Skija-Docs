# Tipografía Avanzada: Recorte y Animación

Skija proporciona herramientas poderosas no solo para dibujar texto estático, sino también para usar el texto como un objeto geométrico para recorte, enmascaramiento y animación.

## Texto como Recorte (Enmascaramiento)

Para usar texto como máscara (por ejemplo, para mostrar una imagen *dentro* de las letras), no puedes simplemente "recortar al texto". En su lugar, primero debes convertir el texto en un `Path`.

### 1. Obtener el Path a partir del Texto
Usa `Font.getPath()` para obtener el contorno geométrico de glifos específicos.

```java
Font font = new Font(typeface, 100);
short[] glyphs = font.getStringGlyphs("MASK");

// Obtener el path para estos glifos
// Nota: getPaths devuelve un array de paths (uno por glifo)
// A menudo querrás combinarlos o simplemente dibujarlos secuencialmente
Point[] positions = font.getPositions(glyphs, new Point(50, 150)); // Posicionar el texto

Path textPath = new Path();
for (int i = 0; i < glyphs.length; i++) {
    Path glyphPath = font.getPath(glyphs[i]);
    if (glyphPath != null) {
        // Desplazar el path del glifo a su posición y añadirlo al path principal
        glyphPath.transform(Matrix33.makeTranslate(positions[i].getX(), positions[i].getY()));
        textPath.addPath(glyphPath);
    }
}
```

### 2. Recortar el Canvas
Una vez que tienes el `Path`, puedes recortar el canvas.

```java
canvas.save();
canvas.clipPath(textPath);

// Ahora dibuja la imagen (o gradiente, o patrón)
// Solo aparecerá dentro de las letras "MASK"
canvas.drawImage(myImage, 0, 0);

canvas.restore();
```

## Animando Texto

Skija permite animación de texto de alto rendimiento dándote acceso de bajo nivel al posicionamiento de glifos a través de `TextBlob`.

### 1. Animación por Glifo (Texto Ondulado)
En lugar de dibujar una cadena, calculas la posición de cada carácter manualmente.

```java
String text = "Wavy Text";
short[] glyphs = font.getStringGlyphs(text);
float[] widths = font.getWidths(glyphs);

// Calcular posiciones para cada glifo
Point[] positions = new Point[glyphs.length];
float x = 50;
float time = (System.currentTimeMillis() % 1000) / 1000f; // 0.0 a 1.0

for (int i = 0; i < glyphs.length; i++) {
    // Animación de onda sinusoidal
    float yOffset = (float) Math.sin((x / 50.0) + (time * Math.PI * 2)) * 10;
    
    positions[i] = new Point(x, 100 + yOffset);
    x += widths[i];
}

// Crear un TextBlob a partir de estas posiciones explícitas
TextBlob blob = TextBlob.makeFromPos(glyphs, positions, font);

// Dibujarlo
canvas.drawTextBlob(blob, 0, 0, paint);
```

### 2. Texto en un Path (RSXform)
Para texto que sigue una curva (y rota para coincidir con ella), usa `RSXform` (Transformación de Rotación, Escala y Traslación).

```java
// Ver 'TextBlob.makeFromRSXform' en la API
// Esto te permite especificar una rotación y posición para cada glifo de forma independiente.
```

## Fuentes Variables
Si tienes una fuente variable (como `Inter-Variable.ttf`), puedes animar su peso o inclinación de forma suave.

```java
// 1. Crear una instancia de FontVariation
FontVariation weight = new FontVariation("wght", 400 + (float)Math.sin(time) * 300); // Peso de 100 a 700

// 2. Crear un Typeface específico a partir de la base variable
Typeface currentFace = variableTypeface.makeClone(weight);

// 3. Crear una Font y Dibujar
Font font = new Font(currentFace, 40);
canvas.drawString("Breathing Text", 50, 50, font, paint);
```

## Resumen

- **Recorte:** Convertir Texto -> Glifos -> Path -> `canvas.clipPath()`.
- **Texto Ondulado/En Movimiento:** Calcular posiciones `Point[]` manualmente y usar `TextBlob.makeFromPos()`.
- **Texto en Path:** Usar `TextBlob.makeFromRSXform()`.
- **Animación de Peso/Estilo:** Usar Fuentes Variables y `makeClone(FontVariation)`.