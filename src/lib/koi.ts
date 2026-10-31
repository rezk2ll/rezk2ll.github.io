type Point = { x: number; y: number };

type Mode = 'swim' | 'coast' | 'hover' | 'flee';

export type Koi = {
	x: number;
	y: number;
	angle: number;
	turn: number;
	speed: number;
	length: number;
	variety: number;
	phase: number;
	freq: number;
	amp: number;
	freqTo: number;
	ampTo: number;
	mode: Mode;
	modeUntil: number;
	social: boolean;
	socialUntil: number;
	goal: Point;
	goalUntil: number;
	bend: number[];
	travelled: number;
	cbend: number;
	cSign: number;
	cUntil: number;
	fin: number;
	fins: [number, number];
	depth: number;
	seed: number;
	spine: Point[];
};

export type PondInput = { px: number; py: number; pspeed: number };

// Pectoral fins in each photo, in texture space: pivot u, body-edge v, and the u range they span.
// The first is on the fish's right side (top of the image), the second on its left.
export const FINS: [number, number, number, number][][] = [
	[
		[0.718, 0.181, 0.6, 0.79],
		[0.718, 0.774, 0.6, 0.79]
	],
	[
		[0.747, 0.135, 0.62, 0.81],
		[0.835, 0.726, 0.73, 0.89]
	]
];

const N = 28;
const TAU = Math.PI * 2;
// Thrust settles where Strouhal number f * 2A / U is about 0.3, so U = f * 2A / 0.3 with a tail
// half-amplitude of 0.1 L * amp.
const STROUHAL_GAIN = 0.2 / 0.3;

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);

function make(x: number, y: number, angle: number, variety: number, W: number): Koi {
	const f: Koi = {
		x,
		y,
		angle,
		turn: 0,
		speed: 0,
		length: Math.max(240, Math.min(W * 0.3, 480)),
		variety,
		phase: Math.random() * TAU,
		freq: 0.8,
		amp: 0.1,
		freqTo: 0.8,
		ampTo: 0.1,
		mode: 'coast',
		modeUntil: 0.3 + Math.random(),
		social: false,
		socialUntil: 4 + Math.random() * 6,
		goal: { x, y },
		goalUntil: 0,
		bend: new Array(N + 2).fill(0),
		travelled: 0,
		cbend: 0,
		cSign: 1,
		cUntil: 0,
		fin: Math.random() * TAU,
		fins: [0, 0],
		depth: 0.5,
		seed: Math.random() * 100,
		spine: Array.from({ length: N }, () => ({ x, y }))
	};
	f.speed = 0.3 * f.length;
	return f;
}

export function createPond(W: number, H: number): Koi[] {
	return [make(W * 0.3, H * 0.65, -0.3, 0, W), make(W * 0.72, H * 0.3, 2.6, 1, W)];
}

export function touches(f: Koi, x: number, y: number) {
	for (let i = 0; i < N * 0.75; i++) {
		const p = f.spine[i];
		if (Math.hypot(p.x - x, p.y - y) < f.length * 0.11) return true;
	}
	return false;
}

function setMode(f: Koi, mode: Mode, t: number) {
	f.mode = mode;
	if (mode === 'swim') {
		const bl = 0.28 + Math.random() * 0.3;
		f.ampTo = 0.5 + Math.random() * 0.15;
		f.freqTo = bl / (STROUHAL_GAIN * f.ampTo);
		const beats = Math.random() < 0.25 ? 10 + Math.random() * 8 : 2 + Math.random() * 6;
		f.modeUntil = t + beats / f.freqTo;
	} else if (mode === 'coast') {
		f.ampTo = 0.06;
		f.freqTo = 0.7;
		f.modeUntil = t + 0.8 + Math.random() * 2.2;
	} else if (mode === 'hover') {
		f.ampTo = 0.03;
		f.freqTo = 0.5;
		f.modeUntil = t + 1.5 + Math.random() * 3;
	} else {
		f.ampTo = 1;
		f.freqTo = 3.2;
		f.modeUntil = t + 0.7;
	}
}

function nextMode(f: Koi, t: number) {
	const r = Math.random();
	if (f.mode === 'flee') setMode(f, 'coast', t);
	else if (f.mode === 'swim') setMode(f, r < 0.8 ? 'coast' : 'swim', t);
	else if (f.mode === 'coast')
		setMode(f, r < 0.25 && f.speed < 0.15 * f.length ? 'hover' : 'swim', t);
	else setMode(f, 'swim', t);
	if (f.mode === 'coast' && f.modeUntil - t < 1.5 && Math.random() < 0.3) f.modeUntil += 1.5;
}

