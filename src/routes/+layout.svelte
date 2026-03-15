<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	let canvas: HTMLCanvasElement;
	let spotlight: HTMLDivElement;
	let mouseX = $state(0);
	let mouseY = $state(0);

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		let w = (canvas.width = window.innerWidth);
		let h = (canvas.height = window.innerHeight);
		mouseX = w / 2;
		mouseY = h / 2;

		const particles = Array.from({ length: 80 }, () => ({
			x: Math.random() * w,
			y: Math.random() * h,
			size: Math.random() * 2.5 + 0.8,
			speedX: (Math.random() - 0.5) * 0.3,
			speedY: (Math.random() - 0.5) * 0.3,
			baseOpacity: Math.random() * 0.5 + 0.25,
			phase: Math.random() * Math.PI * 2,
			twinkleSpeed: Math.random() * 0.02 + 0.008
		}));

		let tick = 0;

		function handleMouseMove(e: MouseEvent) {
			mouseX = e.clientX;
			mouseY = e.clientY;
		}

		function handleResize() {
			w = canvas.width = window.innerWidth;
			h = canvas.height = window.innerHeight;
		}

		window.addEventListener('mousemove', handleMouseMove, { passive: true });
		window.addEventListener('resize', handleResize, { passive: true });

		let frame: number;

		function animate() {
			ctx.clearRect(0, 0, w, h);
			tick++;

			for (const p of particles) {
				const dx = mouseX - p.x;
				const dy = mouseY - p.y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 200) {
					const force = (200 - dist) / 200;
					p.x -= dx * force * 0.004;
					p.y -= dy * force * 0.004;
				}

				p.x += p.speedX;
				p.y += p.speedY;

				if (p.x < -10) p.x = w + 10;
				if (p.x > w + 10) p.x = -10;
				if (p.y < -10) p.y = h + 10;
				if (p.y > h + 10) p.y = -10;

				const twinkle = Math.sin(tick * p.twinkleSpeed + p.phase) * 0.5 + 0.5;
				const opacity = p.baseOpacity * (0.5 + twinkle * 0.5);

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(180, 190, 220, ${opacity})`;
				ctx.fill();

				if (p.size > 1.5 && twinkle > 0.6) {
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(180, 190, 220, ${opacity * 0.12})`;
					ctx.fill();
				}
			}

			frame = requestAnimationFrame(animate);
		}

		animate();

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href="favicon.ico" />
</svelte:head>

{@render children?.()}

<!-- Floating particles -->
<canvas
	bind:this={canvas}
	class="no-print pointer-events-none fixed inset-0 z-10"
	aria-hidden="true"
></canvas>

<!-- Mouse-following warm spotlight -->
<div
	bind:this={spotlight}
	class="no-print pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
	style="background: radial-gradient(700px circle at {mouseX}px {mouseY}px, rgba(80, 100, 160, 0.08), transparent 70%);"
	aria-hidden="true"
></div>

<!-- Grain texture -->
<div class="no-print grain-overlay" aria-hidden="true"></div>
