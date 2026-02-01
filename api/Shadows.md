# Shadows in Skija

Skija provides two distinct ways to draw shadows: **2D Drop Shadows** (via ImageFilters) and **3D Elevation Shadows** (via ShadowUtils).

## 1. 2D Drop Shadows (ImageFilter)

This is the standard way to add a shadow to a specific drawing operation. The shadow follows the shape of the geometry or image being drawn.

```java
ImageFilter shadow = ImageFilter.makeDropShadow(
    2.0f, 2.0f,   // Offset (dx, dy)
    3.0f, 3.0f,   // Blur amount (sigmaX, sigmaY)
    0x80000000    // Shadow color (50% transparent black)
);

Paint paint = new Paint().setImageFilter(shadow);
canvas.drawRect(Rect.makeXYWH(50, 50, 100, 100), paint);
```

### Drop Shadow Only
If you only want to draw the shadow without the original object (e.g., for complex layering), use `makeDropShadowOnly`.

---

## 2. 3D Elevation Shadows (ShadowUtils)

`ShadowUtils` provides a more physically-based shadow model, similar to Material Design elevation. It calculates how a light source at a specific 3D position casts a shadow from an "occluder" (a Path) onto the canvas plane.

### Basic Usage

```java
Path path = new Path().addRect(Rect.makeXYWH(50, 50, 100, 100));

// Z-plane: elevation of the object. 
// Usually constant for flat UI elements: (0, 0, elevation)
Point3 elevation = new Point3(0, 0, 10.0f); 

// Light position: 3D coordinates relative to the canvas
Point3 lightPos = new Point3(250, 0, 600); 

float lightRadius = 800.0f;
int ambientColor = 0x10000000;
int spotColor = 0x30000000;

ShadowUtils.drawShadow(
    canvas, 
    path, 
    elevation, 
    lightPos, 
    lightRadius, 
    ambientColor, 
    spotColor, 
    ShadowUtilsFlag.TRANSPARENT_OCCLUDER
);

// Note: drawShadow ONLY draws the shadow. 
// You still need to draw the object itself:
canvas.drawPath(path, new Paint().setColor(0xFFFFFFFF));
```

### Ambient vs. Spot Shadow
- **Ambient Shadow**: A soft, non-directional shadow caused by indirect light.
- **Spot Shadow**: A directional shadow caused by the specific light source position.
Combining both creates a realistic depth effect.

### Shadow Flags
- `TRANSPARENT_OCCLUDER`: Use this if your object is semi-transparent, so the shadow doesn't get clipped under the object.
- `GEOMETRIC_ONLY`: Optimization if you don't need high-quality blurring.
- `DIRECTIONAL_LIGHT`: Treats the light as being infinitely far away (like sunlight).

## Comparison

| Feature | Drop Shadow (ImageFilter) | Elevation Shadow (ShadowUtils) |
| :--- | :--- | :--- |
| **Model** | 2D Gaussian Blur | 3D Perspective Projection |
| **Performance** | Fast (cached by Skia) | More complex, but highly optimized |
| **Usage** | Set on `Paint` | Direct call to `ShadowUtils` |
| **Best For** | Text, simple UI glows, icons | Material Design buttons, cards, depth effects |

## Visual Example

To see these shadows in action, run the **Scenes** example app and select the **ShadowUtils** scene.

**Source Code:** [`examples/scenes/src/ShadowUtilsScene.java`](https://github.com/HumbleUI/Skija/blob/master/examples/scenes/src/ShadowUtilsScene.java)

*Figure: Comparison of various ShadowUtils flags and light positions.*


