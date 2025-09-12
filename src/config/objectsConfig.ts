export interface ObjectConfig {
  type: string;
  contentType: string; // empty string "" means non-interactive decorative object
  modelPath?: string; // optional for text objects
  position: [number, number, number];
  rotation: [number, number, number]; // in radians
  scale: number;
  isInteractive?: boolean; // optional: explicitly control interactivity (defaults to contentType !== "")
  text?: {
    content: string; // the text to display
    font?: string; // font family or font URL (optional, defaults to built-in)
    size?: number; // text size (optional, defaults to 1)
    height?: number; // text extrusion depth (optional, defaults to 0.1)
    lineSpacing?: number; // line spacing for multiline text (optional, defaults to 1.2)
    material?: {
      color?: string; // text color (optional, defaults to white)
      emissive?: string; // emissive color for glow effect (optional)
      metalness?: number; // metalness for PBR material (optional)
      roughness?: number; // roughness for PBR material (optional)
    };
    alignment?: {
      horizontal: "left" | "center" | "right"; // horizontal alignment
      vertical: "top" | "middle" | "bottom"; // vertical alignment
    };
  };
  animation: {
    floating: {
      enabled: boolean;
      amplitude: number; // how high/low it floats
      speed: number; // how fast it floats
    };
    rotation: {
      enabled: boolean;
      speed: number; // radians per frame
    };
    hover: {
      scaleMultiplier: number; // how much bigger when hovered (only for interactive objects)
    };
    glb: {
      playOnHover: boolean; // play GLB animation on mouse enter
      animationName?: string; // specific animation name to play (optional)
      loop: boolean; // whether to loop the animation
      speed: number; // animation playback speed (1.0 = normal)
    };
  };
}

