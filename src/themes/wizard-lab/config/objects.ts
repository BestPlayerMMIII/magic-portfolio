import type { ObjectConfig } from "../../../types/3d";

// WIZARD LABORATORY THEME - 3D OBJECTS CONFIGURATION
// This file contains the specific object instances for the wizard laboratory theme
// Core logic is now managed in services, this is just the data/configuration

export const wizardLabObjects: ObjectConfig[] = [
  {
    type: "crystal",
    contentType: "project",
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
    contentType: "work-in-progress",
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
    contentType: "blog-post",
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
    contentType: "collaboration",
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
    contentType: "learning-path",
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
    contentType: "fun-fact",
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

  // DECORATIVE TEXT OBJECTS
  {
    type: "text",
    contentType: "", // non-interactive decorative text
    position: [-4.5, 0.5, 0], // position in 3D space [x, y, z]
    rotation: [0, Math.PI / 2, 0], // facing +X direction (viewer at [6,5,5] sees it orthogonal)
    scale: 0.5,
    text: {
      content: "look at\nthe other side",
      size: 0.5,
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
    scale: 0.5,
    text: {
      content: "what are you doing here?\nthe world is outside",
      size: 0.5,
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

// Utility functions for working with the wizard lab objects
export const getWizardLabInteractiveObjects = () => {
  return wizardLabObjects.filter(
    (config) => config.isInteractive !== false && config.contentType !== ""
  );
};

export const getWizardLabDecorativeObjects = () => {
  return wizardLabObjects.filter(
    (config) => config.isInteractive === false || config.contentType === ""
  );
};

// Export default configuration
export default wizardLabObjects;
