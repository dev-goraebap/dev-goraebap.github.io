<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { navItems as sharedNav } from '$lib/nav';
	import { search } from '$lib/search.svelte';

	const navItems = [
		{ ...sharedNav[0] },
		{ href: '/search', label: '검색' },
		{ ...sharedNav[1] }
	];
</script>

<nav class="bottom-nav md:hidden">
	{#each navItems as { href, label } (href)}
		{@const isActive =
			href === '/'
				? !page.url.pathname.startsWith('/about')
				: page.url.pathname.startsWith(href)}
		{#if href === '/search'}
			<button
				class="bottom-nav-item"
				style="color: {search.open ? 'var(--color-accent)' : 'var(--color-text-tertiary)'};"
				onclick={() => search.show()}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
				</svg>
				<span class="bottom-nav-label">{label}</span>
			</button>
		{:else}
			<a
				href="{base}{href}"
				class="bottom-nav-item"
				style="color: {isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)'};"
			>
				{#if href === '/'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
					</svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="8" r="4" />
						<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
					</svg>
				{/if}
				<span class="bottom-nav-label">{label}</span>
			</a>
		{/if}
	{/each}
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		view-transition-name: bottom-nav;
		display: flex;
		align-items: stretch;
		background-color: color-mix(in srgb, var(--color-bg) 80%, transparent);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		border-top: 1px solid var(--color-border);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.bottom-nav-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		padding: 10px 0;
		transition: color 150ms ease;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
	}

	.bottom-nav-label {
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.02em;
	}

	@media (min-width: 768px) {
		.bottom-nav {
			display: none;
		}
	}
</style>
