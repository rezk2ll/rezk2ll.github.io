export const prerender = true;

const pages = ['/', '/resume'];

export function GET() {
	const urls = pages.map((p) => `<url><loc>https://ferjani.dev${p}</loc></url>`).join('');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
}
