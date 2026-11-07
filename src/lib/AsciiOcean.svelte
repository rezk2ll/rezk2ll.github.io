<script lang="ts">
	import { onMount } from 'svelte';

	let { titleEl, fill = '' }: { titleEl?: HTMLElement; fill?: string } = $props();

	const TA = 5;
	const TB = 6;
	const TC = 7;
	const RIP = 8;
	const BUB = 9;
	const GL = 10;
	const N_COLORS = 11;

	const THEMES = [
		{
			bg: '#04070c',
			colors: [
				'#0b1c29',
				'#112b3d',
				'#1a3c53',
				'#265873',
				'#3f86a2',
				'#f0faff',
				'#7dd3fc',
				'#c4b5fd',
				'#9be3f5',
				'#5fa6bb',
				'#e9d5ff'
			]
		},
		{
			bg: '#f2eee3',
			colors: [
				'#e6e1d4',
				'#dcd5c4',
				'#cdc6b1',
				'#adbab4',
				'#7a9ea4',
				'#0b2a38',
				'#0369a1',
				'#7c3aed',
				'#2c6c7e',
				'#4f8593',
				'#7c3aed'
			]
		}
	];

	const WATER = ' .,-~:;=';
	const RIPPLE = '.-~=+oO@';
	const TILE_GLYPHS = '@%#*+=-:.';
	const PHOTOS = ['/koi/kohaku.png', '/koi/ogon.png'];
	const DENSE = '%&8#@';
	const GLITCH = '#$%&@!?/\\<>{}[]*+=';
	// Title edge glyph for each 2x2 coverage pattern, bits TL TR BL BR.
	const QUAD = ' .,_\']//`\\[\\"\\/ ';
	const SEGS = 15;
	const KOI_SLICES = 12;
	const MASK_SCALE = 0.5;

	type Koi = {
		nodes: { x: number; y: number }[];
		a: number;
		len: number;
		speed: number;
		phase: number;
		wander: number;
		kind: number;
		seed: number;
		fear: number;
		fx: number;
		fy: number;
	};
	type Bubble = { x: number; y: number; vy: number; age: number; seed: number };

	let canvas: HTMLCanvasElement;
	let side = 0;
	let sweep = { from: 0, to: 0, x: 0, y: 0, start: -1e9 };
	let drops: [number, number, number][] = [];
	let redraw: (() => void) | null = null;

	export function ripple(x: number, y: number, strength = 1) {
		if (drops.length < 16) drops.push([x, y, strength]);
	}

	// The new theme is written over the old one by a ring of glitch glyphs growing from (x, y).
	export function setTheme(light: boolean, x = 0, y = 0, instant = false) {
		const next = light ? 1 : 0;
		sweep = { from: side, to: next, x, y, start: instant ? -1e9 : performance.now() };
		side = next;
		redraw?.();
	}

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const fillText = fill.replace(/\s+/g, '').toLowerCase() || '#';
		const colors = THEMES.flatMap((t) => t.colors);

		let w = 0;
		let h = 0;
		let dpr = 1;
		let fontPx = 13;
		let font = '';
		let tile = 8;
		let tileFont = '';
		const photos: HTMLImageElement[] = [];
		const layer = document.createElement('canvas');
		const lctx = layer.getContext('2d', { willReadFrequently: true })!;
		const tones: Record<number, string> = {};
		let cw = 8;
		let ch = 16;
		let cols = 0;
		let rows = 0;
		let chr = new Uint16Array(0);
		let ids = new Uint8Array(0);
		let cur = new Float32Array(0);
		let prev = new Float32Array(0);
		const kx = 0.4;
		let ky = 0.1;
		let mask = new Uint8Array(0);
		let mw = 0;
		let mh = 0;
		let mx = -1e5;
		let my = -1e5;
		let lastMove = 0;
		const fish: Koi[] = [];
		const bubbles: Bubble[] = [];

		function buildMask() {
			if (!titleEl) return;
			const r = titleEl.getBoundingClientRect();
			const cs = getComputedStyle(titleEl);
			mw = Math.max(1, Math.ceil(r.width * MASK_SCALE));
			mh = Math.max(1, Math.ceil(r.height * MASK_SCALE));
			const off = document.createElement('canvas');
			off.width = mw;
			off.height = mh;
			const o = off.getContext('2d', { willReadFrequently: true })!;
			o.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * MASK_SCALE}px ${cs.fontFamily}`;
			o.letterSpacing = `${(parseFloat(cs.letterSpacing) || 0) * MASK_SCALE}px`;
			o.textAlign = 'center';
			o.textBaseline = 'middle';
			o.fillText(titleEl.textContent?.trim() ?? '', mw / 2, mh / 2);
			const d = o.getImageData(0, 0, mw, mh).data;
			mask = new Uint8Array(mw * mh);
			for (let i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3];
		}

		function makeKoi(): Koi {
			const len = (w < 640 ? 170 : 260) + Math.random() * 110;
			const a = Math.random() * Math.PI * 2;
			const x = Math.random() * w;
			const y = Math.random() * h;
			const seg = len / SEGS;
			return {
				nodes: Array.from({ length: SEGS + 1 }, (_, i) => ({
					x: x - Math.cos(a) * seg * i,
					y: y - Math.sin(a) * seg * i
				})),
				a,
				len,
				speed: 26 + Math.random() * 22,
				phase: Math.random() * 10,
				wander: 0,
				kind: Math.random() < 0.75 ? 0 : 1,
				seed: Math.random() * 100,
				fear: 0,
				fx: 0,
				fy: 0
			};
		}

		function layout() {
			w = innerWidth;
			h = innerHeight;
			dpr = Math.min(devicePixelRatio || 1, 2);
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			fontPx = w < 640 ? 10 : w < 1200 ? 12 : 13;
			font = `500 ${fontPx}px "JetBrains Mono Variable", ui-monospace, Menlo, monospace`;
			ctx.font = font;
			// Programming ligatures would fuse "==" or "->" into one glyph and break the grid.
			ctx.textRendering = 'optimizeSpeed';
			ctx.letterSpacing = '0.01px';
			cw = ctx.measureText('M').width;
			ch = Math.round(fontPx * 1.25);
			tile = Math.max(6, Math.round(cw));
			layer.width = Math.ceil(w / tile);
			layer.height = Math.ceil(h / tile);
			tileFont = `800 ${Math.round(tile * 0.9)}px "JetBrains Mono Variable", ui-monospace, monospace`;
			cols = Math.ceil(w / cw) + 1;
			rows = Math.ceil(h / ch) + 1;
			chr = new Uint16Array(cols * rows);
			ids = new Uint8Array(cols * rows);
			cur = new Float32Array(cols * rows);
			prev = new Float32Array(cols * rows);
			ky = 0.4 * (cw / ch) ** 2;
			buildMask();
			const want = Math.max(3, Math.min(6, Math.round((w * h) / 220000)));
			while (fish.length < want) fish.push(makeKoi());
			fish.length = want;
		}

		const angleTo = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

		function updateFish(dt: number, now: number) {
			const idle = now - lastMove > 1200 && mx > -1e4;
			for (const f of fish) {
				const head = f.nodes[0];
				f.wander = Math.max(-0.8, Math.min(0.8, f.wander * 0.99 + (Math.random() - 0.5) * dt * 3));
				let steer = f.wander;
				const m = 70;
				if (head.x < m || head.x > w - m || head.y < m || head.y > h - m) {
					steer += angleTo(Math.atan2(h / 2 - head.y, w / 2 - head.x), f.a) * 1.8;
				}
				for (const o of fish) {
					if (o === f) continue;
					const dx = head.x - o.nodes[0].x;
					const dy = head.y - o.nodes[0].y;
					const d = Math.hypot(dx, dy);
					if (d < 170) steer += angleTo(Math.atan2(dy, dx), f.a) * 0.6 * (1 - d / 170);
				}
				let speed = f.speed;
				if (idle) {
					const d = Math.hypot(mx - head.x, my - head.y);
					if (d < 450 && d > 80) steer += angleTo(Math.atan2(my - head.y, mx - head.x), f.a) * 0.7;
					if (d < 160) speed *= 0.6;
				}
				if (f.fear > 0.02) {
					steer += angleTo(Math.atan2(head.y - f.fy, head.x - f.fx), f.a) * 4 * f.fear;
					speed *= 1 + 3.5 * f.fear;
					f.fear *= Math.exp(-dt * 1.3);
				}
				f.a += Math.max(-1.6, Math.min(1.6, steer)) * dt;
				f.phase += dt * (4 + speed * 0.05);
				const dir = f.a + Math.sin(f.phase) * 0.14;
				head.x += Math.cos(dir) * speed * dt;
				head.y += Math.sin(dir) * speed * dt;
				const seg = f.len / SEGS;
				for (let i = 1; i <= SEGS; i++) {
					const p = f.nodes[i];
					const q = f.nodes[i - 1];
					const dx = p.x - q.x;
					const dy = p.y - q.y;
					const d = Math.hypot(dx, dy) || 1;
					p.x = q.x + (dx / d) * seg;
					p.y = q.y + (dy / d) * seg;
				}
				if (Math.random() < dt * 0.06) {
					bubbles.push({
						x: head.x,
						y: head.y,
						vy: 18 + Math.random() * 14,
						age: 0,
						seed: Math.random() * 9
					});
				}
			}
			if (Math.random() < dt * 0.5) {
				bubbles.push({
					x: Math.random() * w,
					y: h + 10,
					vy: 22 + Math.random() * 26,
					age: 0,
					seed: Math.random() * 9
				});
			}
			for (let i = bubbles.length - 1; i >= 0; i--) {
				const b = bubbles[i];
				b.age += dt;
				b.y -= b.vy * dt;
				b.x += Math.sin(b.age * 2.2 + b.seed) * 10 * dt;
				if (b.y < -10 || b.age > 14) bubbles.splice(i, 1);
			}
		}

		function stepRipples() {
			for (const [x, y, s] of drops) {
				const c0 = Math.round(x / cw);
				const r0 = Math.round(y / ch);
				for (let r = r0 - 3; r <= r0 + 3; r++) {
					for (let c = c0 - 5; c <= c0 + 5; c++) {
						if (r < 1 || c < 1 || r >= rows - 1 || c >= cols - 1) continue;
						const d = Math.hypot((c - c0) * cw, (r - r0) * ch) / 28;
						if (d < 1) cur[r * cols + c] += (0.5 + Math.cos(d * Math.PI) * 0.5) * 2.4 * s;
					}
				}
			}
			drops = [];
			for (let r = 1; r < rows - 1; r++) {
				for (let c = 1, i = r * cols + 1; c < cols - 1; c++, i++) {
					const v = cur[i];
					prev[i] =
						(2 * v -
							prev[i] +
							kx * (cur[i - 1] + cur[i + 1] - 2 * v) +
							ky * (cur[i - cols] + cur[i + cols] - 2 * v)) *
						0.985;
				}
			}
			const t = cur;
			cur = prev;
			prev = t;
		}

		PHOTOS.forEach((src, k) => {
			const img = new Image();
			img.onload = () => {
				photos[k] = img;
				redraw?.();
			};
			img.src = src;
		});

		function tone(r: number, g: number, b: number) {
			const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
			return (tones[key] ??= `rgb(${(r >> 3) << 3},${(g >> 3) << 3},${(b >> 3) << 3})`);
		}

		function spineAt(f: Koi, t: number) {
			const k = Math.min(SEGS - 1, Math.floor(t * SEGS));
			const u = t * SEGS - k;
			const a = f.nodes[k];
			const b = f.nodes[k + 1];
			return {
				x: a.x + (b.x - a.x) * u,
				y: a.y + (b.y - a.y) * u,
				angle: Math.atan2(a.y - b.y, a.x - b.x)
			};
		}

		// Each photo is drawn in slices along its koi's spine onto a canvas with one pixel per tile,
		// so the body bends without folding. That canvas is then read back and painted as glyph tiles.
		// The photo's head is on the right, so slice 0 (at the head) is its rightmost strip.
		function drawKoi(t: number) {
			lctx.setTransform(1, 0, 0, 1, 0, 0);
			lctx.clearRect(0, 0, layer.width, layer.height);
			for (const f of fish) {
				const img = photos[f.kind];
				if (!img) continue;
				const len = f.len / tile;
				const height = (len * img.height) / img.width;
				const slice = len / KOI_SLICES;
				const sw = img.width / KOI_SLICES;
				for (let i = 0; i < KOI_SLICES; i++) {
					const s = spineAt(f, (i + 0.5) / KOI_SLICES);
					lctx.setTransform(1, 0, 0, 1, s.x / tile, s.y / tile);
					lctx.rotate(s.angle);
					lctx.drawImage(
						img,
						img.width - (i + 1) * sw,
						0,
						sw,
						img.height,
						-slice / 2 - 0.4,
						-height / 2,
						slice + 0.8,
						height
					);
				}
			}
			const data = lctx.getImageData(0, 0, layer.width, layer.height).data;
			const glyphs: number[] = [];
			const glint = 1.12 + 0.08 * Math.sin(t * 2);
			for (let ty = 0; ty < layer.height; ty++) {
				for (let tx = 0; tx < layer.width; tx++) {
					const idx = (ty * layer.width + tx) * 4;
					if (data[idx + 3] < 150) continue;
					const r = Math.min(255, data[idx] * glint + 14);
					const g = Math.min(255, data[idx + 1] * glint + 14);
					const b = Math.min(255, data[idx + 2] * glint + 14);
					ctx.fillStyle = tone(r, g, b);
					ctx.fillRect(tx * tile + 0.5, ty * tile + 0.5, tile - 1, tile - 1);
					const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
					glyphs.push(tx, ty, Math.min(TILE_GLYPHS.length - 1, (lum * TILE_GLYPHS.length) | 0));
				}
			}
			ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
			for (let i = 0; i < glyphs.length; i += 3) {
				ctx.fillText(
					TILE_GLYPHS[glyphs[i + 2]],
					glyphs[i] * tile + tile / 2,
					glyphs[i + 1] * tile + tile / 2
				);
			}
		}

		function put(c: number, r: number, code: number, id: number) {
			if (c < 0 || r < 0 || c >= cols || r >= rows) return;
			chr[r * cols + c] = code;
			ids[r * cols + c] = id;
		}

		function render(t: number, now: number) {
			const R2 = 150 * 150;
			for (let r = 0; r < rows; r++) {
				const y = r * ch;
				const depth = 0.55 + 0.45 * (1 - y / h);
				for (let c = 0, i = r * cols; c < cols; c++, i++) {
					const x = c * cw;
					const v =
						Math.sin(x * 0.011 + t * 0.42) +
						Math.sin(y * 0.017 - t * 0.33 + x * 0.004) +
						Math.sin((x - y) * 0.008 + t * 0.6);
					let l = Math.max(0, 1 - Math.abs(v) * 0.5);
					l = l * l * l;
					l = l * l;
					l += ((((c * 73856093) ^ (r * 19349663)) & 255) / 255 - 0.5) * 0.12;
					l *= depth;
					const dx = x - mx;
					const dy = y - my;
					const d2 = dx * dx + dy * dy;
					if (d2 < R2) {
						const g = 1 - d2 / R2;
						l += g * g * 0.55;
					}
					const a = Math.abs(cur[i]);
					if (a > 0.18) {
						chr[i] = RIPPLE.charCodeAt(Math.min(7, Math.floor(a * 4)));
						ids[i] = a > 0.5 ? RIP : 4;
						continue;
					}
					l += a * 0.6;
					const lv = Math.max(0, Math.min(WATER.length - 1, Math.floor(l * WATER.length)));
					chr[i] = WATER.charCodeAt(lv);
					ids[i] = Math.min(4, Math.max(0, lv - 1));
				}
			}

			// Below 640px the grid is too coarse to spell the title, so the page keeps its text title.
			if (titleEl && mask.length && w >= 640) {
				const rect = titleEl.getBoundingClientRect();
				if (rect.bottom > 0 && rect.top < h) {
					const at = (x: number, y: number) => {
						const u = ((x - rect.left) * MASK_SCALE) | 0;
						const v = ((y - rect.top) * MASK_SCALE) | 0;
						return u >= 0 && v >= 0 && u < mw && v < mh && mask[v * mw + u] > 110 ? 1 : 0;
					};
					const r0 = Math.max(1, Math.floor(rect.top / ch) - 1);
					const r1 = Math.min(rows - 2, Math.ceil(rect.bottom / ch) + 1);
					const c0 = Math.max(1, Math.floor(rect.left / cw) - 1);
					const c1 = Math.min(cols - 2, Math.ceil(rect.right / cw) + 1);
					for (let r = r0; r <= r1; r++) {
						const cy = r * ch + ch / 2;
						for (let c = c0; c <= c1; c++) {
							const cx = c * cw + cw / 2;
							const i = r * cols + c;
							const ox = Math.sin(cy * 0.05 + t * 1.4) * 2.2 + (cur[i + 1] - cur[i - 1]) * 26;
							const oy = Math.sin(cx * 0.02 + t * 0.9) * 1.6 + (cur[i + cols] - cur[i - cols]) * 26;
							const qx = cw / 4;
							const qy = ch / 4;
							const bits =
								(at(cx - qx + ox, cy - qy + oy) << 3) |
								(at(cx + qx + ox, cy - qy + oy) << 2) |
								(at(cx - qx + ox, cy + qy + oy) << 1) |
								at(cx + qx + ox, cy + qy + oy);
							if (!bits) continue;
							if (bits === 15) {
								// A diagonal band sweeps through the letters, spelling the project names as it passes.
								const band = (((c + r * 2 - t * 18) % 70) + 70) % 70;
								if (band < 6) {
									chr[i] = fillText.charCodeAt((c + r * 3) % fillText.length);
									ids[i] = TC;
								} else {
									const n = Math.sin(c * 0.9 + t * 1.6) + Math.sin(r * 1.7 - t * 1.1);
									chr[i] = DENSE.charCodeAt(Math.floor((n + 2) * 1.249));
									ids[i] = Math.sin(cx * 0.005 - t * 0.6) > 0 ? TA : TB;
								}
							} else {
								chr[i] = QUAD.charCodeAt(bits);
								ids[i] = TA;
							}
						}
					}
				}
			}

			for (const b of bubbles) {
				const code = b.age < 1.5 ? 46 : b.age < 5 ? 111 : 79;
				put(Math.floor(b.x / cw), Math.floor(b.y / ch), code, BUB);
			}

			const elapsed = now - sweep.start;
			const sweeping = elapsed < 1100;
			const maxD = Math.max(
				Math.hypot(sweep.x, sweep.y),
				Math.hypot(w - sweep.x, sweep.y),
				Math.hypot(sweep.x, h - sweep.y),
				Math.hypot(w - sweep.x, h - sweep.y)
			);
			const radius = (elapsed / 1100) * maxD;

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.fillStyle = THEMES[sweeping ? sweep.from : side].bg;
			ctx.fillRect(0, 0, w, h);
			if (sweeping) {
				ctx.fillStyle = THEMES[sweep.to].bg;
				ctx.beginPath();
				ctx.arc(sweep.x, sweep.y, Math.max(0, radius), 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.font = font;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			const dy = (ch - fontPx) / 2;
			const flush = (run: string, key: number, c: number, r: number) => {
				ctx.fillStyle = colors[key];
				ctx.fillText(run, c * cw, r * ch + dy);
			};
			for (let r = 0; r < rows; r++) {
				let run = '';
				let runKey = -1;
				let start = 0;
				const y = r * ch + ch / 2;
				for (let c = 0, i = r * cols; c < cols; c++, i++) {
					let code = chr[i];
					let id = ids[i];
					let s = side;
					if (sweeping) {
						const d = Math.hypot(c * cw + cw / 2 - sweep.x, y - sweep.y);
						s = d < radius ? sweep.to : sweep.from;
						if (Math.abs(d - radius) < 28) {
							code = GLITCH.charCodeAt((Math.random() * GLITCH.length) | 0);
							id = GL;
							s = sweep.to;
						}
					}
					if (code === 32) {
						if (runKey >= 0) run += ' ';
						continue;
					}
					const key = s * N_COLORS + id;
					if (key !== runKey) {
						if (runKey >= 0) flush(run, runKey, start, r);
						runKey = key;
						start = c;
						run = '';
					}
					run += String.fromCharCode(code);
				}
				if (runKey >= 0) flush(run, runKey, start, r);
			}

			ctx.font = tileFont;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			drawKoi(t);
		}

		function onMove(e: PointerEvent) {
			if (e.pointerType === 'touch') return;
			mx = e.clientX;
			my = e.clientY;
			lastMove = performance.now();
		}
		function onLeave() {
			mx = my = -1e5;
		}
		function onDown(e: PointerEvent) {
			if ((e.target as Element | null)?.closest('a, button')) return;
			ripple(e.clientX, e.clientY);
			for (const f of fish) {
				const d = Math.hypot(f.nodes[0].x - e.clientX, f.nodes[0].y - e.clientY);
				if (d < 380) {
					f.fear = Math.max(f.fear, 1 - d / 380);
					f.fx = e.clientX;
					f.fy = e.clientY;
				}
			}
		}
		function onResize() {
			layout();
			redraw?.();
		}

		layout();
		document.fonts?.ready.then(() => {
			layout();
			redraw?.();
		});
		addEventListener('resize', onResize, { passive: true });

		let raf = 0;
		if (reduced) {
			for (let i = 0; i < 400; i++) updateFish(1 / 30, 0);
			bubbles.length = 0;
			redraw = () => render(4, Infinity);
			addEventListener('scroll', redraw, { passive: true });
			redraw();
		} else {
			addEventListener('pointermove', onMove, { passive: true });
			addEventListener('pointerdown', onDown, { passive: true });
			document.documentElement.addEventListener('pointerleave', onLeave);
			let last = performance.now();
			let acc = 0;
			const frame = (now: number) => {
				const dt = Math.min(0.05, (now - last) / 1000);
				last = now;
				acc = Math.min(acc + dt, 3 / 60);
				while (acc >= 1 / 60) {
					stepRipples();
					acc -= 1 / 60;
				}
				updateFish(dt, now);
				render(now / 1000, now);
				raf = requestAnimationFrame(frame);
			};
			raf = requestAnimationFrame(frame);
		}
		document.documentElement.classList.add('ascii-on');

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('resize', onResize);
			removeEventListener('pointermove', onMove);
			removeEventListener('pointerdown', onDown);
			if (redraw) removeEventListener('scroll', redraw);
			document.documentElement.removeEventListener('pointerleave', onLeave);
			document.documentElement.classList.remove('ascii-on');
			redraw = null;
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 z-0 h-full w-full"
	aria-hidden="true"
></canvas>
