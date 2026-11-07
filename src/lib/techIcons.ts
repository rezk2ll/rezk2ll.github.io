// Brand colors too dark for the near-black background fall back to the text color.
export function iconFill(hex: string) {
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return 0.299 * r + 0.587 * g + 0.114 * b < 60 ? '#a1a1aa' : `#${hex}`;
}
