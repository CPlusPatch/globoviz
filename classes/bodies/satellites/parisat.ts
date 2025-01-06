import type { Planet } from "../planet";
import { Satellite } from "../satellite";

export class PariSat extends Satellite {
    constructor(parent: Planet) {
        super({
            radius: 0.5,
            mass: 20,
            rotationPeriod: 0,
            axialTilt: 0,
            name: "PariSat",
            atmosphere: null,
            g: 0,
            orbit: {
                semiMajorAxis: 6.95e6,
                eccentricity: 0.0034694,
                inclination: 62.0,
                parent,
                longitudeOfAscendingNode: 259.888,
                argumentOfPeriapsis: 23.5321,
                meanAnomaly: 336.7346,
            },
        });
    }
}
