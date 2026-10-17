<script lang="ts">
	import { alsoContributed, bio, experience, openSource, projects, technologies } from '$lib/data';
	import Seo from '$lib/Seo.svelte';

	const cvProjects = [...openSource, ...projects].filter((p) =>
		['ldap-rest', 'twake-sessions-service', 'Dojo', 'Vetixa'].includes(p.name)
	);

	function print() {
		window.print();
	}
</script>

<Seo
	title="Khaled Ferjani · Resume"
	description="Resume of Khaled Ferjani, Technical Lead: 9 years building open-source collaboration software, identity and SSO, event-driven services and Kubernetes platforms."
	path="/resume"
/>

<!-- Download button (hidden in print) -->
<div class="no-print fixed top-6 right-6 z-50 flex items-center gap-3">
	<a
		href="/"
		class="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-colors hover:bg-zinc-800"
	>
		Back
	</a>
	<button
		onclick={print}
		class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg transition-colors hover:bg-zinc-200"
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
		Download PDF
	</button>
</div>

<main class="resume-page mx-auto max-w-[800px] px-8 py-12 print:px-0 print:py-0">
	<!-- Header -->
	<header class="mb-8 border-b border-zinc-800 pb-6 print:border-zinc-300">
		<h1 class="text-3xl font-bold tracking-tight text-white print:text-zinc-900">Khaled Ferjani</h1>
		<p class="mt-1 text-lg text-zinc-400 print:text-zinc-600">Technical Lead</p>
		<div
			class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 print:text-zinc-600"
		>
			<span>Nanterre, France</span>
			<span class="text-zinc-700 print:text-zinc-400">|</span>
			<a
				href="mailto:k2ll33d2@gmail.com"
				class="hover:text-white print:text-zinc-600 print:no-underline">k2ll33d2@gmail.com</a
			>
			<span class="text-zinc-700 print:text-zinc-400">|</span>
			<a
				href="https://github.com/rezk2ll"
				class="hover:text-white print:text-zinc-600 print:no-underline"
				target="_blank"
				rel="noopener noreferrer">github.com/rezk2ll</a
			>
			<span class="text-zinc-700 print:text-zinc-400">|</span>
			<a
				href="https://linkedin.com/in/k2ll33d/"
				class="hover:text-white print:text-zinc-600 print:no-underline"
				target="_blank"
				rel="noopener noreferrer">linkedin.com/in/k2ll33d</a
			>
		</div>
	</header>

	<!-- Summary -->
	<section class="mb-8">
		<h2
			class="mb-3 text-sm font-semibold tracking-wider text-zinc-400 uppercase print:text-zinc-500"
		>
			Summary
		</h2>
		<p class="text-sm leading-relaxed text-zinc-300 print:text-zinc-700">
			9 years at LINAGORA, Tech Lead since 2025. {bio}
		</p>
	</section>

	<!-- Technologies -->
	<section class="mb-8">
		<h2
			class="mb-3 text-sm font-semibold tracking-wider text-zinc-400 uppercase print:text-zinc-500"
		>
			Technologies
		</h2>
		<p class="text-sm text-zinc-300 print:text-zinc-700">
			{technologies.map((t) => t.name).join(' · ')}
		</p>
	</section>

	<!-- Experience -->
	<section class="mb-8">
		<h2
			class="mb-4 text-sm font-semibold tracking-wider text-zinc-400 uppercase print:text-zinc-500"
		>
			Experience
		</h2>
		<div class="space-y-6">
			{#each experience as job (job.title)}
				<article>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4">
						<h3 class="font-medium text-white print:text-zinc-900">{job.title}, {job.company}</h3>
						<span class="text-sm text-zinc-500 print:text-zinc-500">{job.period}</span>
					</div>
					<p class="text-sm text-zinc-500 print:text-zinc-500">{job.location}</p>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-400 print:text-zinc-700">
						{job.description}
					</p>
					{#if job.highlights}
						<ul
							class="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-zinc-400 print:text-zinc-700"
						>
							{#each job.highlights as h (h)}
								<li>{h}</li>
							{/each}
						</ul>
					{/if}
				</article>
			{/each}
		</div>
	</section>

	<!-- Open Source -->
	<section class="mb-8">
		<h2
			class="mb-4 text-sm font-semibold tracking-wider text-zinc-400 uppercase print:text-zinc-500"
		>
			Open Source & Side Projects
		</h2>
		<div class="space-y-4">
			{#each cvProjects as project (project.name)}
				<article>
					<div class="flex flex-wrap items-baseline gap-x-2">
						<h3 class="font-medium text-white print:text-zinc-900">{project.name}</h3>
						<span class="text-xs text-zinc-600 print:text-zinc-500"
							>({project.tech.join(', ')})</span
						>
					</div>
					<p class="mt-0.5 text-sm text-zinc-400 print:text-zinc-700">{project.description}</p>
				</article>
			{/each}
		</div>
		<p class="mt-4 text-sm text-zinc-500 print:text-zinc-600">
			Also contributed to {alsoContributed.join(' and ')}
		</p>
	</section>

	<!-- Education -->
	<section class="mb-8">
		<h2
			class="mb-3 text-sm font-semibold tracking-wider text-zinc-400 uppercase print:text-zinc-500"
		>
			Education
		</h2>
		<div>
			<h3 class="font-medium text-white print:text-zinc-900">
				Applied BSc in Computer Science & Software Engineering
			</h3>
			<p class="text-sm text-zinc-500">
				INSAT, National Institute of Applied Science and Technology · 2014 – 2017
			</p>
		</div>
	</section>

	<!-- Languages -->
	<section>
		<h2
			class="mb-3 text-sm font-semibold tracking-wider text-zinc-400 uppercase print:text-zinc-500"
		>
			Languages
		</h2>
		<p class="text-sm text-zinc-400 print:text-zinc-700">
			Arabic (native) · French (fluent, daily at work) · English (fluent, daily at work)
		</p>
	</section>
</main>

<style>
	@media print {
		:global(html),
		:global(body) {
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
