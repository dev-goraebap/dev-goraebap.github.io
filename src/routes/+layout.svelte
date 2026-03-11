<script lang="ts">
	import './layout.css';
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import TopBar from '$lib/components/TopBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="dev.goraebap - 기술과 경험을 기록합니다" />
</svelte:head>

<div class="relative flex min-h-screen flex-col" style="background-color: var(--color-bg);">
	<TopBar />
	<main class="mx-auto w-full max-w-264 flex-1 px-4 py-8 pb-24 md:px-8 md:py-12 md:pb-12" style="view-transition-name: main-content;">
		{@render children()}
	</main>
	<div class="hidden md:block"><Footer /></div>
	<BottomNav />
</div>