// 🎯 EASY CONFIGURATION FOR 3D OBJECTS
// Adjust these values to change how objects appear and behave
export const objectsConfig: ObjectConfig[] = [
  {
    type: "crystal",
    contentType: "projects",
    modelPath: "/assets/models/crystal.glb",
    position: [0, 3, -1], // [x, y, z] - left/right, up/down, forward/back
    rotation: [0, 0, 0], // [x, y, z] rotation in radians (0 to 2*PI)
    scale: 0.002,
    animation: {
      floating: {
        enabled: true,
        amplitude: 0.15, // how high it floats (0.1 = subtle, 0.5 = dramatic)
        speed: 1.0, // floating speed (0.5 = slow, 2.0 = fast)
      },
      rotation: {
        enabled: true,
        speed: 0.005, // rotation speed (0.005 = slow, 0.02 = fast)
      },
      hover: {
        scaleMultiplier: 1.1, // 1.1 = 10% bigger when hovered
      },
      glb: {
        playOnHover: true, // play animation on hover
        loop: true, // loop the animation
        speed: 1.0, // normal speed
      },
    },
  },
  {
    type: "cauldron",
    contentType: "wip",
    modelPath: "/assets/models/cauldron.glb",
    position: [7, -0.25, 7],
    rotation: [0, Math.PI / 4, 0], // 45 degree Y rotation
    scale: 3,
    animation: {
      floating: {
        enabled: false,
        amplitude: 0.15,
        speed: 0.8,
      },
      rotation: {
        enabled: false,
        speed: 0.008,
      },
      hover: {
        scaleMultiplier: 1.1,
      },
      glb: {
        playOnHover: true, // cauldron might have bubbling animation
        loop: true,
        speed: 1.0,
      },
    },
  },
  {
    type: "book",
    contentType: "blog",
    modelPath: "/assets/models/book.glb",
    position: [-6, 5, 8],
    rotation: [0, Math.PI / 3, -Math.PI / 10],
    scale: 0.04,
    animation: {
      floating: {
        enabled: false,
        amplitude: 0.18,
        speed: 1.2,
      },
      rotation: {
        enabled: false,
        speed: 0.012,
      },
      hover: {
        scaleMultiplier: 1.08,
      },
      glb: {
        playOnHover: true, // book might have page-turning animation
        loop: false, // page turn shouldn't loop
        speed: 1.2,
      },
    },
  },
  {
    type: "circle",
    contentType: "collaborations",
    modelPath: "/assets/models/magic-circle.glb",
    position: [6, -0.2, -6],
    rotation: [0, 0, 0], // 90 degree X rotation (horizontal)
    scale: 0.3,
    animation: {
      floating: {
        enabled: true,
        amplitude: 0.05,
        speed: 0.6,
      },
      rotation: {
        enabled: true,
        speed: 0.01, // magic circles should spin faster
      },
      hover: {
        scaleMultiplier: 1.12,
      },
      glb: {
        playOnHover: true, // magic circle might have glowing/pulsing animation
        loop: true,
        speed: 1.5, // faster magic effect
      },
    },
  },
  {
    type: "library",
    contentType: "learning",
    modelPath: "/assets/models/library.glb",
    position: [-8, -0.3, -6],
    rotation: [0, 0, 0], // 22.5 degree Y rotation
    scale: 0.1,
    animation: {
      floating: {
        enabled: false,
        amplitude: 0.12,
        speed: 0.7,
      },
      rotation: {
        enabled: false,
        speed: 0.006, // slower for stability
      },
      hover: {
        scaleMultiplier: 1.05,
      },
      glb: {
        playOnHover: false, // library is more static
        loop: true,
        speed: 1.0,
      },
    },
  },
  {
    type: "owl",
    contentType: "fun-facts",
    modelPath: "/assets/models/owl.glb",
    position: [5, 7, -9],
    rotation: [0, Math.PI / 2, 0],
    scale: 0.02,
    animation: {
      floating: {
        enabled: false,
        amplitude: 0,
        speed: 0,
      },
      rotation: {
        enabled: false,
        speed: 0,
      },
      hover: {
        scaleMultiplier: 1.1,
      },
      glb: {
        playOnHover: true, // owl might have wing flapping or head turning
        loop: false, // owls shouldn't constantly animate
        speed: 1.0,
      },
    },
  },

  // DECORATIVE NON-INTERACTIVE OBJECTS
  // These create atmosphere but don't have content when clicked
  {
    type: "room",
    contentType: "", // empty = non-interactive
    modelPath: "/assets/models/room.glb",
    position: [0, 0, 0], // center the room
    rotation: [0, 0, 0],
    scale: 0.1,
    isInteractive: false,
    animation: {
      floating: {
        enabled: false,
        amplitude: 0,
        speed: 0,
      },
      rotation: {
        enabled: false,
        speed: 0,
      },
      hover: {
        scaleMultiplier: 1.0, // no hover effect for rooms
      },
      glb: {
        playOnHover: false, // rooms don't need animations
        loop: false,
        speed: 1.0,
      },
    },
  },
  {
    type: "lectern",
    contentType: "", // empty = non-interactive
    modelPath: "/assets/models/lectern.glb",
    position: [-6.08, -0.25, 8.08], // position near where book will be
    rotation: [0, (5 * Math.PI) / 6, 0], // match book rotation
    scale: 3.62,
    isInteractive: false,
    animation: {
      floating: {
        enabled: false,
        amplitude: 0,
        speed: 0,
      },
      rotation: {
        enabled: false,
        speed: 0,
      },
      hover: {
        scaleMultiplier: 1.0, // no hover effect for furniture
      },
      glb: {
        playOnHover: false, // furniture doesn't need animations
        loop: false,
        speed: 1.0,
      },
    },
  },

  // TABLE EASTEREGG
  {
    type: "text",
    contentType: "", // non-interactive decorative text
    position: [-4.5, 0.5, 0], // position in 3D space [x, y, z]
    rotation: [0, Math.PI / 2, 0], // facing +X direction (viewer at [6,5,5] sees it orthogonal)
    scale: 1,
    text: {
      content: "look at\nthe other side",
      size: 0.3,
      height: 0.01,
      material: {
        color: "#ffffff",
        emissive: "#4a90e2",
        metalness: 0.3,
        roughness: 0.4,
      },
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },
    },
    animation: {
      floating: { enabled: true, amplitude: 0.1, speed: 0.8 },
      rotation: { enabled: true, speed: 0.01 },
      hover: { scaleMultiplier: 1.0 },
      glb: { playOnHover: false, loop: false, speed: 1.0 },
    },
  },
  {
    type: "text",
    contentType: "", // non-interactive decorative text
    position: [4.5, 0.5, 0], // position in 3D space [x, y, z]
    rotation: [0, -Math.PI / 2, 0], // facing +X direction (viewer at [6,5,5] sees it orthogonal)
    scale: 1,
    text: {
      content: "what are you doing here?\nthe world is outside",
      size: 0.25,
      height: 0.01,
      lineSpacing: 2,
      material: {
        color: "#ffffff",
        emissive: "#4a90e2",
        metalness: 0.3,
        roughness: 0.4,
      },
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },
    },
    animation: {
      floating: { enabled: true, amplitude: 0.1, speed: 0.8 },
      rotation: { enabled: true, speed: 0.01 },
      hover: { scaleMultiplier: 1.0 },
      glb: { playOnHover: false, loop: false, speed: 1.0 },
    },
  },
];

// 🎨 HELPER FUNCTIONS FOR COMMON ADJUSTMENTS

export const adjustAllPositions = (
  deltaX: number,
  deltaY: number,
  deltaZ: number
) => {
  objectsConfig.forEach((config) => {
    config.position[0] += deltaX;
    config.position[1] += deltaY;
    config.position[2] += deltaZ;
  });
};

export const adjustAllScales = (multiplier: number) => {
  objectsConfig.forEach((config) => {
    config.scale *= multiplier;
  });
};

export const setAllFloatingSpeed = (speed: number) => {
  objectsConfig.forEach((config) => {
    config.animation.floating.speed = speed;
  });
};

export const setAllRotationSpeed = (speed: number) => {
  objectsConfig.forEach((config) => {
    config.animation.rotation.speed = speed;
  });
};

// 🎯 UTILITY FUNCTIONS FOR INTERACTIVE/NON-INTERACTIVE OBJECTS

