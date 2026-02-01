# Sombras en Skija

Skija proporciona dos formas distintas de dibujar sombras: **Sombras 2D** (mediante ImageFilters) y **Sombras de Elevación 3D** (mediante ShadowUtils).

## 1. Sombras 2D (ImageFilter)

Esta es la forma estándar de añadir una sombra a una operación de dibujo específica. La sombra sigue la forma de la geometría o imagen que se está dibujando.

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // Desplazamiento (dx, dy)
    3.0f, 3.0f,   // Cantidad de desenfoque (sigmaX, sigmaY)
    0x80000000    // Color de la sombra (negro 50% transparente)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### Solo Sombra
Si solo quieres dibujar la sombra sin el objeto original (por ejemplo, para capas complejas), usa `makeDropShadowOnly`.

---

## 2. Sombras de Elevación 3D (ShadowUtils)

`ShadowUtils` proporciona un modelo de sombras más basado en la física, similar a la elevación del Material Design. Calcula cómo una fuente de luz en una posición 3D específica proyecta una sombra desde un "oclusor" (un Path) sobre el plano del lienzo.

### Uso Básico

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Plano Z: elevación del objeto.
// Generalmente constante para elementos de UI planos: (0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f);

// Posición de la luz: coordenadas 3D relativas al lienzo
Point3 lightPos = new Point3(250, 0, 600);

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas,
    path,
    elevation,
    lightPos,
    lightRadius,
    ambientColor,
    spotColor,
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// Nota: drawShadow SOLO dibuja la sombra.
// Todavía necesitas dibujar el objeto en sí:
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### Sombra Ambiental vs. Sombra de Foco
- **Sombra Ambiental**: Una sombra suave y no direccional causada por la luz indirecta.
- **Sombra de Foco**: Una sombra direccional causada por la posición específica de la fuente de luz.
Combinar ambas crea un efecto de profundidad realista.

### Banderas de Sombra
- `TRANSPARENT_OCCLUDER`: Úsala si tu objeto es semitransparente, para que la sombra no se recorte bajo el objeto.
- `GEOMETRIC_ONLY`: Optimización si no necesitas un desenfoque de alta calidad.
- `DIRECTIONAL_LIGHT`: Trata la luz como si estuviera infinitamente lejos (como la luz solar).

## Comparación

| Característica | Sombra 2D (ImageFilter) | Sombra de Elevación (ShadowUtils) |
| :--- | :--- | :--- |
| **Modelo** | Desenfoque Gaussiano 2D | Proyección en Perspectiva 3D |
| **Rendimiento** | Rápido (en caché por Skia) | Más complejo, pero altamente optimizado |
| **Uso** | Se establece en `Paint` | Llamada directa a `ShadowUtils` |
| **Ideal Para** | Texto, brillos de UI simples, iconos | Botones de Material Design, tarjetas, efectos de profundidad |

## Ejemplo Visual

Para ver estas sombras en acción, ejecuta la aplicación de ejemplo **Scenes** y selecciona la escena **ShadowUtils**.

**Código Fuente:** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*Figura: Comparación de varias banderas de ShadowUtils y posiciones de luz.*