# 🎯 Object Configuration Quick Guide

## Easy Configuration Management

You can now easily manage all 3D objects through the configuration file at:
`src/config/objectsConfig.ts`

## Quick Changes You Can Make

### 📍 **Position (Move Objects)**

```typescript
position: [x, y, z]; // [left/right, up/down, forward/back]

// Examples:
position: [-4, 2, 0]; // Left side, elevated
position: [0, 1, -3]; // Center, forward
position: [4, 2, 0]; // Right side, elevated
```

### 🔄 **Rotation (Rotate Objects)**

```typescript
rotation: [x, y, z]; // in radians (0 to 2*PI)

// Examples:
rotation: [0, 0, 0]; // No rotation
rotation: [0, Math.PI / 4, 0]; // 45° Y rotation
rotation: [Math.PI / 2, 0, 0]; // 90° X rotation (horizontal)
```

### 📏 **Scale (Resize Objects)**

```typescript
scale: 1.0; // 1.0 = normal, 0.5 = half size, 2.0 = double size

// Examples:
scale: 0.8; // 20% smaller
scale: 1.5; // 50% bigger
scale: 2.0; // Double size
```

### 🎭 **Animation Settings**

```typescript
animation: {
  floating: {
    enabled: true,      // Enable/disable floating
    amplitude: 0.2,     // How high it floats (0.1-0.5)
    speed: 1.0,         // How fast it floats (0.5-2.0)
  },
  rotation: {
    enabled: true,      // Enable/disable rotation
    speed: 0.01,        // Rotation speed (0.005-0.02)
  },
  hover: {
    scaleMultiplier: 1.1, // Size when hovered (1.05-1.3)
  },
}
```

## 🚀 Common Adjustments

### Make All Objects Float Higher

```typescript
// In objectsConfig.ts, change all objects:
amplitude: 0.4; // was 0.2
```

### Speed Up All Animations

```typescript
// Use the helper function:
applyPreset("energetic");
```

### Move All Objects Up

```typescript
// Use the helper function:
adjustAllPositions(0, 1, 0); // Move up by 1 unit
```

### Make All Objects Bigger

```typescript
// Use the helper function:
adjustAllScales(1.5); // 50% bigger
```

## 🎨 Ready-Made Presets

Simply call these functions in `objectsConfig.ts`:

```typescript
applyPreset("minimal"); // Subtle, calm animations
applyPreset("dramatic"); // Big, dramatic movements
applyPreset("calm"); // Peaceful, slow animations
applyPreset("energetic"); // Fast, exciting animations
```

## 🔧 Individual Object Changes

Find the object in the array and modify:

```typescript
// Make the crystal bigger and float more dramatically
objectsConfig[0].scale = 2.0;
objectsConfig[0].animation.floating.amplitude = 0.5;

// Stop the owl from rotating
objectsConfig[5].animation.rotation.enabled = false;

// Move the cauldron to the left
objectsConfig[1].position = [-2, 1, -3];
```

## 📱 Live Updates

After making changes:

1. Save the file
2. The development server will automatically reload
3. Your changes appear immediately!

## 🎯 Pro Tips

- **Start small**: Change one value at a time
- **Use Math.PI**: For rotations (Math.PI = 180°, Math.PI/2 = 90°)
- **Test on mobile**: Some animations might be too fast on mobile
- **Watch the console**: Look for loading feedback

## 🔍 Troubleshooting

If objects disappear or look weird:

- Check that position values aren't too extreme (-10 to 10 is safe)
- Make sure scale isn't too small (< 0.1) or too big (> 5.0)
- Verify rotation values are in radians, not degrees

---

**Ready to customize your magical laboratory?** 🔮✨

Edit `src/config/objectsConfig.ts` and watch your changes come to life!
