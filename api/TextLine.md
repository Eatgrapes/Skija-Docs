# API Reference: TextLine

`TextLine` represents a single line of shaped text. It is typically created by the `Shaper` and provides metric information and hit-testing capabilities essential for building text editors or interactive labels.

## Creation

```java
// Shape a single line of text
TextLine line = TextLine.make("Hello World", font);
```

## Metrics

- `getAscent()`: Distance from baseline to top of highest glyph (negative).
- `getDescent()`: Distance from baseline to bottom of lowest glyph (positive).
- `getCapHeight()`: Height of capital letters.
- `getXHeight()`: Height of lowercase 'x'.
- `getWidth()`: Total advance width of the line.
- `getHeight()`: Total height (descent - ascent).

## Hit Testing (Interaction)

`TextLine` provides methods to map between pixel coordinates and character offsets.

```java
// 1. Get Offset from Coordinate (Clicking)
float x = mouseEvent.getX();
int offset = line.getOffsetAtCoord(x); // Returns UTF-16 character index
// 'offset' will be closest to the mouse cursor

// 2. Get Coordinate from Offset (Cursor Placement)
float cursorX = line.getCoordAtOffset(offset);
// Draw a cursor at (cursorX, baseline)
```

- `getOffsetAtCoord(x)`: Closest character offset.
- `getLeftOffsetAtCoord(x)`: Character offset strictly to the left.
- `getCoordAtOffset(offset)`: Pixel X-coordinate for a given character index.

## Rendering

```java
// You can draw the line directly
canvas.drawTextLine(line, x, y, paint);

// Or extract the TextBlob for more manual control
try (TextBlob blob = line.getTextBlob()) {
    canvas.drawTextBlob(blob, x, y, paint);
}
```

## Lifecycle
`TextLine` implements `Managed`. Always close it when you are done to free native resources.

```java
try (TextLine line = TextLine.make(text, font)) {
    // ... use line ...
}
```
