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
				? page.route.id !== '/about'
				: page.route.id?.startsWith(href)}
		{#if href === '/search'}
			<button
				class="bottom-nav-item"
				style="color: {search.open ? 'var(--color-accent)' : 'var(--color-text-tertiary)'};"
				onclick={() => search.show()}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
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
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
