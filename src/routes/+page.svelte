<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import LiquidGlass from '$lib/components/LiquidGlass.svelte';

	let { data } = $props();

	let selectedTag = $state<string | null>(null);

	let filteredPosts = $derived.by(() => {
		if (!selectedTag) return data.posts.slice(0, 6);
		return data.posts.filter((p) => p.meta.tags?.includes(selectedTag!));
	});

	// 태그별 사용 횟수 집계
	let tagCounts = $derived.by(() => {
		const map = new Map<string, number>();
		for (const post of data.posts) {
			for (const tag of post.meta.tags ?? []) {
				map.set(tag, (map.get(tag) ?? 0) + 1);
			}
		}
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	});

	function selectTag(tag: string) {
		selectedTag = selectedTag === tag ? null : tag;
	}
</script>

<svelte:head>
	<title>dev.goraebap</title>
</svelte:head>

<div class="mx-auto max-w-[1056px] md:grid md:grid-cols-[minmax(0,640px)_280px] md:gap-16">
	<!-- Left: Feed -->
	<div>
		<!-- Feed Header -->
		<section class="mb-6">
			<h1
				class="text-3xl leading-normal font-normal"
				style="font-family: var(--font-heading); color: var(--color-text);"
			>
				읽어볼 만한 글
			</h1>
			<p class="text-sm" style="color: var(--color-text-secondary);">
				개발하며 배운 것들을 기록합니다
			</p>
		</section>

		<!-- Feed -->
		{#if filteredPosts.length > 0}
			<section class="flex flex-col gap-4">
				{#each filteredPosts as post (post.slug)}
					<PostCard {post} />
				{/each}
			</section>
		{:else}
			<p class="text-sm" style="color: var(--color-text-tertiary);">
				'{selectedTag}' 태그의 글이 없습니다.
			</p>
		{/if}

		{#if !selectedTag && data.posts.length > 6}
			<div class="mt-10 text-center">
				<a
					href="/blog"
					class="text-sm font-medium transition-colors duration-150"
					style="color: var(--color-accent);"
				>
					모든 글 보기 &rarr;
				</a>
			</div>
		{/if}
	</div>

	<!-- Right: Tag Cloud (desktop only) -->
	<aside class="hidden md:block">
		<div class="sticky top-20">
			<h2
				class="mb-4 text-lg font-normal"
				style="font-family: var(--font-heading); color: var(--color-text);"
			>
				Topics
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each tagCounts as [tag, count]}
					{@const active = selectedTag === tag}
					<LiquidGlass
						class="tag-chip h-8 cursor-pointer items-center px-3 text-sm"
						pill={true}
						onclick={() => selectTag(tag)}
					>
						<span
							style="color: {active
								? 'var(--color-accent)'
								: 'var(--color-text-secondary)'}; transition: color 150ms ease;">{tag}</span
						>
						<span
							class="ml-1.5 text-xs"
							style="color: {active
								? 'var(--color-accent)'
								: 'var(--color-text-tertiary)'}; transition: color 150ms ease;">{count}</span
						>
					</LiquidGlass>
				{/each}
			</div>

			{#if selectedTag}
				<button
					onclick={() => (selectedTag = null)}
					class="mt-3 text-xs transition-colors duration-150"
					style="color: var(--color-text-tertiary);"
				>
					✕ 필터 초기화
				</button>
			{/if}
		</div>
	</aside>
</div>

<style>
	:global(.tag-chip:hover span) {
		color: var(--color-text) !important;
	}
</style>
