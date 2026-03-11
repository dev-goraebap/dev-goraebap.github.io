<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>글 — dev.goraebap</title>
</svelte:head>

<h1
	class="mb-8 text-center text-3xl leading-normal font-normal"
	style="font-family: var(--font-heading); color: var(--color-text);"
>
	글
</h1>

{#if data.posts.length > 0}
	<div class="mx-auto flex max-w-[640px] flex-col gap-4">
		{#each data.posts as post (post.slug)}
			<PostCard {post} />
		{/each}
	</div>
{:else}
	<p class="text-center" style="color: var(--color-text-secondary);">아직 작성된 글이 없습니다.</p>
{/if}
