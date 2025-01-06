import { Orbit } from "../../orbits";
import { Planet } from "../planet";
import { Sun } from "./sun";

export class Earth extends Planet {
    constructor() {
        super({
            radius: 6.371e6,
            mass: 5.972e24,
            rotationPeriod: 24 * 60 * 60,
            axialTilt: 23.5,
            name: "Earth",
            orbit: {
                parent: new Sun(),
                semiMajorAxis: 1.496e11,
                argumentOfPeriapsis: 288.064,
                eccentricity: 0.0167,
                inclination: 0,
                longitudeOfAscendingNode: 174.873,
                trueAnomaly: 358.617,
            },
            atmosphere: {
                density: 1.225,
                fullHeight: 100e3,
                wavelength: [680e-9, 550e-9, 450e-9],
                raighleighCoefficient: 0.0025,
                mieCoefficient: 0.001,
            },
            g: 9.81,
        });
    }
}
