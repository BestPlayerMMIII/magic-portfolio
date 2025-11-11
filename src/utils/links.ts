export const baseButtonLink =
  "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg";

export const getLinksFromPost = (post: { data: any }) => {
  return [
    { key: "github", url: post.data.githubUrl },
    { key: "live", url: post.data.liveUrl },
    ...(post.data.otherLinks || []),
  ];
};

export const getClass = (key: string, isDayMode: boolean) => {
  switch (key) {
    case "github":
      return isDayMode
        ? "bg-gray-800 text-white hover:bg-gray-900"
        : "bg-gray-700 text-white hover:bg-gray-800";
    case "live":
      return isDayMode
        ? "bg-green-500 text-white hover:bg-green-600"
        : "bg-green-600 text-white hover:bg-green-500";
    case "read-more":
      return isDayMode
        ? "bg-purple-500 text-white hover:bg-purple-600"
        : "bg-purple-600 text-white hover:bg-purple-500";
    default:
      return isDayMode
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-blue-600 text-white hover:bg-blue-500";
  }
};

export const getSvgIcon = (key: string) => {
  // Return SVG markup as a string to avoid using JSX inside the <script setup lang="ts"> block.
  switch (key) {
    case "github":
      return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';

    case "live":
      return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>';
  }
  return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>';
};

export const getName = (key: string) => {
  if (key === "github") return "GitHub";
  if (key === "live") return "Live Demo";
  if (key === "read-more") return "Read More";
  return key
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
