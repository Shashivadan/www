import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

import posts from './src/generated/posts.json' with { type: 'json' }

// Enumerate every content route so SSG prerenders static HTML for each post,
// category, and tag (crawlLinks also picks up whatever the homepage links to).
const prerenderPaths = [
  '/',
  '/blog',
  '/search',
  ...posts.map((p) => `/blog/${p.slug}`),
  ...[...new Set(posts.map((p) => p.category))].map((c) => `/category/${c}`),
  ...[...new Set(posts.flatMap((p) => p.tags))].map((t) => `/tag/${t}`),
]

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false },
      pages: prerenderPaths.map((path) => ({ path })),
    }),
    viteReact(),
  ],
})

export default config
