import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Metrimap Documentation',
  description: 'Comprehensive documentation for the Metrimap application',
  base: '/',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Product Requirements', link: '/prd/prd' },
      { text: 'Architecture', link: '/adr/' },
    ],

    sidebar: {
      '/prd/': [
        {
          text: 'Product Requirements',
          items: [
            { text: 'PRD', link: '/prd/prd' }
          ]
        }
      ],
      '/adr/': [
        {
          text: 'Architecture Decision Records',
          items: [
            { text: 'ADR-001: Scaffolding', link: '/adr/ADR-001%3A%20Scaffolding' },
            { text: 'ADR-002: Using Clerk for User Management', link: '/adr/ADR-002%3A%20Using%20Clerk%20for%20User%20Management' },
            { text: 'ADR-003: EditorJS for Text Editor', link: '/adr/ADR-003%3A%20EditorJS%20for%20Text%20Editor' },
            { text: 'ADR-004: Excalidraw for Whiteboarding', link: '/adr/ADR-004%3A%20Excalidraw%20for%20Whiteboarding' },
            { text: 'ADR-005: Realtime-js, WASM, and Websocket', link: '/adr/ADR-005%3A%20Realtime-js%2C%20WASM%2C%20and%20Websocket' },
            { text: 'ADR-006: Use Prisma + Zod', link: '/adr/ADR-006%3A%20Use%20Prisma%20%2B%20Zod' },
            { text: 'ADR-007: Adding XState', link: '/adr/ADR-007%3A%20Adding%20XState' },
            { text: 'ADR-008: Storybook.js', link: '/adr/ADR-008%3A%20Storybook.js' }
          ]
        }
      ],
      '/features/': [
        {
          text: 'Features',
          items: [
            { text: 'Userback Integration', link: '/features/USERBACK_INTEGRATION' },
            { text: 'Canvas Version History', link: '/features/CANVAS_VERSION_HISTORY' },
            { text: 'Source Page CRUD Implementation', link: '/features/SOURCE_PAGE_CRUD_IMPLEMENTATION' }
          ]
        }
      ],
      '/editor/': [
        {
          text: 'Editor',
          items: [
            { text: 'Draw Mode Architecture', link: '/editor/DRAW_MODE_ARCHITECTURE' },
            { text: 'Notebook Implementation', link: '/editor/NOTEBOOK_IMPLEMENTATION' },
            { text: 'EditorJS Fixes Summary', link: '/editor/EDITORJS_FIXES_SUMMARY' },
            { text: 'Block Conversion and Fullscreen Fixes', link: '/editor/BLOCK_CONVERSION_AND_FULLSCREEN_FIXES' },
            { text: 'EditorJS Error Analysis', link: '/editor/EDITORJS_ERROR_ANALYSIS' }
          ]
        }
      ],
      '/database/': [
        {
          text: 'Database',
          items: [
            { text: 'Prisma Zod Quick Reference', link: '/database/PRISMA_ZOD_QUICK_REFERENCE' },
            { text: 'RLS Solution Summary', link: '/database/RLS_SOLUTION_SUMMARY' },
            { text: 'Supabase Client Singleton', link: '/database/SUPABASE_CLIENT_SINGLETON' },
            { text: 'Team Guide Prisma Zod', link: '/database/TEAM_GUIDE_PRISMA_ZOD' },
            { text: 'Prisma Zod Integration Guide', link: '/database/PRISMA_ZOD_INTEGRATION_GUIDE' },
            { text: 'Prisma Zod Setup', link: '/database/PRISMA_ZOD_SETUP' },
            { text: 'RLS Testing Guide', link: '/database/RLS_TESTING_GUIDE' }
          ]
        }
      ],
      '/auth/': [
        {
          text: 'Authentication',
          items: [
            { text: 'Use Clerk with your Supabase project', link: '/auth/Use_Clerk_with_your_Supabase_project' },
            { text: 'Customize your session token', link: '/auth/Customize_your_session_token' },
            { text: 'Integrate Supabase with Clerk', link: '/auth/Integrate_Supabase_with_Clerk' }
          ]
        }
      ],
      '/environment/': [
        {
          text: 'Environment',
          items: [
            { text: 'Environment Guide', link: '/environment/ENVIRONMENT_GUIDE' },
            { text: 'Environment Secrets', link: '/environment/ENVIRONMENT_SECRETS' }
          ]
        }
      ],
      '/state-management/': [
        {
          text: 'State Management',
          items: [
            { text: 'XState Complete Guide', link: '/state-management/XSTATE_COMPLETE_GUIDE' }
          ]
        }
      ],
      '/refactoring/': [
        {
          text: 'Refactoring',
          items: [
            { text: 'Assets Page Refactoring', link: '/refactoring/ASSETS_PAGE_REFACTORING' },
            { text: 'Canvas Store Migration', link: '/refactoring/CANVAS_STORE_MIGRATION' }
          ]
        }
      ],
      '/tests/': [
        {
          text: 'Testing',
          items: [
            { text: 'Incremental Improvement', link: '/tests/incremental_improvement' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nadeemramli/metric-mapping' }
    ]
  }
})