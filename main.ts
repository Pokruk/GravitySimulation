class PendulumsSimulator {

    lastFrameEndTime = null;

    /**
     * @type {Array<Pendulum>}
     */
    pendulums = null;
    interval;

    get deltaTime() {
        return this.lastFrameEndTime !== null ? new Date() - this.lastFrameEndTime : 0
    }

    /**
     * @param {{pendulums: Array.<Pendulum>|undefined}} params
     */
    constructor(params) {
        this.pendulums = params.pendulums;
    }

    bindSpawnOnDragClickFor(canvas) {
        let massInput = document.getElementById("mass");
        let sizeInput = document.getElementById("size");

        let lastDown = null;
        canvas.addEventListener("mousedown",
            /**
             * @param e {DragEvent}
             */
            (e)=> {
                lastDown = {x: e.offsetX, y: e.offsetY}
            });

        canvas.addEventListener("mouseup",
            /**
             * @param e {DragEvent}
             */
            (e)=> {
                const dif = {x: e.offsetX - lastDown.x, y: e.offsetY - lastDown.y}

                this.pendulums.push(new Pendulum(lastDown.x, lastDown.y, Number(sizeInput.value), Number(massInput.value) * 10 ** 14, {
                    color: this.getRandomColor(),
                    centers: this.pendulums,
                    speed: new Speed(dif.x, dif.y),
                }));
            });
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

    /**
     * @param {Pendulum[]} pendulums
     */
    chainCenters(pendulums) {
        pendulums = pendulums || this.pendulums;
        for (let i = 0; i < pendulums.length - 1; i++) {
            pendulums[i].centers.push(pendulums[i+1])
        }
        //chaining last and first
        pendulums[pendulums.length-1].centers.push(pendulums[0])
    }

    eachOtherCentering(pendulums) {
        pendulums = pendulums || this.pendulums;
        for (let pendulum of pendulums) {
            pendulum.centers = pendulums
        }
    }

    hideAll(pendulums) {
        pendulums = pendulums || this.pendulums;
        pendulums.forEach((el) => {
            el.hide = true;
        })
    }

    showAll(pendulums) {
        pendulums = pendulums || this.pendulums;
        pendulums.forEach((el) => {
            el.hide = false;
        })
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

class Dot {
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

class PhysicalDot extends Dot {
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

class Vector {
    from; to;

    /**
     * @param {Dot} from
     * @param {Dot} to
     */
    constructor(from, to) {
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

    /** @param {Vector} vector */
    add(vector) {
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

class Speed extends Vector {
    constructor(x, y) {
        super(new Dot(0,0), new Dot(x,y));
    }
}

class Pendulum extends PhysicalDot {
    /** @type {Speed} */
    speed = null;
    /** @type {Array<PhysicalDot>} */
    centers = []
    /** @type {boolean} */
    hide;

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
    draw(ctx, params) {
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

const canvas = document.getElementsByTagName("canvas")[0]

const ctx = canvas.getContext('2d')

let pendulums = [];

let simulation = new PendulumsSimulator(
    {
        dotSize: 10,
        pendulums: pendulums,
        doClear: false,
        speed: 1,
    }
)
simulation.eachOtherCentering();
simulation.bindSpawnOnDragClickFor(canvas);

function getSizeFromMass(mass) {
    return mass / 100000000000000;
}

let mass = 1000000000000000;

simulation.start(1, canvas, ctx, true);

function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}




