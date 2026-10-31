<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { siLinux, type SimpleIcon } from 'simple-icons';
	import { showcase, type Project } from '$lib/data';
	import Sea from '$lib/Sea.svelte';
	import Seo from '$lib/Seo.svelte';
	import { iconFill, techIcons } from '$lib/techIcons';

	const logos: Record<string, string | SimpleIcon> = {
		Dojo: '/logos/dojo.svg',
		'Claude Agents Indicator': '/logos/claude-agents-indicator.svg',
		tuxmedic: siLinux,
		Vetixa: '/logos/vetixa.svg',
		'Eat Explained': '/logos/eat-explained.png'
	};

	const all = showcase.flatMap((g) => g.items);
	const techs = [...new Set(all.flatMap((p) => p.tech))].sort(
		(a, b) => Number(b in techIcons) - Number(a in techIcons) || a.localeCompare(b)
	);
	const floating = techs.filter((t) => t in techIcons && t !== 'Svelte 5' && t !== 'Svelte');

	const THEME_SCRIPT =
		`<script>try{var t=localStorage.getItem('projects-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t}catch(e){}</scr` +
		`ipt>`;

	let sea: Sea;
	let hero: HTMLElement;
	let floaters: HTMLButtonElement[] = $state([]);
	let filter = $state<string | null>(null);
	let theme = $state<'dark' | 'light'>('dark');

	const groups = $derived(
		showcase
			.map((g) => ({
				...g,
				items: filter ? g.items.filter((p) => p.tech.includes(filter!)) : g.items
			}))
			.filter((g) => g.items.length)
	);

	function logoFor(p: Project): string | SimpleIcon {
		return logos[p.name] ?? techIcons[p.tech[0]] ?? '';
	}

	function hue(name: string) {
		let n = 0;
		for (const c of name) n = (n * 31 + c.charCodeAt(0)) % 360;
		return n;
	}

	async function pick(t: string | null, e?: MouseEvent) {
		filter = filter === t ? null : t;
		if (e) sea?.splash(e.clientX, e.clientY, 30, 0.7);
		if (t) window.umami?.track('projects-filter', { tech: t });
		await tick();
		document.getElementById('list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// The sea paints the new theme as a circle growing from the toggle behind a rolling wave, while
	// the page colours fade through registered CSS properties. Both stay on the GPU, no snapshots.
	function toggleTheme(e: MouseEvent) {
		const next = theme === 'dark' ? 'light' : 'dark';
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		theme = next;
		document.documentElement.dataset.theme = next;
		localStorage.setItem('projects-theme', next);
		sea?.setTheme(next === 'light', reduced, e.clientX, e.clientY);
		sea?.splash(e.clientX, e.clientY, 70, 1.4);
		window.umami?.track('projects-theme', { theme: next });
	}

	function tilt(node: HTMLElement) {
		function move(e: PointerEvent) {
			const r = node.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width;
			const y = (e.clientY - r.top) / r.height;
			node.style.setProperty('--mx', `${x * 100}%`);
			node.style.setProperty('--my', `${y * 100}%`);
			node.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
			node.style.setProperty('--ry', `${(x - 0.5) * 12}deg`);
		}
		function leave() {
			node.style.setProperty('--rx', '0deg');
			node.style.setProperty('--ry', '0deg');
		}
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerleave', leave);
		return {
			destroy() {
				node.removeEventListener('pointermove', move);
				node.removeEventListener('pointerleave', leave);
			}
		};
	}

	// The tech logos float on the water: a spring pulls each one home and the pointer pushes them away.
	onMount(() => {
		theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
		sea?.setTheme(theme === 'light', true);
		requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'));

		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let width = hero.clientWidth;
		let height = hero.clientHeight;
		let px = -9999;
		let py = -9999;

		const bodies = floating.map((_, i) => {
			const angle = (i / floating.length) * Math.PI * 2 + Math.random() * 0.3;
			const rx = 0.38 + Math.random() * 0.08;
			const ry = 0.32 + Math.random() * 0.1;
			return {
				hx: 0.5 + Math.cos(angle) * rx,
				hy: 0.42 + Math.sin(angle) * ry,
				x: width / 2,
				y: height * 0.42,
				vx: (Math.random() - 0.5) * 30,
				vy: (Math.random() - 0.5) * 30,
				phase: Math.random() * Math.PI * 2
			};
		});

		function place(t: number) {
			bodies.forEach((b, i) => {
				const el = floaters[i];
				if (!el) return;
				const bob = Math.sin(t / 900 + b.phase) * 5;
				el.style.transform = `translate(${b.x - 22}px, ${b.y - 22 + bob}px) rotate(${b.vx * 3 + Math.sin(t / 1300 + b.phase) * 6}deg)`;
			});
		}

		if (reduced) {
			for (const b of bodies) {
				b.x = b.hx * width;
				b.y = b.hy * height;
			}
			place(0);
			return;
		}

		function onMove(e: PointerEvent) {
			const r = hero.getBoundingClientRect();
			px = e.clientX - r.left;
			py = e.clientY - r.top;
		}
		function onResize() {
			width = hero.clientWidth;
			height = hero.clientHeight;
		}
		addEventListener('pointermove', onMove, { passive: true });
		addEventListener('resize', onResize, { passive: true });

		let raf = 0;
		function step(t: number) {
			for (const b of bodies) {
				b.vx += (b.hx * width - b.x) * 0.012;
				b.vy += (b.hy * height - b.y) * 0.012;
				const dx = b.x - px;
				const dy = b.y - py;
				const d = Math.hypot(dx, dy) || 1;
				if (d < 150) {
					const f = ((150 - d) / 150) * 2.2;
					b.vx += (dx / d) * f;
					b.vy += (dy / d) * f;
				}
				b.vx *= 0.9;
				b.vy *= 0.9;
				b.x += b.vx;
				b.y += b.vy;
			}
			place(t);
			raf = requestAnimationFrame(step);
		}
		raf = requestAnimationFrame(step);

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('pointermove', onMove);
			removeEventListener('resize', onResize);
		};
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html THEME_SCRIPT}
</svelte:head>

<Seo
	title="Khaled Ferjani · Projects"
	description="Side projects by Khaled Ferjani: Dojo, Claude Agents Indicator, tuxmedic, Vetixa and more, plus libraries and framework experiments."
	path="/"
	origin="https://projects.ferjani.dev"
/>

<Sea bind:this={sea} />

<button
	onclick={toggleTheme}
	class="glass toggle fixed top-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full"
	aria-label="Switch to {theme === 'dark' ? 'light' : 'dark'} theme"
>
	<svg class="icon sun" viewBox="0 0 24 24" aria-hidden="true">
		<circle cx="12" cy="12" r="4.5" />
		{#each Array.from({ length: 8 }, (_, k) => k * 45) as a (a)}
			<line x1="12" y1="2.5" x2="12" y2="5" transform="rotate({a} 12 12)" />
		{/each}
	</svg>
	<svg class="icon moon" viewBox="0 0 24 24" aria-hidden="true">
		<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
	</svg>
</button>

<section bind:this={hero} class="relative z-20 h-[100svh] min-h-[560px] overflow-hidden">
	<a
		href="https://ferjani.dev"
		class="glass absolute top-6 left-6 rounded-full px-4 py-2 text-sm"
		data-umami-event="projects-back">← ferjani.dev</a
	>

	{#each floating as t, i (t)}
		<button
			bind:this={floaters[i]}
			onclick={(e) => pick(t, e)}
			class="floater absolute top-0 left-0"
			title={t}
			aria-label="Show {t} projects"
			style="--c: {iconFill(techIcons[t].hex)}"
		>
			<svg class="h-6 w-6" viewBox="0 0 24 24" fill={iconFill(techIcons[t].hex)} aria-hidden="true"
				><path d={techIcons[t].path} /></svg
			>
		</button>
	{/each}

	<div
		class="pointer-events-none absolute inset-x-0 top-[40svh] -translate-y-1/2 px-6 text-center"
		in:fly={{ y: 24, duration: 1000, delay: 200 }}
	>
		<h1 class="title">Projects</h1>
		<p class="tagline mt-4 text-base md:text-lg">
			Side projects, libraries and experiments by Khaled Ferjani.
		</p>
	</div>

	<button
		onclick={() => document.getElementById('list')?.scrollIntoView({ behavior: 'smooth' })}
		class="dive muted absolute bottom-8 left-1/2 -translate-x-1/2 text-xl"
		aria-label="Scroll to projects">↓</button
	>
</section>

<main id="list" class="relative z-20 mx-auto max-w-6xl scroll-mt-4 px-6 pb-24 md:px-10">
	<nav
		class="glass sticky top-4 z-30 flex flex-wrap gap-1.5 rounded-2xl p-2"
		aria-label="Filter by technology"
	>
		<button
			onclick={(e) => pick(null, e)}
			class="chip {filter === null ? 'chip-on' : ''}"
			aria-pressed={filter === null}>All</button
		>
		{#each techs as t (t)}
			<button
				onclick={(e) => pick(t, e)}
				class="chip {filter === t ? 'chip-on' : ''}"
				aria-pressed={filter === t}
			>
				{#if techIcons[t]}
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill={iconFill(techIcons[t].hex)}
						aria-hidden="true"><path d={techIcons[t].path} /></svg
					>
				{/if}
				{t}
			</button>
		{/each}
	</nav>

	{#each groups as group, g (group.title)}
		<section class="mt-16" transition:scale={{ start: 0.98, duration: 250 }}>
			<div class="flex items-baseline gap-4">
				<span class="number">0{g + 1}</span>
				<div>
					<h2 class="heading text-2xl font-bold">{group.title}</h2>
					<p class="muted mt-0.5 text-sm">{group.intro}</p>
				</div>
			</div>
			<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each group.items as project, i (project.name)}
					{@const logo = logoFor(project)}
					<div
						animate:flip={{ duration: 450 }}
						in:scale={{ start: 0.85, duration: 450, delay: i * 70 }}
					>
						<div class="bob h-full" style="animation-delay: {-i * 1.3}s">
							<article use:tilt class="card group h-full">
								<div class="card-glow" aria-hidden="true"></div>
								<div class="relative flex items-center gap-3">
									<div class="logo" style="--h: {hue(project.name)}">
										{#if typeof logo === 'string' && logo}
											<img src={logo} alt="" class="h-7 w-7 object-contain" loading="lazy" />
										{:else if typeof logo === 'object'}
											<svg
												class="h-6 w-6"
												viewBox="0 0 24 24"
												fill={iconFill(logo.hex)}
												aria-hidden="true"><path d={logo.path} /></svg
											>
										{:else}
											<span class="text-sm font-bold text-white">{project.name.slice(0, 2)}</span>
										{/if}
									</div>
									<h3 class="heading flex-1 font-semibold">{project.name}</h3>
									{#if project.year}
										<span class="muted text-xs">{project.year}</span>
									{/if}
								</div>
								<p class="body relative mt-3 text-sm leading-relaxed">{project.description}</p>
								<div class="relative mt-4 flex flex-wrap gap-1.5">
									{#each project.tech as t (t)}
										<button onclick={(e) => pick(t, e)} class="pill">
											{#if techIcons[t]}
												<svg
													class="h-3 w-3"
													viewBox="0 0 24 24"
													fill={iconFill(techIcons[t].hex)}
													aria-hidden="true"><path d={techIcons[t].path} /></svg
												>
											{/if}
											{t}
										</button>
									{/each}
								</div>
								<div class="relative mt-auto flex gap-3 pt-5 text-sm">
									<a
										href={project.url}
										target="_blank"
										rel="noopener noreferrer"
										data-umami-event="project"
										data-umami-event-name={project.name}
										class="link-primary">{project.repo ? 'Visit' : 'GitHub'} ↗</a
									>
									{#if project.repo}
										<a
											href={project.repo}
											target="_blank"
											rel="noopener noreferrer"
											data-umami-event="project-source"
											data-umami-event-name={project.name}
											class="link-secondary">Source ↗</a
										>
									{/if}
								</div>
							</article>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/each}

	<p class="mt-24 text-center text-sm">
		<a href="https://ferjani.dev" class="muted hover-strong">Back to ferjani.dev</a>
	</p>
	<p class="muted mt-6 text-center text-xs">
		Koi photos by
		<a
			class="hover-strong underline"
			href="https://commons.wikimedia.org/wiki/File:Kohaku_nishikigoi_Konishi_Koi_Farm_Martin_Kammerer_ID7185-.jpg"
			>Martin Kammerer</a
		>
		(<a class="hover-strong underline" href="https://creativecommons.org/licenses/by-sa/4.0/"
			>CC BY-SA 4.0</a
		>) and
		<a
			class="hover-strong underline"
			href="https://commons.wikimedia.org/wiki/File:Yamabuki_Ogon.JPG">Fehlwort</a
		>
		(<a class="hover-strong underline" href="https://creativecommons.org/licenses/by-sa/3.0/"
			>CC BY-SA 3.0</a
		>), background removed.
	</p>
</main>

<style>
	:global(html) {
		--fg: #eef4fa;
		--muted: rgba(214, 228, 242, 0.62);
		--body: rgba(226, 236, 246, 0.82);
		--title: #f6f9fc;
		--title-shadow: 0 4px 40px rgba(0, 10, 30, 0.55);
		--glass: rgba(6, 16, 30, 0.38);
		--glass-strong: rgba(6, 16, 30, 0.55);
		--glass-border: rgba(170, 215, 255, 0.16);
		--accent: #7dd3fc;
		--accent-bg: rgba(56, 189, 248, 0.18);
		--pill: rgba(255, 255, 255, 0.06);
	}
	:global(html[data-theme='light']) {
		--fg: #082233;
		--muted: rgba(8, 34, 51, 0.62);
		--body: rgba(8, 34, 51, 0.82);
		--title: #062234;
		--title-shadow: 0 4px 36px rgba(255, 255, 255, 0.45);
		--glass: rgba(255, 255, 255, 0.34);
		--glass-strong: rgba(255, 255, 255, 0.55);
		--glass-border: rgba(255, 255, 255, 0.6);
		--accent: #0369a1;
		--accent-bg: rgba(3, 105, 161, 0.14);
		--pill: rgba(255, 255, 255, 0.4);
	}
	@property --fg {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --muted {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --body {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --title {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --glass {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --glass-strong {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --glass-border {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --accent {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --accent-bg {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --pill {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	:global(html.theme-ready) {
		transition-property:
			--fg, --muted, --body, --title, --glass, --glass-strong, --glass-border, --accent,
			--accent-bg, --pill;
		transition-duration: 0.9s;
		transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}

	.title {
		font-size: clamp(4rem, 15vw, 12rem);
		font-weight: 800;
		line-height: 0.9;
		letter-spacing: -0.045em;
		color: var(--title);
		text-shadow: var(--title-shadow);
	}
	.tagline {
		color: var(--body);
		text-shadow: var(--title-shadow);
	}
	.heading {
		color: var(--fg);
	}
	.muted {
		color: var(--muted);
	}
	.body {
		color: var(--body);
	}
	.hover-strong {
		transition: color 0.2s;
	}
	.hover-strong:hover {
		color: var(--fg);
	}

	.glass {
		color: var(--fg);
		background: var(--glass-strong);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(14px) saturate(1.4);
	}

	.toggle {
		overflow: hidden;
		transition: transform 0.3s;
	}
	.toggle:hover {
		transform: scale(1.08);
	}
	.icon {
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		transition:
			transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.4s;
	}
	.moon {
		fill: currentColor;
		stroke: none;
	}
	:global(html[data-theme='light']) .moon,
	:global(html:not([data-theme='light'])) .sun {
		transform: rotate(-90deg) scale(0.3);
		opacity: 0;
	}

	.floater {
		display: grid;
		place-items: center;
		height: 44px;
		width: 44px;
		border-radius: 9999px;
		background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.4), var(--glass) 70%);
		border: 1px solid var(--glass-border);
		box-shadow: 0 8px 22px -8px rgba(0, 0, 0, 0.5);
		will-change: transform;
		cursor: pointer;
	}
	.floater:hover {
		border-color: var(--c);
		box-shadow: 0 0 24px -2px var(--c);
	}

	.dive {
		animation: dive 2.4s ease-in-out infinite;
	}
	@keyframes dive {
		50% {
			transform: translate(-50%, 6px);
		}
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 9999px;
		padding: 0.3rem 0.75rem;
		font-size: 0.75rem;
		color: var(--body);
		transition: all 0.2s;
	}
	.chip:hover {
		background: var(--accent-bg);
		color: var(--fg);
	}
	.chip-on {
		background: var(--accent-bg);
		color: var(--fg);
		box-shadow: inset 0 0 0 1px var(--accent);
	}

	.number {
		font-size: 3.5rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.04em;
		color: var(--fg);
		opacity: 0.25;
	}

	.bob {
		animation: bob 7s ease-in-out infinite;
	}
	@keyframes bob {
		0%,
		100% {
			transform: translateY(0) rotate(-0.4deg);
		}
		50% {
			transform: translateY(-8px) rotate(0.4deg);
		}
	}

	.card {
		--mx: 50%;
		--my: 50%;
		--rx: 0deg;
		--ry: 0deg;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 1.25rem;
		border: 1px solid var(--glass-border);
		background: var(--glass);
		padding: 1.4rem;
		box-shadow: 0 25px 50px -25px rgba(0, 0, 0, 0.55);
		transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
		transition:
			transform 0.25s ease-out,
			border-color 0.25s,
			box-shadow 0.25s;
	}
	.card:hover {
		border-color: var(--accent);
		box-shadow: 0 30px 60px -20px rgba(0, 40, 80, 0.45);
	}
	.card-glow {
		position: absolute;
		inset: 0;
		opacity: 0;
		background: radial-gradient(
			340px circle at var(--mx) var(--my),
			rgba(255, 255, 255, 0.16),
			transparent 60%
		);
		transition: opacity 0.25s;
	}
	.card:hover .card-glow {
		opacity: 1;
	}

	.logo {
		display: grid;
		place-items: center;
		height: 2.75rem;
		width: 2.75rem;
		flex-shrink: 0;
		border-radius: 0.8rem;
		background: linear-gradient(
			135deg,
			hsl(var(--h) 60% 35% / 0.75),
			hsl(calc(var(--h) + 50) 60% 22% / 0.75)
		);
		border: 1px solid hsl(var(--h) 70% 70% / 0.3);
		transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.card:hover .logo {
		transform: rotate(-10deg) scale(1.15);
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		border-radius: 9999px;
		background: var(--pill);
		box-shadow: inset 0 0 0 1px var(--glass-border);
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		color: var(--body);
		transition: all 0.2s;
	}
	.pill:hover {
		background: var(--accent-bg);
		color: var(--fg);
	}

	.link-primary,
	.link-secondary {
		border-radius: 9999px;
		padding: 0.25rem 0.75rem;
		transition: all 0.2s;
	}
	.link-primary {
		background: var(--accent-bg);
		color: var(--fg);
		box-shadow: inset 0 0 0 1px var(--accent);
	}
	.link-primary:hover {
		background: var(--accent);
		color: white;
	}
	.link-secondary {
		color: var(--muted);
		box-shadow: inset 0 0 0 1px var(--glass-border);
	}
	.link-secondary:hover {
		color: var(--fg);
	}

	@media (prefers-reduced-motion: reduce) {
		.bob,
		.dive {
			animation: none;
		}
		.card {
			transform: none;
		}
	}
</style>