// Curvature behind the snout at arc length s, read from the history of the path the head swam.
function bendAt(f: Koi, s: number, live: number) {
	const seg = f.length / (N - 1);
	const p = (s - f.travelled) / seg;
	if (p < 0) return live;
	const i = Math.min(Math.floor(p), N);
	return f.bend[i] + (f.bend[i + 1] - f.bend[i]) * (p - i);
}

// Locomotion follows carangiform kinematics: a travelling body wave with the amplitude envelope
// A(s) = 0.02 - 0.08 s + 0.16 s^2 (Videler), a wavelength of about one body length, speed set by
// tail-beat frequency, and burst-and-coast bouts with glides in between. Steering bends the body
// along the path the head took, pectoral fins paddle when slow and fold back when fast, and a
// touch sets off a C-start escape.
export function updatePond(
	fishes: Koi[],
	t: number,
	dt: number,
	input: PondInput,
	W: number,
	H: number
) {
	for (const f of fishes) {
		const L = f.length;
		const seg = L / (N - 1);
		const other = fishes.find((o) => o !== f);

		if (t > f.socialUntil) {
			f.social = Math.random() < 0.45;
			f.socialUntil = t + 8 + Math.random() * 12;
		}

		if (f.mode !== 'flee' && input.pspeed > 0.5 && touches(f, input.px, input.py)) {
			const away = Math.atan2(f.y - input.py, f.x - input.px) + (Math.random() - 0.5) * 0.8;
			f.cSign = Math.sign(wrap(away - f.angle)) || 1;
			f.cUntil = t + 0.14;
			f.goal = { x: f.x + Math.cos(away) * L * 3, y: f.y + Math.sin(away) * L * 3 };
			f.goalUntil = t + 2.5;
			setMode(f, 'flee', t);
		}
		if (t > f.modeUntil) nextMode(f, t);

		let goal = f.goal;
		if (f.social && other && f.mode !== 'flee') {
			const side = f.variety === 0 ? 1 : -1;
			const ca = Math.cos(other.angle);
			const sa = Math.sin(other.angle);
			goal = {
				x: other.x - ca * L * 0.55 - sa * L * 0.4 * side,
				y: other.y - sa * L * 0.55 + ca * L * 0.4 * side
			};
			if (f.mode === 'swim') {
				const d = Math.hypot(goal.x - f.x, goal.y - f.y) / L;
				const bl = clamp(other.speed / L + (d - 0.3) * 0.35, 0.2, 0.95);
				f.freqTo = bl / (STROUHAL_GAIN * f.ampTo);
			}
		} else if (t > f.goalUntil || Math.hypot(f.goal.x - f.x, f.goal.y - f.y) < L * 0.6) {
			f.goal = {
				x: W * (0.15 + Math.random() * 0.7),
				y: H * (0.2 + Math.random() * 0.6)
			};
			f.goalUntil = t + 10 + Math.random() * 10;
			goal = f.goal;
		}

		let desired = Math.atan2(goal.y - f.y, goal.x - f.x);
		desired += Math.sin(t * 0.37 + f.seed) * 0.25 + Math.sin(t * 0.13 + f.seed * 2) * 0.35;

		if (other) {
			const ox = other.spine[N >> 2].x;
			const oy = other.spine[N >> 2].y;
			const d = Math.hypot(ox - f.x, oy - f.y);
			if (d < L * 0.8) {
				const away = Math.atan2(f.y - oy, f.x - ox);
				desired = f.angle + wrap(away - f.angle) * (1 - d / (L * 0.8)) * 1.4;
			}
		}

		const look = L * 0.5 + f.speed * 1.2;
		const ax = f.x + Math.cos(f.angle) * look;
		const ay = f.y + Math.sin(f.angle) * look;
		const m = Math.min(W, H) * 0.06;
		if (ax < m || ax > W - m || ay < m || ay > H - m) {
			desired = Math.atan2(H / 2 - f.y, W / 2 - f.x);
			if (f.mode === 'hover') setMode(f, 'swim', t);
		}

		const fleeing = f.mode === 'flee';
		const bl = f.speed / L;
		const wmax = fleeing && t < f.cUntil + 0.1 ? 9 : 0.3 + 1.6 * bl;
		const wd = clamp(wrap(desired - f.angle) * (fleeing ? 6 : 1.4), -wmax, wmax);
		f.turn += (wd - f.turn) * ease(dt, fleeing ? 0.04 : 0.35);
		const dTheta = f.turn * dt;

		// Slow turns pivot around the centre of mass instead of tracing a tight curve with the head.
		const pivot = 1 - Math.min(1, bl / 0.35);
		const pr = 0.3 * L * pivot;
		const px = f.x - Math.cos(f.angle) * pr;
		const py = f.y - Math.sin(f.angle) * pr;
		f.angle += dTheta;
		f.x = px + Math.cos(f.angle) * pr;
		f.y = py + Math.sin(f.angle) * pr;

		f.amp += (f.ampTo - f.amp) * ease(dt, fleeing ? 0.06 : 0.3);
		f.freq += (f.freqTo - f.freq) * ease(dt, fleeing ? 0.06 : 0.4);
		f.phase += TAU * f.freq * dt;
		const thrust = STROUHAL_GAIN * f.amp * f.freq * L;
		f.speed += (thrust - f.speed) * ease(dt, thrust > f.speed ? (fleeing ? 0.2 : 0.45) : 1.6);
		const ds = f.speed * dt;
		f.x += Math.cos(f.angle) * ds;
		f.y += Math.sin(f.angle) * ds;

		const live = clamp((f.turn * (1 - pivot)) / Math.max(f.speed, 1), -1.6 / L, 1.6 / L);
		f.travelled += ds;
		while (f.travelled >= seg) {
			f.bend.pop();
			f.bend.unshift(live);
			f.travelled -= seg;
		}
		const relax = Math.exp(-dt * 0.5);
		for (let i = 0; i < f.bend.length; i++) f.bend[i] *= relax;

		f.cbend += ((t < f.cUntil ? f.cSign : 0) - f.cbend) * ease(dt, 0.07);

		const spread = 1 - clamp((bl - 0.35) / 0.55, 0, 1);
		f.fin += dt * TAU * 1.2 * spread;
		const bias = clamp(f.turn * 0.35, -0.35, 0.35) * spread;
		f.fins[0] = 0.75 + (0.12 + 0.26 * Math.sin(f.fin) - 0.75) * spread - bias;
		f.fins[1] = 0.75 + (0.12 + 0.26 * Math.sin(f.fin + 2.2) - 0.75) * spread + bias;

		f.depth = 0.5 + 0.5 * Math.sin(t * 0.13 + f.seed * 3);

		let dir = f.angle + Math.PI;
		let cx = f.x;
		let cy = f.y;
		for (let i = 0; i < N; i++) {
			const s = i / (N - 1);
			const env = 0.2 - 0.8 * s + 1.6 * s * s;
			const lag = 1.2 * Math.max(0, (s - 0.78) / 0.22) ** 2;
			const lat = 0.1 * L * f.amp * env * Math.sin((TAU * s) / 0.95 - f.phase - lag);
			const p = f.spine[i];
			p.x = cx - Math.sin(dir) * lat;
			p.y = cy + Math.cos(dir) * lat;
			const k = bendAt(f, (i + 0.5) * seg, live) + ((f.cbend * 3.2) / L) * Math.sin(Math.PI * s);
			dir -= k * seg * 0.5;
			cx += Math.cos(dir) * seg;
			cy += Math.sin(dir) * seg;
			dir -= k * seg * 0.5;
		}
	}
}

export const STRIP_INDICES = (() => {
	const idx: number[] = [];
	for (let i = 0; i < N - 1; i++) {
		const a = i * 2;
		idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
	}
	return new Uint16Array(idx);
})();

export const STRIP_FLOATS = N * 8;

// The photo is laid along the spine: head at u=1 (right edge of the image), tail at u=0.
export function buildStrip(f: Koi, aspect: number, out: Float32Array) {
	const s = f.spine;
	const half = (f.length * aspect) / 2;
	for (let i = 0; i < N; i++) {
		const a = s[Math.max(0, i - 1)];
		const b = s[Math.min(N - 1, i + 1)];
		const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
		const nx = -(a.y - b.y) / d;
		const ny = (a.x - b.x) / d;
		const u = 1 - i / (N - 1);
		const o = i * 8;
		out[o] = s[i].x + nx * half;
		out[o + 1] = s[i].y + ny * half;
		out[o + 2] = u;
		out[o + 3] = 0;
		out[o + 4] = s[i].x - nx * half;
		out[o + 5] = s[i].y - ny * half;
		out[o + 6] = u;
		out[o + 7] = 1;
	}
	return out;
}
