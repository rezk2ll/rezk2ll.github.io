import {
	siAstro,
	siCapacitor,
	siClaude,
	siDrizzle,
	siFreedesktopdotorg,
	siGo,
	siGtk,
	siHtml5,
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
	siZod
} from 'simple-icons';

type Icon = { hex: string; path: string };

// simple-icons has no logo for these, so they get plain glyphs in the 24x24 grid.
const bubbleTea: Icon = {
	hex: 'F25D94',
	path: 'M13.2 1h2.1l-1 6h-2.1zM4 7h16v2.2H4zM5.6 10.4h12.8l-1.5 11.7a1 1 0 0 1-1 .9H8.1a1 1 0 0 1-1-.9z'
};
const openWeatherMap: Icon = {
	hex: 'EB6E4B',
	path: 'M17.5 2.5a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6zM7 21.5h9.5a4 4 0 0 0 .5-8 5.6 5.6 0 0 0-10.9 1.4A3.3 3.3 0 0 0 7 21.5z'
};
const valtio: Icon = {
	hex: 'FF8F3F',
	path: 'M1.5 3h4.8L12 15.6 17.7 3h4.8L13.6 21h-3.2z'
};

export const techIcons: Record<string, Icon> = {
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
	Linux: siLinux,
	'D-Bus': siFreedesktopdotorg,
	Canvas: siHtml5,
	'Bubble Tea': bubbleTea,
	OpenWeatherMap: openWeatherMap,
	Valtio: valtio
};

// Brand colors too dark for the near-black background fall back to the text color.
export function iconFill(hex: string) {
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return 0.299 * r + 0.587 * g + 0.114 * b < 60 ? '#a1a1aa' : `#${hex}`;
}
