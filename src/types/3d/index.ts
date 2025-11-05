// Core 3D types for the application

import * as THREE from "three";
import type { DeepPartial, Vector3 } from "../global";
import type { NullableSchemaType, SchemaType } from "@/types";

// Object and animation configuration types
export interface ObjectConfig {
  type: string;
  contentType: NullableSchemaType; // empty string "" means non-interactive decorative object
  modelPath?: string; // optional for text objects - local path to 3D model file (GLB/GLTF)
  position: [number, number, number];
  rotation: [number, number, number]; // in radians
  scale: number;
  isInteractive?: boolean; // optional: explicitly control interactivity (defaults to contentType !== "")
  text?: TextConfig;
  animation: AnimationConfig;
}

export interface TextConfig {
  content: string; // the text to display
  font?: string; // font family or font URL (optional, defaults to built-in)
  size?: number; // text size (optional, defaults to 1)
  height?: number; // text extrusion depth (optional, defaults to 0.1)
  lineSpacing?: number; // line spacing for multiline text (optional, defaults to 1.2)
  material?: TextMaterialConfig;
  alignment?: TextAlignment;
}

export interface TextMaterialConfig {
  color?: string; // text color (optional, defaults to white)
  emissive?: string; // emissive color for glow effect (optional)
  metalness?: number; // metalness for PBR material (optional)
  roughness?: number; // roughness for PBR material (optional)
}

export interface TextAlignment {
  horizontal: "left" | "center" | "right"; // horizontal alignment
  vertical: "top" | "middle" | "bottom"; // vertical alignment
}

export interface AnimationConfig {
  floating: FloatingAnimation;
  rotation: RotationAnimation;
  hover: HoverAnimation;
  glb: GLBAnimation;
}

export interface FloatingAnimation {
  enabled: boolean;
  amplitude: number; // how high/low it floats
  speed: number; // how fast it floats
}

export interface RotationAnimation {
  enabled: boolean;
  speed: number; // radians per frame
}

export interface HoverAnimation {
  scaleMultiplier: number; // how much bigger when hovered (only for interactive objects)
}

export interface GLBAnimation {
  playOnHover: boolean; // play GLB animation on mouse enter
  animationName?: string; // specific animation name to play (optional)
  loop: boolean; // whether to loop the animation
  speed: number; // animation playback speed (1.0 = normal)
}

// Lighting configuration types
export interface LightConfig {
  type: "ambient" | "directional" | "point" | "spot";
  name?: string;
  tags?: string[];
  color: number;
  intensity: number;
  position?: [number, number, number];
  target?: [number, number, number];
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
  castShadow?: boolean;
  shadowMapSize?: [number, number];
  shadowCameraNear?: number;
  shadowCameraFar?: number;
  shadowCameraLeft?: number;
  shadowCameraRight?: number;
  shadowCameraTop?: number;
  shadowCameraBottom?: number;
  enabled?: boolean;
}

export interface LightingConfiguration {
  ambientLight: LightConfig;
  directionalLight: LightConfig;
  dynamicLights: LightConfig[];
  globalShadowSettings: ShadowSettings;
}

export interface ShadowSettings {
  enabled: boolean;
  type: "basic" | "pcf" | "pcfSoft" | "vsm";
  autoUpdate: boolean;
}

// Particle system configuration types
export interface ParticleSystemConfig {
  name: string;
  tags?: string[]; // Optional tags for categorization
  particleCount: number;
  geometry: ParticleGeometry;
  material: ParticleMaterial;
  distribution: ParticleDistribution;
  animation: ParticleAnimation;
  position: [number, number, number];
  enabled: boolean;
  timeToLive: TimeToLiveConfig;
  fade: FadeConfig;
}

export interface ParticleGeometry {
  type: "sphere" | "box" | "custom";
  size: number;
  randomness: number;
}

export interface ParticleMaterial {
  color: number;
  size: number;
  transparent: boolean;
  opacity: number;
  blending: "normal" | "additive" | "subtractive" | "multiply";
  alphaTest?: number;
  vertexColors?: boolean;
  texture?: string; // Path to texture file (SVG, PNG, etc.)
}

