type Point = { x: number; y: number };

type Mood = 'roam' | 'follow' | 'glide';

export type Koi = {
	x: number;
	y: number;
	angle: number;
	turn: number;
	speed: number;
	beat: number;
	spine: Point[];
	length: number;
	variety: number;
	phase: number;
	depth: number;
	scared: number;
	mood: Mood;
	moodUntil: number;
};

export type PondInput = { px: number; py: number; pspeed: number };

const N = 28;
const CRUISE = 30;
const FLEE = 230;

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function make(x: number, y: number, angle: number, variety: number, W: number): Koi {
	return {
		x,
		y,
		angle,
		turn: 0,
		speed: CRUISE,
		beat: Math.random() * 10,
		spine: Array.from({ length: N }, () => ({ x, y })),
		length: Math.max(240, Math.min(W * 0.3, 480)),
		variety,
		phase: Math.random() * 100,
		depth: 0.5,
		scared: 0,
		mood: 'roam',
		moodUntil: 4 + Math.random() * 6
	};
}

export function createPond(W: number, H: number): Koi[] {
	return [make(W * 0.3, H * 0.65, -0.3, 0, W), make(W * 0.72, H * 0.3, 2.6, 1, W)];
}

// True when the point lies on the fish's body, measured against the front two thirds of the spine.
export function touches(f: Koi, x: number, y: number) {
	for (let i = 0; i < N * 0.7; i++) {
		const p = f.spine[i];
		if (Math.hypot(p.x - x, p.y - y) < f.length * 0.11) return true;
	}
	return false;
}

function pickMood(f: Koi, t: number) {
	const r = Math.random();
	f.mood = r < 0.45 ? 'roam' : r < 0.8 ? 'follow' : 'glide';
	f.moodUntil = t + 6 + Math.random() * 10;
}

// Each koi roams on a slowly drifting heading, sometimes swims alongside the other one, sometimes
// glides. A pointer touching its body startles it. Speeds are in px/s and the steps scale with dt,
// so the motion is the same at any frame rate.
export function updatePond(
	fishes: Koi[],
	t: number,
	dt: number,
	input: PondInput,
	W: number,
	H: number,
	onStartle: (f: Koi) => void
) {
	for (const f of fishes) {
		if (t > f.moodUntil) pickMood(f, t);
		const other = fishes.find((o) => o !== f);

		const drift =
			Math.sin(t * 0.13 + f.phase) * 0.6 +
			Math.sin(t * 0.051 + f.phase * 1.7) * 0.9 +
			Math.sin(t * 0.31 + f.phase * 0.3) * 0.25;
		let desired = f.angle + drift;
		let target = f.mood === 'glide' ? CRUISE * 0.55 : CRUISE;

		if (f.mood === 'follow' && other) {
			const side = f.variety === 0 ? 1 : -1;
			const back = f.length * 0.5;
			const beside = f.length * 0.35 * side;
			const ox = other.x - Math.cos(other.angle) * back - Math.sin(other.angle) * beside;
			const oy = other.y - Math.sin(other.angle) * back + Math.cos(other.angle) * beside;
			const d = Math.hypot(ox - f.x, oy - f.y);
			desired = d > f.length * 0.25 ? Math.atan2(oy - f.y, ox - f.x) : other.angle;
			target = Math.min(CRUISE * 1.8, Math.max(other.speed * 0.9, CRUISE * 0.6 + d * 0.08));
		}

		if (other) {
			const d = Math.hypot(other.x - f.x, other.y - f.y);
			if (d < f.length * 0.55) {
				desired += wrap(Math.atan2(f.y - other.y, f.x - other.x) - desired) * 0.6;
			}
		}

		if (input.pspeed > 0 && f.scared < 0.3 && touches(f, input.px, input.py)) {
			f.scared = 1;
			onStartle(f);
		}
		if (f.scared > 0.02) {
			desired = Math.atan2(f.y - input.py, f.x - input.px);
			target = CRUISE + (FLEE - CRUISE) * f.scared;
			f.scared *= Math.exp(-dt * 0.9);
		}

		const m = Math.min(180, W * 0.12);
		const out = f.x < m || f.x > W - m || f.y < m || f.y > H - m;
		if (out) desired = Math.atan2(H / 2 - f.y, W / 2 - f.x);

		const maxTurn = (f.scared > 0.1 ? 2.6 : out ? 1.2 : 0.7) * dt;
		const want = wrap(desired - f.angle) * Math.min(1, dt * 2);
		const dTurn = Math.max(-maxTurn, Math.min(maxTurn, want));
		f.angle += dTurn;
		f.turn += (dTurn / Math.max(dt, 1e-3) - f.turn) * Math.min(1, dt * 4);
		f.speed += (target - f.speed) * Math.min(1, dt * (f.scared > 0.1 ? 4 : 0.8));
		f.beat += dt * (2.4 + f.speed * 0.045);
		f.x += Math.cos(f.angle) * f.speed * dt;
		f.y += Math.sin(f.angle) * f.speed * dt;
		f.depth = 0.5 + 0.5 * Math.sin(t * 0.13 + f.phase * 3);

		// Spine: an arc set by the turn rate plus a travelling wave that grows toward the tail, so the
		// head stays steady.
		const L = f.length;
		const ds = L / (N - 1);
		const k = Math.max(-1.1 / L, Math.min(1.1 / L, f.turn / Math.max(f.speed, 20)));
		const swim = 0.45 + 0.55 * Math.min(f.speed / 120, 1);
		let dir = f.angle + Math.PI;
		let cx = f.x;
		let cy = f.y;
		for (let i = 0; i < N; i++) {
			const u = i / (N - 1);
			const lateral = L * (0.005 + 0.04 * u * u) * swim * Math.sin(u * 5.3 - f.beat);
			f.spine[i] = { x: cx - Math.sin(dir) * lateral, y: cy + Math.cos(dir) * lateral };
			cx += Math.cos(dir) * ds;
			cy += Math.sin(dir) * ds;
			dir -= k * ds;
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
