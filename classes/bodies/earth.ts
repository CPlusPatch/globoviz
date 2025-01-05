import { CelestialBody } from ".";

export class Earth extends CelestialBody {
    constructor() {
        super({
            radius: 6.371e6,
            mass: 5.972e24,
            rotationPeriod: 24 * 60 * 60,
            orbitalPeriod: 365.25 * 24 * 60 * 60,
            axialTilt: 23.5,
            name: "Earth",
            orbits: null,
            atmosphere: {
                density: 1.225,
                fullHeight: 100e3,
                wavelength: [680e-9, 550e-9, 450e-9],
                raighleighCoefficient: 0.0025,
                mieCoefficient: 0.001,
            },
            g: -0.95,
        });
    }
}