export interface ParticleDistribution {
  type: "sphere" | "box" | "ring" | "line";
  radius?: number;
  width?: number;
  height?: number;
  depth?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export interface ParticleAnimation {
  enabled: boolean;
  speed: number;
  direction: [number, number, number];
  rotationSpeed: number;
  floatingAmplitude: number;
  floatingSpeed: number;
}

export interface TimeToLiveConfig {
  enabled: boolean;
  minLifetime: number; // seconds
  maxLifetime: number; // seconds
  respawn: boolean; // whether particles respawn after death
}

export interface FadeConfig {
  enabled: boolean;
  fadeInPercentage: number; // 0-1, percentage of lifetime for fade in
  fadeOutPercentage: number; // 0-1, percentage of lifetime for fade out
}

export interface ParticlesConfiguration {
  particles: Record<string, ParticleSystemConfig>;
  dynamicParticles: ParticleSystemConfig[];
  globalSettings: ParticleGlobalSettings;
}

export interface ParticleGlobalSettings {
  enableAllParticles: boolean;
  performanceMode: "high" | "medium" | "low";
  maxParticleSystems: number;
}

// Effects configuration types
export interface EffectConfig {
  id: string;
  description: string;
  particles?: ParticleSystemConfig;
  lighting?: LightConfig;
}

export type EffectInstance = {
  name: string;
  config: EffectConfig;
  position: Vector3;
  tags?: string[];
};

// --- Utility Functions ---

const ensureVector3 = (
  elem:
    | [(number | undefined)?, (number | undefined)?, (number | undefined)?]
    | undefined,
  prev: Vector3
): Vector3 => {
  if (!elem) return prev;
  const [x, y, z] = elem;
  return [x ?? 0, y ?? 0, z ?? 0];
};

function overrideEffectConfig(
  config: EffectConfig,
  overrides?: {
    description?: string;
    particles?: DeepPartial<ParticleSystemConfig>;
    lighting?: DeepPartial<LightConfig>;
  }
): EffectConfig {
  const result: EffectConfig = {
    ...config,
    ...(overrides?.description && { description: overrides.description }),
  };
  if (overrides?.particles && config.particles) {
    result.particles = {
      ...config.particles,
      ...{
        ...overrides.particles,
        position: ensureVector3(
          overrides.particles.position,
          config.particles.position
        ),
      },
      geometry: {
        ...config.particles.geometry,
        ...overrides.particles.geometry,
      },
      material: {
        ...config.particles.material,
        ...overrides.particles.material,
      },
      distribution: {
        ...config.particles.distribution,
        ...overrides.particles.distribution,
      },
      animation: {
        ...config.particles.animation,
        ...overrides.particles.animation,
        direction: ensureVector3(
          overrides.particles.animation?.direction,
          config.particles.animation.direction
        ),
      },
      timeToLive: {
        ...config.particles.timeToLive,
        ...overrides.particles.timeToLive,
      },
      fade: {
        ...config.particles.fade,
        ...overrides.particles.fade,
      },
    };
  }
  if (overrides?.lighting && config.lighting) {
    result.lighting = {
      ...config.lighting,
      ...overrides.lighting,
    };
  }
  return result;
}

export function createEffectInstances(
  baseName: string,
  config: EffectConfig | undefined,
  positions: Vector3[],
  overrides?: {
    description?: string;
    particles?: DeepPartial<ParticleSystemConfig>;
    lighting?: DeepPartial<LightConfig>;
  },
  tags?: string[]
): EffectInstance[] {
  if (!config) return [];
  const result: EffectInstance[] = [];
  positions.forEach((position, i) => {
    const finalConfig = overrides
      ? overrideEffectConfig(config, overrides)
      : config;
    result.push({
      name: `${baseName}_${i}`,
      config: finalConfig,
      position,
      tags,
    });
  });
  return result;
}

// Scene and interaction types
export interface InteractiveObject {
  id: string;
  type: "text" | string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  contentType: SchemaType;
  isHovered: boolean;
  isClicked: boolean;
}

export interface SceneState {
  isLoading: boolean;
  selectedObject: InteractiveObject | null;
  hoveredObject: InteractiveObject | null;
  modalOpen: boolean;
  modalContent: any;
}

// Scene setup and configuration types
export interface SceneConfig {
  camera: CameraConfig;
  renderer: RendererConfig;
  controls: ControlsConfig;
  fog?: FogConfig;
}

export interface CameraConfig {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: [number, number, number];
}

export interface RendererConfig {
  antialias: boolean;
  alpha: boolean;
  shadowMapEnabled: boolean;
  shadowMapType: "basic" | "pcf" | "pcfSoft" | "vsm";
  outputColorSpace: string;
}

export interface ControlsConfig {
  enableDamping: boolean;
  dampingFactor: number;
  screenSpacePanning: boolean;
  enablePan: boolean;
  minDistance: number;
  maxDistance: number;
  maxPolarAngle: number;
}

export interface FogConfig {
  color: number;
  near: number;
  far: number;
}

// Lighting modes
export type LightingMode = "day" | "night";

// Model loading and management types
export interface ModelLoadingOptions {
  enableDRACO?: boolean;
  dracoPath?: string;
  timeout?: number;
}

export interface ModelMetadata {
  path: string;
  size?: number;
  animations?: string[];
  materials?: string[];
  loadTime?: number;
}

// Animation and mixer management
export interface AnimationMixerState {
  mixer: THREE.AnimationMixer;
  actions: THREE.AnimationAction[];
  isPlaying: boolean;
}

// Preloader types
export interface PreloaderState {
  isLoading: boolean;
  progress: number;
  status: string;
  totalAssets: number;
  loadedAssets: number;
}

// Theme configuration types
export interface ThemeConfig {
  name: string;
  objects: ObjectConfig[];
  lighting: LightingConfiguration;
  particles: ParticlesConfiguration;
  scene: SceneConfig;
  metadata: ThemeMetadata;
}

export interface ThemeMetadata {
  displayName: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
}

// Event handling types
export interface RaycastResult {
  object: THREE.Object3D;
  point: THREE.Vector3;
  distance: number;
  face?: THREE.Face;
  faceIndex?: number;
  uv?: THREE.Vector2;
}

export interface InteractionEvent {
  type: "hover" | "click" | "mousedown" | "mouseup";
  object: InteractiveObject;
  raycastResult: RaycastResult;
  originalEvent: MouseEvent;
}

// Performance monitoring types
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryUsage?: number;
}

export type ConfigurationPreset = "minimal" | "dramatic" | "calm" | "energetic";
