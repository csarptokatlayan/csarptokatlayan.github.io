import { getCollection, type CollectionEntry } from 'astro:content';

export type GameEntry = CollectionEntry<'games'>;
export type Theme = GameEntry['data']['theme'];

export interface Game extends GameEntry {
  /** Catalogue number, e.g. "CH-001". Given in order of release. */
  number: string;
  released: Date | undefined;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string | undefined): Date | undefined {
  return value && ISO_DATE.test(value) ? new Date(`${value}T00:00:00Z`) : undefined;
}

/**
 * All visible games, oldest first. Numbers follow release order, so a new
 * release always gets the next number. Undated games sort last.
 */
export async function getGames(): Promise<Game[]> {
  const entries = (await getCollection('games')).filter((g) => !g.data.hidden);
  const sorted = entries
    .map((g) => ({ ...g, released: parseDate(g.data.releaseDate) }))
    .sort((a, b) => {
      const ta = a.released?.getTime() ?? Infinity;
      const tb = b.released?.getTime() ?? Infinity;
      return ta - tb || a.id.localeCompare(b.id);
    });
  return sorted.map((g, i) => ({ ...g, number: `CH-${String(i + 1).padStart(3, '0')}` }));
}

/** The game for the home page: newest one marked "featured", else the newest. */
export function pickFeatured(games: Game[]): Game | undefined {
  const newestFirst = [...games].reverse();
  return newestFirst.find((g) => g.data.featured) ?? newestFirst[0];
}

/** CSS custom properties that paint a game's area in its own theme. */
export function themeStyle(theme: Theme): string {
  const c = theme.colors;
  const font = theme.font ? `'${theme.font.family}', var(--font-body)` : 'var(--font-display)';
  const body = theme.bodyFont ? `'${theme.bodyFont.family}', var(--font-body)` : theme.font ? font : 'var(--font-body)';
  return [
    `--g-bg:${c.background}`,
    `--g-surface:${c.surface}`,
    `--g-text:${c.text}`,
    `--g-muted:${c.muted}`,
    `--g-accent:${c.accent}`,
    `--g-accent-text:${c.accentText}`,
    `--g-highlight:${c.highlight ?? c.accent}`,
    `--g-font:${font}`,
    `--g-body:${body}`,
    `--g-radius:${theme.radius}px`,
    `--g-depth:${theme.depth}px`,
    `--g-tilt:${theme.tilt}deg`,
    `color-scheme:${theme.scheme}`,
  ].join(';');
}

/** Google Fonts stylesheet URL for a game's theme fonts, if it has any. */
export function themeFontUrl(theme: Theme): string | undefined {
  const fonts = [theme.font, theme.bodyFont].filter((f) => f !== undefined);
  if (fonts.length === 0) return undefined;
  const families = fonts.map((f) => {
    const weights = [...new Set(f.weights)].sort((a, b) => a - b).join(';');
    return `family=${f.family.trim().replace(/ /g, '+')}:wght@${weights}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

/** The swatches shown on a game's plate: its palette, before you open it. */
export function swatches(theme: Theme): string[] {
  const c = theme.colors;
  return [c.background, c.surface, c.accent, c.highlight, c.text].filter(Boolean) as string[];
}

export function youtubeId(value: string): string {
  const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : value;
}
