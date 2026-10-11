import type { ThemeConfig } from "../../types/3d";
import wizardLabObjects from "./config/objects";
import wizardLabLighting from "./config/lighting";
import wizardLabParticles from "./config/particles";
import wizardLabScene from "./config/scene";
import wizardLabUi from "./config/ui";
import wizardLabStrings from "./config/strings";

// 🧙‍♂️ WIZARD LABORATORY THEME
// Complete theme configuration combining all aspects of the wizard laboratory
export const wizardLabTheme: ThemeConfig = {
  name: "wizard-lab",
  objects: wizardLabObjects,
  lighting: wizardLabLighting,
  particles: wizardLabParticles,
  scene: wizardLabScene,
  ui: wizardLabUi,
  strings: wizardLabStrings,
  metadata: {
    displayName: "Wizard Laboratory",
    description:
      "A magical laboratory filled with mysterious artifacts and glowing effects",
    version: "1.0.0",
    author: "Magic Portfolio",
    tags: ["magical", "laboratory", "wizard", "dark", "atmospheric", "fantasy"],
  },
};

// Export individual configurations for flexibility
export {
  wizardLabObjects,
  wizardLabLighting,
  wizardLabParticles,
  wizardLabScene,
  wizardLabUi,
  wizardLabStrings,
};

// Export as default theme
export default wizardLabTheme;
