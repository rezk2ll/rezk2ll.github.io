<script lang="ts">
	import { onMount } from 'svelte';

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
					if (entry.isIntersecting && entry.target.id && !visibleSections.includes(entry.target.id)) {
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

	function reveal(id: string) {
		return visibleSections.includes(id) ? 'section-visible' : 'section-hidden';
	}

	const technologies = [
		{ name: 'TypeScript', slug: 'typescript', color: '3178C6' },
		{ name: 'JavaScript', slug: 'javascript', color: 'F7DF1E' },
		{ name: 'Svelte', slug: 'svelte', color: 'FF3E00' },
		{ name: 'Node.js', slug: 'nodedotjs', color: '5FA04E' },
		{ name: 'React', slug: 'react', color: '61DAFB' },
		{ name: 'Vue.js', slug: 'vuedotjs', color: '4FC08D' },
		{ name: 'Tailwind CSS', slug: 'tailwindcss', color: '06B6D4' },
		{ name: 'Docker', slug: 'docker', color: '2496ED' },
		{ name: 'Kubernetes', slug: 'kubernetes', color: '326CE5' },
		{ name: 'GitHub Actions', slug: 'githubactions', color: '2088FF' },
		{ name: 'Linux', slug: 'linux', color: 'FCC624' },
		{ name: 'Helm', slug: 'helm', color: '0F1689' },
		{ name: 'Git', slug: 'git', color: 'F05032' }
	];

	const projects = [
		{
			name: 'Vetixa',
			description: 'Open-source veterinary clinic management system, actively used in production',
			tech: ['SvelteKit', 'PocketBase', 'TailwindCSS', 'Zod'],
			url: 'https://github.com/rezk2ll/vetixa'
		},
		{
			name: 'SplitShare',
			description:
				'Workout split sharing platform with social features, offline sync, and clean architecture',
			tech: ['SvelteKit', 'Better Auth', 'PWA'],
			url: 'https://github.com/split-share/splitshare'
		},
		{
			name: 'svelte-num-otp',
			description: 'Reusable OTP input component for Svelte applications',
			tech: ['Svelte', 'TailwindCSS'],
			url: 'https://github.com/rezk2ll/svelte-num-otp'
		},
		{
			name: 'SvelteKit Forecast',
			description: 'Progressive Web App with geolocation-based weather forecasts',
			tech: ['SvelteKit', 'TailwindCSS', 'DaisyUI'],
			url: 'https://github.com/rezk2ll/sveltekit-forecast'
		}
	];

	const experience = [
		{
			title: 'Technical Lead',
			company: 'LINAGORA',
			location: 'Issy-les-Moulineaux, France',
			period: 'Jun 2025 – Present',
			description:
				'Tech Lead on Twake Workplace — hands-on across the full stack: feature development, ADRs, LDAP identity, admin tooling, security hardening, Helm charts, and Kubernetes deployments. Mentoring developers and coordinating delivery across product, DevOps, and security teams.'
		},
		{
			title: 'Senior Full-Stack Developer',
			company: 'LINAGORA',
			location: 'Tunis & Issy-les-Moulineaux, France',
			period: '2022 – 2025',
			description:
				'Expanded platform services for Twake Workplace, Signup, and Twake On Matrix. Designed critical APIs, ensured service stability and security, and owned CI/CD infrastructure with Docker, GitHub Actions, and Helm.'
		},
		{
			title: 'Full-Stack Developer',
			company: 'LINAGORA',
			location: 'Tunis, Tunisia',
			period: '2020 – 2022',
			description:
				'Built the Twake platform, Matrix invitation system, and contributed to OpenPaas and SmartSla. Developed frontends with AngularJS, Vue, and React. Created CI/CD pipelines and maintained cross-team integrations.'
		},
		{
			title: 'Web Developer',
			company: 'LINAGORA',
			location: 'Tunis, Tunisia',
			period: '2017 – 2020',
			description:
				'Developed and maintained the ANCE Managed PKI platform. Delivered client demos and provided ongoing support.'
		}
	];
</script>

<svelte:head>
	<title>Khaled Ferjani</title>
</svelte:head>

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
						src="https://avatars.githubusercontent.com/u/6764881?v=4"
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
			<p class="mt-16 text-sm leading-relaxed text-zinc-400">
				I build collaboration platforms and developer tools. Tech Lead on Twake Workplace —
				involved in everything from architecture and development to deployment, Helm charts, and
				Kubernetes. I also ship open-source projects on the side.
			</p>

			<!-- Links -->
			<nav class="mt-5 flex items-center gap-4">
				<a
					href="https://github.com/rezk2ll"
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100"
					aria-label="GitHub"
				>
					<img src="https://cdn.simpleicons.org/github/e4e4e7" alt="GitHub" class="h-5 w-5" />
				</a>
				<a
					href="https://linkedin.com/in/k2ll33d/"
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100"
					aria-label="LinkedIn"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="#e4e4e7"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
				</a>
				<a
					href="mailto:k2ll33d2@gmail.com"
					class="opacity-50 transition-opacity hover:opacity-100"
					aria-label="Email"
				>
					<img src="https://cdn.simpleicons.org/gmail/e4e4e7" alt="Email" class="h-5 w-5" />
				</a>
			</nav>

			<!-- Resume link -->
			<a
				href="/resume"
				class="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
				Resume
			</a>

			<!-- Technologies -->
			<div class="mt-8">
				<h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
					Technologies
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each technologies as tech}
						<div
							class="flex items-center gap-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
						>
							<img
								src="https://cdn.simpleicons.org/{tech.slug}/{tech.color}"
								alt={tech.name}
								width="14"
								height="14"
								class="h-3.5 w-3.5"
								loading="lazy"
							/>
							<span>{tech.name}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Education (compact in sidebar) -->
			<div class="mt-8">
				<h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
					Education
				</h2>
				<div>
					<p class="text-sm font-medium text-zinc-300">BSc Computer Science & Software Engineering</p>
					<p class="mt-0.5 text-xs text-zinc-600">INSAT · 2014 – 2017</p>
				</div>
				<div class="mt-4 space-y-2 text-xs text-zinc-500">
					<p>MTA: Software Development Fundamentals — Microsoft, 2017</p>
					<p>Winner — Carthage Cyber Arena CTF, 2017</p>
				</div>
			</div>

			<!-- Languages -->
			<div class="mt-6 text-xs text-zinc-600">
				Arabic · French · English
			</div>
		</aside>

		<!-- Main content -->
		<main class="min-w-0 flex-1">
			<!-- Experience -->
			<section id="experience" class="{reveal('experience')}">
				<h2 class="mb-8 text-lg font-semibold text-white">Experience</h2>
				<div class="ml-3 border-l border-zinc-800/80 pl-8">
					{#each experience as job, i}
						<article class="relative {i < experience.length - 1 ? 'pb-10' : ''}">
							<div
								class="absolute -left-[37px] top-[7px] h-2.5 w-2.5 rounded-full border-2 border-zinc-700 bg-zinc-900"
							></div>
							<div class="flex flex-wrap items-baseline gap-x-3">
								<h3 class="font-medium text-white">{job.title}</h3>
								<span class="text-sm text-zinc-600">{job.period}</span>
							</div>
							<p class="mt-0.5 text-sm text-zinc-500">
								{job.company} · {job.location}
							</p>
							<p class="mt-2 text-sm leading-relaxed text-zinc-400">{job.description}</p>
						</article>
					{/each}
				</div>
			</section>

			<hr class="my-12 border-zinc-800/60" />

			<!-- Open Source -->
			<section id="opensource" class="{reveal('opensource')}">
				<h2 class="mb-8 text-lg font-semibold text-white">Open Source</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each projects as project}
						<a
							href={project.url}
							target="_blank"
							rel="noopener noreferrer"
							class="group rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
						>
							<div class="flex items-center gap-2">
								<h3
									class="font-medium text-white transition-colors group-hover:text-blue-300"
								>
									{project.name}
								</h3>
								<span
									class="text-zinc-700 transition-colors group-hover:text-blue-300/60"
									aria-hidden="true">↗</span
								>
							</div>
							<p class="mt-2 text-sm leading-relaxed text-zinc-400">{project.description}</p>
							<div class="mt-3 flex flex-wrap gap-1.5">
								{#each project.tech as t}
									<span
										class="rounded-full bg-zinc-800/60 px-2.5 py-0.5 text-xs text-zinc-500"
										>{t}</span
									>
								{/each}
							</div>
						</a>
					{/each}
				</div>
				<p class="mt-8 text-sm text-zinc-600">
					Also contributed to
					<span class="text-zinc-500">react-international-phone</span>
					and
					<span class="text-zinc-500">validator.js</span>
				</p>
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
			<img src="https://cdn.simpleicons.org/github/e4e4e7" alt="GitHub" class="h-4 w-4" />
		</a>
		<a
			href="https://linkedin.com/in/k2ll33d/"
			target="_blank"
			rel="noopener noreferrer"
			class="opacity-40 transition-opacity hover:opacity-80"
			aria-label="LinkedIn"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="#e4e4e7"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
		</a>
		<a
			href="mailto:k2ll33d2@gmail.com"
			class="opacity-40 transition-opacity hover:opacity-80"
			aria-label="Email"
		>
			<img src="https://cdn.simpleicons.org/gmail/e4e4e7" alt="Email" class="h-4 w-4" />
		</a>
	</footer>
</div>
