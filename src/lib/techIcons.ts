import {
	siAstro,
	siCapacitor,
	siClaude,
	siDrizzle,
	siGo,
	siGtk,
	siLinux,
	siMermaid,
	siMobx,
	siPocketbase,
	siPwa,
	siPython,
	siQwik,
	siReact,
	siRemix,
	siSvelte,
	siTailwindcss,
	siVala,
	siZod,
	type SimpleIcon
} from 'simple-icons';

export const techIcons: Record<string, SimpleIcon> = {
	SvelteKit: siSvelte,
	Svelte: siSvelte,
	'Svelte 5': siSvelte,
	PWA: siPwa,
	Mermaid: siMermaid,
	Vala: siVala,
	GTK: siGtk,
	Go: siGo,
	PocketBase: siPocketbase,
	TailwindCSS: siTailwindcss,
	Zod: siZod,
	'Claude Code': siClaude,
	Python: siPython,
	Drizzle: siDrizzle,
	Capacitor: siCapacitor,
	Astro: siAstro,
	MobX: siMobx,
	Remix: siRemix,
	Qwik: siQwik,
	React: siReact,
	Linux: siLinux
};

// Brand colors too dark for the near-black background fall back to the text color.
export function iconFill(hex: string) {
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return 0.299 * r + 0.587 * g + 0.114 * b < 60 ? '#a1a1aa' : `#${hex}`;
}
