import { GitCMS } from "@git-cms/client";

/**
 * GitCMS Client for Frontend (Public Transport Mode)
 *
 * This client uses public transport mode, which means:
 * - No GitHub token required
 * - Direct access to public repositories
 * - 60 requests/hour rate limit (unauthenticated)
 * - Perfect for client-side applications
 *
 * For more information, see: TRANSPORT-MODE-GUIDE.md
 */

// Environment variables (Vite)
const REPOSITORY = import.meta.env.VITE_GITCMS_REPOSITORY || "username/repo";
const BRANCH = import.meta.env.VITE_GITCMS_BRANCH || "main";

/**
 * GitCMS client instance
 * Configured for public transport mode (no token needed)
 */
export const gitcms = new GitCMS({
  repository: REPOSITORY,
  branch: BRANCH,
  // No token - uses public transport mode automatically!
});

// Log configuration in development
if (import.meta.env.DEV) {
  console.log("🔮 GitCMS Client initialized");
  console.log(`📦 Repository: ${REPOSITORY}`);
  console.log(`🌿 Branch: ${BRANCH}`);
  console.log(`🚀 Transport Mode: ${gitcms.getTransportMode()}`);
  console.log(`🔓 Public Mode: ${gitcms.isPublicMode()}`);
}

// Export for convenience
export default gitcms;
