# 3D Models Directory

This directory is for storing 3D models used in the magical laboratory scene.

## Recommended Formats

- `.glb` - Compressed binary glTF (preferred)
- `.gltf` - JSON glTF with separate binary files

## Example Files to Add

- `crystal.glb` - Floating crystal for projects
- `cauldron.glb` - Alchemy cauldron for work in progress
- `book.glb` - Mystical book for blog posts
- `magic-circle.glb` - Magic circle for collaborations
- `library.glb` - Bookshelf for learning paths
- `owl.glb` - Animated owl for fun facts

## Free 3D Model Resources

- [Sketchfab](https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount)
- [Poly Haven](https://polyhaven.com/models)
- [Mixamo](https://www.mixamo.com/) (for animated characters)
- [Blender Cloud](https://cloud.blender.org/welcome)

## Usage in Code

Models can be loaded using Three.js GLTFLoader:

```javascript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.load("/assets/models/crystal.glb", (gltf) => {
  scene.add(gltf.scene);
});
```
