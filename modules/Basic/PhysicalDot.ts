import {Dot} from "./Dot.js";

export class PhysicalDot extends Dot {
    /**
     * @type {number}
     */
    mass;
    /**
     * @type {number}
     */
    size;

    constructor(x, y, color, size, mass) {
        super(x, y, color);
        this.mass = mass;
        this.size = size;
    }
    draw(ctx, params) {
        super.draw(ctx, {dotSize: params.dotSize | this.size})
    }
}