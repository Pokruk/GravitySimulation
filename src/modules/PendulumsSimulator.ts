import {Pendulum} from "./Pendulum.js";
import {Speed} from "./Basic/Speed.js";

function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


export class PendulumsSimulator {
    lastFrameEndTime = null;

    pendulums: Pendulum[] = null;
    interval;

    get deltaTime() {
        return this.lastFrameEndTime !== null ? Date.now() - this.lastFrameEndTime : 0
    }

    constructor(params?: {pendulums?: Pendulum[]}) {
        this.pendulums = params.pendulums;
    }

    draw(ctx) {
        for (let pendulum of this.pendulums) {
            pendulum.draw(ctx);
        }
    }

    tick(width, height, fps) {

        for (let pendulum of this.pendulums) {
            pendulum.wallCollision(width, height);
        }

        for (let pendulum of this.pendulums) {
            pendulum.move(fps);
        }

        for (let pendulum of this.pendulums) {
            pendulum.update(fps);
        }

        let vel_sum = 0
        for (let pendulum of this.pendulums) {
            vel_sum += pendulum.speed.length
        }

        this.lastFrameEndTime = new Date()
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    start(interval_milliseconds, canvas, ctx, doClear=true) {
        if (!(canvas) || !(ctx)){
            throw new Error('Canvas or ctx undefined')
        }
        this.interval = setInterval(()=>{
            if (doClear) {
                clearCanvas(canvas, ctx);
            }
            this.tick(canvas.width, canvas.height, 1000/interval_milliseconds);
            this.draw(ctx);
        }, interval_milliseconds)
    }

    stop() {
        clearInterval(this.interval);
    }
}
