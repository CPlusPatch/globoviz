import { CelestialBody } from ".";
import { Orbit } from "../orbits";

export class Sun extends CelestialBody {
    constructor() {
        super({
            radius: 6.957e8,
            mass: 1.989e30,
            axialTilt: 0,
            g: 274,
            rotationPeriod: 25.05,
            orbit: new Orbit({
                argumentOfPeriapsis: 0,
                eccentricity: 0,
                inclination: 0,
                longitudeOfAscendingNode: 0,
                parent: null,
                semiMajorAxis: 0,
                trueAnomaly: 0,
            }),
            name: "Sun",
            atmosphere: null,
        });
    }
}
