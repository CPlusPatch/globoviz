import { CelestialBody } from ".";

export class ISS extends CelestialBody {
    constructor() {
        super({
            radius: 110,
            mass: 450_000,
            rotationPeriod: 0,
            // 90 minutes
            orbitalPeriod: 90 * 60,
            axialTilt: 0,
            name: "International Space Station",
            orbits: null,
            atmosphere: null,
            g: 0,
        });
    }
}
