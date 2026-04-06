<script lang="ts">
	const technologies = [
		'TypeScript', 'JavaScript', 'Svelte/SvelteKit', 'Node.js', 'React', 'Vue.js',
		'Tailwind CSS', 'PostgreSQL', 'RabbitMQ', 'LDAP', 'Docker', 'Kubernetes', 'Helm',
		'GitHub Actions', 'Linux', 'Git'
	];

	const projects = [
		{
			name: 'Vetixa',
			description: 'Open-source veterinary clinic management system, actively used in production',
			tech: 'SvelteKit, PocketBase, TailwindCSS, Zod',
			url: 'https://github.com/rezk2ll/vetixa'
		},
		{
			name: 'SplitShare',
			description: 'Workout split sharing platform with social features, offline sync, and clean architecture',
			tech: 'SvelteKit, Better Auth, PWA',
			url: 'https://github.com/split-share/splitshare'
		},
		{
			name: 'svelte-num-otp',
			description: 'Reusable OTP input component for Svelte applications',
			tech: 'Svelte, TailwindCSS',
			url: 'https://github.com/rezk2ll/svelte-num-otp'
		},
		{
			name: 'SvelteKit Forecast',
			description: 'Progressive Web App with geolocation-based weather forecasts',
			tech: 'SvelteKit, TailwindCSS, DaisyUI',
			url: 'https://github.com/rezk2ll/sveltekit-forecast'
		}
	];

	const experience = [
		{
			title: 'Technical Lead',
			company: 'LINAGORA',
			location: 'Issy-les-Moulineaux, France',
			period: 'Jun 2025 – Present',
			description: 'Own the registration and authentication platform end-to-end: SSO/OIDC, 2FA, client-side PBKDF2 encryption, account lifecycle. Designed event-driven RabbitMQ architecture across services and published the shared @linagora/rabbitmq-client library. Built a platform metrics dashboard and documentation site from scratch. Led security hardening across the codebase: LDAP injection prevention, CrowdSec anti-fraud, session security. 440+ code reviews across 17 repositories.'
		},
		{
			title: 'Senior Full-Stack Developer',
			company: 'LINAGORA',
			location: 'Tunis & Issy-les-Moulineaux, France',
			period: '2022 – 2025',
			description: 'Built and expanded platform services for Twake Workplace, Signup, and Twake On Matrix. Contributed major features to Cozy Drive and upstream Cozy ecosystem. Owned CI/CD infrastructure with Docker, GitHub Actions, and Helm.'
		},
		{
			title: 'Full-Stack Developer',
			company: 'LINAGORA',
			location: 'Tunis, Tunisia',
			period: '2020 – 2022',
			description: 'Built the Twake platform, Matrix invitation system, and contributed to OpenPaas and SmartSla. Developed frontends with AngularJS, Vue, and React. Created CI/CD pipelines and maintained cross-team integrations.'
		},
		{
			title: 'Web Developer',
			company: 'LINAGORA',
			location: 'Tunis, Tunisia',
			period: '2017 – 2020',
			description: 'Developed and maintained the ANCE Managed PKI platform. Delivered client demos and provided ongoing support.'
		}
	];

	function print() {
		window.print();
	}
</script>

<svelte:head>
	<title>Khaled Ferjani — Resume</title>
</svelte:head>

<!-- Download button (hidden in print) -->
<div class="no-print fixed top-6 right-6 z-50 flex items-center gap-3">
	<a href="/" class="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-colors hover:bg-zinc-800">
		Back
	</a>
	<button
		onclick={print}
		class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg transition-colors hover:bg-zinc-200"
	>
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
		Download PDF
	</button>
</div>

