# Textures Directory

This directory is for storing texture files used in the 3D scene.

## Recommended Formats

- `.jpg` - For color/diffuse maps
- `.png` - For maps with transparency (normal, alpha, etc.)
- `.hdr` - For environment maps

## Example Texture Types

- `environment.hdr` - HDR environment map for realistic lighting
- `magic-particle.png` - Particle texture for magical effects
- `crystal-normal.png` - Normal map for crystal surface details
- `wood-diffuse.jpg` - Wood texture for book covers
- `metal-roughness.png` - Roughness map for metallic surfaces

## Free Texture Resources

- [Poly Haven](https://polyhaven.com/textures)
- [Freepbr](https://freepbr.com/)
- [3D Textures](https://3dtextures.me/)
- [CC0 Textures](https://cc0textures.com/)

## Usage in Code

Textures can be loaded using Three.js TextureLoader:

```javascript
import { TextureLoader } from "three";

const textureLoader = new TextureLoader();
const diffuseTexture = textureLoader.load("/assets/textures/wood-diffuse.jpg");

const material = new THREE.MeshStandardMaterial({
  map: diffuseTexture,
});
```
