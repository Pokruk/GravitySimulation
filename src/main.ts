import { PendulumsSimulator } from "./modules/PendulumsSimulator.js";
import {Pendulum} from "./modules/Pendulum.js";
import {Speed} from "./modules/Basic/Speed.js";
import { PendulumsConnector} from "./modules/PendulumConnector.js";

const canvas = document.getElementsByTagName("canvas")[0]

const ctx = canvas.getContext('2d')

let pendulums = [];

let simulation = new PendulumsSimulator(
    {
        pendulums: pendulums,
    }
)

function bindSpawnOnDragClickFor(canvas, simulation) {
    let massInput = document.getElementById("mass") as HTMLInputElement;
    let sizeInput = document.getElementById("size") as HTMLInputElement;
    let colorInput = document.getElementById("color") as HTMLInputElement;

    let lastDown = null;
    canvas.addEventListener("mousedown",
        (e: DragEvent)=> {
            lastDown = {x: e.offsetX, y: e.offsetY}
        });

    canvas.addEventListener("mouseup",
        (e: DragEvent)=> {
            const dif = {x: e.offsetX - lastDown.x, y: e.offsetY - lastDown.y}

            simulation.pendulums.push(new Pendulum(lastDown.x, lastDown.y, Number(sizeInput.value), Number(massInput.value) * 10 ** 14, {
                color: colorInput.value,
                centers: simulation.pendulums,
                speed: new Speed(dif.x, dif.y),
            }));
        });
}

PendulumsConnector.eachOther(simulation.pendulums);
bindSpawnOnDragClickFor(canvas, simulation);

simulation.start(1, canvas, ctx, true);