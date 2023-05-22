const canvas = document.querySelector("#canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// Constants
const W = window.innerHeight;
const H = window.innerHeight;

canvas.width = W;
canvas.height = H;

class Effect {
	constructor(ctx, w, h, particlesNum = 70) {
		this.ctx = ctx;
		this.w = w;
		this.h = h;
		this.particlesNum = particlesNum;
		this.cellSize = 20;
		this.curve = 0.54;
		this.zoom = 0.9;
		this.particles = [];
		this.grid = [];
		this.rows;
		this.cols;
		this.init();
	}

	init() {
		this.rows = Math.floor(this.w / this.cellSize);
		this.cols = Math.floor(this.h / this.cellSize);

		for (let y = 0; y <= this.cols; y++) {
			const temp = [];
			for (let x = 0; x <= this.rows; x++) {
				temp[x] =
					(Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
			}
			this.grid.push(temp);
		}

		for (let i = 0; i <= this.particlesNum; i++) {
			this.particles.push(new Particle(this));
		}
	}

	render() {
		for (const particle of this.particles) {
			particle.update(this.ctx);
			particle.draw(this.ctx);
		}
	}
}

class Particle {
	constructor(effect) {
		this.effect = effect;
		this.x = Math.floor(Math.random() * this.effect.w);
		this.y = Math.floor(Math.random() * this.effect.h);
		this.history = [{ x: this.x, y: this.y }];
		this.w = 10;
		this.h = 10;
		this.angle = 0;
		this.lifeSpan = Math.floor(Math.random() * 200);
		this.speedModifier = Math.floor(Math.random() * 10);
		this.speedX;
		this.speedY;
	}

	update() {
		if (this.x >= this.effect.w || this.y >= this.effect.h) this.reset();
		else if (this.lifeSpan >= 1) {
			const col = Math.floor(this.y / this.effect.cellSize);
			const row = Math.floor(this.x / this.effect.cellSize);

			this.angle = this.effect.grid[col][row];
			this.speedX = Math.sin(this.angle);
			this.speedY = Math.cos(this.angle);

			this.x += this.speedX * this.speedModifier;
			this.y += this.speedY * this.speedModifier;

			this.history.push({ x: this.x, y: this.y });
		} else if (this.history >= 1) {
			this.history.shift();
		} else this.reset();
	}

	draw(ctx) {
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		if (this.history.length > 0)
			ctx.moveTo(this.history[0].x, this.history[0].y);
		for (const pos of this.history) {
			ctx.lineTo(pos.x, pos.y);
		}
		ctx.stroke();
	}

	reset() {
		this.x = Math.floor(Math.random() * this.effect.w);
		this.y = Math.floor(Math.random() * this.effect.h);
		this.history = [{ x: this.x, y: this.y }];
	}
}

const effect = new Effect(ctx, W, H, 1200);

const animate = () => {
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, W, H);
	effect.render(ctx);
	requestAnimationFrame(animate);
};

animate();
