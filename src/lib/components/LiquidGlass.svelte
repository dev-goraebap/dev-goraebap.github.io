<script lang="ts">
	let {
		children,
		class: className = '',
		pill = true,
		onclick
	}: {
		children: import('svelte').Snippet;
		class?: string;
		pill?: boolean;
		onclick?: (e: MouseEvent) => void;
	} = $props();

	let wrapper: HTMLElement;
	let layers: HTMLElement;

	// Spring physics state
	let targetOX = 50,
		targetOY = 50;
	let targetSX = 1,
		targetSY = 1;
	let currentOX = 50,
		currentOY = 50;
	let currentSX = 1,
		currentSY = 1;
	let velocityOX = 0,
		velocityOY = 0;
	let velocitySX = 0,
		velocitySY = 0;
	let animating = false;

	const stiffness = 0.08;
	const damping = 0.7;

	function tick() {
		// Spring for origin
		let forceOX = (targetOX - currentOX) * stiffness;
		let forceOY = (targetOY - currentOY) * stiffness;
		velocityOX = (velocityOX + forceOX) * damping;
		velocityOY = (velocityOY + forceOY) * damping;
		currentOX += velocityOX;
		currentOY += velocityOY;

		// Spring for scale
		let forceSX = (targetSX - currentSX) * stiffness;
		let forceSY = (targetSY - currentSY) * stiffness;
		velocitySX = (velocitySX + forceSX) * damping;
		velocitySY = (velocitySY + forceSY) * damping;
		currentSX += velocitySX;
		currentSY += velocitySY;

		if (layers) {
			layers.style.transformOrigin = `${currentOX}% ${currentOY}%`;
			layers.style.transform = `scaleX(${currentSX}) scaleY(${currentSY})`;
		}

		const settling =
			Math.abs(velocityOX) + Math.abs(velocityOY) + Math.abs(velocitySX) + Math.abs(velocitySY) >
				0.0001 ||
			Math.abs(targetOX - currentOX) +
				Math.abs(targetOY - currentOY) +
				Math.abs(targetSX - currentSX) +
				Math.abs(targetSY - currentSY) >
				0.01;

		if (settling) {
			requestAnimationFrame(tick);
		} else {
			animating = false;
		}
	}

	function startAnimation() {
		if (!animating) {
			animating = true;
			requestAnimationFrame(tick);
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		targetOX = x;
		targetOY = y;

		const dx = (x - 50) / 50;
		const dy = (y - 50) / 50;
		targetSX = 1 + Math.abs(dx) * 0.08;
		targetSY = 1 + Math.abs(dy) * 0.08;

		startAnimation();
	}

	function handleMouseLeave() {
		targetSX = 1;
		targetSY = 1;
		targetOX = 50;
		targetOY = 50;
		startAnimation();
	}
</script>

<!-- SVG filter (hidden, shared) -->
<svg class="absolute h-0 w-0" aria-hidden="true">
	<defs>
		<filter
			id="glass-distortion"
			x="0%"
			y="0%"
			width="100%"
			height="100%"
			filterUnits="objectBoundingBox"
		>
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.001 0.005"
				numOctaves="1"
				seed="17"
				result="turbulence"
			/>
			<feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
			<feSpecularLighting
				in="softMap"
				surfaceScale="5"
				specularConstant="1"
				specularExponent="100"
				lighting-color="white"
				result="specLight"
			>
				<fePointLight x="-200" y="-200" z="300" />
			</feSpecularLighting>
			<feComposite
				in="specLight"
				operator="arithmetic"
				k1="0"
				k2="1"
				k3="1"
				k4="0"
				result="litImage"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="softMap"
				scale="100"
				xChannelSelector="R"
				yChannelSelector="G"
			/>
		</filter>
	</defs>
</svg>

<div
	bind:this={wrapper}
	class="liquid-glass-wrapper {pill ? 'liquid-glass-pill' : ''} {className}"
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	{onclick}
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
>
	<div bind:this={layers} class="liquid-glass-visual-layers">
		<div class="liquid-glass-effect"></div>
		<div class="liquid-glass-tint"></div>
		<div class="liquid-glass-shine"></div>
	</div>
	<div class="liquid-glass-content">
		{@render children()}
	</div>
</div>
