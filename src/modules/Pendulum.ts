import {PhysicalDot} from "./Basic/PhysicalDot.js";
import {Speed} from "./Basic/Speed.js";
import {Vector} from "./Basic/Vector.js";

export class Pendulum extends PhysicalDot {
    speed: Speed = null;
    centers: PhysicalDot[] = []
    hide: boolean;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} size
     * @param {number} mass
     * @param {{color: string|undefined, centers: Array<PhysicalDot>|undefined, speed: Speed|undefined, hide: boolean|undefined}} params
     */

    constructor(x, y, size, mass, params) {
        super(x, y, params.color, size, mass);

        this.hide = params.hide || false;

        let centers = params.centers;
        if (centers) {
            if (centers instanceof PhysicalDot) {
                this.centers = [centers];
            } else if (centers instanceof Array) {
                this.centers = centers;
            }
        }

        let speed = params.speed;
        if (speed) {
            this.speed = speed;
        } else {
            this.speed = new Speed(0, 0);
        }
    }

    /**
     * @param ctx
     * @param {{color: string|undefined, dotSize: number}} params
     */
    draw(ctx, params?) {
        if (!this.hide) {
            super.draw(ctx, {color: this.color, dotSize: this.size});
        }
    }

    move(fps) {
        this.x += this.speed.x * 1/fps;
        this.y += this.speed.y * 1/fps;
    }

    wallCollision(width, height) {
        if (this.x < 0 || this.x > width) {
            this.speed = new Speed(-this.speed.x, this.speed.y)

            if (this.x < 0) {
                this.x = 0
                if (this.speed.x < 0) {
                    this.speed = new Speed(-this.speed.x, this.speed.y)
                }
            } else if (this.x > width) {
                this.x = width
                if (this.speed.x > 0) {
                    this.speed = new Speed(-this.speed.x, this.speed.y)
                }
            }
        }
        if (this.y < 0 || this.y > height) {


            if (this.y < 0) {
                this.y = 0
                if (this.speed.y < 0) {
                    this.speed = new Speed(this.speed.x, -this.speed.y)
                }
            } else if (this.y > height) {
                this.y = height
                if (this.speed.y > 0) {
                    this.speed = new Speed(this.speed.x, -this.speed.y)
                }
            }
        }
    }

    update(fps) {
        for (let center of this.centers) {
            if (center.x === this.x && center.y === this.y) {
                continue;
            }

            let toCenterVector = new Vector(this, center)
            if (toCenterVector.length < center.size) continue;
            let centripetal_force = toCenterVector.normalize().multiply(0.00000000000000667430 * center.mass / toCenterVector.length);

            this.speed = this.speed.add(centripetal_force.multiply(1/fps));
        }
    }
}
