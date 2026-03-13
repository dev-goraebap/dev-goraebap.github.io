<script lang="ts">
	import { formatDate } from '$lib/posts';
	import mermaid from 'mermaid';

	let { data } = $props();

	function initMermaid(node: HTMLElement) {
		const isDark = document.documentElement.classList.contains('dark');
		mermaid.initialize({
			startOnLoad: false,
			theme: isDark ? 'dark' : 'default',
			fontFamily: 'var(--font-body)'
		});
		mermaid.run({ nodes: node.querySelectorAll('.mermaid') });
	}

	// --- Gradient (same as PostCard) ---
	const gradients = [
		'linear-gradient(135deg, #667eea, #764ba2)',
		'linear-gradient(135deg, #f093fb, #f5576c)',
		'linear-gradient(135deg, #4facfe, #00f2fe)',
		'linear-gradient(135deg, #43e97b, #38f9d7)',
		'linear-gradient(135deg, #fa709a, #fee140)',
		'linear-gradient(135deg, #a18cd1, #fbc2eb)',
		'linear-gradient(135deg, #fccb90, #d57eeb)',
		'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
		'linear-gradient(135deg, #f6d365, #fda085)',
		'linear-gradient(135deg, #89f7fe, #66a6ff)'
	];

	function hashSlug(slug: string): number {
		let hash = 0;
		for (let i = 0; i < slug.length; i++) {
			hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
		}
		return Math.abs(hash);
	}

	let gradient = $derived(gradients[hashSlug(data.slug) % gradients.length]);

	// --- Copy URL ---
	let copied = $state(false);

	function copyUrl() {
		navigator.clipboard.writeText(window.location.href).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 2000);
		});
	}

	// --- TOC ---
	interface TocItem {
		id: string;
		text: string;
		level: number;
	}

	let tocItems = $state<TocItem[]>([]);
	let activeId = $state('');

	function tocAttachment(node: HTMLElement) {
		const headings = Array.from(node.querySelectorAll('h2, h3')) as HTMLElement[];
		tocItems = headings
			.filter((h) => h.id)
			.map((h) => ({
				id: h.id,
				text: h.textContent ?? '',
				level: parseInt(h.tagName[1])
			}));

		if (tocItems.length === 0) return;

		const OFFSET = 120;

		function updateActive() {
			const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
			if (atBottom) {
				activeId = headings[headings.length - 1]?.id ?? '';
				return;
			}
			let current = headings[0]?.id ?? '';
			for (const h of headings) {
				if (h.getBoundingClientRect().top <= OFFSET) {
					current = h.id;
				}
			}
			activeId = current;
		}

		updateActive();
		window.addEventListener('scroll', updateActive, { passive: true });

		return () => window.removeEventListener('scroll', updateActive);
	}
</script>

<svelte:head>
	<title>{data.meta.title} — dev.goraebap</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
</svelte:head>

<div class="mx-auto max-w-264 md:grid md:grid-cols-[minmax(0,640px)_280px] md:gap-16">
	<!-- Left: Article -->
	<article {@attach tocAttachment}>
		<!-- Thumbnail Hero -->
		<div class="squircle mb-8 aspect-2/1 w-full overflow-hidden" style="border-radius: 20px;">
			{#if data.meta.cover}
				<img src={data.meta.cover} alt={data.meta.title} class="h-full w-full object-cover" />
			{:else}
				<div class="flex h-full w-full items-center justify-center" style="background: {gradient};">
					<span class="text-6xl font-light text-white/80" style="font-family: var(--font-heading);">
						{data.meta.title.charAt(0)}
					</span>
				</div>
			{/if}
		</div>

		<!-- Header -->
		<header class="mb-10">
			<h1
				class="mb-4 text-2xl font-normal md:text-[2rem] md:leading-[1.2]"
				style="font-family: var(--font-heading); color: var(--color-text);"
			>
				{data.meta.title}
			</h1>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div
					class="flex flex-wrap items-center gap-3 text-sm"
					style="color: var(--color-text-secondary);"
				>
					<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
					{#if data.meta.tags?.length}
						<span style="color: var(--color-border);">&middot;</span>
						{#each data.meta.tags as tag (tag)}
							<span class="font-medium" style="color: var(--color-text-tertiary);">{tag}</span>
						{/each}
					{/if}
				</div>
				<button
					onclick={copyUrl}
					class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-150"
					style="color: {copied ? 'var(--color-accent)' : 'var(--color-text-tertiary)'}; background-color: var(--color-surface);"
					title="URL 복사"
				>
					{#if copied}
						<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
						복사됨
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
						URL 복사
					{/if}
				</button>
			</div>
		</header>

		<!-- Mobile TOC (collapsible) -->
		{#if tocItems.length > 0}
			<details class="md:hidden mb-8 rounded-xl overflow-hidden" style="background-color: var(--color-surface); border: 1px solid var(--color-border);">
				<summary class="flex items-center justify-between px-4 py-3 text-sm font-semibold cursor-pointer select-none" style="color: var(--color-text-tertiary); letter-spacing: 0.05em; text-transform: uppercase; list-style: none;">
					목차
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
				</summary>
				<nav class="px-4 pb-3 pt-1">
					<ul class="flex flex-col gap-1">
						{#each tocItems as item (item.id)}
							<li>
								{#if item.level === 2}
									<a href="#{item.id}" class="block py-1 text-sm leading-snug" style="color: var(--color-text-secondary); padding-left: 0.5rem; border-left: 2px solid var(--color-border);">{item.text}</a>
								{:else}
									<a href="#{item.id}" class="block py-0.5 text-xs leading-snug" style="color: var(--color-text-tertiary); padding-left: 1.25rem;"><span style="opacity:0.4;margin-right:0.25rem;">#</span>{item.text}</a>
								{/if}
							</li>
						{/each}
					</ul>
				</nav>
			</details>
		{/if}

		<!-- Content -->
		<div class="prose" {@attach initMermaid}>
			<data.content />
		</div>
	</article>

	<!-- Right: TOC (desktop only) -->
	{#if tocItems.length > 0}
		<aside class="hidden md:block">
			<div class="sticky top-20">
				<h2
					class="mb-4 text-sm font-semibold tracking-wider uppercase"
					style="color: var(--color-text-tertiary);"
				>
					목차
				</h2>
				<nav>
					<ul class="flex flex-col gap-1">
						{#each tocItems as item (item.id)}
							<li>
								{#if item.level === 2}
									<a
										href="#{item.id}"
										class="block py-1 text-sm leading-snug transition-colors duration-150"
										style="color: {activeId === item.id ? 'var(--color-accent)' : 'var(--color-text-secondary)'}; border-left: 2px solid {activeId === item.id ? 'var(--color-accent)' : 'transparent'}; padding-left: 0.5rem;"
									>
										{item.text}
									</a>
								{:else}
									<a
										href="#{item.id}"
										class="block py-0.5 text-xs leading-snug transition-colors duration-150"
										style="color: {activeId === item.id ? 'var(--color-accent)' : 'var(--color-text-tertiary)'}; padding-left: 1.25rem;"
									>
										<span style="opacity: 0.4; margin-right: 0.25rem;">#</span>{item.text}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</nav>
			</div>
		</aside>
	{/if}
</div>
