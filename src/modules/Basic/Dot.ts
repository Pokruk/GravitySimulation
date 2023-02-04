export class Dot {
    _x;
    _y;
    color;

    constructor(x,y, color="#000000") {
        this._x = x;
        this._y = y;
        this.color = color;
    }

    get x() {
        return this._x;
    }
    set x(val) {
        if (isNaN(val)) {
            throw new Error("Ээээ, чё суёшь"+ val)
        } else {
            this._x = val;
        }
    }

    get y() {
        return this._y;
    }
    set y(val) {
        if (isNaN(val)) {
            throw new Error("Ээээ, чё суёшь"+ val)
        } else {
            this._y = val;
        }
    }

    /**
     *
     * @param ctx
     * @param {{color: string|undefined, dotSize: number}} params
     */
    draw(ctx, params) {
        if (!ctx) {throw Error('ctx undefined')}
        let color = params.color || this.color;
        let dotSize = params.dotSize;
        ctx.fillStyle = color;
        ctx.fillRect(this.x-(dotSize/2), this.y-(dotSize/2), dotSize, dotSize);
    }
}
