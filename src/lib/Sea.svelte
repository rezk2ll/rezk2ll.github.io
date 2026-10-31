<script lang="ts">
	import { onMount } from 'svelte';
	import { buildStrip, createPond, STRIP_FLOATS, STRIP_INDICES, touches, updatePond } from './koi';

	export const REVEAL_MS = 1100;

	let canvas: HTMLCanvasElement;
	let drops: [number, number, number, number][] = [];
	let themeFrom = 0;
	let themeTo = 0;
	let reveal = { x: 0, y: 0, start: -1e9 };

	export function splash(x: number, y: number, radius = 20, strength = 0.3) {
		if (drops.length < 16) drops.push([x, y, radius, strength]);
	}

	// The new theme spreads through the water as a circle growing from (x, y).
	export function setTheme(light: boolean, instant = false, x = 0, y = 0) {
		themeFrom = instant ? (light ? 1 : 0) : themeTo;
		themeTo = light ? 1 : 0;
		reveal = { x, y, start: instant ? -1e9 : performance.now() };
	}

	const QUAD_VERT = `#version 300 es
layout(location = 0) in vec2 p;
out vec2 uv;
void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

	const DROP = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D state;
uniform vec4 drops[16];
uniform int count;
uniform vec2 size;
void main() {
	vec4 s = texture(state, uv);
	for (int k = 0; k < 16; k++) {
		if (k >= count) break;
		float d = max(0.0, 1.0 - length((uv - drops[k].xy) * size) / drops[k].z);
		s.r += (0.5 - cos(d * 3.14159) * 0.5) * drops[k].w;
	}
	o = s;
}`;

	// Height in r, velocity in g: a damped wave equation on a quarter-resolution grid, with a little
	// diffusion so the grid never shows up as a checkerboard.
	const STEP = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D state;
uniform vec2 texel;
void main() {
	vec4 s = texture(state, uv);
	float avg = (
		texture(state, uv - vec2(texel.x, 0.0)).r + texture(state, uv + vec2(texel.x, 0.0)).r +
		texture(state, uv - vec2(0.0, texel.y)).r + texture(state, uv + vec2(0.0, texel.y)).r
	) * 0.25;
	s.g += (avg - s.r) * 2.0;
	s.g *= 0.993;
	s.r += s.g;
	s.r += (avg - s.r) * 0.08;
	s.r *= 0.998;
	o = s;
}`;

	const FISH_VERT = `#version 300 es
layout(location = 0) in vec2 pos;
layout(location = 1) in vec2 tex;
uniform vec2 res;
out vec2 vUv;
void main() {
	vUv = tex;
	gl_Position = vec4(pos.x / res.x * 2.0 - 1.0, 1.0 - pos.y / res.y * 2.0, 0.0, 1.0);
}`;

	// Output is premultiplied; the water pass adds scene light, caustics and absorption.
	const FISH_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D photo;
uniform float fade;
void main() {
	vec4 c = texture(photo, vUv);
	o = vec4(c.rgb * c.a, c.a) * fade;
}`;

	// Looking straight down into the water: a sandy bed refracted by the surface, caustics focused by
	// the waves, the koi between bed and surface with their shadows, depth absorption, and glints.
	const RENDER = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform sampler2D sim;
uniform sampler2D fish;
uniform vec2 res;
uniform vec2 simTexel;
uniform vec2 mouse;
uniform float time;
uniform vec2 themes;
uniform vec3 reveal;
uniform float scroll;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
	vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float v = 0.0; float a = 0.5;
	for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
	return v;
}
float waves(vec2 p) {
	return fbm(p * 0.0045 + vec2(time * 0.025, time * 0.017)) * 0.6 + fbm(p * 0.011 - vec2(time * 0.04, -time * 0.03)) * 0.4;
}
float causticLayer(vec2 p, float t) {
	vec2 q = mod(p * 6.2831, 6.2831) - 250.0;
	vec2 i = q;
	float c = 1.0;
	for (int n = 0; n < 5; n++) {
		float tt = t * (1.0 - 3.5 / float(n + 1));
		i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
		c += 1.0 / length(vec2(q.x / (sin(i.x + tt) / 0.005), q.y / (cos(i.y + tt) / 0.005)));
	}
	c /= 5.0;
	c = 1.17 - pow(c, 1.4);
	return pow(abs(c), 8.0);
}
float caustics(vec2 p) {
	float t = time * 0.4 + 23.0;
	mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
	return causticLayer(p / 420.0, t) * 0.6 + causticLayer(r * p / 290.0, t * 1.13) * 0.5;
}

