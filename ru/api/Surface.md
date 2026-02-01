# Справочник API: Surface

Класс `Surface` является конечной точкой для всех команд рисования. Он управляет памятью пикселей (на CPU или GPU) и предоставляет `Canvas`, который вы используете для рисования.

## Обзор

`Surface` отвечает за:
1.  Хранение данных пикселей (или управление текстурой GPU).
2.  Предоставление интерфейса `Canvas` для рисования в эти данные.
3.  Создание снимка текущего содержимого в виде `Image`.

## Создание Surface

### 1. Растровая Surface (CPU)
Самая простая поверхность. Пиксели находятся в стандартной системной памяти (RAM). Лучше всего подходит для генерации изображений, рендеринга на стороне сервера или тестирования.

```java
// Стандартная 32-битная RGBA поверхность
Surface raster = Surface.makeRasterN32Premul(800, 600);

// С пользовательским ImageInfo (например, F16 для HDR)
ImageInfo info = new ImageInfo(800, 600, ColorType.RGBA_F16, AlphaType.PREMUL);
Surface hdrSurface = Surface.makeRaster(info);
```

### 2. GPU Surface (Render Target)
Используется для аппаратно-ускоренного рендеринга. Вам нужен `DirectContext` (контекст OpenGL/Metal/Vulkan).

```java
DirectContext context = ...; // Ваш GPU контекст

// Создать новую текстуру на GPU, управляемую Skia
Surface gpuSurface = Surface.makeRenderTarget(
    context,
    false,             // Budgeted? (Должна ли Skia учитывать это в лимите кэша?)
    ImageInfo.makeN32Premul(800, 600)
);
```

### 3. Обёртка существующих текстур OpenGL/Metal
Если вы интегрируете Skija в существующий игровой движок или оконную систему (например, LWJGL или JWM), окно обычно предоставляет ID "фреймбуфера" или "текстуры". Вы оборачиваете его, чтобы Skija могла рисовать прямо на экран.

```java
// Пример OpenGL
int framebufferId = 0; // Буфер экрана по умолчанию
BackendRenderTarget renderTarget = BackendRenderTarget.makeGL(
    800, 600,          // Ширина, Высота
    0,                 // Счётчик сэмплов (0 для отсутствия MSAA)
    8,                 // Бит трафарета
    framebufferId,
    BackendRenderTarget.FRAMEBUFFER_FORMAT_GR_GL_RGBA8
);

Surface screenSurface = Surface.wrapBackendRenderTarget(
    context,
    renderTarget,
    SurfaceOrigin.BOTTOM_LEFT, // Координаты OpenGL начинаются снизу слева
    ColorType.RGBA_8888,
    ColorSpace.getSRGB(),
    null // SurfaceProps
);
```

### 4. Обёртка растровых пикселей (Interop)
Если у вас есть `ByteBuffer` или указатель из другой библиотеки (например, декодера видеокадров), вы можете обернуть его напрямую без копирования.

```java
long pixelPtr = ...; // Нативный указатель на память
int rowBytes = width * 4; // Байт на строку

Surface wrap = Surface.wrapPixels(
    ImageInfo.makeN32Premul(width, height),
    pixelPtr,
    rowBytes
);
```

### 5. Нулевая Surface
Создаёт поверхность, которая ничего не делает. Полезна для измерения или тестирования без выделения памяти.

```java
Surface nullSurface = Surface.makeNull(100, 100);
```

## Создание снимков (`Image`)

Создание неизменяемого `Image` из `Surface` — это дешёвая операция (Copy-on-Write).

```java
// Это не копирует пиксели немедленно!
// Это фактически "разветвляет" поверхность. Будущие рисования на 'surface' не повлияют на 'snapshot'.
Image snapshot = surface.makeImageSnapshot();

// Теперь вы можете использовать 'snapshot' для рисования на другой поверхности или сохранения на диск.
```

## Взаимодействие с содержимым

```java
// Получить холст для рисования
Canvas canvas = surface.getCanvas();
canvas.drawCircle(50, 50, 20, paint);

// Прочитать пиксели обратно в Bitmap
Bitmap bitmap = new Bitmap();
bitmap.allocPixels(ImageInfo.makeN32Premul(100, 100));
if (surface.readPixels(bitmap, 0, 0)) {
    // Пиксели успешно прочитаны
}

// Записать пиксели из Bitmap на поверхность
surface.writePixels(bitmap, 10, 10);

// Отправить команды на GPU (важно для GPU поверхностей)
surface.flush();
```

- `getCanvas()`: Возвращает холст для рисования.
- `readPixels(bitmap, x, y)`: Читает пиксели обратно с GPU/CPU в Bitmap.
- `writePixels(bitmap, x, y)`: Записывает пиксели из Bitmap на поверхность.
- `flush()`: Гарантирует, что все ожидающие команды GPU отправлены драйверу.
- `notifyContentWillChange()`: Вызовите это, если вы изменяете базовую память пикселей напрямую (в обход Canvas).
- `getRecordingContext()`: Возвращает `DirectContext`, поддерживающий эту поверхность (если есть).