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
				<p>
					안녕하세요, <strong>데브고래밥</strong>입니다.
				</p>
				<p>
					이곳은 제가 직접 겪고, 고민하고, 해결한 것들을 기록하는 공간입니다. 공부 노트나 단순한
					메모가 아니라, 한 편 한 편 공을 들여 쓴 글만 올립니다. 양보다 질이라고 믿기 때문입니다.
				</p>
				<p>
					글 하나를 쓸 때마다 &ldquo;이 글이 누군가에게 실제로 도움이 될까&rdquo;를 먼저 생각합니다.
					그 기준을 통과한 것들만 여기에 남깁니다.
				</p>

				<h2>주로 다루는 것들</h2>
				<ul>
					<li>TypeScript · JavaScript</li>
					<li>SvelteKit · React</li>
					<li>Node.js · 인프라</li>
				</ul>

				<h2>연락</h2>
				<p>
					글에 대한 의견이나 이야기 나누고 싶은 게 있다면 언제든지 환영합니다.
				</p>
			</div>
		</div>
	</div>
</div>
