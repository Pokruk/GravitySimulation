var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PendulumsSimulator = /** @class */ (function () {
    function PendulumsSimulator(params) {
        this.lastFrameEndTime = null;
        this.pendulums = null;
        this.pendulums = params.pendulums;
    }
    Object.defineProperty(PendulumsSimulator.prototype, "deltaTime", {
        get: function () {
            return this.lastFrameEndTime !== null ? Date.now() - this.lastFrameEndTime : 0;
        },
        enumerable: false,
        configurable: true
    });
    PendulumsSimulator.prototype.bindSpawnOnDragClickFor = function (canvas) {
        var _this = this;
        var massInput = document.getElementById("mass");
        var sizeInput = document.getElementById("size");
        var lastDown = null;
        canvas.addEventListener("mousedown", 
        /**
         * @param e {DragEvent}
         */
        function (e) {
            lastDown = { x: e.offsetX, y: e.offsetY };
        });
        canvas.addEventListener("mouseup", 
        /**
         * @param e {DragEvent}
         */
        function (e) {
            var dif = { x: e.offsetX - lastDown.x, y: e.offsetY - lastDown.y };
            _this.pendulums.push(new Pendulum(lastDown.x, lastDown.y, Number(sizeInput.value), Number(massInput.value) * Math.pow(10, 14), {
                color: _this.getRandomColor(),
                centers: _this.pendulums,
                speed: new Speed(dif.x, dif.y),
            }));
        });
    };
    PendulumsSimulator.prototype.draw = function (ctx) {
        for (var _i = 0, _a = this.pendulums; _i < _a.length; _i++) {
            var pendulum = _a[_i];
            pendulum.draw(ctx);
        }
    };
    PendulumsSimulator.prototype.tick = function (width, height, fps) {
        for (var _i = 0, _a = this.pendulums; _i < _a.length; _i++) {
            var pendulum = _a[_i];
            pendulum.wallCollision(width, height);
        }
        for (var _b = 0, _c = this.pendulums; _b < _c.length; _b++) {
            var pendulum = _c[_b];
            pendulum.move(fps);
        }
        for (var _d = 0, _e = this.pendulums; _d < _e.length; _d++) {
            var pendulum = _e[_d];
            pendulum.update(fps);
        }
        var vel_sum = 0;
        for (var _f = 0, _g = this.pendulums; _f < _g.length; _f++) {
            var pendulum = _g[_f];
            vel_sum += pendulum.speed.length;
        }
        this.lastFrameEndTime = new Date();
    };
    /**
     * @param {Pendulum[]} pendulums
     */
    PendulumsSimulator.prototype.chainCenters = function (pendulums) {
        pendulums = pendulums || this.pendulums;
        for (var i = 0; i < pendulums.length - 1; i++) {
            pendulums[i].centers.push(pendulums[i + 1]);
        }
        //chaining last and first
        pendulums[pendulums.length - 1].centers.push(pendulums[0]);
    };
    PendulumsSimulator.prototype.eachOtherCentering = function (pendulums) {
        pendulums = pendulums || this.pendulums;
        for (var _i = 0, pendulums_1 = pendulums; _i < pendulums_1.length; _i++) {
            var pendulum = pendulums_1[_i];
            pendulum.centers = pendulums;
        }
    };
    PendulumsSimulator.prototype.hideAll = function (pendulums) {
        pendulums = pendulums || this.pendulums;
        pendulums.forEach(function (el) {
            el.hide = true;
        });
    };
    PendulumsSimulator.prototype.showAll = function (pendulums) {
        pendulums = pendulums || this.pendulums;
        pendulums.forEach(function (el) {
            el.hide = false;
        });
    };
    PendulumsSimulator.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    PendulumsSimulator.prototype.start = function (interval_milliseconds, canvas, ctx, doClear) {
        var _this = this;
        if (doClear === void 0) { doClear = true; }
        if (!(canvas) || !(ctx)) {
            throw new Error('Canvas or ctx undefined');
        }
        this.interval = setInterval(function () {
            if (doClear) {
                clearCanvas(canvas, ctx);
            }
            _this.tick(canvas.width, canvas.height, 1000 / interval_milliseconds);
            _this.draw(ctx);
        }, interval_milliseconds);
    };
    PendulumsSimulator.prototype.stop = function () {
        clearInterval(this.interval);
    };
    return PendulumsSimulator;
}());
var Dot = /** @class */ (function () {
    function Dot(x, y, color) {
        if (color === void 0) { color = "#000000"; }
        this._x = x;
        this._y = y;
        this.color = color;
    }
    Object.defineProperty(Dot.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (val) {
            if (isNaN(val)) {
                throw new Error("Ээээ, чё суёшь" + val);
            }
            else {
                this._x = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dot.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (val) {
            if (isNaN(val)) {
                throw new Error("Ээээ, чё суёшь" + val);
            }
            else {
                this._y = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * @param ctx
     * @param {{color: string|undefined, dotSize: number}} params
     */
    Dot.prototype.draw = function (ctx, params) {
        if (!ctx) {
            throw Error('ctx undefined');
        }
        var color = params.color || this.color;
        var dotSize = params.dotSize;
        ctx.fillStyle = color;
        ctx.fillRect(this.x - (dotSize / 2), this.y - (dotSize / 2), dotSize, dotSize);
    };
    return Dot;
}());
var PhysicalDot = /** @class */ (function (_super) {
    __extends(PhysicalDot, _super);
    function PhysicalDot(x, y, color, size, mass) {
        var _this = _super.call(this, x, y, color) || this;
        _this.mass = mass;
        _this.size = size;
        return _this;
    }
    PhysicalDot.prototype.draw = function (ctx, params) {
        _super.prototype.draw.call(this, ctx, { dotSize: params.dotSize | this.size });
    };
    return PhysicalDot;
}(Dot));
var Vector = /** @class */ (function () {
    /**
     * @param {Dot} from
     * @param {Dot} to
     */
    function Vector(from, to) {
        this.from = from;
        this.to = to;
    }
    Object.defineProperty(Vector.prototype, "x", {
        get: function () {
            return this.to.x - this.from.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () {
            return this.to.y - this.from.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "length", {
        get: function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    /** @param {Vector} vector */
    Vector.prototype.add = function (vector) {
        return new Vector(this.from, new Dot(this.to.x + vector.x, this.to.y + vector.y));
    };
    Vector.prototype.multiply = function (multiplier) {
        return new Vector(this.from, new Dot(this.from.x + this.x * multiplier, this.from.y + this.y * multiplier));
    };
    Vector.prototype.normalize = function () {
        return this.multiply(1 / this.length);
    };
    return Vector;
}());
var Speed = /** @class */ (function (_super) {
    __extends(Speed, _super);
    function Speed(x, y) {
        return _super.call(this, new Dot(0, 0), new Dot(x, y)) || this;
    }
    return Speed;
}(Vector));
var Pendulum = /** @class */ (function (_super) {
    __extends(Pendulum, _super);
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} size
     * @param {number} mass
     * @param {{color: string|undefined, centers: Array<PhysicalDot>|undefined, speed: Speed|undefined, hide: boolean|undefined}} params
     */
    function Pendulum(x, y, size, mass, params) {
        var _this = _super.call(this, x, y, params.color, size, mass) || this;
        /** @type {Speed} */
        _this.speed = null;
        /** @type {Array<PhysicalDot>} */
        _this.centers = [];
        _this.hide = params.hide || false;
        var centers = params.centers;
        if (centers) {
            if (centers instanceof PhysicalDot) {
                _this.centers = [centers];
            }
            else if (centers instanceof Array) {
                _this.centers = centers;
            }
        }
        var speed = params.speed;
        if (speed) {
            _this.speed = speed;
        }
        else {
            _this.speed = new Speed(0, 0);
        }
        return _this;
    }
    /**
     * @param ctx
     * @param {{color: string|undefined, dotSize: number}} params
     */
    Pendulum.prototype.draw = function (ctx, params) {
        if (!this.hide) {
            _super.prototype.draw.call(this, ctx, { color: this.color, dotSize: this.size });
        }
    };
    Pendulum.prototype.move = function (fps) {
        this.x += this.speed.x * 1 / fps;
        this.y += this.speed.y * 1 / fps;
    };
    Pendulum.prototype.wallCollision = function (width, height) {
        if (this.x < 0 || this.x > width) {
            this.speed = new Speed(-this.speed.x, this.speed.y);
            if (this.x < 0) {
                this.x = 0;
                if (this.speed.x < 0) {
                    this.speed = new Speed(-this.speed.x, this.speed.y);
                }
            }
            else if (this.x > width) {
                this.x = width;
                if (this.speed.x > 0) {
                    this.speed = new Speed(-this.speed.x, this.speed.y);
                }
            }
        }
        if (this.y < 0 || this.y > height) {
            if (this.y < 0) {
                this.y = 0;
                if (this.speed.y < 0) {
                    this.speed = new Speed(this.speed.x, -this.speed.y);
                }
            }
            else if (this.y > height) {
                this.y = height;
                if (this.speed.y > 0) {
                    this.speed = new Speed(this.speed.x, -this.speed.y);
                }
            }
        }
    };
    Pendulum.prototype.update = function (fps) {
        for (var _i = 0, _a = this.centers; _i < _a.length; _i++) {
            var center = _a[_i];
            if (center.x === this.x && center.y === this.y) {
                continue;
            }
            var toCenterVector = new Vector(this, center);
            if (toCenterVector.length < center.size)
                continue;
            var centripetal_force = toCenterVector.normalize().multiply(0.00000000000000667430 * center.mass / toCenterVector.length);
            this.speed = this.speed.add(centripetal_force.multiply(1 / fps));
        }
    };
    return Pendulum;
}(PhysicalDot));
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext('2d');
var pendulums = [];
var simulation = new PendulumsSimulator({
    pendulums: pendulums,
});
simulation.eachOtherCentering();
simulation.bindSpawnOnDragClickFor(canvas);
function getSizeFromMass(mass) {
    return mass / 100000000000000;
}
var mass = 1000000000000000;
simulation.start(1, canvas, ctx, true);
function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//# sourceMappingURL=main.js.map