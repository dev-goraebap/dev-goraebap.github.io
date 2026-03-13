<script lang="ts">
	import { formatDate } from '$lib/posts';
	import type { Post } from '$lib/posts';

	let { post }: { post: Post } = $props();
</script>

<article class="group border-b py-6" style="border-color: var(--color-border);">
	<a href="/posts/{post.slug}" class="block">
		<div class="mb-2 flex items-center gap-2 text-sm" style="color: var(--color-text-secondary);">
			<time datetime={post.meta.date}>{formatDate(post.meta.date)}</time>
		</div>
		<h2
			class="mb-2 text-xl font-semibold transition-colors duration-150 group-hover:text-[var(--color-accent)] md:text-2xl"
			style="font-family: var(--font-heading); color: var(--color-text);"
		>
			{post.meta.title}
		</h2>
		<p class="line-clamp-2 text-base" style="color: var(--color-text-secondary);">
			{post.meta.description}
		</p>
		{#if post.meta.tags?.length}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each post.meta.tags as tag (tag)}
					<span class="text-sm font-medium" style="color: var(--color-text-tertiary);">
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</a>
</article>
