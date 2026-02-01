# API-Referenz: Codec (Dekodierung & Animation)

Während `Image.makeDeferredFromEncodedBytes()` für einfache statische Bilder ausreicht, benötigen Sie die `Codec`-Klasse, wenn Sie mehr Kontrolle über den Dekodierungsprozess benötigen oder mit **animierten Bildern** (GIF, animiertes WebP) arbeiten.

## Laden eines Codec

Ein `Codec` repräsentiert die "Quelle" eines Bildes, bevor es in Pixel umgewandelt wird.

```java
Data data = Data.makeFromFileName("animations/loading.gif");
Codec codec = Codec.makeFromData(data);
```

## Grundlegende Dekodierung

Um einen einzelnen statischen Frame aus einem Codec zu erhalten:

```java
Bitmap bmp = new Bitmap();
bmp.allocPixels(codec.getImageInfo()); // Speicher vorbereiten
codec.readPixels(bmp); // Die Daten in die Bitmap dekodieren
```

## Umgang mit Animationen

Hier zeigt `Codec` seine Stärken. Es ermöglicht Ihnen, durch die Frames eines GIF oder WebP zu iterieren.

```java
int frameCount = codec.getFrameCount();
int loopCount = codec.getRepetitionCount(); // -1 für unendlich

for (int i = 0; i < frameCount; i++) {
    // 1. Informationen über diesen spezifischen Frame abrufen (Dauer, etc.)
    AnimationFrameInfo info = codec.getFrameInfo(i);
    int duration = info.getDuration(); // in Millisekunden
    
    // 2. Den Frame dekodieren
    Bitmap frameBmp = new Bitmap();
    frameBmp.allocPixels(codec.getImageInfo());
    codec.readPixels(frameBmp, i);
    
    // 3. Etwas mit dem Frame machen...
}
```

## Erweiterte Dekodierungsoptionen

### Skalierung während der Dekodierung
Wenn Sie ein 4K-Bild haben, es aber nur in 200x200 benötigen, können Sie dem Codec anweisen, es **während** des Dekodierungsprozesses zu skalieren. Dies ist viel schneller und benötigt deutlich weniger Speicher, als das volle Bild zu dekodieren und es dann zu skalieren.

```java
ImageInfo smallInfo = ImageInfo.makeN32Premul(200, 200);
Bitmap smallBmp = new Bitmap();
smallBmp.allocPixels(smallInfo);

codec.readPixels(smallBmp); // Dekodiert und skaliert in einem Schritt!
```

## Wichtige Hinweise

- **Stream-Rückspulen:** Einige Codecs (abhängig von den Quelldaten) können nicht zurückgespult werden. Wenn Sie Frames mehrfach dekodieren müssen, ist es sicherer, die `Data` im Speicher zu behalten.
- **Farbräume:** Der Codec versucht, den im Bild eingebetteten Farbraum zu berücksichtigen. Sie können dies überschreiben, indem Sie `readPixels` eine andere `ImageInfo` bereitstellen.
- **Speicher:** Der `Codec` selbst ist klein, aber die `Bitmap`-Objekte, in die Sie dekodieren, können sehr groß sein. Wiederverwenden Sie Bitmaps, wo möglich.