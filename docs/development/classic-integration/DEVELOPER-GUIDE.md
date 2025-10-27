# Developer Guide: Adding New Content Sections

This guide explains how to add a new content section to the Magic Portfolio.

## Steps to Add a New Section

### 1. Define the Schema Type

Add your new schema type to `src/types/index.ts`:

```typescript
export type SchemaType =
  | "project"
  | "blog-post"
  | "work-in-progress"
  | "collaboration"
  | "learning-path"
  | "fun-fact"
  | "your-new-type"; // Add this

export interface YourNewType {
  // Define the structure of your content
  title: string;
  description: string;
  // ... other fields
}
```

### 2. Add Section Description

Add configuration in `src/config/sectionDescriptions.ts`:

```typescript
export const sectionDescriptions: Record<string, SectionDescription> = {
  // ... existing sections ...

  "your-new-type": {
    id: "your-new-type",
    title: "Your Section Title",
    emoji: "🎯", // Choose an emoji
    description: "Short description for cards",
    longDescription:
      "Longer description for the section page explaining what this section contains.",
    color: {
      from: "#yourColor1", // Gradient start
      to: "#yourColor2", // Gradient end
      accent: "#yourColor3", // Accent color for borders/glows
    },
  },
};
```

Also update the mapping functions:

```typescript
export function contentTypeToSchemaId(contentType: string): string {
  const mapping: Record<string, string> = {
    // ... existing mappings ...
    "your-content-type": "your-new-type",
  };
  return mapping[contentType] || contentType;
}

export function schemaIdToContentType(schemaId: string): string {
  const mapping: Record<string, string> = {
    // ... existing mappings ...
    "your-new-type": "your-content-type",
  };
  return mapping[schemaId] || schemaId;
}
```

### 3. Create a List Component

Create `src/components/sections/YourNewTypeList.vue`:

```vue
<template>
  <div class="your-list grid gap-4">
    <div
      v-for="item in items"
      :key="item.id"
      class="item-card rounded-lg p-6 border transition-all duration-300"
      :class="{
        'bg-white/90 border-gray-300 hover:shadow-lg': isDayMode,
        'bg-slate-800/70 border-purple-500/30 hover:shadow-2xl': !isDayMode,
      }"
    >
      <h3
        class="text-xl font-semibold mb-3"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ item.data.title }}
      </h3>
      <p
        class="text-sm"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ item.data.description }}
      </p>
      <!-- Add more content as needed -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, YourNewType } from "@/types";

defineProps<{
  items: ContentItem<YourNewType>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<YourNewType>];
}>();
</script>
```

Export it in `src/components/sections/index.ts`:

```typescript
export { default as YourNewTypeList } from "./YourNewTypeList.vue";
```

### 4. Update API Service

Add methods in `src/services/api.ts`:

```typescript
async getYourNewTypes(): Promise<ContentItem<YourNewType>[]> {
  return this.fetchApi<ContentItem<YourNewType>[]>("/your-endpoint");
}
```

And in `src/services/apiWithCache.ts`:

```typescript
async getYourNewTypes(useCache = true): Promise<ContentItem<YourNewType>[]> {
  if (useCache && this.isInitialized) {
    return cacheManager.getYourNewTypes();
  }
  return apiService.getYourNewTypes();
}
```

Update the `getByType` method to include your new type:

```typescript
async getByType(type: string, useCache = true): Promise<ContentItem<any>[]> {
  switch (type) {
    // ... existing cases ...
    case "your-content-type":
    case "your-new-type":
      content = await apiWithCache.getYourNewTypes(useCache);
      break;
    // ...
  }
  return content;
}
```

### 5. Update ContentModal

Add your list component to `src/components/ContentModal.vue`:

```vue
<template>
  <!-- ... existing content ... -->

  <!-- Your New Type -->
  <YourNewTypeList
    v-else-if="type === 'your-content-type'"
    :items="content"
    :isDayMode="false"
    @item-click="openPost"
  />
</template>

<script setup lang="ts">
// ... existing imports ...
import YourNewTypeList from "./sections/YourNewTypeList.vue";
</script>
```

### 6. Update PostSection

Add your list component to `src/scenes/PostSection.vue`:

