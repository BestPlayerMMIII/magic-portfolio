import { GitCMS } from "@git-cms/client";
import dotenv from "dotenv";

dotenv.config();

/**
 * Server-side media service that handles GitCMS media operations
 * Uses credentials from environment variables
 */
export class MediaService {
  private gitcms: GitCMS;

  constructor() {
    this.gitcms = new GitCMS({
      repository: process.env.GITCMS_REPOSITORY || "username/repo",
      branch: process.env.GITCMS_BRANCH || "main",
      token: process.env.GITCMS_TOKEN || "",
    });
  }

  /**
   * Process HTML content with embedded media tags
   * Returns fast version with thumbnails
   */
  renderFast(htmlContent: string): string {
    return this.gitcms.media.renderFast(htmlContent);
  }

  /**
   * Process HTML content with embedded media tags
   * Returns full resolution version (async)
   */
  async renderFull(
    htmlContent: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<string> {
    return this.gitcms.media.renderFull(htmlContent, { onProgress });
  }

  /**
   * Get thumbnail for a media field (image object with path)
   */
  getThumbnailForField(mediaField: any): string | null {
    if (!mediaField?.path) return null;

    const ref = this.gitcms.media.extractFromField(mediaField);
    if (!ref) return null;

    // Handle array or single reference
    const singleRef = Array.isArray(ref) ? ref[0] : ref;
    if (!singleRef) return null;

    return this.gitcms.media.getThumbnail(singleRef);
  }

  /**
   * Fetch full resolution data for a media field
   */
  async fetchFullForField(mediaField: any): Promise<{
    url: string;
    size?: number;
    mimeType?: string;
  } | null> {
    if (!mediaField?.path) return null;

    const ref = this.gitcms.media.extractFromField(mediaField);
    if (!ref) return null;

    // Handle array or single reference
    const singleRef = Array.isArray(ref) ? ref[0] : ref;
    if (!singleRef) return null;

    try {
      const fullData = await this.gitcms.media.fetchFull(singleRef, {
        resolveLFS: true,
        timeout: 30000,
      });

      return {
        url: fullData.url,
        size: fullData.size,
        mimeType: singleRef.mimeType,
      };
    } catch (error) {
      console.error("Failed to fetch full media:", error);
      return null;
    }
  }

  /**
   * Process content item with media (both HTML and fields)
   * Returns processed content with thumbnails
   */
  processContentFast<T>(contentItem: any): any {
    const processed = { ...contentItem };

    // Process HTML content if exists
    if (processed.data?.content) {
      processed.data.content = this.renderFast(processed.data.content);
    }

    // Add thumbnail URLs for media fields
    if (processed.data?.header?.image) {
      const thumbnail = this.getThumbnailForField(processed.data.header.image);
      if (thumbnail) {
        processed.data.header.image.thumbnailUrl = thumbnail;
      }
    }

    return processed;
  }

  /**
   * Process content item with full resolution media
   */
  async processContentFull<T>(contentItem: any): Promise<any> {
    const processed = { ...contentItem };

    // Process HTML content if exists
    if (processed.data?.content) {
      processed.data.content = await this.renderFull(processed.data.content);
    }

    // Fetch full resolution for media fields
    if (processed.data?.header?.image) {
      const fullData = await this.fetchFullForField(
        processed.data.header.image
      );
      if (fullData) {
        processed.data.header.image.fullUrl = fullData.url;
        processed.data.header.image.fullSize = fullData.size;
      }
    }

    return processed;
  }

  /**
   * Extract all media references from content
   */
  extractMediaFromContent(contentItem: any): any[] {
    const mediaRefs = [];

    // Extract from HTML
    if (contentItem.data?.content) {
      const htmlMedia = this.gitcms.media.extractFromHTML(
        contentItem.data.content
      );
      mediaRefs.push(...htmlMedia);
    }

    // Extract from fields
    if (contentItem.data?.header?.image) {
      const fieldMedia = this.gitcms.media.extractFromField(
        contentItem.data.header.image
      );
      if (fieldMedia) mediaRefs.push(fieldMedia);
    }

    return mediaRefs;
  }
}

export const mediaService = new MediaService();
