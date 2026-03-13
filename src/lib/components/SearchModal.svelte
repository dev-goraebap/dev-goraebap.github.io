<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { tick } from 'svelte';
	import { search } from '$lib/search.svelte';
	import type { Post } from '$lib/posts';

	let { posts }: { posts: Post[] } = $props();

	let query = $state('');
	let selectedIndex = $state(0);
	let inputEl: HTMLInputElement;

	// ── Search scoring ──
	function scorePost(post: Post, raw: string): number {
		const q = raw.toLowerCase().trim();
		if (!q) return 0;

		const tokens = q.split(/\s+/).filter(Boolean);
		const title = post.meta.title.toLowerCase();
		const desc = (post.meta.description ?? '').toLowerCase();
		const tags = (post.meta.tags ?? []).map((t) => t.toLowerCase()).join(' ');

		let s = 0;

		// Full phrase match (highest priority)
		if (title.includes(q)) s += 10;
		if (desc.includes(q)) s += 5;
		if (tags.includes(q)) s += 4;

		// Per-token match
		for (const token of tokens) {
			if (title.includes(token)) s += 5;
			if (tags.includes(token)) s += 3;
			if (desc.includes(token)) s += 2;
			// Bonus: token starts a word in title
			if (new RegExp(`\\b${token}`).test(title)) s += 2;
		}

		return s;
	}

	let results = $derived.by(() => {
		const q = query.trim();
		if (!q) return [];

		return posts
			.map((p) => ({ post: p, s: scorePost(p, q) }))
			.filter((r) => r.s > 0)
			.sort(
				(a, b) =>
					b.s - a.s ||
					new Date(b.post.meta.date).getTime() - new Date(a.post.meta.date).getTime()
			)
			.slice(0, 5)
			.map((r) => r.post);
	});

	// Reset selection when results change
	$effect(() => {
		selectedIndex = results.length >= 0 ? 0 : 0;
	});

	// Lock body scroll when modal is open
	$effect(() => {
		document.body.style.overflow = search.open ? 'hidden' : '';
	});

	// Register focus callback for mobile keyboard support
	$effect(() => {
		search.onOpen = () => {
			tick().then(() => inputEl?.focus());
		};
		return () => { search.onOpen = null; };
	});

	function closeModal() {
		search.open = false;
		query = '';
		selectedIndex = 0;
	}

	function navigate(post: Post) {
		goto(`${base}/posts/${post.slug}`);
		closeModal();
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
			e.preventDefault();
			if (search.open) { closeModal(); } else { search.show(); }
			return;
		}
		if (!search.open) return;

		if (e.key === 'Escape') {
			closeModal();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			const post = results[selectedIndex];
			if (post) navigate(post);
		}
	}

	// Highlight matched tokens in text
	function highlight(text: string, q: string): string {
		if (!q.trim()) return text;
		const tokens = q
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.sort((a, b) => b.length - a.length);
		const pattern = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
		return text.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if search.open}
	<!-- Backdrop -->
	<div
		class="search-backdrop"
		onclick={closeModal}
		role="presentation"
	></div>

	<!-- Modal -->
	<div class="search-modal" role="dialog" aria-modal="true" aria-label="검색">
		<!-- Input -->
		<div class="search-input-wrap">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="search-icon"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<input
				bind:this={inputEl}
				bind:value={query}
				type="text"
				placeholder="검색어를 입력하세요..."
				class="search-input"
				autocomplete="off"
				spellcheck="false"
			/>
			<kbd class="search-esc-hint">esc</kbd>
		</div>

		<!-- Results -->
		{#if query.trim()}
			{#if results.length > 0}
				<ul class="search-results">
					{#each results as post, i (post.slug)}
						<li>
							<a
								href="/posts/{post.slug}"
								class="search-item"
								class:search-item--active={i === selectedIndex}
								onclick={(e) => { e.preventDefault(); navigate(post); }}
								onmouseenter={() => (selectedIndex = i)}
							>
								<div class="search-item-title">
									{@html highlight(post.meta.title, query)}
								</div>
								{#if post.meta.description}
									<div class="search-item-desc">
										{@html highlight(post.meta.description, query)}
									</div>
								{/if}
								{#if post.meta.tags?.length}
									<div class="search-item-tags">
										{#each post.meta.tags as tag (tag)}
											<span class="search-tag">#{tag}</span>
										{/each}
									</div>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
				<div class="search-footer">
					<span>↑↓ 이동</span>
					<span>↵ 열기</span>
					<span>esc 닫기</span>
				</div>
			{:else}
				<div class="search-empty">
					<span>'{query}' 에 대한 결과가 없습니다</span>
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.search-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background-color: color-mix(in srgb, var(--color-text) 20%, transparent);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		animation: fade-in 150ms ease;
	}

	.search-modal {
		position: fixed;
		top: 15vh;
		left: 50%;
		transform: translateX(-50%);
		z-index: 101;
		width: min(600px, calc(100vw - 2rem));
		border-radius: 16px;
		overflow: hidden;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.15),
			0 4px 16px rgba(0, 0, 0, 0.08);
		animation: modal-in 150ms ease;
	}

	.search-input-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.search-icon {
		flex-shrink: 0;
		color: var(--color-text-tertiary);
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-size: 1rem;
		color: var(--color-text);
		font-family: var(--font-body);
	}

	.search-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.search-esc-hint {
		font-size: 0.6875rem;
		padding: 0.2em 0.5em;
		border-radius: 4px;
		color: var(--color-text-tertiary);
		background-color: color-mix(in srgb, var(--color-text) 6%, transparent);
		border: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.search-results {
		list-style: none;
		margin: 0;
		padding: 0.5rem;
	}

	.search-item {
		display: block;
		padding: 0.75rem 0.875rem;
		border-radius: 10px;
		text-decoration: none;
		transition: background-color 100ms ease;
		cursor: pointer;
	}

	.search-item--active {
		background-color: color-mix(in srgb, var(--color-accent) 8%, transparent);
	}

	.search-item-title {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text);
		margin-bottom: 0.25rem;
		font-family: var(--font-heading);
	}

	.search-item-desc {
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.search-item-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-top: 0.375rem;
	}

	.search-tag {
		font-size: 0.6875rem;
		color: var(--color-text-tertiary);
		background-color: color-mix(in srgb, var(--color-text) 6%, transparent);
		padding: 0.15em 0.5em;
		border-radius: 4px;
	}

	.search-footer {
		display: flex;
		gap: 1rem;
		padding: 0.625rem 1.25rem;
		border-top: 1px solid var(--color-border);
		font-size: 0.6875rem;
		color: var(--color-text-tertiary);
	}

	.search-empty {
		padding: 2rem 1rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	:global(.search-item-title mark),
	:global(.search-item-desc mark) {
		background: color-mix(in srgb, var(--color-accent) 20%, transparent);
		color: var(--color-accent);
		border-radius: 2px;
		padding: 0 1px;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes modal-in {
		from { opacity: 0; transform: translateX(-50%) scale(0.96) translateY(-8px); }
		to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
	}
</style>