<main class="resume-page mx-auto max-w-[800px] px-8 py-12 print:px-0 print:py-0">
	<!-- Header -->
	<header class="mb-8 border-b border-zinc-800 pb-6 print:border-zinc-300">
		<h1 class="text-3xl font-bold tracking-tight text-white print:text-zinc-900">Khaled Ferjani</h1>
		<p class="mt-1 text-lg text-zinc-400 print:text-zinc-600">Technical Lead</p>
		<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 print:text-zinc-600">
			<span>Nanterre, France</span>
			<span class="text-zinc-700 print:text-zinc-400">|</span>
			<a href="mailto:k2ll33d2@gmail.com" class="hover:text-white print:text-zinc-600 print:no-underline">k2ll33d2@gmail.com</a>
			<span class="text-zinc-700 print:text-zinc-400">|</span>
			<a href="https://github.com/rezk2ll" class="hover:text-white print:text-zinc-600 print:no-underline" target="_blank" rel="noopener noreferrer">github.com/rezk2ll</a>
			<span class="text-zinc-700 print:text-zinc-400">|</span>
			<a href="https://linkedin.com/in/k2ll33d/" class="hover:text-white print:text-zinc-600 print:no-underline" target="_blank" rel="noopener noreferrer">linkedin.com/in/k2ll33d</a>
		</div>
	</header>

	<!-- Summary -->
	<section class="mb-8">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Summary</h2>
		<p class="text-sm leading-relaxed text-zinc-300 print:text-zinc-700">
			Technical Lead with 9+ years of experience building identity, collaboration, and developer platforms.
			Currently leading Twake Workplace at LINAGORA -- owning the authentication service, designing cross-service
			event-driven architecture, and driving security hardening and platform observability across 15 repositories.
		</p>
	</section>

	<!-- Technologies -->
	<section class="mb-8">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Technologies</h2>
		<p class="text-sm text-zinc-300 print:text-zinc-700">{technologies.join(' · ')}</p>
	</section>

	<!-- Experience -->
	<section class="mb-8">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Experience</h2>
		<div class="space-y-6">
			{#each experience as job}
				<article>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4">
						<h3 class="font-medium text-white print:text-zinc-900">{job.title} — {job.company}</h3>
						<span class="text-sm text-zinc-500 print:text-zinc-500">{job.period}</span>
					</div>
					<p class="text-sm text-zinc-500 print:text-zinc-500">{job.location}</p>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-400 print:text-zinc-700">{job.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<!-- Open Source -->
	<section class="mb-8">
		<h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Open Source</h2>
		<div class="space-y-4">
			{#each projects as project}
				<article>
					<div class="flex flex-wrap items-baseline gap-x-2">
						<h3 class="font-medium text-white print:text-zinc-900">{project.name}</h3>
						<span class="text-xs text-zinc-600 print:text-zinc-500">({project.tech})</span>
					</div>
					<p class="mt-0.5 text-sm text-zinc-400 print:text-zinc-700">{project.description}</p>
				</article>
			{/each}
		</div>
		<p class="mt-4 text-sm text-zinc-500 print:text-zinc-600">
			Also contributed to react-international-phone and validator.js
		</p>
	</section>

	<!-- Education -->
	<section class="mb-8">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Education</h2>
		<div>
			<h3 class="font-medium text-white print:text-zinc-900">Applied BSc in Computer Science & Software Engineering</h3>
			<p class="text-sm text-zinc-500">INSAT — National Institute of Applied Science and Technology · 2014 – 2017</p>
		</div>
	</section>

	<!-- Certifications & Awards -->
	<section>
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Certifications & Awards</h2>
		<div class="space-y-1.5 text-sm text-zinc-400 print:text-zinc-700">
			<p>MTA: Software Development Fundamentals — Microsoft, 2017</p>
			<p>Winner — Carthage Cyber Arena CTF, 2017</p>
		</div>
	</section>

	<!-- Languages -->
	<section class="mt-6">
		<h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 print:text-zinc-500">Languages</h2>
		<p class="text-sm text-zinc-400 print:text-zinc-700">Arabic · French · English</p>
	</section>
</main>

<style>
	@media print {
		:global(html), :global(body) {
			background: white !important;
			color: #111 !important;
		}
		.resume-page {
			max-width: 100% !important;
			padding: 0 !important;
			margin: 0 !important;
		}
	}
</style>
