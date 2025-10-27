# Architecture Overview

## Component Hierarchy

```
App.vue
│
└── Router
    │
    ├── MagicPortfolio (/) ─────────────────┐
    │   │                                    │
    │   ├── [3D Mode]                        │
    │   │   ├── AppHeader                    │
    │   │   ├── 3D Canvas                    │
    │   │   ├── Interactive Objects          │
    │   │   └── ContentModal ───────┐        │
    │   │       ├── SectionHeader    │        │
    │   │       └── Section Lists ───┼────────┼─┐
    │   │                            │        │ │
    │   └── [Minimalist Mode]        │        │ │
    │       ├── NavigationHeader     │        │ │
    │       └── Section Cards Grid   │        │ │
    │                                │        │ │
    ├── PostSection (/post/:schemaId)│        │ │
    │   ├── NavigationHeader         │        │ │
    │   ├── SectionHeader ───────────┤        │ │
    │   └── Section Lists ───────────┴────────┤ │
    │       ├── ProjectsList ─────────────────┼─┤
    │       ├── BlogPostsList ────────────────┼─┤
    │       ├── WIPList ──────────────────────┼─┤
    │       ├── CollaborationsList ───────────┼─┤
    │       ├── LearningPathsList ────────────┼─┤
    │       └── FunFactsList ─────────────────┼─┤
    │                                         │ │
    └── Post (/post/:schemaId/:postId)        │ │
        ├── NavigationHeader                  │ │
        ├── Post Content                      │ │
        └── BackButton                        │ │
                                              │ │
        Shared Components ────────────────────┴─┘
        ├── SectionHeader
        ├── ProjectsList
        ├── BlogPostsList
        ├── WIPList
        ├── CollaborationsList
        ├── LearningPathsList
        └── FunFactsList
```

## State Management Flow

```
┌─────────────────────────────────────────┐
│      useViewMode() Composable           │
│  (src/stores/viewModeStore.ts)          │
│                                         │
│  State:                                 │
│  - viewMode: "3d" | "minimalist"        │
│  - isDayMode: boolean                   │
│                                         │
│  Methods:                               │
│  - toggle3DMode()                       │
│  - toggleDayMode()                      │
│  - setViewMode()                        │
│  - setDayMode()                         │
└─────────────────────────────────────────┘
           │                │
           ▼                ▼
    ┌─────────────┐  ┌──────────────┐
    │ Magic       │  │ Navigation   │
    │ Portfolio   │  │ Header       │
    └─────────────┘  └──────────────┘
```

## Data Flow

```
User Action (Click Section)
        │
        ▼
┌───────────────────┐
│  Route Changes    │
│  /post/:schemaId  │
└───────────────────┘
        │
        ▼
┌───────────────────────────┐
│  PostSection Component    │
│  - Parses schemaId        │
│  - Looks up description   │
└───────────────────────────┘
        │
        ▼
┌───────────────────────────┐
│  apiWithCache Service     │
│  - Gets content by type   │
│  - Returns cached data    │
└───────────────────────────┘
        │
        ▼
┌───────────────────────────┐
│  Section Components       │
│  - Renders list items     │
│  - Applies styling        │
└───────────────────────────┘
        │
        ▼
┌───────────────────────────┐
│  User sees content        │
│  - Can click items        │
│  - Navigate to posts      │
└───────────────────────────┘
```

## Configuration System

```
┌──────────────────────────────────────────┐
│  sectionDescriptions.ts                  │
│                                          │
│  {                                       │
│    "project": {                          │
│      id, title, emoji,                   │
│      description, longDescription,       │
│      color: { from, to, accent }         │
│    },                                    │
│    "blog-post": { ... },                 │
│    ...                                   │
│  }                                       │
└──────────────────────────────────────────┘
           │
           ├─────────────────────────────────┐
           │                                 │
           ▼                                 ▼
    ┌──────────────┐                ┌──────────────┐
    │ SectionHeader│                │ Navigation   │
    │ - Gets emoji │                │ Header       │
    │ - Gets colors│                │ - Shows links│
    │ - Gets desc  │                │ - Highlights │
    └──────────────┘                └──────────────┘
           │                                 │
           ▼                                 ▼
    ┌──────────────┐                ┌──────────────┐
    │ ContentModal │                │ Homepage     │
    │ - Gets desc  │                │ - Shows cards│
    │ - Sets colors│                │ - Uses colors│
    └──────────────┘                └──────────────┘
```

## Route Structure

