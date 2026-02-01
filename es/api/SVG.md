# Referencia de la API: SVG

Aunque Skia es principalmente un motor de dibujo de bajo nivel, Skija incluye un módulo SVG que te permite trabajar directamente con archivos SVG. Esto es perfecto para iconos, ilustraciones simples y logotipos.

## Carga y Renderizado

El SVG en Skija se gestiona mediante la clase `SVGDOM`.

```java
import io.github.humbleui.skija.svg.SVGDOM;

// 1. Cargar los datos SVG
Data svgData = Data.makeFromFileName("assets/logo.svg");
SVGDOM svg = new SVGDOM(svgData);

// 2. Definir el tamaño del viewport
// ¡Esto es importante! Los SVG a menudo no tienen un tamaño fijo.
svg.setContainerSize(200, 200);

// 3. Renderizarlo en un Canvas
svg.render(canvas);
```

## Escalado de SVGs

Dado que los SVG están basados en vectores, puedes escalarlos a cualquier tamaño sin perder calidad. Simplemente cambia el `setContainerSize` o usa `canvas.scale()` antes de renderizar.

```java
canvas.save();
canvas.translate(100, 100);
canvas.scale(2.0f, 2.0f); // Hacerlo dos veces más grande
svg.render(canvas);
canvas.restore();
```

## Accediendo al Elemento Raíz

Puedes obtener el elemento raíz `<svg>` para consultar las dimensiones originales u otros metadatos.

```java
SVGSVG root = svg.getRoot();
if (root != null) {
    Point size = root.getIntrinsicSize(); // Obtener el tamaño definido en el archivo SVG
}
```

## Consejo de Rendimiento: La "Caché de Rasterizado"

Renderizar un SVG puede ser sorprendentemente costoso porque Skia tiene que analizar la estructura tipo XML y ejecutar muchos comandos de dibujo cada vez.

**Mejor Práctica:** Si tienes un icono que aparece muchas veces (como un icono de carpeta en un gestor de archivos), no llames a `svg.render()` para cada instancia. En su lugar, renderízalo una vez en una `Image` fuera de pantalla y dibuja esa imagen.

```java
// Haz esto una vez
Surface cache = Surface.makeRasterN32Premul(width, height);
svg.render(cache.getCanvas());
Image cachedIcon = cache.makeImageSnapshot();

// Usa esto en tu bucle de renderizado
canvas.drawImage(cachedIcon, x, y);
```

## Limitaciones

La implementación SVG de Skija es un "subconjunto" de la especificación SVG completa. Admite la mayoría de las funciones comunes (formas, trazados, rellenos, degradados), pero puede tener problemas con:
- Estilos CSS complejos
- Scripting (JavaScript dentro de SVG)
- Algunos efectos de filtro oscuros

Para la mayoría de los iconos de interfaz de usuario y logotipos, funciona perfectamente.