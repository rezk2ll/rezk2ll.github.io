<script lang="ts">
	import { onMount } from 'svelte';
	import { siGithub, siGmail } from 'simple-icons';
	import Seo from '$lib/Seo.svelte';
	import {
		ai,
		alsoContributed,
		bio,
		experience,
		openSource,
		projects,
		technologies,
		type Project
	} from '$lib/data';

	let time = $state('');
	let timeIcon = $state('');
	let mounted = $state(false);
	let visibleSections = $state<string[]>([]);

	function updateTime() {
		const now = new Date();
		const hour = parseInt(
			new Intl.DateTimeFormat('en-US', {
				hour: 'numeric',
				hour12: false,
				timeZone: 'Europe/Paris'
			}).format(now)
		);
		timeIcon = hour >= 19 || hour < 7 ? '\u{1F319}' : '\u{2600}\u{FE0F}';
		time = new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
			timeZone: 'Europe/Paris',
			timeZoneName: 'short'
		}).format(now);
	}

	onMount(() => {
		mounted = true;
		updateTime();
		const interval = setInterval(updateTime, 60000);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (
						entry.isIntersecting &&
						entry.target.id &&
						!visibleSections.includes(entry.target.id)
					) {
						visibleSections = [...visibleSections, entry.target.id];
					}
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);

		document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));

		return () => {
			clearInterval(interval);
			observer.disconnect();
		};
	});

	// Brand colors too dark for the near-black background fall back to the text color.
	function iconFill(hex: string) {
		const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
		return 0.299 * r + 0.587 * g + 0.114 * b < 60 ? '#a1a1aa' : `#${hex}`;
	}

	function reveal(id: string) {
		return visibleSections.includes(id) ? 'section-visible' : 'section-hidden';
	}
</script>

<Seo
	title="Khaled Ferjani · Technical Lead, identity and event-driven platforms"
	description="Khaled Ferjani is a Technical Lead in France building open-source collaboration software: sign-in and identity (SSO, OIDC, 2FA), RabbitMQ messaging, Kubernetes. Creator of Dojo and Claude Code guardrails."
	path="/"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		url: 'https://ferjani.dev/',
		mainEntity: {
			'@type': 'Person',
			name: 'Khaled Ferjani',
			url: 'https://ferjani.dev/',
			image: 'https://ferjani.dev/avatar.webp',
			jobTitle: 'Technical Lead',
			worksFor: { '@type': 'Organization', name: 'LINAGORA', url: 'https://linagora.com' },
			address: { '@type': 'PostalAddress', addressCountry: 'FR' },
			sameAs: ['https://github.com/rezk2ll', 'https://linkedin.com/in/k2ll33d/'],
			knowsAbout: [
				'Identity and access management',
				'OpenID Connect',
				'Event-driven architecture',
				'RabbitMQ',
				'Kubernetes',
				'TypeScript',
				'Svelte',
				'Claude Code'
			]
		}
	}}
/>

