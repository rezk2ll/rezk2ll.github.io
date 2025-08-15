<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="favicon.ico" />
  <title>Khaled FERJANI</title>
</svelte:head>
<div class="page-bg flex h-dvh w-full flex-col justify-between">
	<main class="flex-1 pb-40 print:pb-0">
		<div class="fixed left-1/2 z-0 prose min-h-60 w-full -translate-x-1/2">
			<img src="/bg.webp" alt="Map" class="z-[-1] h-[250px] w-full object-cover opacity-90" />
		</div>
		<div class="banner-overlay min-h-60 px-4">
			<div class="banner-shadow min-h-28">
				<div class="mx-auto w-full max-w-3xl px-4 pt-4">
					<div class="overflow-hidden pt-40">
						<div class="px-12 text-2xl leading-tight font-light text-white">Hello</div>
					</div>
				</div>
			</div>
		</div>

		<div class="page-bg relative m-auto prose pt-2 prose-invert print:p-0 px-2 lg:px-0">
			<div
				class="absolute -top-40 right-4 mr-2 ml-auto h-36 w-36 origin-center -translate-x-3 -rotate-6 p-6 duration-500 hover:rotate-0 sm:h-48 sm:w-48"
				style="animation-delay: 0s;"
			>
				<img
					src="https://avatars.githubusercontent.com/u/6764881?v=4"
					width="160"
					height="160"
					alt="khaled's portrait"
					class="touch-manipulation rounded-md shadow-sm shadow-gray-900/50 transition-opacity"
				/>
			</div>
			{@render children?.()}
		</div>
	</main>
</div>
