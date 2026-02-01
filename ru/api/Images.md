# Изображения и растровые карты

Работа с изображениями в Skija включает два основных класса: `Image` и `Bitmap`. Хотя они кажутся похожими, они служат разным целям.

## Image vs. Bitmap

- **`Image`**: Представьте это как доступное только для чтения, потенциально GPU-ускоренное текстуру. Оно оптимизировано для рисования на холсте (canvas).
- **`Bitmap`**: Это изменяемый массив пикселей на стороне CPU. Вы используете его, когда вам нужно программно редактировать отдельные пиксели.

## Загрузка изображения

Самый распространенный способ получить изображение — загрузить его из закодированных байтов (PNG, JPEG и т.д.).

```java
byte[] bytes = Files.readAllBytes(Path.of("photo.jpg"));
Image img = Image.makeDeferredFromEncodedBytes(bytes);
```

**Совет:** `makeDeferredFromEncodedBytes` является "ленивым" — он не декодирует пиксели до первого фактического рисования, что экономит память и время при начальной загрузке.

### Создание из пикселей (растра)

Если у вас есть сырые данные пикселей (например, из другой библиотеки или сгенерированные процедурно):

```java
// Из объекта Data (оборачивает нативную память или массив байтов)
Image img = Image.makeRasterFromData(
    ImageInfo.makeN32Premul(100, 100),
    data,
    rowBytes
);

// Из Bitmap (копирует или делится пикселями)
Image img = Image.makeRasterFromBitmap(bitmap);

// Из Pixmap (копирует пиксели)
Image img = Image.makeRasterFromPixmap(pixmap);
```

## Кодирование (Сохранение изображений)

Чтобы сохранить `Image` в файл или поток, его необходимо закодировать. Skija предоставляет `EncoderJPEG`, `EncoderPNG` и `EncoderWEBP` для детального контроля.

```java
// Простое кодирование (настройки по умолчанию)
Data pngData = EncoderPNG.encode(image);
Data jpgData = EncoderJPEG.encode(image); // Качество по умолчанию 100

// Продвинутое кодирование (с опциями)
EncodeJPEGOptions jpgOpts = new EncodeJPEGOptions()
    .setQuality(80)
    .setAlphaMode(EncodeJPEGAlphaMode.IGNORE);

Data compressed = EncoderJPEG.encode(image, jpgOpts);

// WebP кодирование
EncodeWEBPOptions webpOpts = new EncodeWEBPOptions()
    .setQuality(90)
    .setCompression(EncodeWEBPCompressionMode.LOSSY); // или LOSSLESS

Data webp = EncoderWEBP.encode(image, webpOpts);
```

## Рисование на холсте (Canvas)

Рисование изображения просто, но обратите внимание на **Сэмплирование (Sampling)**.

```java
canvas.drawImage(img, 10, 10);
```

### Режимы сэмплирования

Когда вы масштабируете изображение, вам нужно решить, как оно должно быть сэмплировано:
- `SamplingMode.DEFAULT`: Ближайший сосед. Быстро, но выглядит блочно при масштабировании.
- `SamplingMode.LINEAR`: Билинейная фильтрация. Плавно, но может быть немного размыто.
- `SamplingMode.MITCHELL`: Высококачественное кубическое пересэмплирование. Отлично подходит для уменьшения масштаба.

```java
canvas.drawImageRect(img, Rect.makeWH(200, 200), SamplingMode.LINEAR, null, true);
```

## Создание шейдеров из изображений

Вы можете использовать изображение как паттерн (например, для плиточного фона), превратив его в шейдер.

```java
Shader pattern = img.makeShader(FilterTileMode.REPEAT, FilterTileMode.REPEAT);
paint.setShader(pattern);
canvas.drawPaint(paint); // Заполняет весь холст плиточным изображением
```

## Работа с пикселями (Bitmap)

Если вам нужно сгенерировать изображение с нуля, пиксель за пикселем:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(100, 100));

// Теперь вы можете рисовать в этот bitmap, используя Canvas
Canvas c = new Canvas(bmp);
c.clear(0xFFFFFFFF);
// ... рисуем что-то ...

// Или получить доступ к сырым пикселям (продвинутый уровень)
ByteBuffer pixels = bmp.peekPixels();
```

## Доступ к данным пикселей (Сэмплирование)

Чтобы прочитать пиксели из `Image` или `Surface`, используйте метод `readPixels`.

### Сэмплирование всего изображения
```java
// Создаем bitmap для хранения пикселей
Bitmap bmp = new Bitmap();
bmp.allocPixels(ImageInfo.makeN32Premul(width, height));

// Читаем все пиксели из изображения в bitmap
image.readPixels(bmp);
```

### Сэмплирование области
Вы можете прочитать определенную под-область изображения, указав смещение (x, y).

```java
// Нам нужна только область 50x50
Bitmap regionBmp = new Bitmap();
regionBmp.allocPixels(ImageInfo.makeN32Premul(50, 50));

// Читаем, начиная с (100, 100) в исходном изображении
// фактически захватывая прямоугольник {100, 100, 150, 150}
image.readPixels(regionBmp, 100, 100); 
```

## Совместимость с OpenGL / Metal

Skija позволяет создавать объекты `Image` напрямую из существующих GPU-текстур. Это полезно для интеграции с другими графическими библиотеками (например, LWJGL).

### Создание изображения из текстуры OpenGL

```java
// Вам нужен DirectContext для GPU операций
DirectContext context = ...; 

// Предположим, у вас есть ID текстуры OpenGL из другого источника
int textureId = 12345;

Image glImage = Image.adoptGLTextureFrom(
    context, 
    textureId, 
    GL30.GL_TEXTURE_2D, 
    512, 512, 
    GL30.GL_RGBA8, 
    SurfaceOrigin.BOTTOM_LEFT, 
    ColorType.RGBA_8888
);

// Теперь вы можете рисовать эту текстуру с помощью Skija
canvas.drawImage(glImage, 0, 0);
```

**Примечание:** При "усыновлении" (adopt) текстуры Skija берет на себя владение ею. Если вы хотите обернуть текстуру без взятия владения, ищите варианты `makeFromTexture` (если доступны) или тщательно управляйте временем жизни.

## Проблемы производительности

1.  **Декодирование в UI-потоке:** Декодирование больших изображений может быть медленным. Делайте это в фоновом режиме.
2.  **Загрузка текстур:** Если вы используете GPU-бэкенд (например, OpenGL), при первом рисовании `Image`, находящегося на стороне CPU, Skia должна загрузить его на GPU. Для больших текстур это может вызвать просадку кадров.
3.  **Большие Bitmap'ы:** Bitmap'ы живут в куче Java и в нативной памяти. Будьте осторожны с большими размерами (например, текстуры 8k), так как они могут быстро привести к ошибкам OutOfMemory.