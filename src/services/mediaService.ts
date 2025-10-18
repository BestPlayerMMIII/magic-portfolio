const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Client-side media service that communicates with the server-side media API
 * The server handles GitCMS authentication and media processing
 */
class MediaService {
  /**
   * Fetch full resolution media for a media field
   */
  async fetchFullForField(mediaField: any): Promise<{
    url: string;
    size?: number;
    mimeType?: string;
  } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/media/fetch-full`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaField }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch media");
      }

      return result.data;
    } catch (error) {
      console.error("Failed to fetch full resolution media:", error);
      return null;
    }
  }

  /**
   * Process HTML content with embedded media tags
   * @param content - HTML content with <gitcms-media> tags
   * @param full - Whether to fetch full resolution (default: false for thumbnails)
   */
  async processContent(
    content: string,
    full: boolean = false
  ): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/media/process-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, full }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to process content");
      }

      return result.data.content;
    } catch (error) {
      console.error("Failed to process content:", error);
      // Return original content on error
      return content;
    }
  }
}

export const mediaService = new MediaService();
export default mediaService;
