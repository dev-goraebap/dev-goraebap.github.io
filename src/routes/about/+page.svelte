<script lang="ts">
	let { data } = $props();
	const Content = data.content;
</script>

<svelte:head>
	<title>소개 — dev.goraebap</title>
</svelte:head>

<div class="mx-auto max-w-264">
	<div class="flex flex-col md:grid md:grid-cols-[360px_minmax(0,1fr)] md:gap-16 md:items-start">
		<!-- Left: Illustration (mobile: below content) -->
		<div class="order-2 mx-auto mt-8 w-64 md:order-1 md:mt-0 md:w-full">
			<img
				src="/item-02.png"
				alt="몬스테라 화분 일러스트"
				class="w-full select-none"
				draggable="false"
			/>
		</div>

		<!-- Right: Content (mobile: above image) -->
		<div class="order-1 md:order-2">
			<h1
				class="mb-6 text-4xl font-extrabold leading-none md:text-5xl"
				style="font-family: var(--font-heading); color: var(--color-text); letter-spacing: -0.01em;"
			>
				hello world!
			</h1>

			<div class="prose">
				<Content />
			</div>
		</div>
	</div>
</div>
