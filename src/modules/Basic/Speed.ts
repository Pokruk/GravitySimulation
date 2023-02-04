import {Vector} from "./Vector.js";
import {Dot} from "./Dot.js";

export class Speed extends Vector {
    constructor(x, y) {
        super(new Dot(0,0), new Dot(x,y));
    }
}