void main() {
	vec2 px = uv * res;
	float rd = length(px - reveal.xy) - reveal.z;
	float theme = mix(themes.x, themes.y, smoothstep(60.0, -60.0, rd));

	float h = texture(sim, uv).r;
	float hl = texture(sim, uv - vec2(simTexel.x * 1.5, 0.0)).r;
	float hr = texture(sim, uv + vec2(simTexel.x * 1.5, 0.0)).r;
	float hd = texture(sim, uv - vec2(0.0, simTexel.y * 1.5)).r;
	float hu = texture(sim, uv + vec2(0.0, simTexel.y * 1.5)).r;
	float vel = texture(sim, uv).g;
	float lap = hl + hr + hd + hu - 4.0 * h;

	float w0 = waves(px);
	vec2 wg = vec2(waves(px + vec2(2.0, 0.0)) - w0, waves(px + vec2(0.0, 2.0)) - w0);
	vec2 grad = vec2(hr - hl, hu - hd) * 2.2 + wg * 9.0;
	vec3 n = normalize(vec3(-grad, 1.0));

	vec2 bedP = px - vec2(0.0, scroll * 0.35) + n.xy * 46.0;
	float big = fbm(bedP * 0.0021);
	float dunes = sin(dot(bedP, vec2(0.055, 0.022)) + fbm(bedP * 0.008) * 7.0) * 0.5 + 0.5;
	float grain = noise(bedP * 0.9) * 0.6 + noise(bedP * 0.23) * 0.4;
	vec3 sand = vec3(0.93, 0.84, 0.66) * (0.8 + 0.12 * dunes + 0.08 * grain);
	float rock = smoothstep(0.6, 0.78, fbm(bedP * 0.006 + 3.0));
	sand = mix(sand, vec3(0.42, 0.44, 0.38) * (0.8 + grain * 0.3), rock * 0.75);
	float weed = smoothstep(0.62, 0.8, big) * (0.6 + 0.4 * noise(bedP * 0.05 + time * 0.2));
	sand = mix(sand, vec3(0.25, 0.42, 0.28), weed * 0.6);
	float depth = mix(0.45, 1.5, big);

	float c = caustics(bedP + n.xy * 30.0) + max(0.0, -lap) * 60.0;

	vec2 fp = px + n.xy * 22.0;
	vec4 fc = texture(fish, fp / res);
	vec2 sp = fp + vec2(-26.0, 34.0);
	float sh = (
		texture(fish, sp / res).a +
		texture(fish, (sp + vec2(11.0, 7.0)) / res).a + texture(fish, (sp + vec2(-7.0, 11.0)) / res).a +
		texture(fish, (sp + vec2(-11.0, -7.0)) / res).a + texture(fish, (sp + vec2(7.0, -11.0)) / res).a
	) * 0.2;

	vec3 sun = vec3(1.0, 0.97, 0.9);
	vec3 moon = vec3(0.3, 0.4, 0.62) * 0.7;
	float torch = exp(-dot(px - mouse, px - mouse) / 52000.0);
	vec3 light = mix(moon + vec3(1.0, 0.92, 0.75) * torch * 1.6, sun, theme);
	float causticGain = mix(0.25 + torch * 1.2, 1.25, theme);

	vec3 bed = sand * light * (0.7 + c * causticGain) * (1.0 - sh * 0.5);
	vec3 koiLight = mix(vec3(0.66, 0.74, 0.9) + vec3(1.0, 0.92, 0.75) * torch * 0.8, sun, theme);
	vec3 koi = fc.rgb * koiLight * (0.9 + c * causticGain * 0.35);

	vec3 absorb = mix(vec3(0.7, 0.32, 0.2), vec3(0.55, 0.14, 0.09), theme);
	vec3 water = mix(vec3(0.01, 0.05, 0.1), vec3(0.04, 0.42, 0.52), theme);
	vec3 tb = exp(-absorb * depth * 2.0);
	vec3 tf = exp(-absorb * depth * mix(0.25, 0.6, theme));
	vec3 col = (bed * tb + water * (1.0 - tb)) * (1.0 - fc.a) + koi * tf + water * (1.0 - tf) * fc.a;

	vec3 sky = mix(vec3(0.02, 0.05, 0.12), vec3(0.75, 0.9, 1.0), theme);
	col = mix(col, sky, clamp(0.04 + (1.0 - n.z) * 6.0, 0.0, 0.35));

	vec3 ld = normalize(mix(vec3(0.3, 0.45, 0.85), vec3(-0.35, 0.5, 0.8), theme));
	vec3 hv = normalize(ld + vec3(0.0, 0.0, 1.0));
	float spec = pow(max(dot(n, hv), 0.0), mix(700.0, 500.0, theme));
	col += spec * mix(vec3(0.6, 0.75, 1.0) * 0.8, vec3(1.0, 0.98, 0.9) * 2.2, theme);

	float glow = smoothstep(0.003, 0.03, abs(vel)) * step(0.55, noise(px * 0.35 + time * 3.0));
	col += vec3(0.15, 0.85, 1.0) * glow * (1.0 - theme) * 0.9;

	vec2 vq = uv - 0.5;
	col *= 1.0 - dot(vq, vq) * mix(0.9, 0.35, theme);

	float front = exp(-rd * rd / 900.0) * abs(themes.y - themes.x);
	col += vec3(0.75, 0.95, 1.0) * front * 0.35 * (0.6 + 0.4 * noise(px * 0.08 + time));
	o = vec4(col, 1.0);
}`;

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
		if (!gl) {
			canvas.style.background = 'linear-gradient(#0b4f6c, #04121e)';
			return;
		}
		const ripples = !!gl.getExtension('EXT_color_buffer_float');

		function program(vert: string, frag: string) {
			const p = gl!.createProgram()!;
			for (const [type, src] of [
				[gl!.VERTEX_SHADER, vert],
				[gl!.FRAGMENT_SHADER, frag]
			] as const) {
				const s = gl!.createShader(type)!;
				gl!.shaderSource(s, src);
				gl!.compileShader(s);
				if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) console.error(gl!.getShaderInfoLog(s));
				gl!.attachShader(p, s);
			}
			gl!.linkProgram(p);
			if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) console.error(gl!.getProgramInfoLog(p));
			const cache: Record<string, WebGLUniformLocation | null> = {};
			const u = (name: string) => {
				if (!(name in cache)) cache[name] = gl!.getUniformLocation(p, name);
				return cache[name];
			};
			return { p, u };
		}
		const dropP = program(QUAD_VERT, DROP);
		const stepP = program(QUAD_VERT, STEP);
		const renderP = program(QUAD_VERT, RENDER);
		const fishP = program(FISH_VERT, FISH_FRAG);

		const quadVao = gl.createVertexArray();
		gl.bindVertexArray(quadVao);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		const fishVao = gl.createVertexArray();
		gl.bindVertexArray(fishVao);
		const fishVbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, fishVbo);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, STRIP_INDICES, gl.STATIC_DRAW);
		gl.bindVertexArray(null);

		const photos = ['/koi/kohaku.png', '/koi/ogon.png'].map((src) => {
			const photo = { tex: gl.createTexture()!, aspect: 0 };
			const img = new Image();
			img.onload = () => {
				texture(photo.tex, true);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
				gl.generateMipmap(gl.TEXTURE_2D);
				photo.aspect = img.height / img.width;
				if (reduced) render(4000);
			};
			img.src = src;
			return photo;
		});

		let W = 0;
		let H = 0;
		let sw = 1;
		let sh = 1;
		let targets: { tex: WebGLTexture; fb: WebGLFramebuffer }[] = [];
		const fishTex = gl.createTexture()!;
		const fishFb = gl.createFramebuffer()!;

		function texture(tex: WebGLTexture, mips: boolean) {
			gl!.bindTexture(gl!.TEXTURE_2D, tex);
			gl!.texParameteri(
				gl!.TEXTURE_2D,
				gl!.TEXTURE_MIN_FILTER,
				mips ? gl!.LINEAR_MIPMAP_LINEAR : gl!.LINEAR
			);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
		}

		function target() {
			const tex = gl!.createTexture()!;
			texture(tex, false);
			gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA16F, sw, sh, 0, gl!.RGBA, gl!.HALF_FLOAT, null);
			const fb = gl!.createFramebuffer()!;
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
			gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
			gl!.clearColor(0, 0, 0, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
			return { tex, fb };
		}

		function resize() {
			W = innerWidth;
			H = innerHeight;
			canvas.width = W;
			canvas.height = H;
			sw = Math.ceil(W / 4);
			sh = Math.ceil(H / 4);
			for (const t of targets) {
				gl!.deleteTexture(t.tex);
				gl!.deleteFramebuffer(t.fb);
			}
			targets = ripples ? [target(), target()] : [];

			texture(fishTex, false);
			gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA8, W, H, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, fishFb);
			gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, fishTex, 0);
		}
		resize();

		const fishes = createPond(W, H);
		const input = { px: -1e4, py: -1e4, pspeed: 0 };
		const strip = new Float32Array(STRIP_FLOATS);

		function pass(prog: { u: (n: string) => WebGLUniformLocation | null }) {
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, targets[1].fb);
			gl!.activeTexture(gl!.TEXTURE0);
			gl!.bindTexture(gl!.TEXTURE_2D, targets[0].tex);
			gl!.uniform1i(prog.u('state'), 0);
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
			targets.reverse();
		}

		function sim() {
			if (!ripples) return;
			gl!.bindVertexArray(quadVao);
			gl!.viewport(0, 0, sw, sh);
			if (drops.length) {
				gl!.useProgram(dropP.p);
				const flat = new Float32Array(64);
				drops.forEach(([x, y, r, s], k) => flat.set([x / W, 1 - y / H, r / 4, s], k * 4));
				gl!.uniform4fv(dropP.u('drops'), flat);
				gl!.uniform1i(dropP.u('count'), drops.length);
				gl!.uniform2f(dropP.u('size'), sw, sh);
				pass(dropP);
				drops = [];
			}
			gl!.useProgram(stepP.p);
			gl!.uniform2f(stepP.u('texel'), 1 / sw, 1 / sh);
			pass(stepP);
		}

		function renderFish() {
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, fishFb);
			gl!.viewport(0, 0, W, H);
			gl!.clearColor(0, 0, 0, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
			gl!.enable(gl!.BLEND);
			gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
			gl!.useProgram(fishP.p);
			gl!.uniform2f(fishP.u('res'), W, H);
			gl!.uniform1i(fishP.u('photo'), 0);
			gl!.activeTexture(gl!.TEXTURE0);
			gl!.bindVertexArray(fishVao);
			gl!.bindBuffer(gl!.ARRAY_BUFFER, fishVbo);

			for (const f of fishes) {
				const photo = photos[f.variety];
				if (!photo.aspect) continue;
				gl!.bindTexture(gl!.TEXTURE_2D, photo.tex);
				gl!.uniform1f(fishP.u('fade'), 1 - f.depth * 0.2);
				gl!.bufferData(gl!.ARRAY_BUFFER, buildStrip(f, photo.aspect, strip), gl!.DYNAMIC_DRAW);
				gl!.drawElements(gl!.TRIANGLES, STRIP_INDICES.length, gl!.UNSIGNED_SHORT, 0);
			}

			gl!.disable(gl!.BLEND);
			gl!.bindVertexArray(null);
		}

		function render(t: number) {
			renderFish();
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
			gl!.viewport(0, 0, W, H);
			gl!.bindVertexArray(quadVao);
			gl!.useProgram(renderP.p);
			const u = renderP.u;
			gl!.activeTexture(gl!.TEXTURE0);
			if (ripples) gl!.bindTexture(gl!.TEXTURE_2D, targets[0].tex);
			gl!.activeTexture(gl!.TEXTURE1);
			gl!.bindTexture(gl!.TEXTURE_2D, fishTex);
			gl!.uniform1i(u('sim'), 0);
			gl!.uniform1i(u('fish'), 1);
			gl!.uniform2f(u('res'), W, H);
			gl!.uniform2f(u('simTexel'), 1 / sw, 1 / sh);
			gl!.uniform2f(u('mouse'), input.px, H - input.py);
			gl!.uniform1f(u('time'), t / 1000);
			const p = Math.min(1, (performance.now() - reveal.start) / REVEAL_MS);
			if (p >= 1) themeFrom = themeTo;
			const eased = 1 - Math.pow(1 - p, 3);
			const far = Math.hypot(Math.max(reveal.x, W - reveal.x), Math.max(reveal.y, H - reveal.y));
			gl!.uniform2f(u('themes'), themeFrom, themeTo);
			gl!.uniform3f(u('reveal'), reveal.x, H - reveal.y, eased * (far + 120));
			gl!.uniform1f(u('scroll'), scrollY);
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		}

		function onResize() {
			resize();
			if (reduced) render(4000);
		}
		addEventListener('resize', onResize, { passive: true });

		if (reduced) {
			for (let k = 0; k < 30; k++) updatePond(fishes, k / 10, 0.1, input, W, H, () => {});
			render(4000);
			let shown = themeTo;
			const id = setInterval(() => {
				if (shown !== themeTo) {
					shown = themeFrom = themeTo;
					render(4000);
				}
			}, 100);
			return () => {
				clearInterval(id);
				removeEventListener('resize', onResize);
			};
		}

		let lastX = -1;
		let lastY = -1;
		function onMove(e: PointerEvent) {
			if (lastX >= 0) {
				const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
				input.pspeed = Math.max(input.pspeed, speed);
				splash(e.clientX, e.clientY, 10, Math.min(speed * 0.004, 0.12));
			}
			lastX = input.px = e.clientX;
			lastY = input.py = e.clientY;
		}
		function onDown(e: PointerEvent) {
			input.px = e.clientX;
			input.py = e.clientY;
			input.pspeed = Math.max(input.pspeed, 1);
			const hit = fishes.some((f) => touches(f, e.clientX, e.clientY));
			splash(e.clientX, e.clientY, hit ? 30 : 22, hit ? 0.9 : 0.6);
		}
		addEventListener('pointermove', onMove, { passive: true });
		addEventListener('pointerdown', onDown, { passive: true });

		for (let k = 0; k < 4; k++) {
			setTimeout(
				() => splash(W * (0.2 + Math.random() * 0.6), H * (0.25 + Math.random() * 0.5), 26, 0.7),
				300 + k * 350
			);
		}

		// Fish move in real time and the ripple grid steps at a fixed 120 Hz, so a 144 Hz screen and a
		// 60 Hz one show the same speeds.
		let raf = 0;
		let last = performance.now();
		let simDebt = 0;
		let wakeDebt = 0;
		function loop(t: number) {
			const dt = Math.min(0.05, (t - last) / 1000);
			last = t;
			input.pspeed *= Math.exp(-dt * 10);
			updatePond(fishes, t / 1000, dt, input, W, H, (f) => splash(f.x, f.y, 40, 1));
			wakeDebt += dt;
			if (wakeDebt > 0.05) {
				wakeDebt = 0;
				for (const f of fishes) splash(f.x, f.y, 10, 0.02 + f.speed * 0.0006);
			}
			if (Math.random() < dt * 1.2) splash(Math.random() * W, Math.random() * H, 6, 0.15);
			simDebt = Math.min(simDebt + dt * 120, 4);
			while (simDebt >= 1) {
				sim();
				simDebt--;
			}
			render(t);
			raf = requestAnimationFrame(loop);
		}
		raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			removeEventListener('resize', onResize);
			removeEventListener('pointermove', onMove);
			removeEventListener('pointerdown', onDown);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 z-0 h-full w-full"
	aria-hidden="true"
></canvas>
