---
layout: home

hero:
  name: Skija
  text: Java-биндинги для Skia
  tagline: Высокопроизводительная 2D-графика с аппаратным ускорением для JVM.
  actions:
    - theme: brand
      text: Начало работы
      link: /getting-started
    - theme: alt
      text: Посмотреть на GitHub
      link: https://github.com/HumbleUI/Skija

features:
  - title: Аппаратное ускорение
    details: Использует OpenGL, Metal, Vulkan и Direct3D через Skia для плавной работы.
  - title: Богатая типографика
    details: Продвинутый шейпинг текста с HarfBuzz и сложная верстка с SkParagraph.
  - title: Современные шейдеры
    details: Пишите собственные GPU-шейдеры, используя SkSL (Skia Shading Language).
---

::: warning Неофициальная документация
Эта документация поддерживается сообществом и **не** является официальной публикацией проектов Skia или Skija.
Если вы нашли ошибки или у вас есть предложения, пожалуйста, сообщите о них в [**Eatgrapes/Skija-Docs**](https://github.com/Eatgrapes/Skija-Docs).
:::

## Полный индекс документации

### Основы

- [**Getting Started**](../getting-started.md): Обзор работы Skija и с чего начать.
- [**Installation**](../installation.md): Настройка зависимостей проекта для Windows, macOS и Linux.
- [**Rendering Basics**](../rendering-basics.md): Поверхности, холсты и ваш первый «Hello World».
- [**Colors and Alpha**](../colors.md): Работа с прозрачностью, преумножением и цветовыми пространствами.
- [**Animation**](../animation.md): Создание движения, игровых циклов и воспроизведение анимаций Lottie/GIF.
- [**Resource Management**](../resource-management.md): Как Skija работает с нативной памятью и жизненным циклом `Managed`.

### Глубокое погружение в API

- [**Surface**](../api/Surface.md): Создание целей для рисования (растровые, GPU, обернутые).
- [**Canvas**](../api/Canvas.md): Трансформации, отсечение и примитивы рисования.
- [**Images & Bitmaps**](../api/Images.md): Загрузка, рисование и манипулирование пиксельными данными.
- [**SamplingMode**](../api/SamplingMode.md): Определение того, как выбираются пиксели при масштабировании.
- [**CubicResampler**](../api/CubicResampler.md): Высококачественная бикубическая интерполяция.
- [**Data**](../api/Data.md): Эффективное управление нативной памятью.
- [**StreamAsset**](../api/StreamAsset.md): Потоки данных с возможностью поиска только для чтения.
- [**Matrix**](../api/Matrix.md): Матричные трансформации 3x3 и 4x4.
- [**Codec (Animations)**](../api/Codec.md): Низкоуровневое декодирование изображений и анимации GIF/WebP.
- [**Paint & Effects**](../api/Effects.md): Стили, размытие, тени и цветовые фильтры.
- [**Shadows**](../api/Shadows.md): 2D падающие тени и тени на основе 3D-высоты.
- [**Paths**](../api/Path.md): Создание и комбинирование сложных геометрических фигур.
- [**PathBuilder**](../api/path-builder.md): Fluent API для построения путей.
- [**PathMeasure**](../api/PathMeasure.md): Измерение длины и поиск точек вдоль пути.
- [**Region**](../api/Region.md): Операции с областями на основе целых чисел и проверка попаданий.
- [**Picture**](../api/Picture.md): Запись и воспроизведение команд рисования для производительности.

### Типографика и текст

- [**Typeface**](../api/Typeface.md): Загрузка файлов шрифтов и свойства.
- [**Font**](../api/Font.md): Размер шрифта, метрики и атрибуты рендеринга.
- [**Typography & Fonts**](../typography.md): Основы шрифтов и метрик.
- [**Text Animation & Clipping**](../api/text-animation.md): Использование текста как масок, волнистый текст и вариативные шрифты.
- [**TextBlob & Builder**](../api/TextBlob.md): Оптимизированные, переиспользуемые последовательности глифов.
- [**TextLine**](../api/TextLine.md): Однострочная верстка текста и проверка попаданий.
- [**Paragraph (Rich Text)**](../api/Paragraph.md): Сложная многостилевая верстка текста и перенос строк.
- [**BreakIterator**](../api/BreakIterator.md): Поиск границ слов, строк и предложений.

### Продвинутая графика

- [**GPU Rendering**](../gpu-rendering.md): Аппаратное ускорение с OpenGL, Metal, Vulkan и Direct3D.
- [**DirectContext**](../api/direct-context.md): Управление состоянием GPU и отправка команд.
- [**Shaper**](../api/Shaper.md): Шейпинг текста и позиционирование глифов (HarfBuzz).
- [**SkSL (RuntimeEffect)**](../api/runtime-effect.md): Написание собственных GPU-шейдеров для максимальной гибкости.
- [**PDF Generation**](../api/Document.md): Создание векторных PDF-документов.

### Расширения

- [**SVG**](../api/SVG.md): Загрузка и рендеринг SVG-иконок и иллюстраций.
- [**Lottie**](../extensions.md): Воспроизведение высокопроизводительных векторных анимаций с Skottie.