```vue
<template>
  <!-- ... existing content ... -->

  <!-- Your New Type -->
  <YourNewTypeList
    v-else-if="schemaId === 'your-new-type'"
    :items="content"
    :isDayMode="isDayMode"
    @item-click="navigateToItem"
  />
</template>

<script setup lang="ts">
// ... existing imports ...
import YourNewTypeList from "@/components/sections/YourNewTypeList.vue";
</script>
```

### 7. Add 3D Object (Optional)

If you want a 3D object for your section, add it to `src/themes/wizard-lab/config/objects.ts`:

```typescript
{
  type: "your-object",
  contentType: "your-content-type",
  modelPath: "/assets/models/your-model.glb",
  position: [x, y, z],
  rotation: [rx, ry, rz],
  scale: scaleValue,
  animation: {
    // Configure animations
  },
}
```

### 8. Update Scene3DManager (Optional)

If adding to 3D scene, update the title mapping in `src/services/core/scene3DManager.ts`:

```typescript
getObjectTitle(contentType: string): string {
  switch (contentType) {
    // ... existing cases ...
    case "your-content-type":
      return "Your Section Title";
    default:
      return "Unknown";
  }
}
```

## Testing Your New Section

1. **Start the dev server**: `npm run dev`

2. **Test in 3D mode** (if applicable):

   - Click the 3D object
   - Verify ContentModal shows your content
   - Click "View Full Section"

3. **Test in minimalist mode**:

   - Click "Minimalist" button
   - Verify your section card appears
   - Click the card to view section page

4. **Test section page** (`/post/your-new-type`):

   - Verify header displays correctly
   - Verify list shows all items
   - Verify items are clickable (if applicable)
   - Test day/night mode toggle

5. **Test navigation**:
   - Navigate between sections
   - Verify active section highlighting
   - Test mobile menu

## Styling Guidelines

### Colors

- Use the color scheme defined in `sectionDescriptions.ts`
- Support both day and night modes
- Use Tailwind CSS classes for consistency

### Spacing

- Use consistent padding: `p-4`, `p-6`
- Use consistent gaps: `gap-4`, `gap-6`
- Use consistent margins: `mb-3`, `mb-4`

### Transitions

- Use `transition-all duration-300` for smooth animations
- Add hover effects: `hover:scale-105`, `hover:shadow-xl`

### Typography

- Use semantic heading sizes: `text-xl`, `text-2xl` for titles
- Use `font-semibold` or `font-bold` for emphasis
- Use smaller text for metadata: `text-sm`, `text-xs`

## Common Patterns

### Clickable Items

```vue
<div
  @click="$emit('item-click', item)"
  class="cursor-pointer hover:scale-[1.02] transition-all"
>
  <!-- content -->
</div>
```

### Status Badges

```vue
<span
  class="px-3 py-1 rounded-full text-xs font-medium"
  :class="getStatusClass(item.status)"
>
  {{ item.status }}
</span>
```

### Progress Bars

```vue
<div class="w-full h-2 rounded-full overflow-hidden bg-gray-700">
  <div
    class="h-2 rounded-full transition-all duration-300"
    :style="{ width: `${item.progress}%`, background: 'linear-gradient(...)' }"
  ></div>
</div>
```

### Tag Lists

```vue
<div class="flex flex-wrap gap-2">
  <span
    v-for="tag in item.tags"
    :key="tag"
    class="px-3 py-1 rounded-full text-xs font-medium"
  >
    {{ tag }}
  </span>
</div>
```

## Troubleshooting

### Section not appearing

- Check `sectionDescriptions.ts` is properly configured
- Verify the section is exported from components
- Check console for errors

### Colors not working

- Verify color values in hex format
- Check day/night mode conditional classes
- Ensure Tailwind config includes custom colors if needed

### Navigation not working

- Verify route is added to router
- Check schemaId matches in all mappings
- Verify component is imported correctly

## Best Practices

1. **Keep components focused**: Each list component should only handle rendering its specific type
2. **Use TypeScript**: Define proper interfaces for type safety
3. **Support both modes**: Always implement day/night mode styling
4. **Be responsive**: Test on mobile, tablet, and desktop
5. **Add loading states**: Handle loading and error states gracefully
6. **Document your code**: Add comments for complex logic
7. **Follow existing patterns**: Look at existing components for reference

## Need Help?

- Check existing section components for examples
- Review the NEW-FEATURES.md documentation
- Look at the type definitions in `src/types/index.ts`
- Check the console for TypeScript errors
