/**
 * Interactive Objects Information Service
 * Provides information about interactive objects in the scene
 */

import type { ObjectConfig } from "@/types/3d";
import type { SchemaType } from "@/types";
import { getSectionById } from "@/config/sectionDescriptions";

export interface InteractiveObjectInfo {
  type: string;
  contentType: SchemaType;
  emoji: string;
  title: string;
  description: string;
}

/**
 * Get information about interactive objects from configuration
 * @param objectsConfig - Array of object configurations
 * @returns Array of interactive object information
 */
export function getInteractiveObjectsInfo(
  objectsConfig: ObjectConfig[]
): InteractiveObjectInfo[] {
  // Filter only interactive objects (those with contentType and isInteractive !== false)
  const interactiveObjects = objectsConfig.filter(
    (config) => config.isInteractive !== false && config.contentType !== ""
  );

  // Map to information objects with unique content types
  const infoMap = new Map<SchemaType, InteractiveObjectInfo>();

  interactiveObjects.forEach((config) => {
    const contentType = config.contentType as SchemaType;

    // Skip if we already have this content type
    if (infoMap.has(contentType)) {
      return;
    }

    // Get section information
    const section = getSectionById(contentType);

    if (section) {
      infoMap.set(contentType, {
        type: config.type,
        contentType: contentType,
        emoji: section.emoji,
        title: section.title,
        description: section.description,
      });
    }
  });

  // Convert map to array and sort by content type
  return Array.from(infoMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

/**
 * Get a user-friendly description of interactive objects
 * @param objectsConfig - Array of object configurations
 * @returns Human-readable string describing interactive objects
 */
export function getInteractiveObjectsDescription(
  objectsConfig: ObjectConfig[]
): string {
  const infos = getInteractiveObjectsInfo(objectsConfig);

  if (infos.length === 0) {
    return "No interactive objects available";
  }

  if (infos.length === 1) {
    return `Click the ${infos[0].type} to view ${infos[0].title.toLowerCase()}`;
  }

  // Format: "Click the crystal, book, or cauldron to explore different content"
  const types = infos.map((info) => info.type);
  const lastType = types.pop();
  const typesString =
    types.length > 0 ? `${types.join(", ")}, or ${lastType}` : lastType;

  return `Click the ${typesString} to explore different content`;
}
