<script lang="ts">
	import { formatDate, timeAgo } from '$lib/posts';
	import type { Post } from '$lib/posts';

	let { post }: { post: Post } = $props();

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

	let gradient = $derived(gradients[hashSlug(post.slug) % gradients.length]);
</script>

<article class="group">
	<a
		href="/blog/{post.slug}"
		class="squircle flex cursor-pointer flex-col overflow-hidden border p-2 transition-all duration-300 ease-in-out hover:shadow-sm"
		style:border-radius="28px"
		style="border-color: var(--color-border); background-color: var(--color-bg); box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);"
	>
		<!-- Cover Image -->
		<div class="squircle relative aspect-[2/1] w-full overflow-hidden" style="border-radius: 20px;">
			<div
				class="h-full w-full transition-transform duration-300 ease-in-out group-hover:scale-105"
			>
				{#if post.meta.cover}
					<img
						src={post.meta.cover}
						alt={post.meta.title}
						class="absolute inset-0 h-full w-full object-cover"
						loading="lazy"
					/>
				{:else}
					<div
						class="absolute inset-0 flex items-center justify-center"
						style="background: {gradient};"
					>
						<span
							class="text-4xl font-light text-white/80"
							style="font-family: var(--font-heading);"
						>
							{post.meta.title.charAt(0)}
						</span>
					</div>
				{/if}
			</div>

			<!-- Overlay Badge -->
			<div class="absolute top-0 right-0 m-2">
				<div
					class="squircle flex h-7 items-center px-3 text-sm backdrop-blur-md"
					style:border-radius="10px"
					style="background-color: color-mix(in srgb, var(--color-surface) 80%, transparent); color: var(--color-text); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-border) 40%, transparent), inset 1px 1px 0 0 color-mix(in srgb, var(--color-bg) 60%, transparent);"
				>
					<time datetime={post.meta.date}>{timeAgo(post.meta.date)}</time>
				</div>
			</div>
		</div>

		<!-- Title -->
		<div class="max-h-[91px] px-4 pt-4 pb-2">
			<h2
				class="line-clamp-2 text-2xl leading-snug font-normal"
				style="font-family: var(--font-heading); color: var(--color-text); letter-spacing: -0.03em;"
			>
				{post.meta.title}
			</h2>
		</div>

		<!-- Description -->
		<div class="max-h-16 px-4 pt-1 pb-2">
			<p class="line-clamp-3 text-sm leading-relaxed" style="color: var(--color-text-secondary);">
				{post.meta.description}
			</p>
		</div>

		<!-- Tags -->
		{#if post.meta.tags?.length}
			<div class="mt-auto flex flex-wrap gap-2 px-4 pt-2 pb-3">
				{#each post.meta.tags as tag}
					<span class="text-xs" style="color: var(--color-text-tertiary);">{tag}</span>
				{/each}
			</div>
		{/if}
	</a>
</article>
