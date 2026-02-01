# API-Referenz: StreamAsset

`StreamAsset` repräsentiert einen positionierbaren, schreibgeschützten Datenstrom. Es wird häufig zum Laden von Schriftartdaten oder anderen Ressourcen verwendet, bei denen wahlfreier Zugriff erforderlich ist.

## Übersicht

Ein `StreamAsset` bietet Methoden zum Lesen, Überspringen und Positionieren innerhalb eines Bytestroms. Es ist ein "Managed"-Objekt, was bedeutet, dass Skija die Bereinigung des nativen Speichers übernimmt.

## Methoden

### Lesen

- `read(buffer, size)`: Liest bis zu `size` Bytes in das bereitgestellte Byte-Array. Gibt die tatsächlich gelesene Anzahl Bytes zurück.
- `peek(buffer, size)`: Wirft einen Blick auf Daten, ohne die Stream-Position vorzurücken.
- `isAtEnd()`: Gibt `true` zurück, wenn das Ende des Streams erreicht ist.

### Navigation

- `skip(size)`: Überspringt die angegebene Anzahl Bytes.
- `rewind()`: Setzt die Stream-Position auf den Anfang zurück.
- `seek(position)`: Positioniert den Stream an eine bestimmte absolute Position.
- `move(offset)`: Bewegt die Position um einen relativen Offset.

### Informationen

- `getPosition()`: Gibt das aktuelle Byte-Offset im Stream zurück.
- `getLength()`: Gibt die Gesamtlänge des Streams zurück (falls bekannt).
- `hasPosition()`: Gibt `true` zurück, wenn der Stream Positionierung unterstützt.
- `hasLength()`: Gibt `true` zurück, wenn die Länge bekannt ist.
- `getMemoryBase()`: Wenn der Stream speicherbasiert ist, gibt dies die native Speicheradresse zurück.

### Duplizierung

- `duplicate()`: Erstellt ein neues `StreamAsset`, das dieselben Daten teilt, aber eine unabhängige Position hat.
- `fork()`: Ähnlich wie duplicate, aber der neue Stream beginnt an der aktuellen Position des Originals.

## Verwendung in Typografie

`StreamAsset` wird am häufigsten bei der Arbeit mit [`Typeface`](Typeface.md)-Daten angetroffen:

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... Schriftartdaten verarbeiten
}
```