# API Reference: StreamAsset

`StreamAsset` represents a seekable, read-only stream of data. It is often used for loading font data or other resources where random access is required.

## Overview

A `StreamAsset` provides methods for reading, skipping, and seeking within a byte stream. It is a "Managed" object, meaning Skija will handle the native memory cleanup.

## Methods

### Reading

- `read(buffer, size)`: Reads up to `size` bytes into the provided byte array. Returns the number of bytes actually read.
- `peek(buffer, size)`: Peeks at data without advancing the stream position.
- `isAtEnd()`: Returns `true` if the stream has reached the end.

### Navigation

- `skip(size)`: Skips the specified number of bytes.
- `rewind()`: Moves the stream position back to the beginning.
- `seek(position)`: Seeks to a specific absolute position.
- `move(offset)`: Moves the position by a relative offset.

### Information

- `getPosition()`: Returns the current byte offset in the stream.
- `getLength()`: Returns the total length of the stream (if known).
- `hasPosition()`: Returns `true` if the stream supports seeking/positioning.
- `hasLength()`: Returns `true` if the length is known.
- `getMemoryBase()`: If the stream is memory-backed, returns the native memory address.

### Duplication

- `duplicate()`: Creates a new `StreamAsset` that shares the same data but has an independent position.
- `fork()`: Similar to duplicate, but the new stream starts at the current position of the original.

## Usage in Typography

`StreamAsset` is most commonly encountered when working with [`Typeface`](Typeface.md) data:

```java
Typeface typeface = Typeface.makeFromFile("fonts/Inter.ttf");
StreamAsset stream = typeface.openStream();

if (stream != null) {
    byte[] header = new byte[4];
    stream.read(header, 4);
    // ... process font data
}
```
