<script lang="ts">
	import { page } from '$app/state';
	import LiquidGlass from './LiquidGlass.svelte';
	import { navItems } from '$lib/nav';
	import { search } from '$lib/search.svelte';

	let dark = $state(false);

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});
</script>

<header class="sticky top-0 z-10 px-4 py-3 md:px-8">
	<nav class="mx-auto flex max-w-[1056px] items-center justify-between">
		<!-- Logo + Nav -->
		<div class="flex items-center gap-5">
			<a
				href="/"
				class="text-2xl font-medium tracking-tight transition-colors duration-150"
				style="color: var(--color-text); font-family: var(--font-logo);"
				onclick={(e) => {
					if (page.url.pathname === '/') e.preventDefault();
				}}
			>
				dev.goraebap
			</a>
			{#each navItems as { href, label } (href)}
				{@const isActive =
					href === '/'
						? !page.url.pathname.startsWith('/about')
						: page.url.pathname.startsWith(href)}
				{@const isCurrent = page.url.pathname === href}
				<a
					{href}
					class="hidden text-sm font-medium transition-colors duration-150 md:inline"
					style="color: {isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)'};"
					aria-current={isCurrent ? 'page' : undefined}
					onclick={(e) => {
						if (isCurrent) e.preventDefault();
					}}
				>
					{label}
				</a>
			{/each}
		</div>

		<!-- Right: Search + Theme Toggle -->
		<div class="flex items-center gap-2">
			<!-- Search Bar (desktop only) -->
			<div class="hidden md:block">
				<LiquidGlass class="h-9 w-55 cursor-pointer items-center px-3 text-sm" onclick={() => (search.open = true)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="shrink-0"
						style="color: var(--color-text-tertiary);"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					<span class="ml-2" style="color: var(--color-text-tertiary);">검색...</span>
					<span class="ml-auto flex items-center gap-0.5">
						<kbd
							class="rounded px-1 py-0.5 text-[10px] leading-none"
							style="color: var(--color-text-tertiary); background-color: color-mix(in srgb, var(--color-text) 8%, transparent); border: 1px solid var(--color-border);"
							>⌘</kbd
						>
						<kbd
							class="rounded px-1 py-0.5 text-[10px] leading-none"
							style="color: var(--color-text-tertiary); background-color: color-mix(in srgb, var(--color-text) 8%, transparent); border: 1px solid var(--color-border);"
							>K</kbd
						>
					</span>
				</LiquidGlass>
			</div>

			<!-- Theme Toggle -->
			<LiquidGlass
				class="group flex h-10 w-10 cursor-pointer items-center justify-center"
				pill={true}
				onclick={toggleTheme}
			>
				<div class="relative h-5 w-5">
					<!-- Sun icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute inset-0 scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90"
						style="color: var(--color-text-secondary);"
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</svg>

					<!-- Moon icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="absolute inset-0 scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0"
						style="color: var(--color-text-secondary);"
					>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				</div>
			</LiquidGlass>
		</div>
	</nav>
</header>

<style>
	header {
		background-color: color-mix(in srgb, var(--color-bg) 75%, transparent);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		border-bottom: 1px solid var(--color-border);
		view-transition-name: top-bar;
	}
</style>
