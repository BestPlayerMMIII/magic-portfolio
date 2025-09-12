import { retrieveLighting } from "./effectsConfig";

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
  mainDirectionalLight: LightConfig;
  magicalPointLights: LightConfig[];
  spotLights?: LightConfig[];
  globalShadowSettings: {
    enabled: boolean;
    type: "basic" | "pcf" | "pcfSoft" | "vsm";
    autoUpdate: boolean;
  };
}

export const lightingConfig: LightingConfiguration = {
  // Ambient lighting for overall scene illumination
  ambientLight: {
    type: "ambient",
    color: 0x404040,
    intensity: 0.8,
    enabled: true,
  },

  // Main directional light (sun-like lighting)
  mainDirectionalLight: {
    type: "directional",
    color: 0xffffff,
    intensity: 1.6,
    position: [10, 10, 5],
    target: [0, 0, 0],
    castShadow: true,
    shadowMapSize: [2048, 2048],
    shadowCameraNear: 0.1,
    shadowCameraFar: 50,
    shadowCameraLeft: -20,
    shadowCameraRight: 20,
    shadowCameraTop: 20,
    shadowCameraBottom: -20,
    enabled: true,
  },

  // Magical point lights for atmospheric effects
  magicalPointLights: [
    {
      type: "point",
      color: 0xd946ef, // Pink magical light (red potion on the table)
      intensity: 2.5,
      position: [3.1, 3.05, 1.9],
      distance: 20,
      decay: 2,
      castShadow: false,
      enabled: true,
    },
    {
      type: "point",
      color: 0x08b7c1, // Crystal light
      intensity: 2.0,
      position: [0, 3, -1],
      distance: 15,
      decay: 2,
      castShadow: false,
      enabled: true,
    },
  ],

  // Optional spot lights for focused illumination
  spotLights: [
    {
      type: "spot",
      color: 0xffffff,
      intensity: 3,
      position: [0, 8, 0],
      target: [0, 0, 0],
      distance: 25,
      angle: Math.PI / 6,
      penumbra: 0.2,
      decay: 2,
      castShadow: true,
      shadowMapSize: [1024, 1024],
      enabled: false, // Disabled by default
    },
  ],

  // Global shadow settings
  globalShadowSettings: {
    enabled: true,
    type: "pcfSoft",
    autoUpdate: true,
  },
};

// Helper functions for lighting management
export const getLightById = (lightType: string): LightConfig | null => {
  switch (lightType) {
    case "ambient":
      return lightingConfig.ambientLight;
    case "directional":
      return lightingConfig.mainDirectionalLight;
    default:
      return null;
  }
};

export const getEnabledLights = (): LightConfig[] => {
  const enabledLights: LightConfig[] = retrieveLighting();

  if (lightingConfig.ambientLight.enabled) {
    enabledLights.push(lightingConfig.ambientLight);
  }

  if (lightingConfig.mainDirectionalLight.enabled) {
    enabledLights.push(lightingConfig.mainDirectionalLight);
  }

  lightingConfig.magicalPointLights.forEach((light) => {
    if (light.enabled) {
      enabledLights.push(light);
    }
  });

  if (lightingConfig.spotLights) {
    lightingConfig.spotLights.forEach((light) => {
      if (light.enabled) {
        enabledLights.push(light);
      }
    });
  }

  return enabledLights;
};

export const updateLightIntensity = (
  lightType: string,
  intensity: number
): void => {
  const light = getLightById(lightType);
  if (light) {
    light.intensity = intensity;
  }
};

export const toggleLight = (lightType: string): void => {
  const light = getLightById(lightType);
  if (light) {
    light.enabled = !light.enabled;
  }
};
