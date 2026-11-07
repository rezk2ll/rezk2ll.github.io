<script lang="ts">
	import '@fontsource-variable/jetbrains-mono';
	import { onMount } from 'svelte';
	import { showcase } from '$lib/data';
	import AsciiOcean from '$lib/AsciiOcean.svelte';
	import Seo from '$lib/Seo.svelte';

	const THEME_SCRIPT =
		`<script>try{var t=localStorage.getItem('projects-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t}catch(e){}</scr` +
		`ipt>`;

	const names = showcase.flatMap((g) => g.items.map((p) => p.name)).join('/');
	const GLYPHS = '!<>-_\\/[]{}=+*^?#%@&$';

	let ocean: AsciiOcean;
	let titleEl: HTMLElement | undefined = $state();
	let theme = $state<'dark' | 'light'>('dark');

	function toggleTheme(e: MouseEvent) {
		const next = theme === 'dark' ? 'light' : 'dark';
		theme = next;
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem('projects-theme', next);
		} catch {
			/* private mode */
		}
		let { clientX: x, clientY: y } = e;
		if (!e.detail) {
			const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
			x = r.left + r.width / 2;
			y = r.top + r.height / 2;
		}
		ocean?.setTheme(next === 'light', x, y);
		ocean?.ripple(x, y, 1.4);
		window.umami?.track('projects-theme', { theme: next });
	}

	// Decodes the text from random glyphs, once on load and again when the pointer enters the host card.
	function scramble(node: HTMLElement) {
		const text = node.textContent ?? '';
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Screen readers get a stable copy instead of the glyphs mid-decode.
		const label = document.createElement('span');
		label.className = 'sr-only';
		label.textContent = text;
		node.after(label);
		node.setAttribute('aria-hidden', 'true');
		const host = node.closest('article') ?? node;
		let raf = 0;
		function run(duration: number) {
			cancelAnimationFrame(raf);
			const start = performance.now();
			const tick = (now: number) => {
				const p = (now - start) / duration;
				let out = '';
				for (let i = 0; i < text.length; i++) {
					out +=
						i < p * text.length || text[i] === ' '
							? text[i]
							: GLYPHS[(Math.random() * GLYPHS.length) | 0];
				}
				node.textContent = out;
				if (p < 1) raf = requestAnimationFrame(tick);
				else node.textContent = text;
			};
			raf = requestAnimationFrame(tick);
		}
		const hover = () => run(420);
		host.addEventListener('pointerenter', hover);
		run(900);
		return {
			destroy() {
				cancelAnimationFrame(raf);
				host.removeEventListener('pointerenter', hover);
				label.remove();
			}
		};
	}

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
		ocean?.setTheme(theme === 'light', 0, 0, true);
		requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'));
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html THEME_SCRIPT}
</svelte:head>

<Seo
	title="Khaled Ferjani · Projects"
	description="Side projects by Khaled Ferjani: Vitre OS, Dojo, Claude Agents Indicator, tuxmedic, Vetixa and more, plus libraries and framework experiments."
	path="/"
	origin="https://projects.ferjani.dev"
/>

<AsciiOcean bind:this={ocean} {titleEl} fill={names} />

