<script lang="ts">
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.querySelectorAll('img').forEach((img) => {
			if (img.complete) img.classList.add('loaded');
		});

		document.addEventListener(
			'load',
			(e) => {
				if (e.target instanceof HTMLImageElement) {
					e.target.classList.add('loaded');
				}
			},
			true
		);
	});
</script>

{@render children()}
