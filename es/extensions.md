# Extensiones: Lottie y SVG

Skija incluye soporte de alto nivel para formatos vectoriales populares como Lottie (a través de Skottie) y SVG, lo que te permite integrar fácilmente animaciones complejas e iconos en tus aplicaciones Java.

## Animaciones Lottie (Skottie)

Skottie es el reproductor Lottie de Skia. Puede cargar y reproducir animaciones basadas en JSON exportadas desde After Effects.

### Cargar una Animación

```java
import io.github.humbleui.skija.skottie.Animation;

Animation anim = Animation.makeFromFile("assets/loader.json");
```

### Reproducir y Renderizar

Para reproducir una animación, necesitas "buscar" un tiempo o fotograma específico y luego renderizarlo en un lienzo.

```java
// tiempo normalizado: 0.0 (inicio) a 1.0 (fin)
anim.seek(currentTime); 

// O buscar un índice de fotograma específico
anim.seekFrame(24);

// Renderizar en un rectángulo específico del lienzo
anim.render(canvas, Rect.makeXYWH(0, 0, 200, 200));
```

## Soporte SVG

Skija proporciona un DOM SVG que puede analizar y renderizar archivos SVG.

### Cargar y Renderizar SVG

```java
import io.github.humbleui.skija.svg.SVGDOM;

Data data = Data.makeFromFileName("assets/icon.svg");
SVGDOM svg = new SVGDOM(data);

// Establecer el tamaño del contenedor donde se renderizará el SVG
svg.setContainerSize(100, 100);

// Dibujarlo en el lienzo
svg.render(canvas);
```

### Interactuar con SVG

Puedes acceder al elemento raíz del SVG para consultar sus propiedades, como su tamaño intrínseco.

```java
SVGSVG root = svg.getRoot();
Point size = root.getIntrinsicSize();
```

## ¿Cuándo usar qué?

- **Lottie:** Ideal para animaciones complejas de interfaz de usuario, animaciones de personajes y transiciones expresivas.
- **SVG:** Ideal para iconos estáticos, logotipos simples e ilustraciones.
- **Shaders Personalizados (SkSL):** Ideal para fondos generados proceduralmente, efectos en tiempo real y visuales altamente dinámicos.