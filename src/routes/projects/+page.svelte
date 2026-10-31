<script lang="ts">
	import { showcase } from '$lib/data';
	import Seo from '$lib/Seo.svelte';
</script>

<Seo
	title="Khaled Ferjani · Projects"
	description="Side projects by Khaled Ferjani: Dojo, Claude Agents Indicator, tuxmedic, Vetixa and more, plus libraries and framework experiments."
	path="/"
	origin="https://projects.ferjani.dev"
/>

<main class="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-20">
	<header class="animate-fade-in">
		<a
			href="https://ferjani.dev"
			class="text-sm text-zinc-500 transition-colors hover:text-white"
			data-umami-event="projects-back">← ferjani.dev</a
		>
		<h1 class="mt-6 text-3xl font-bold tracking-tight text-white">Projects</h1>
		<p class="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
			What I build outside work, from apps people use every day to weekend experiments.
		</p>
	</header>

	{#each showcase as group (group.title)}
		<section class="mt-14">
			<h2 class="text-lg font-semibold text-white">{group.title}</h2>
			<p class="mt-1 text-sm text-zinc-500">{group.intro}</p>
			<div class="mt-6 grid gap-4 sm:grid-cols-2">
				{#each group.items as project (project.name)}
					<article
						class="flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
					>
						<div class="flex items-baseline justify-between gap-3">
							<h3 class="font-medium text-white">{project.name}</h3>
							{#if project.year}
								<span class="text-xs text-zinc-600">{project.year}</span>
							{/if}
						</div>
						<p class="mt-2 text-sm leading-relaxed text-zinc-400">{project.description}</p>
						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each project.tech as t (t)}
								<span class="rounded-full bg-zinc-800/60 px-2.5 py-0.5 text-xs text-zinc-500"
									>{t}</span
								>
							{/each}
						</div>
						<div class="mt-auto flex gap-4 pt-4 text-sm">
							<a
								href={project.url}
								target="_blank"
								rel="noopener noreferrer"
								data-umami-event="project"
								data-umami-event-name={project.name}
								class="text-zinc-300 transition-colors hover:text-blue-300"
								>{project.repo ? 'Open' : 'GitHub'} <span aria-hidden="true">↗</span></a
							>
							{#if project.repo}
								<a
									href={project.repo}
									target="_blank"
									rel="noopener noreferrer"
									data-umami-event="project-source"
									data-umami-event-name={project.name}
									class="text-zinc-500 transition-colors hover:text-blue-300"
									>Source <span aria-hidden="true">↗</span></a
								>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/each}
</main>
