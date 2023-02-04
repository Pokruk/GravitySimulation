export class PendulumsConnector {
    static chain(pendulums) {
        for (let i = 0; i < pendulums.length - 1; i++) {
            pendulums[i].centers.push(pendulums[i+1])
        }
        //chaining last and first
        pendulums[pendulums.length-1].centers.push(pendulums[0])
    }

    static eachOther(pendulums?) {
        for (let pendulum of pendulums) {
            pendulum.centers = pendulums
        }
    }
}

