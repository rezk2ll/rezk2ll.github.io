type Point = { x: number; y: number };

export type Pellet = { x: number; y: number; born: number };

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
	seed: number;
	scared: number;
	depth: number;
	phase: number;
};

export type PondInput = {
	px: number;
	py: number;
	pspeed: number;
	lastMove: number;
	pellets: Pellet[];
};

const N = 28;

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function make(x: number, y: number, angle: number, variety: number, W: number): Koi {
	return {
		x,
		y,
		angle,
		turn: 0,
		speed: 1.2,
		beat: Math.random() * 10,
		spine: Array.from({ length: N }, () => ({ x, y })),
		length: Math.max(240, Math.min(W * 0.3, 480)),
		variety,
		seed: Math.random() * 10,
		scared: 0,
		depth: 0.5,
		phase: Math.random() * 10
	};
}

export function createPond(W: number, H: number): Koi[] {
	return [make(W * 0.3, H * 0.65, -0.3, 0, W), make(W * 0.72, H * 0.3, 2.6, 1, W)];
}

// Steering: wander, follow a slow pointer, chase food, flee a fast swipe. The spine is an arc set by
// the turn rate plus a travelling wave that grows toward the tail, so the head stays steady.
export function updatePond(
	fishes: Koi[],
	t: number,
	input: PondInput,
	W: number,
	H: number,
	onEat: (p: Pellet) => void
) {
	for (const f of fishes) {
		let desired = f.angle + Math.sin(t * 0.0004 + f.phase) * 0.5;
		let target = 1.1;
		const dPointer = Math.hypot(input.px - f.x, input.py - f.y);
		if (input.pspeed > 45 && dPointer < f.length * 0.8) f.scared = 1;

		let food: Pellet | undefined;
		let foodD = Infinity;
		for (const p of input.pellets) {
			const d = Math.hypot(p.x - f.x, p.y - f.y);
			if (d < foodD) {
				food = p;
				foodD = d;
			}
		}

		if (f.scared > 0.05) {
			desired = Math.atan2(f.y - input.py, f.x - input.px);
			target = 1.2 + 5 * f.scared;
			f.scared *= 0.985;
		} else if (food) {
			desired = Math.atan2(food.y - f.y, food.x - f.x);
			target = foodD < f.length * 0.5 ? 1.6 : 3;
			if (foodD < f.length * 0.05) onEat(food);
		} else if (t - input.lastMove < 2500 && dPointer < 420) {
			desired = Math.atan2(input.py - f.y, input.px - f.x);
			target = 1.6;
			if (dPointer < f.length * 0.6) {
				desired += Math.PI / 2;
				target = 0.8;
			}
		}

		for (const o of fishes) {
			if (o === f) continue;
			const d = Math.hypot(o.x - f.x, o.y - f.y);
			if (d < f.length * 0.7) desired += wrap(Math.atan2(f.y - o.y, f.x - o.x) - desired) * 0.5;
		}

		const m = Math.min(160, W * 0.12);
		if (f.x < m || f.x > W - m || f.y < m || f.y > H - m) {
			desired = Math.atan2(H / 2 - f.y, W / 2 - f.x);
		}

		const maxTurn = 0.012 + f.speed * 0.006;
		const dTurn = Math.max(-maxTurn, Math.min(maxTurn, wrap(desired - f.angle)));
		f.angle += dTurn;
		f.turn += (dTurn - f.turn) * 0.1;
		f.speed += (target - f.speed) * 0.03;
		f.beat += 0.05 + f.speed * 0.045;
		f.x += Math.cos(f.angle) * f.speed;
		f.y += Math.sin(f.angle) * f.speed;
		f.depth = 0.5 + 0.5 * Math.sin(t * 0.00022 + f.phase * 3);

		const bodyLen = f.length;
		const ds = bodyLen / (N - 1);
		const k = Math.max(-1.1 / bodyLen, Math.min(1.1 / bodyLen, f.turn / Math.max(f.speed, 0.6)));
		const swim = 0.55 + 0.45 * Math.min(f.speed / 3, 1);
		let dir = f.angle + Math.PI;
		let cx = f.x;
		let cy = f.y;
		for (let i = 0; i < N; i++) {
			const u = i / (N - 1);
			const lateral = f.length * (0.006 + 0.045 * u * u) * swim * Math.sin(u * 5.3 - f.beat);
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

// The photo is laid along the spine: head at u=1 (right edge of the image), tail at u=0.
export function buildStrip(f: Koi, aspect: number): Float32Array {
	const s = f.spine;
	const half = (f.length * aspect) / 2;
	const out = new Float32Array(N * 8);
	for (let i = 0; i < N; i++) {
		const a = s[Math.max(0, i - 1)];
		const b = s[Math.min(N - 1, i + 1)];
		const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
		const nx = -(a.y - b.y) / d;
		const ny = (a.x - b.x) / d;
		const u = 1 - i / (N - 1);
		out.set(
			[s[i].x + nx * half, s[i].y + ny * half, u, 0, s[i].x - nx * half, s[i].y - ny * half, u, 1],
			i * 8
		);
	}
	return out;
}