```
/
├── / (Home)
│   └── MagicPortfolio
│       ├── [3D Mode] Interactive scene
│       └── [Minimalist] Section cards
│
├── /post/:schemaId (Section Pages)
│   ├── /post/project
│   ├── /post/blog-post
│   ├── /post/work-in-progress
│   ├── /post/collaboration
│   ├── /post/learning-path
│   └── /post/fun-fact
│   └── PostSection Component
│       ├── NavigationHeader
│       ├── SectionHeader
│       └── Appropriate List Component
│
└── /post/:schemaId/:postId (Individual Posts)
    ├── /post/blog-post/post-1
    ├── /post/project/project-1
    └── Post Component
        ├── NavigationHeader
        ├── Post Content
        └── BackButton
```

## View Mode Comparison

```
┌─────────────────────────────────────────────────────────┐
│                     3D MODE                             │
├─────────────────────────────────────────────────────────┤
│  • AppHeader (minimalist style)                         │
│  • 3D Canvas with interactive objects                   │
│  • Floating animations                                  │
│  • Click objects → ContentModal                         │
│  • Hover hints                                          │
│  • Controls panel                                       │
│  • Magical effects                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 MINIMALIST MODE                         │
├─────────────────────────────────────────────────────────┤
│  • NavigationHeader (full navigation)                   │
│  • Grid of section cards                                │
│  • Click cards → Section pages                          │
│  • Traditional navigation                               │
│  • Clean, accessible design                             │
│  • No 3D rendering (performance boost)                  │
└─────────────────────────────────────────────────────────┘
```

## Component Props Flow

```
PostSection.vue
│
├── SectionHeader
│   ├── description: SectionDescription
│   └── isDayMode: boolean
│
└── [Section List Component]
    ├── items: ContentItem<T>[]
    ├── isDayMode: boolean
    └── @item-click: (item) => void

ContentModal.vue
│
├── SectionHeader (not shown, but description available)
│
└── [Section List Component]
    ├── items: ContentItem<T>[]
    ├── isDayMode: false (always dark)
    └── @item-click: (item) => void

NavigationHeader.vue
│
├── isDayMode: boolean
└── toggleDayNightMode: () => void
```

## Color Theme System

```
Each section has a gradient theme:

Projects:     Purple (#8b5cf6) → Pink (#ec4899)
Blog Posts:   Fuchsia (#d946ef) → Purple (#8b5cf6)
WIP:          Amber (#f59e0b) → Red (#ef4444)
Collaborations: Cyan (#06b6d4) → Blue (#3b82f6)
Learning:     Emerald (#10b981) → Teal (#14b8a6)
Fun Facts:    Rose (#f43f5e) → Pink (#ec4899)

Applied to:
- Section headers
- Card borders
- Hover effects
- Progress bars
- Button backgrounds
- Text gradients
```

## Responsive Breakpoints

```
Mobile (< 640px)
├── Single column layout
├── Hamburger menu
├── Stacked cards
└── Touch-optimized buttons

Tablet (640px - 1024px)
├── 2-column grid
├── Hamburger menu
├── Medium spacing
└── Touch-friendly

Desktop (> 1024px)
├── 3-column grid
├── Full navigation bar
├── Hover effects
└── Optimal spacing
```

## File Organization

```
src/
├── components/
│   ├── AppHeader.vue (3D mode only)
│   ├── BackButton.vue
│   ├── ContentModal.vue (updated)
│   ├── NavigationHeader.vue (NEW)
│   └── sections/ (NEW)
│       ├── index.ts
│       ├── SectionHeader.vue
│       ├── ProjectsList.vue
│       ├── BlogPostsList.vue
│       ├── WIPList.vue
│       ├── CollaborationsList.vue
│       ├── LearningPathsList.vue
│       └── FunFactsList.vue
│
├── config/ (NEW)
│   └── sectionDescriptions.ts
│
├── stores/
│   ├── cacheStore.ts
│   └── viewModeStore.ts (NEW)
│
├── scenes/
│   ├── index.ts (updated)
│   ├── MagicPortfolio.vue (updated)
│   ├── Post.vue (updated)
│   └── PostSection.vue (NEW)
│
├── router/
│   └── index.ts (updated)
│
├── services/
│   ├── api.ts
│   ├── apiWithCache.ts
│   └── core/
│
└── types/
    ├── index.ts
    └── 3d/
```

## Key Design Patterns Used

1. **Composition API**: For reactive state and lifecycle
2. **Composables**: For shared state (viewModeStore)
3. **Component Composition**: Reusable section components
4. **Configuration-Driven**: Central section descriptions
5. **Props/Events**: Parent-child communication
6. **Conditional Rendering**: Mode-based UI switching
7. **TypeScript Generics**: Type-safe content items
8. **Route Parameters**: Dynamic section routing
9. **Responsive Design**: Tailwind CSS utilities
10. **Progressive Enhancement**: 3D as enhancement, not requirement
