import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A text field can be a plain string (English) or one string per language:
// "Penguin Math Race"  or  { "en": "Penguin Math Race", "tr": "Penguen Matematik Yarışı" }
const text = z.union([z.string(), z.record(z.string(), z.string())]);

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex colour like "#1B2A44"');

const ambientLayer = z.object({
  type: z.enum(['snow', 'glyphs', 'embers', 'dust']),
  density: z.number().min(0).max(3).default(1),
  speed: z.number().min(0).max(3).default(1),
  colors: z.array(hex).optional(),
  glyphs: z.array(z.string()).optional(),
});

const themeFont = z.object({
  family: z.string(),
  weights: z.array(z.number()).default([400, 700]),
});

const games = defineCollection({
  // Every folder in /games with a game.json is a game. The folder name is the URL.
  loader: glob({
    pattern: '*/game.json',
    base: './games',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: text,
      tagline: text,
      description: text,
      genre: text,
      platforms: z.array(z.string()).min(1),
      releaseDate: z.string().optional(),
      featured: z.boolean().default(false),
      hidden: z.boolean().default(false),

      stores: z
        .array(
          z.object({
            store: z.enum(['google-play', 'app-store', 'steam', 'itch', 'epic', 'web', 'other']),
            url: z.url(),
            label: text.optional(),
          }),
        )
        .default([]),
      trailer: z.object({ youtube: z.string() }).optional(),
      links: z.array(z.object({ label: text, url: z.string() })).default([]),

      cover: image(),
      coverAlt: text,
      icon: image().optional(),
      screenshots: z.array(z.object({ src: image(), alt: text })).default([]),

      theme: z.object({
        scheme: z.enum(['light', 'dark']).default('light'),
        colors: z.object({
          background: hex,
          surface: hex,
          text: hex,
          muted: hex,
          accent: hex,
          accentText: hex,
          highlight: hex.optional(),
        }),
        // Headings and buttons. Any Google Fonts family name.
        font: themeFont.optional(),
        // Paragraphs. Leave out to use `font` for everything.
        bodyFont: themeFont.optional(),
        radius: z.number().min(0).max(40).default(8),
        depth: z.number().min(0).max(12).default(0),
        tilt: z.number().min(-6).max(6).default(0),
        ambient: z.array(ambientLayer).default([]),
      }),
    }),
});

export const collections = { games };
