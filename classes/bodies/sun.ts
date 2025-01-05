import { CelestialBody } from ".";

export class Sun extends CelestialBody {
    constructor() {
        super({
            radius: 6.957e8,
            mass: 1.989e30,
            axialTilt: 0,
            g: 274,
            orbitalPeriod: 0,
            rotationPeriod: 25.05,
            orbits: null,
            name: "Sun",
            atmosphere: null,
        });
    }
}
