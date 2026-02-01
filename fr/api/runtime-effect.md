# Référence API : RuntimeEffect & SkSL

`RuntimeEffect` est la porte d'entrée vers **SkSL** (Skia Shading Language), un langage puissant qui vous permet d'écrire des shaders de fragments personnalisés qui s'exécutent directement sur le GPU.

## Apprendre le SkSL

Le SkSL est très similaire au GLSL mais optimisé pour la portabilité sur tous les backends de Skia.

- **[Documentation Officielle du SkSL](https://skia.org/docs/user/sksl/)**: Le guide définitif de la syntaxe et des fonctionnalités du SkSL.
- **[Skia Fiddle](https://fiddle.skia.org/)**: Un terrain de jeu interactif où vous pouvez écrire et tester du code SkSL dans votre navigateur.
- **[The Book of Shaders](https://thebookofshaders.com/)**: Bien qu'écrit pour le GLSL, les concepts et la plupart du code sont directement applicables au SkSL.

## Charger des Scripts SkSL

Bien que vous *puissiez* coder en dur le SkSL sous forme de chaînes en Java, il est bien préférable de conserver vos shaders dans des fichiers `.sksl` séparés pour une meilleure coloration syntaxique et une meilleure maintenabilité.

### Modèle Recommandé

```java
public class ShaderLoader {
    public static Shader loadShader(String path) throws IOException {
        String sksl = Files.readString(Path.of(path));
        RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
        return effect.makeShader(null);
    }
}
```

## Écrire du SkSL

Un shader SkSL doit avoir une fonction `main`.

```glsl
// my_shader.sksl
uniform float iTime;
uniform vec2  iResolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    return vec4(uv.x, uv.y, sin(iTime) * 0.5 + 0.5, 1.0);
}
```

## Considérations Clés

### Coordonnées
Le `fragCoord` passé à `main` est exprimé en **coordonnées locales du canvas**. Si vous avez besoin d'UV normalisés (0.0 à 1.0), vous devez passer la résolution comme uniforme et diviser les coordonnées vous-même.

### Précision
- `float`: Virgule flottante 32 bits.
- `half`: Virgule flottante 16 bits. Utilisez `half` pour les couleurs et les effets simples pour améliorer les performances sur les GPU mobiles.

### Alpha Pré-multiplié
Skia attend que les shaders retournent des couleurs au format **alpha pré-multiplié**. Si vous retournez un alpha inférieur à 1.0, vous devez multiplier les composantes R, G et B par cette valeur alpha.

```glsl
vec4 main(vec2 p) {
    float alpha = 0.5;
    vec3 color = vec3(1.0, 0.0, 0.0); // Rouge
    return vec4(color * alpha, alpha); // Alpha Pré-multiplié Correct
}
```

## Animer les Shaders (Uniforms)

Pour animer un shader, vous déclarez des variables `uniform` dans votre code SkSL et vous les mettez à jour depuis Java à chaque frame.

### 1. Code SkSL
```glsl
// rainbow.sksl
uniform float iTime;
uniform float iWidth;
uniform float iHeight;

vec4 main(vec2 fragCoord) {
    // Normaliser les coordonnées vers 0..1
    vec2 uv = fragCoord / vec2(iWidth, iHeight);
    
    // Créer un motif arc-en-ciel mouvant
    float r = sin(uv.x * 6.28 + iTime) * 0.5 + 0.5;
    float g = sin(uv.y * 6.28 + iTime + 2.0) * 0.5 + 0.5;
    float b = sin((uv.x + uv.y) * 6.28 + iTime + 4.0) * 0.5 + 0.5;
    
    return vec4(r, g, b, 1.0);
}
```

### 2. Code Java
Vous utilisez `Data` ou `ByteBuffer` pour passer les valeurs des uniforms. L'ordre doit correspondre à l'ordre de déclaration dans le SkSL.

```java
// Compiler l'effet une fois
RuntimeEffect effect = RuntimeEffect.makeForShader(skslCode);

// Dans votre boucle d'animation :
long now = System.nanoTime();
float time = (now - startTime) / 1e9f;

// Créer un tampon pour les uniforms : 3 floats * 4 octets = 12 octets
// Skija attend l'ordre des octets Little Endian pour les uniforms
try (Data uniforms = Data.makeFromBytes(ByteBuffer.allocate(12)
        .order(ByteOrder.LITTLE_ENDIAN)
        .putFloat(time)          // iTime
        .putFloat(500f)          // iWidth
        .putFloat(500f)          // iHeight
        .array())) 
{
    // Créer un nouveau shader avec les uniforms mis à jour
    try (Shader shader = effect.makeShader(uniforms, null, null)) {
        Paint p = new Paint().setShader(shader);
        canvas.drawPaint(p); // Remplir l'écran
    }
}
```

## RuntimeEffectBuilder

L'emballage manuel de tableaux d'octets pour les uniforms peut être source d'erreurs. `RuntimeEffectBuilder` simplifie cela en vous permettant de définir les uniforms par leur nom.

```java
RuntimeEffect effect = RuntimeEffect.makeForShader(sksl);
RuntimeEffectBuilder builder = new RuntimeEffectBuilder(effect);

// Définir les uniforms par nom (type-safe)
builder.setUniform("iTime", 1.5f);
builder.setUniform("iResolution", 800f, 600f);
builder.setUniform("iColor", new float[] { 1, 0, 0, 1 }); // vec4

// Créer Shader/ColorFilter/Blender
Shader shader = builder.makeShader();
```