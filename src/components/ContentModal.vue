<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto border border-magic-500/30 shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white pr-6">
          {{ getTitle() }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div
          v-if="props.loading"
          class="flex flex-col items-center justify-center py-16"
        >
          <!-- Magical Loading Animation -->
          <div class="relative mb-16">
            <!-- Spinning magical circles -->
            <div
              class="w-16 h-16 border-4 border-magic-500/30 rounded-full animate-spin border-t-magic-500"
            ></div>
            <div
              class="absolute inset-0 w-16 h-16 border-4 border-mystical-500/30 rounded-full animate-spin-reverse border-b-mystical-500"
            ></div>

            <!-- Central magical core -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-4 h-4 bg-gradient-to-r from-magic-500 to-mystical-500 rounded-full animate-pulse"
              ></div>
            </div>

            <!-- Floating particles -->
            <div class="absolute -inset-8">
              <div
                class="absolute top-0 left-1/2 w-1 h-1 bg-magic-400 rounded-full animate-float-1"
              ></div>
              <div
                class="absolute top-1/2 right-0 w-1 h-1 bg-mystical-400 rounded-full animate-float-2"
              ></div>
              <div
                class="absolute bottom-0 left-1/2 w-1 h-1 bg-magic-400 rounded-full animate-float-3"
              ></div>
              <div
                class="absolute top-1/2 left-0 w-1 h-1 bg-mystical-400 rounded-full animate-float-4"
              ></div>
            </div>
          </div>

          <!-- Loading Text with Magical Effect -->
          <div class="text-center">
            <p class="text-gray-400 text-sm animate-pulse delay-150">
              Gathering magical knowledge from the ethereal realm
            </p>

            <!-- Progress dots -->
            <div class="flex justify-center space-x-1 mt-4">
              <div
                class="w-2 h-2 bg-magic-500 rounded-full animate-bounce"
              ></div>
              <div
                class="w-2 h-2 bg-magic-500 rounded-full animate-bounce delay-100"
              ></div>
              <div
                class="w-2 h-2 bg-magic-500 rounded-full animate-bounce delay-200"
              ></div>
            </div>
          </div>
        </div>

        <!-- Actual Content (when not loading) -->
        <div v-else>
          <!-- Projects -->
          <div v-if="type === 'projects'" class="grid gap-4 md:grid-cols-2">
            <div
              v-for="project in content"
              :key="project.metadata.id"
              class="bg-slate-800/50 rounded-lg p-4 border border-magic-500/20 hover:border-magic-500/40 transition-colors"
            >
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ project.data.title }}
              </h3>
              <p class="text-gray-300 mb-3">{{ project.data.description }}</p>

              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tech in project.data.technologies"
                  :key="tech"
                  class="px-2 py-1 bg-magic-500/20 text-magic-300 rounded text-sm"
                >
                  {{ tech }}
                </span>
              </div>

              <div class="flex gap-2">
                <a
                  v-if="project.data.githubUrl"
                  :href="project.data.githubUrl"
                  target="_blank"
                  class="px-3 py-1 bg-magic-600 hover:bg-magic-700 text-white rounded transition-colors text-sm"
                >
                  GitHub
                </a>
                <a
                  v-if="project.data.liveUrl"
                  :href="project.data.liveUrl"
                  target="_blank"
                  class="px-3 py-1 bg-mystical-600 hover:bg-mystical-700 text-white rounded transition-colors text-sm"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>

          <!-- Blog Posts -->
          <div v-else-if="type === 'blog'" class="space-y-4">
            <div
              v-for="post in content"
              :key="post.metadata.id"
              class="bg-slate-800/50 rounded-lg p-4 border border-magic-500/20 cursor-pointer hover:border-magic-500/40 transition-colors"
              @click="openPost(post)"
            >
              <div class="flex items-start space-x-4">
                <img
                  :src="post.data.header.image.thumbnailUrl"
                  alt="Thumbnail"
                  width="150"
                  height="150"
                />
                <div>
                  <h3 class="text-lg font-semibold text-white mb-2">
                    {{ post.data.header.title }}
                  </h3>
                  <p class="text-gray-300 mb-3">
                    {{ post.data.header.excerpt }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tag in post.data.header.tags"
                  :key="tag"
                  class="px-2 py-1 bg-mystical-500/20 text-mystical-300 rounded text-sm"
                >
                  {{ tag }}
                </span>
              </div>

              <p class="text-gray-400 text-sm">
                Updated: {{ formatDate(post.metadata.updatedAt) }}
              </p>
            </div>
          </div>

          <!-- Work in Progress -->
          <div v-else-if="type === 'wip'" class="space-y-4">
            <div
              v-for="item in content"
              :key="item.metadata.id"
              class="bg-slate-800/50 rounded-lg p-4 border border-magic-500/20"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-white">
                  {{ item.data.title }}
                </h3>
                <span
                  class="px-2 py-1 rounded text-sm"
                  :class="getPriorityClass(item.data.priority)"
                >
                  {{ item.data.priority }}
                </span>
              </div>

              <p class="text-gray-300 mb-3">{{ item.data.description }}</p>

              <div class="mb-3">
                <div class="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{{ item.data.progress }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-magic-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${item.data.progress}%` }"
                  ></div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in item.data.technologies"
                  :key="tech"
                  class="px-2 py-1 bg-magic-500/20 text-magic-300 rounded text-sm"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>

          <!-- Collaborations -->
          <div v-else-if="type === 'collaborations'" class="space-y-4">
            <div
              v-for="collab in content"
              :key="collab.metadata.id"
              class="bg-slate-800/50 rounded-lg p-4 border border-magic-500/20"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-white">
                  {{ collab.data.title }}
                </h3>
                <span
                  class="px-2 py-1 rounded text-sm"
                  :class="getStatusClass(collab.data.status)"
                >
                  {{ collab.data.status }}
                </span>
              </div>

              <p class="text-gray-300 mb-3">{{ collab.data.description }}</p>

              <div class="mb-3">
                <p class="text-gray-400 text-sm mb-2">Collaborators:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="collaborator in collab.data.collaborators"
                    :key="collaborator"
                    class="px-2 py-1 bg-mystical-500/20 text-mystical-300 rounded text-sm"
                  >
                    {{ collaborator }}
                  </span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in collab.data.technologies"
                  :key="tech"
                  class="px-2 py-1 bg-magic-500/20 text-magic-300 rounded text-sm"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>

          <!-- Learning Paths -->
          <div v-else-if="type === 'learning'" class="space-y-4">
            <div
              v-for="path in content"
              :key="path.metadata.id"
              class="bg-slate-800/50 rounded-lg p-4 border border-magic-500/20"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-white">
                  {{ path.data.title }}
                </h3>
                <span
                  class="px-2 py-1 rounded text-sm"
                  :class="getDifficultyClass(path.data.difficulty)"
                >
                  {{ path.data.difficulty }}
                </span>
              </div>

              <p class="text-gray-300 mb-3">{{ path.data.description }}</p>
              <p class="text-gray-400 text-sm mb-3">
                Category: {{ path.data.category }}
              </p>

              <div class="mb-3">
                <div class="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{{ path.data.progress }}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-mystical-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${path.data.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fun Facts -->
          <div
            v-else-if="type === 'fun-facts'"
            class="grid gap-4 md:grid-cols-2"
          >
            <div
              v-for="fact in content"
              :key="fact.metadata.id"
              class="bg-slate-800/50 rounded-lg p-4 border border-magic-500/20"
            >
              <p class="text-gray-300 mb-3">{{ fact.data.content }}</p>
              <span
                class="px-2 py-1 rounded text-sm"
                :class="getCategoryClass(fact.data.category)"
              >
                {{ fact.data.category }}
              </span>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="!loading && (!content || content.length === 0)"
            class="text-center py-8"
          >
            <div class="text-gray-400 mb-2">
              <svg
                class="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <p class="text-gray-400">No content available yet</p>
            <p class="text-gray-500 text-sm mt-1">
              Check back later for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";

interface Props {
  visible: boolean;
  content: ContentItem<any>[];
  type: string;
  loading?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const getTitle = () => {
  const titles = {
    projects: "🔮 Projects",
    wip: "⚗️ Work in Progress",
    blog: "📖 Blog Posts",
    collaborations: "🔮 Collaborations",
    learning: "📚 Learning Paths",
    "fun-facts": "🦉 Fun Facts",
  };
  return titles[props.type as keyof typeof titles] || props.type;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const getPriorityClass = (priority: string) => {
  const classes = {
    low: "bg-green-500/20 text-green-300",
    medium: "bg-yellow-500/20 text-yellow-300",
    high: "bg-red-500/20 text-red-300",
  };
  return (
    classes[priority as keyof typeof classes] || "bg-gray-500/20 text-gray-300"
  );
};

const getStatusClass = (status: string) => {
  const classes = {
    planning: "bg-blue-500/20 text-blue-300",
    active: "bg-green-500/20 text-green-300",
    completed: "bg-purple-500/20 text-purple-300",
    paused: "bg-yellow-500/20 text-yellow-300",
  };
  return (
    classes[status as keyof typeof classes] || "bg-gray-500/20 text-gray-300"
  );
};

const getDifficultyClass = (difficulty: string) => {
  const classes = {
    beginner: "bg-green-500/20 text-green-300",
    intermediate: "bg-yellow-500/20 text-yellow-300",
    advanced: "bg-red-500/20 text-red-300",
  };
  return (
    classes[difficulty as keyof typeof classes] ||
    "bg-gray-500/20 text-gray-300"
  );
};

const getCategoryClass = (category: string) => {
  const classes = {
    personal: "bg-pink-500/20 text-pink-300",
    technical: "bg-blue-500/20 text-blue-300",
    random: "bg-purple-500/20 text-purple-300",
  };
  return (
    classes[category as keyof typeof classes] || "bg-gray-500/20 text-gray-300"
  );
};

const openPost = <T>(post: ContentItem<T>) => {
  // TODO open the post in the same tab with all the context of the post (full .data)
  window.location.href = `/post/${post.schemaId}/${post.metadata.id}`;
};
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.8);
}

/* Magical Loading Animations */
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-reverse {
  animation: spin-reverse 1.5s linear infinite;
}

/* Floating particles animations */
@keyframes float-1 {
  0%,
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes float-2 {
  0%,
  100% {
    transform: translate(0, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(20px, -50%) scale(1.2);
    opacity: 1;
  }
}

@keyframes float-3 {
  0%,
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, 20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes float-4 {
  0%,
  100% {
    transform: translate(0, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-20px, -50%) scale(1.2);
    opacity: 1;
  }
}

.animate-float-1 {
  animation: float-1 2s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 2.2s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 2.4s ease-in-out infinite;
}

.animate-float-4 {
  animation: float-4 2.6s ease-in-out infinite;
}

/* Enhanced magical glow for loading */
.animate-pulse {
  animation: magical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes magical-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

/* Bounce delay animations */
.delay-100 {
  animation-delay: 0.1s;
}

.delay-150 {
  animation-delay: 0.15s;
}

.delay-200 {
  animation-delay: 0.2s;
}
</style>
