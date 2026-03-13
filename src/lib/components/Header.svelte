<script lang="ts">
	import { page } from '$app/state';

	let dark = $state(false);

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	const navItems = [
		{ href: '/posts', label: '피드' },
		{ href: '/about', label: '헬로월드' }
	];
</script>

<header
	class="sticky top-0 z-10 border-b backdrop-blur-sm"
	style="border-color: var(--color-border); background-color: color-mix(in srgb, var(--color-bg) 85%, transparent);"
>
	<nav class="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-8">
		<a
			href="/"
			class="font-heading text-xl font-bold transition-colors duration-150"
			style="color: var(--color-text); font-family: var(--font-heading);"
		>
			Goraebap Studio
		</a>

		<div class="flex items-center gap-6">
			{#each navItems as { href, label } (href)}
				<a
					{href}
					class="text-sm font-medium transition-colors duration-150"
					style="color: {page.url.pathname.startsWith(href)
						? 'var(--color-accent)'
						: 'var(--color-text-secondary)'};"
					onmouseenter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
					onmouseleave={(e) => {
						if (!page.url.pathname.startsWith(href)) {
							e.currentTarget.style.color = 'var(--color-text-secondary)';
						}
					}}
				>
					{label}
				</a>
			{/each}

			<button
				onclick={toggleTheme}
				class="cursor-pointer rounded-md p-2 transition-colors duration-150"
				style="color: var(--color-text-secondary);"
				aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
			>
				{#if dark}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
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
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				{/if}
			</button>
		</div>
	</nav>
</header>