{#snippet frame()}
	<i class="edge top" aria-hidden="true"><b>+</b><s></s><b>+</b></i>
	<i class="edge bottom" aria-hidden="true"><b>+</b><s></s><b>+</b></i>
	<i class="side left" aria-hidden="true"></i>
	<i class="side right" aria-hidden="true"></i>
{/snippet}

<div class="page">
	<a href="https://ferjani.dev" class="btn fixed top-5 left-5 z-40" data-umami-event="projects-back"
		>[ &lt;- ferjani.dev ]</a
	>
	<button
		onclick={toggleTheme}
		class="btn fixed top-5 right-5 z-40"
		aria-label="Switch to {theme === 'dark' ? 'light' : 'dark'} theme"
		>[ {theme === 'dark' ? '* light' : 'o dark'} ]</button
	>

	<section class="relative z-10 flex h-[100svh] min-h-[560px] flex-col items-center px-4">
		<div class="mt-[24svh] w-full text-center">
			<h1 bind:this={titleEl} class="title">projects</h1>
			<p class="tagline mt-6 text-sm md:text-base">
				<span class="accent">&gt;</span>
				<span use:scramble>side projects, libraries and experiments by khaled ferjani</span><span
					class="cursor"
					aria-hidden="true">_</span
				>
			</p>
			<p class="muted mt-3 text-xs">click the water</p>
		</div>
		<button
			onclick={() => document.getElementById('list')?.scrollIntoView({ behavior: 'smooth' })}
			class="dive btn absolute bottom-8 left-1/2 -translate-x-1/2"
			aria-label="Scroll to projects">[ v ]</button
		>
	</section>

	<main id="list" class="relative z-10 mx-auto max-w-6xl scroll-mt-6 px-4 pb-24 md:px-10">
		{#each showcase as group, g (group.title)}
			<section class="mt-16 first:mt-4">
				<h2 class="heading">
					<span class="accent">[0{g + 1}]</span>
					{group.title.toLowerCase()}
					<span class="muted">// {group.intro.toLowerCase()}</span>
				</h2>
				<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{#each group.items as project (project.name)}
						<article class="card">
							{@render frame()}
							<div class="flex items-baseline gap-3">
								<h3 class="name flex-1"><span use:scramble>{project.name}</span></h3>
								{#if project.year}<span class="muted text-xs">{project.year}</span>{/if}
							</div>
							<p class="body mt-3 text-[0.8rem] leading-relaxed">{project.description}</p>
							<p class="tech mt-4 text-xs">
								{#each project.tech as t, i (t)}{i ? ' ' : ''}<span>#{t.toLowerCase()}</span>{/each}
							</p>
							<div class="mt-auto flex flex-wrap gap-2 pt-5 text-xs">
								<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									data-umami-event="project"
									data-umami-event-name={project.name}
									class="link link-primary">[ {project.repo ? 'visit' : 'github'} ↗ ]</a
								>
								{#if project.repo}
									<a
										href={project.repo}
										target="_blank"
										rel="noopener noreferrer"
										data-umami-event="project-source"
										data-umami-event-name={project.name}
										class="link">[ source ↗ ]</a
									>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/each}

		<p class="mt-24 text-center text-sm">
			<a href="https://ferjani.dev" class="btn">[ back to ferjani.dev ]</a>
		</p>
		<p class="muted mt-6 text-center text-xs">every fish, ripple and letter here is text.</p>
		<p class="muted mt-2 text-center text-xs">
			koi photos by
			<a
				class="link underline"
				href="https://commons.wikimedia.org/wiki/File:Kohaku_nishikigoi_Konishi_Koi_Farm_Martin_Kammerer_ID7185-.jpg"
				>martin kammerer</a
			>
			(<a class="link underline" href="https://creativecommons.org/licenses/by-sa/4.0/"
				>cc by-sa 4.0</a
			>) and
			<a class="link underline" href="https://commons.wikimedia.org/wiki/File:Yamabuki_Ogon.JPG"
				>fehlwort</a
			>
			(<a class="link underline" href="https://creativecommons.org/licenses/by-sa/3.0/"
				>cc by-sa 3.0</a
			>), background removed.
		</p>
	</main>
</div>

<style>
	:global(html) {
		--bg: #04070c;
		--fg: #e6f1f7;
		--muted: rgba(170, 200, 215, 0.6);
		--body: rgba(214, 232, 240, 0.82);
		--accent: #7dd3fc;
		--accent2: #c4b5fd;
		--panel: rgba(4, 7, 12, 0.8);
		--line: rgba(125, 211, 252, 0.38);
		background: var(--bg);
	}
	:global(html[data-theme='light']) {
		--bg: #f2eee3;
		--fg: #0e2a36;
		--muted: rgba(14, 42, 54, 0.58);
		--body: rgba(14, 42, 54, 0.84);
		--accent: #0369a1;
		--accent2: #7c3aed;
		--panel: rgba(242, 238, 227, 0.84);
		--line: rgba(3, 105, 161, 0.45);
	}
	@property --bg {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
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
	@property --accent {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --accent2 {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --panel {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	@property --line {
		syntax: '<color>';
		inherits: true;
		initial-value: transparent;
	}
	:global(html.theme-ready) {
		transition-property: --bg, --fg, --muted, --body, --accent, --accent2, --panel, --line;
		transition-duration: 0.9s;
		transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}
	:global(body) {
		background: var(--bg);
	}

	.page {
		font-family: 'JetBrains Mono Variable', ui-monospace, Menlo, monospace;
		font-variant-ligatures: none;
		color: var(--fg);
	}

	.title {
		font-family: 'JetBrains Mono Variable', ui-monospace, Menlo, monospace;
		font-size: clamp(3.4rem, 17vw, 13rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.06em;
		color: var(--fg);
	}
	@media (min-width: 640px) {
		:global(html.ascii-on) .title {
			color: transparent;
		}
	}
	.tagline {
		display: inline-block;
		background: var(--panel);
		padding: 0.15rem 0.6rem;
		color: var(--body);
	}
	.cursor {
		color: var(--accent);
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.accent {
		color: var(--accent);
	}
	.muted {
		color: var(--muted);
	}
	.body {
		color: var(--body);
	}

	.btn {
		background: var(--panel);
		padding: 0.25rem 0.5rem;
		font-size: 0.8rem;
		color: var(--fg);
		white-space: nowrap;
		transition: color 0.2s;
	}
	.btn:hover {
		color: var(--accent);
	}

	.dive {
		animation: dive 2.4s ease-in-out infinite;
	}
	@keyframes dive {
		50% {
			transform: translate(-50%, 6px);
		}
	}

	.heading {
		display: inline-block;
		background: var(--panel);
		padding: 0.2rem 0.5rem;
		font-size: 1rem;
		font-weight: 700;
	}
	.heading .muted {
		font-weight: 400;
		font-size: 0.8rem;
	}

	.card {
		position: relative;
		display: flex;
		height: 100%;
		flex-direction: column;
		background: var(--panel);
		backdrop-filter: blur(2px);
		padding: 1.6em 2.2ch;
		font-size: 0.875rem;
		line-height: 1.6;
	}
	.edge {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		height: 1lh;
		overflow: hidden;
		font-style: normal;
		color: var(--line);
		transition: color 0.2s;
	}
	.edge.top {
		top: 0;
	}
	.edge.bottom {
		bottom: 0;
	}
	.edge b {
		font-weight: 400;
	}
	.edge s {
		flex: 1;
		overflow: hidden;
		text-decoration: none;
		white-space: nowrap;
	}
	.edge s::before {
		content: '--------------------------------------------------------------------------------------------------------------------------------';
	}
	.side {
		position: absolute;
		top: 1lh;
		bottom: 1lh;
		width: 1ch;
		overflow: hidden;
		font-style: normal;
		word-break: break-all;
		color: var(--line);
		transition: color 0.2s;
	}
	.side::before {
		content: '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||';
	}
	.side.left {
		left: 0;
	}
	.side.right {
		right: 0;
	}
	.card:hover .edge,
	.card:hover .side {
		color: var(--accent);
	}
	.card:hover .edge s::before {
		content: '================================================================================================================================';
	}

	.name {
		font-weight: 700;
		color: var(--fg);
	}
	.card:hover .name {
		color: var(--accent);
	}
	.tech {
		color: var(--accent2);
	}

	.link {
		color: var(--muted);
		transition: color 0.2s;
	}
	.link:hover,
	.link-primary {
		color: var(--fg);
	}
	.link-primary:hover {
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.dive,
		.cursor {
			animation: none;
		}
	}
</style>
