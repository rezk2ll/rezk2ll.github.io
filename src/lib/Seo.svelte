<script lang="ts">
	const SITE = 'https://ferjani.dev';

	let {
		title,
		description,
		path,
		origin = SITE,
		jsonLd
	}: {
		title: string;
		description: string;
		path: string;
		origin?: string;
		jsonLd?: object;
	} = $props();

	const url = $derived(origin + path);
	const ldScript = $derived(
		jsonLd
			? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}<` +
					'/script>'
			: ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="profile" />
	<meta property="og:site_name" content="Khaled Ferjani" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content="{SITE}/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html ldScript}
</svelte:head>
