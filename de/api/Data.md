# API-Referenz: Data

Die `Data`-Klasse ist ein unveränderlicher Wrapper um einen rohen Speicherpuffer (Byte-Array). Sie wird in Skija verwendet, um binäre Daten (wie kodierte Bilder, Schriftarten oder Shader) effizient zwischen Java und der nativen C++ Skia-Bibliothek auszutauschen.

## Erstellung

### Aus Java-Byte-Array
Kopiert die Daten aus einem Java-`byte[]`.

```java
byte[] bytes = new byte[] { 1, 2, 3, 4 };
Data data = Data.makeFromBytes(bytes);
```

### Aus Datei
Mappt eine Datei effizient in den Speicher (verwendet nach Möglichkeit `mmap`).

```java
Data data = Data.makeFromFileName("assets/image.png");
if (data == null) {
    System.err.println("Datei nicht gefunden");
}
```

### Leer
Erstellt ein leeres Data-Objekt.

```java
Data empty = Data.makeEmpty();
```

## Modifikation (Teilmengen)

Da `Data` unveränderlich ist, kann der Inhalt nicht geändert werden, aber es kann eine Ansicht in einen Teilbereich erstellt werden (Zero-Copy, falls unterstützt, oder günstige Kopie).

```java
// Erstellt ein neues Data-Objekt, das die Bytes 10-20 repräsentiert
Data subset = data.makeSubset(10, 10);
```

## Auf Inhalte zugreifen

### Als Byte-Array
Kopiert die nativen Daten zurück in ein Java-`byte[]`.

```java
byte[] content = data.getBytes();

// Oder einen Bereich
byte[] part = data.getBytes(0, 10);
```

### Als ByteBuffer
Wrappet den nativen Speicher direkt in einen Java-`ByteBuffer`. Dies ist der effizienteste Weg, Daten ohne Kopie zu lesen.

```java
ByteBuffer buffer = data.toByteBuffer();
// Vom Buffer lesen...
```

### Größe
```java
long size = data.getSize();
```

## Lebenszyklus

`Data` erweitert `Managed` und verwendet nativen Speicher. Idealerweise verwenden Sie try-with-resources oder rufen `close()` auf, wenn Sie fertig sind, obwohl der Garbage Collector es letztendlich freigibt.

```java
try (Data data = Data.makeFromFileName("large_file.dat")) {
    // data verwenden...
} // data.close() wird automatisch aufgerufen
```