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
      class="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-purple-500/30 shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🎨</span>
          <h2 class="text-2xl font-bold text-white pr-6">3D Model Credits</h2>
        </div>
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

      <!-- Description -->
      <div
        class="mb-6 p-4 rounded-xl backdrop-blur-sm border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
      >
        <p class="text-gray-300 text-sm leading-relaxed">
          All 3D models used in this portfolio are licensed under Creative
          Commons Attribution. We are grateful to the talented artists who
          created these amazing works and made them available to the community.
        </p>
      </div>

      <!-- Credits List -->
      <div class="space-y-4">
        <div
          v-for="(credit, index) in credits"
          :key="index"
          class="p-4 rounded-lg bg-slate-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-start justify-between gap-2">
              <h3
                class="font-semibold text-lg text-purple-400 hover:text-purple-300 underline transition-colors"
              >
                <a :href="credit.url" target="_blank" rel="noopener noreferrer">
                  {{ credit.name }}</a
                >
              </h3>
              <span
                class="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-medium whitespace-nowrap"
              >
                {{ credit.filename }}
              </span>
            </div>
            <p class="text-gray-400 text-sm">
              by
              {{ credit.author }}
            </p>
            <a
              :href="credit.licenseUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 text-xs hover:text-gray-400 transition-colors inline-flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clip-rule="evenodd"
                />
              </svg>
              Creative Commons Attribution License
            </a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-gray-700/50 text-center">
        <p class="text-gray-400 text-sm">
          Thank you to all the artists for their incredible work! ❤️
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Credit {
  name: string;
  url: string;
  author: string;
  licenseUrl: string;
  filename: string;
}

interface Props {
  visible: boolean;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();

const credits: Credit[] = [
  {
    name: "Book Open",
    url: "https://skfb.ly/6pMGN",
    author: "FlukierJupiter",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "book.glb",
  },
  {
    name: "Cauldron",
    url: "https://skfb.ly/oK7rG",
    author: "Darren McNerney 3D",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "cauldron.glb",
  },
  {
    name: "Glowing crystals",
    url: "https://skfb.ly/6TJ9A",
    author: "SusanKing",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "crystal.glb",
  },
  {
    name: "lectern",
    url: "https://skfb.ly/oLWPH",
    author: "distant_voices",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "lectern.glb",
  },
  {
    name: "Stylized Book Shelf",
    url: "https://skfb.ly/oKGuK",
    author: "Matias Herrera",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "book-shelf.glb",
  },
  {
    name: "Magic Circle",
    url: "https://skfb.ly/6vBGO",
    author: "Mondao_",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "magic-circle.glb",
  },
  {
    name: "Owl",
    url: "https://skfb.ly/ZGxT",
    author: "CamestrosFelapton",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "owl.glb",
  },
  {
    name: "Low Poly Magic Room",
    url: "https://skfb.ly/6YJpE",
    author: "yukumura",
    licenseUrl: "http://creativecommons.org/licenses/by/4.0/",
    filename: "room.glb",
  },
];
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
  transition: background 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.8);
}
</style>