export const getInteractiveObjects = () => {
  return objectsConfig.filter(
    (config) => config.isInteractive !== false && config.contentType !== ""
  );
};

export const getNonInteractiveObjects = () => {
  return objectsConfig.filter(
    (config) => config.isInteractive === false || config.contentType === ""
  );
};

export const getAllObjects = () => {
  return objectsConfig;
};

// Apply changes only to interactive objects
export const adjustInteractiveObjectsOnly = (
  callback: (config: ObjectConfig) => void
) => {
  getInteractiveObjects().forEach(callback);
};

// Apply changes only to decorative objects
export const adjustDecorativeObjectsOnly = (
  callback: (config: ObjectConfig) => void
) => {
  getNonInteractiveObjects().forEach(callback);
};

// QUICK PRESETS (only affect interactive objects)

export const applyPreset = (
  presetName: "minimal" | "dramatic" | "calm" | "energetic"
) => {
  switch (presetName) {
    case "minimal":
      adjustInteractiveObjectsOnly((config) => {
        config.animation.floating.speed = 0.3;
        config.animation.rotation.speed = 0.003;
        config.animation.floating.amplitude = 0.05;
        config.animation.hover.scaleMultiplier = 1.02;
      });
      break;

    case "dramatic":
      adjustInteractiveObjectsOnly((config) => {
        config.animation.floating.speed = 2.0;
        config.animation.rotation.speed = 0.02;
        config.animation.floating.amplitude = 0.4;
        config.animation.hover.scaleMultiplier = 1.3;
      });
      break;

    case "calm":
      adjustInteractiveObjectsOnly((config) => {
        config.animation.floating.speed = 0.5;
        config.animation.rotation.speed = 0.005;
        config.animation.floating.amplitude = 0.1;
        config.animation.hover.scaleMultiplier = 1.05;
      });
      break;

    case "energetic":
      adjustInteractiveObjectsOnly((config) => {
        config.animation.floating.speed = 1.8;
        config.animation.rotation.speed = 0.018;
        config.animation.floating.amplitude = 0.3;
        config.animation.hover.scaleMultiplier = 1.25;
      });
      break;
  }
};

// USAGE EXAMPLES:
//
// // Move all objects up by 1 unit:
// adjustAllPositions(0, 1, 0);
//
// // Make all objects 50% bigger:
// adjustAllScales(1.5);
//
// // Apply calm preset (only affects interactive objects):
// applyPreset('calm');
//
// // Work with interactive objects only:
// adjustInteractiveObjectsOnly((config) => {
//   config.animation.floating.enabled = true;
// });
//
// // Work with decorative objects only:
// adjustDecorativeObjectsOnly((config) => {
//   config.scale *= 1.2; // make decorative objects bigger
// });
//
// // Get lists of objects:
// const interactive = getInteractiveObjects(); // crystal, cauldron, book, circle, library, owl
// const decorative = getNonInteractiveObjects(); // room, lectern
//
// // Individual object adjustment:
// objectsConfig[0].position = [-5, 3, 1]; // Move crystal
// objectsConfig[1].scale = 2.0; // Make cauldron bigger
// objectsConfig[2].animation.floating.enabled = false; // Stop book floating

// 📝 TEXT OBJECT EXAMPLES:
// Add these to objectsConfig array to create 3D text in your scene:

// Example 1: Non-interactive decorative text
// {
//   type: "text",
//   contentType: "", // non-interactive
//   position: [5, 5, 5], // position in 3D space
//   rotation: [0, Math.PI / 2, 0], // facing +X direction from viewer at [6,5,5]
//   scale: 1,
//   text: {
//     content: "Hello World",
//     size: 1,
//     height: 0.2,
//     material: {
//       color: "#ffffff",
//       emissive: "#4a90e2",
//       metalness: 0.3,
//       roughness: 0.4
//     },
//     alignment: {
//       horizontal: 'center',
//       vertical: 'middle'
//     }
//   },
//   animation: {
//     floating: { enabled: false, amplitude: 0, speed: 0 },
//     rotation: { enabled: true, speed: 0.01 },
//     hover: { scaleMultiplier: 1.0 },
//     glb: { playOnHover: false, loop: false, speed: 1.0 }
//   }
// },

// Example 2: Interactive text that opens projects modal
// {
//   type: "text",
//   contentType: "projects", // interactive
//   position: [-3, 2, 0],
//   rotation: [0, 0, 0], // facing camera
//   scale: 0.8,
//   text: {
//     content: "My Projects",
//     size: 0.8,
//     height: 0.1,
//     material: {
//       color: "#ffd700",
//       emissive: "#ff6b35"
//     },
//     alignment: {
//       horizontal: 'center',
//       vertical: 'middle'
//     }
//   },
//   animation: {
//     floating: { enabled: true, amplitude: 0.1, speed: 0.8 },
//     rotation: { enabled: false, speed: 0 },
//     hover: { scaleMultiplier: 1.2 },
//     glb: { playOnHover: false, loop: false, speed: 1.0 }
//   }
// }
