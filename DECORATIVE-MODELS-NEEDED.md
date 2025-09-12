# Missing Decorative 3D Models

## 🏛️ Required GLB Files for Decorative Objects

You need to add these GLB model files to complete the magical laboratory environment:

### `/public/assets/models/room.glb`

- **Purpose**: Background environment/room structure
- **Type**: Non-interactive decorative object
- **Description**: A magical laboratory room with walls, floor, ceiling
- **Position**: Center of scene (0, 0, 0)
- **Suggested Features**: Stone walls, mystical atmosphere, ambient lighting

### `/public/assets/models/lectern.glb`

- **Purpose**: Stand/podium for the book to rest on
- **Type**: Non-interactive decorative object
- **Description**: A wooden or stone lectern/reading stand
- **Position**: Near the book position (4, 0.5, 0)
- **Suggested Features**: Medieval/fantasy style, ornate details

## 🎨 Where to Get Models

1. **Create your own** using Blender, Maya, or other 3D software
2. **Download from free sources**:
   - Sketchfab (free models)
   - OpenGameArt.org
   - Free3D.com
   - Poly Haven
3. **Purchase from marketplaces**:
   - Sketchfab Store
   - Unity Asset Store
   - Unreal Marketplace
   - TurboSquid

## 📏 Technical Requirements

- **Format**: GLB (preferred) or GLTF
- **Optimization**: Keep file sizes reasonable (< 5MB per model)
- **Materials**: PBR materials work best with Three.js
- **Geometry**: Moderate polygon count for web performance

## 🔧 Fallback Behavior

If these GLB files are missing, the system will automatically use fallback geometric shapes:

- **Room**: Large gray box (20x8x20 units)
- **Lectern**: Brown cylinder stand

The app will work perfectly fine with fallbacks, but custom models will enhance the visual experience!
