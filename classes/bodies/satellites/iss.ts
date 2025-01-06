import type { Planet } from "../planet";
import { Satellite } from "../satellite";

export class Iss extends Satellite {
    constructor(parent: Planet) {
        super({
            radius: 110,
            mass: 450_000,
            rotationPeriod: 0,
            axialTilt: 0,
            name: "International Space Station",
            atmosphere: null,
            g: 0,
            orbit: {
                semiMajorAxis: 6.7e6,
                eccentricity: 0.0001,
                inclination: 51.6,
                parent,
                longitudeOfAscendingNode: 32.7386,
                argumentOfPeriapsis: 48.6291,
                trueAnomaly: 97.2059,
            },
        });
    }
}
