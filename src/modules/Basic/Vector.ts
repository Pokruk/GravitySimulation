import {Dot} from "./Dot.js";

export class Vector {
    from: Dot;
    to: Dot;

    constructor(from: Dot, to: Dot) {
        this.from = from;
        this.to = to;
    }


    get x() {
        return this.to.x - this.from.x;
    }
    get y() {
        return this.to.y - this.from.y;
    }

    get length() {
        return Math.sqrt(this.x**2 + this.y**2)
    }

    add(vector: Vector) {
        return new Vector(
            this.from,
            new Dot(
                this.to.x + vector.x,
                this.to.y + vector.y
            )
        )
    }

    multiply(multiplier) {
        return new Vector(this.from, new Dot(this.from.x + this.x * multiplier, this.from.y + this.y * multiplier));
    }

    normalize() {
        return this.multiply(1/this.length);
    }
}