<div class="mx-auto max-w-screen-2xl px-6 py-12 md:px-10 md:py-20">
	<div class="flex flex-col gap-12 lg:flex-row lg:gap-16">
		<!-- Sidebar -->
		<aside
			class="lg:sticky lg:top-20 lg:w-[380px] lg:shrink-0 lg:self-start {mounted
				? 'animate-fade-in'
				: 'opacity-0'}"
		>
			<!-- Map card + Identity wrapper -->
			<div class="relative mb-6">
				<div class="h-[240px] overflow-hidden rounded-2xl">
					<div
						class="absolute inset-0 bg-cover"
						style="background-image: url('/map.webp'); background-position: 43% 51%;"
					></div>
					<div class="absolute inset-0 bg-black/15"></div>
					<div
						class="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent"
					></div>

					{#if time}
						<div
							class="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 backdrop-blur-sm"
						>
							<span>{timeIcon}</span>
							<span>{time}</span>
						</div>
					{/if}

					<div class="absolute -translate-x-1/2 -translate-y-1/2" style="left: 43%; top: 51%;">
						<div class="animate-pulse-dot h-2.5 w-2.5 rounded-full bg-blue-400"></div>
					</div>
				</div>

				<!-- Identity — overlaps map bottom -->
				<div class="absolute -bottom-12 left-4 flex items-end gap-4">
					<img
						src="/avatar.webp"
						width="96"
						height="96"
						alt="Khaled Ferjani"
						class="h-24 w-24 rounded-2xl border-4 border-[#111113] object-cover shadow-lg shadow-black/40"
					/>
					<div class="pb-1">
						<h1 class="text-xl font-bold tracking-tight text-white">Khaled Ferjani</h1>
						<p class="text-sm text-zinc-500">Technical Lead at LINAGORA</p>
					</div>
				</div>
			</div>

			<!-- Bio -->
			<p class="mt-16 text-sm leading-relaxed text-zinc-400">{bio}</p>

			<!-- Links -->
			<nav class="mt-5 flex items-center gap-4">
				<a
					href="https://github.com/rezk2ll"
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100"
					aria-label="GitHub"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="#e4e4e7"><path d={siGithub.path} /></svg>
				</a>
				<a
					href="https://linkedin.com/in/k2ll33d/"
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100"
					aria-label="LinkedIn"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="#e4e4e7"
						><path
							d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
						/></svg
					>
				</a>
				<a
					href="mailto:k2ll33d2@gmail.com"
					class="opacity-50 transition-opacity hover:opacity-100"
					aria-label="Email"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="#e4e4e7"><path d={siGmail.path} /></svg>
				</a>
			</nav>

			<!-- Resume link -->
			<a
				href="/resume"
				class="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
				Resume
			</a>

			<div class="mt-4 grid grid-cols-2 gap-2">
				<a
					href="https://ferjani.dev/dojo/"
					class="group rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10"
				>
					<span class="flex items-center gap-1 text-sm font-medium text-emerald-300"
						>Dojo <span aria-hidden="true" class="text-emerald-400/60">↗</span></span
					>
					<span class="mt-0.5 block text-xs text-zinc-500 group-hover:text-zinc-400"
						>Daily practice for engineers</span
					>
				</a>
				<a
					href="https://ferjani.dev/skills/"
					class="group rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2.5 transition-colors hover:border-orange-400/40 hover:bg-orange-500/10"
				>
					<span class="flex items-center gap-1 text-sm font-medium text-orange-300"
						>Skills <span aria-hidden="true" class="text-orange-400/60">↗</span></span
					>
					<span class="mt-0.5 block text-xs text-zinc-500 group-hover:text-zinc-400"
						>My Claude Code setup</span
					>
				</a>
			</div>

			<!-- Technologies -->
			<div class="mt-8">
				<h2 class="mb-4 text-xs font-semibold tracking-wider text-zinc-600 uppercase">
					Technologies
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each technologies as tech (tech.name)}
						<div
							class="flex items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
						>
							<svg
								class="h-3.5 w-3.5"
								viewBox="0 0 24 24"
								fill={iconFill(tech.icon.hex)}
								aria-hidden="true"><path d={tech.icon.path} /></svg
							>
							<span>{tech.name}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Education (compact in sidebar) -->
			<div class="mt-8">
				<h2 class="mb-4 text-xs font-semibold tracking-wider text-zinc-600 uppercase">Education</h2>
				<div>
					<p class="text-sm font-medium text-zinc-300">
						BSc Computer Science & Software Engineering
					</p>
					<p class="mt-0.5 text-xs text-zinc-600">INSAT · 2014 – 2017</p>
				</div>
				<div class="mt-4 space-y-2 text-xs text-zinc-500">
					<p>MTA: Software Development Fundamentals — Microsoft, 2017</p>
					<p>Winner — Carthage Cyber Arena CTF, 2017</p>
				</div>
			</div>

			<!-- Languages -->
			<div class="mt-6 text-xs text-zinc-600">Arabic · French · English</div>
		</aside>

		<!-- Main content -->
		<main class="min-w-0 flex-1">
			<!-- Experience -->
			<section id="experience" class={reveal('experience')}>
				<h2 class="mb-8 text-lg font-semibold text-white">Experience</h2>
				<div class="ml-3 border-l border-zinc-800/80 pl-8">
					{#each experience as job, i (job.title)}
						<article class="relative {i < experience.length - 1 ? 'pb-10' : ''}">
							<div
								class="absolute top-[7px] -left-[37px] h-2.5 w-2.5 rounded-full border-2 border-zinc-700 bg-zinc-900"
							></div>
							<div class="flex flex-wrap items-baseline gap-x-3">
								<h3 class="font-medium text-white">{job.title}</h3>
								<span class="text-sm text-zinc-600">{job.period}</span>
							</div>
							<p class="mt-0.5 text-sm text-zinc-500">
								{job.company} · {job.location}
							</p>
							<p class="mt-2 text-sm leading-relaxed text-zinc-400">{job.description}</p>
							{#if job.highlights}
								<ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-zinc-400">
									{#each job.highlights as h (h)}
										<li>{h}</li>
									{/each}
								</ul>
							{/if}
						</article>
					{/each}
				</div>
			</section>

			<hr class="my-12 border-zinc-800/60" />

			{#snippet cards(list: Project[])}
				<div class="grid gap-4 sm:grid-cols-2">
					{#each list as project (project.name)}
						<a
							href={project.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
						>
							<div class="flex items-center gap-2">
								<h3 class="font-medium text-white transition-colors group-hover:text-blue-300">
									{project.name}
								</h3>
								<span
									class="text-zinc-700 transition-colors group-hover:text-blue-300/60"
									aria-hidden="true">↗</span
								>
							</div>
							<p class="mt-2 text-sm leading-relaxed text-zinc-400">{project.description}</p>
							<div class="mt-3 flex flex-wrap gap-1.5">
								{#each project.tech as t (t)}
									<span class="rounded-full bg-zinc-800/60 px-2.5 py-0.5 text-xs text-zinc-500"
										>{t}</span
									>
								{/each}
							</div>
						</a>
					{/each}
				</div>
			{/snippet}

			<section id="projects" class={reveal('projects')}>
				<h2 class="mb-8 text-lg font-semibold text-white">Side Projects</h2>
				{@render cards(projects)}
			</section>

			<hr class="my-12 border-zinc-800/60" />

			<section id="opensource" class={reveal('opensource')}>
				<h2 class="mb-8 text-lg font-semibold text-white">Open Source</h2>
				{@render cards(openSource)}
				<p class="mt-8 text-sm text-zinc-600">
					Also contributed to
					<span class="text-zinc-500">{alsoContributed.join(' and ')}</span>
				</p>
			</section>

			<hr class="my-12 border-zinc-800/60" />

			<section id="ai" class={reveal('ai')}>
				<h2 class="mb-4 text-lg font-semibold text-white">How I Build with AI</h2>
				<p class="text-sm leading-relaxed text-zinc-400">{ai.intro}</p>
				<ul class="mt-4 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-zinc-400">
					{#each ai.points as point (point)}
						<li>{point}</li>
					{/each}
				</ul>
				<a
					href="https://ferjani.dev/skills"
					class="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
					>Install my skills and guardrails <span aria-hidden="true">↗</span></a
				>
			</section>
		</main>
	</div>

	<!-- Footer -->
	<footer class="no-print mt-16 flex items-center gap-4 border-t border-zinc-800/60 pt-8 pb-4">
		<a
			href="https://github.com/rezk2ll"
			target="_blank"
			rel="noopener noreferrer"
			class="opacity-40 transition-opacity hover:opacity-80"
			aria-label="GitHub"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="#e4e4e7"><path d={siGithub.path} /></svg>
		</a>
		<a
			href="https://linkedin.com/in/k2ll33d/"
			target="_blank"
			rel="noopener noreferrer"
			class="opacity-40 transition-opacity hover:opacity-80"
			aria-label="LinkedIn"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="#e4e4e7"
				><path
					d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
				/></svg
			>
		</a>
		<a
			href="mailto:k2ll33d2@gmail.com"
			class="opacity-40 transition-opacity hover:opacity-80"
			aria-label="Email"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="#e4e4e7"><path d={siGmail.path} /></svg>
		</a>
	</footer>
</div>
