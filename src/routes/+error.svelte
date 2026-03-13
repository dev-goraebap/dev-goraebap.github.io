<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { base } from '$app/paths';

	const messages: Record<number, { title: string; desc: string }> = {
		404: { title: '페이지를 찾을 수 없습니다', desc: '요청하신 페이지가 존재하지 않거나 이동되었어요' },
		500: { title: '서버에 문제가 발생했습니다', desc: '잠시 후 다시 시도해 주세요' }
	};

	let status = $derived(page.status);
	let info = $derived(messages[status] ?? { title: '오류가 발생했습니다', desc: page.error?.message ?? '알 수 없는 오류입니다' });
</script>

<div class="error-page" style="background-color: var(--color-bg);">
	<img
		src="/error.svg"
		alt=""
		class="mb-8 h-64 w-64 select-none object-contain dark:invert dark:hue-rotate-180"
		draggable="false"
		aria-hidden="true"
	/>
	<p class="mb-2 text-6xl font-light" style="color: var(--color-text-tertiary); font-family: var(--font-heading);">
		{status}
	</p>
	<p class="mb-1 text-lg" style="color: var(--color-text); font-family: var(--font-heading);">
		{info.title}
	</p>
	<p class="mb-8 text-sm" style="color: var(--color-text-tertiary);">
		{info.desc}
	</p>
	<a
		href="{base}/"
		class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors duration-150"
		style="color: var(--color-accent); background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
		홈으로 돌아가기
	</a>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1rem;
	}
</style>
