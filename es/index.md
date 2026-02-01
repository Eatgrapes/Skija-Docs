---
layout: home

hero:
  name: Skija
  text: Enlaces Java para Skia
  tagline: Gráficos 2D de alto rendimiento y aceleración por hardware para la JVM.
  actions:
    - theme: brand
      text: Empezar
      link: /getting-started
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/HumbleUI/Skija

features:
  - title: Aceleración por Hardware
    details: Aprovecha OpenGL, Metal, Vulkan y Direct3D a través de Skia para un rendimiento suave como la seda.
  - title: Tipografía Rica
    details: Conformación de texto avanzada con HarfBuzz y diseño complejo con SkParagraph.
  - title: Shaders Modernos
    details: Escribe shaders de GPU personalizados usando SkSL (Skia Shading Language).
---

::: warning Documentación No Oficial
Esta documentación es mantenida por la comunidad y **no** es una publicación oficial de los proyectos Skia o Skija.
Si encuentras errores o tienes sugerencias, repórtalos en [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs).
:::

## Índice Completo de Documentación

### Lo Esencial

- [**Getting Started**](../getting-started.md): Una vista panorámica de cómo funciona Skija y por dónde empezar.
- [**Installation**](../installation.md): Configuración de dependencias del proyecto para Windows, macOS y Linux.
- [**Rendering Basics**](../rendering-basics.md): Surfaces, Canvases y tu primer "Hola Mundo".
- [**Colors and Alpha**](../colors.md): Manejo de transparencia, premultiplicación y espacios de color.
- [**Animation**](../animation.md): Creación de movimiento, bucles de juego y reproducción de animaciones Lottie/GIF.
- [**Resource Management**](../resource-management.md): Cómo Skija maneja la memoria nativa y el ciclo de vida `Managed`.

### Profundización en la API

- [**Surface**](../api/Surface.md): Creación de destinos de dibujo (Ráster, GPU, Envuelto).
- [**Canvas**](../api/Canvas.md): Transformaciones, recorte y primitivas de dibujo.
- [**Images & Bitmaps**](../api/Images.md): Carga, dibujo y manipulación de datos de píxeles.
- [**Data**](../api/Data.md): Gestión eficiente de memoria nativa.
- [**Matrix**](../api/Matrix.md): Transformaciones matriciales 3x3 y 4x4.
- [**Codec (Animations)**](../api/Codec.md): Decodificación de imágenes de bajo nivel y animaciones GIF/WebP.
- [**Paint & Effects**](../api/Effects.md): Estilos, desenfoques, sombras y filtros de color.
- [**Shadows**](../api/Shadows.md): Sombras paralelas 2D y sombras basadas en elevación 3D.
- [**Paths**](../api/Path.md): Creación y combinación de formas geométricas complejas.
- [**PathBuilder**](../api/path-builder.md): API fluida para construir trazados.
- [**Region**](../api/Region.md): Operaciones de área basadas en enteros y pruebas de impacto.
- [**Picture**](../api/Picture.md): Grabación y reproducción de comandos de dibujo para rendimiento.

### Tipografía y Texto

- [**Typeface**](../api/Typeface.md): Carga de archivos de fuentes y propiedades.
- [**Font**](../api/Font.md): Tamaño de fuente, métricas y atributos de renderizado.
- [**Typography & Fonts**](../typography.md): Conceptos básicos de fuentes y métricas.
- [**Text Animation & Clipping**](../api/text-animation.md): Uso de texto como máscaras, texto ondulado y fuentes variables.
- [**TextBlob & Builder**](../api/TextBlob.md): Ejecuciones de glifos optimizadas y reutilizables.
- [**TextLine**](../api/TextLine.md): Diseño de texto de una sola línea y pruebas de impacto.
- [**Paragraph (Rich Text)**](../api/Paragraph.md): Diseño de texto complejo de múltiples estilos y ajuste de línea.
- [**BreakIterator**](../api/BreakIterator.md): Localización de límites de palabras, líneas y oraciones.

### Gráficos Avanzados

- [**GPU Rendering**](../gpu-rendering.md): Aceleración por hardware con OpenGL, Metal, Vulkan y Direct3D.
- [**DirectContext**](../api/direct-context.md): Gestión del estado de la GPU y envío de comandos.
- [**Shaper**](../api/Shaper.md): Conformación de texto y posicionamiento de glifos (HarfBuzz).
- [**SkSL (RuntimeEffect)**](../api/runtime-effect.md): Escritura de shaders de GPU personalizados para máxima flexibilidad.
- [**PDF Generation**](../api/Document.md): Creación de documentos PDF basados en vectores.

### Extensiones

- [**SVG**](../api/SVG.md): Carga y renderizado de iconos e ilustraciones SVG.
- [**Lottie**](../extensions.md): Reproducción de animaciones vectoriales de alto rendimiento con Skottie.