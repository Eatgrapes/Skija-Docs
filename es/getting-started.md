# Primeros pasos con Skija

Skija lleva el poder del motor gráfico Skia a la Máquina Virtual de Java. Esta guía proporciona una visión general de alto nivel sobre cómo empezar a dibujar con Skija.

## Conceptos básicos

Antes de sumergirse en el código, es útil comprender los actores principales en el ecosistema de Skija:

- **Surface** (Superficie): El destino para tu dibujo (como una hoja de papel).
- **Canvas** (Lienzo): La interfaz utilizada para realizar operaciones de dibujo (como tu mano).
- **Paint** (Pintura): Define el color, estilo y efectos de lo que dibujas (como tu pluma o pincel).

## Ruta de inicio rápido

Para obtener tu primer "Hola Mundo" en pantalla o en un archivo de imagen, recomendamos seguir estos pasos:

1.  **[Instalación](installation.md)**: Configura las dependencias de tu proyecto para tu plataforma específica (Windows, macOS o Linux).
2.  **[Conceptos básicos de renderizado](rendering-basics.md)**: Aprende a crear una Surface simple en memoria y dibujar tus primeras formas primitivas.
3.  **[Tipografía](typography.md)**: Añade texto a tus creaciones usando fuentes del sistema o archivos de fuentes personalizados.
4.  **[Renderizado por GPU](gpu-rendering.md)**: Para aplicaciones interactivas, aprende a aprovechar el poder de tu tarjeta gráfica.

## Gestión de recursos

Skija es un envoltorio de alto rendimiento alrededor de una biblioteca en C++. Si bien gestiona la memoria automáticamente por ti, se recomienda comprender los principios de [Gestión de recursos](resource-management.md) para construir aplicaciones robustas.

## Inmersiones profundas

Una vez que te sientas cómodo con los conceptos básicos, explora nuestras referencias detalladas de la API:

- [**API de Canvas**](api/Canvas.md): Mirada detallada a transformaciones, recorte y métodos de dibujo.
- [**Paint y efectos**](api/Effects.md): Domina desenfoques, sombras y matrices de color.
- [**Shaders**](api/Shader.md): Crea hermosos degradados y texturas procedurales.
- [**SkSL**](api/runtime-effect.md): Escribe shaders personalizados para GPU para una flexibilidad máxima.

---

### ¿Listo para construir algo increíble?
Consulta el [**Índice completo de documentación**](/) para obtener una lista completa de guías y referencias.