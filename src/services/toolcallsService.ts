import router from "@/router";

/**
 * Toolcalls Service - Resolves GitCMS toolcalls in content
 *
 * This service provides functionality to parse and resolve
 * custom <gitcms-toolcall> tags embedded in content.
 */

export interface ToolcallReference {
  id: string;
  parameters: Record<string, string>;
  originalTag: string;
}

export type ToolcallRenderer = (
  id: string,
  parameters: Record<string, string>
) => string;

export type ToolcallRenderers = Record<string, ToolcallRenderer>;

/**
 * Extract toolcall references from HTML content
 */
export function extractToolcalls(html: string): ToolcallReference[] {
  const toolcallRegex =
    /<gitcms-toolcall\s+id="([^"]+)"([^>]*?)(?:\/>|><\/gitcms-toolcall>)/gi;
  const results: ToolcallReference[] = [];
  let match: RegExpExecArray | null;

  while ((match = toolcallRegex.exec(html)) !== null) {
    const id = match[1];
    const attributesString = match[2];
    const parameters: Record<string, string> = {};

    // Extract parameters (prefixed with _)
    const paramRegex = /_([a-zA-Z0-9_-]+)="([^"]*)"/g;
    let paramMatch: RegExpExecArray | null;

    while ((paramMatch = paramRegex.exec(attributesString)) !== null) {
      const paramName = paramMatch[1];
      const paramValue = paramMatch[2];
      parameters[paramName] = paramValue;
    }

    results.push({
      id,
      parameters,
      originalTag: match[0],
    });
  }

  return results;
}

/**
 * Resolve toolcalls in HTML content using provided renderers
 */
export function resolveToolcalls(
  content: string,
  renderers: ToolcallRenderers
): string {
  const toolcalls = extractToolcalls(content);
  let processedContent = content;

  for (const toolcall of toolcalls) {
    const renderer = renderers[toolcall.id];

    if (renderer) {
      try {
        const replacement = renderer(toolcall.id, toolcall.parameters);
        processedContent = processedContent.replace(
          toolcall.originalTag,
          replacement
        );
      } catch (error) {
        console.error(`Error rendering toolcall ${toolcall.id}:`, error);
        // Keep original tag on error
      }
    }
  }

  return processedContent;
}

/**
 * Default GOTO renderer for navigation toolcalls
 * Creates a link that navigates to a local URL using Vue Router
 */
export function createGotoRenderer(): ToolcallRenderer {
  return (_id: string, params: Record<string, string>) => {
    const text = params.text || "Click here";
    const url = params.url || "/";

    // Generate a unique ID for the link
    const linkId = `goto-link-${Math.random().toString(36).substr(2, 9)}`;

    // Create the link HTML with a data attribute
    const linkHtml = `<a 
      id="${linkId}" 
      href="${url}" 
      data-goto-url="${url}"
      class="goto-link inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-4 transition-colors duration-200 font-medium cursor-pointer"
      onclick="event.preventDefault(); return false;"
    >
      ${text}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </a>`;

    // Schedule the event listener attachment after the DOM is updated
    setTimeout(() => {
      const linkElement = document.getElementById(linkId);
      if (linkElement) {
        linkElement.addEventListener("click", (e) => {
          e.preventDefault();
          const targetUrl = linkElement.getAttribute("data-goto-url");
          if (targetUrl) {
            router.push(targetUrl);
          }
        });
      }
    }, 0);

    console.log("Created GOTO link:", linkHtml);

    return linkHtml;
  };
}

/**
 * Default renderers collection
 */
export const defaultRenderers: ToolcallRenderers = {
  GOTO: createGotoRenderer(),
};

/**
 * Convenience function to resolve toolcalls with default renderers
 */
export function resolveToolcallsWithDefaults(
  content: string,
  customRenderers: ToolcallRenderers = {}
): string {
  console.log("Resolving toolcalls with content:", content);
  return resolveToolcalls(content, {
    ...defaultRenderers,
    ...customRenderers,
  });
}
