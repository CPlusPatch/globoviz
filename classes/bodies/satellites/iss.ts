import type { CelestialBodyParameters } from "..";
import { Orbit } from "../../orbits";
import type { Planet } from "../planet";

export const issParameters = (parent: Planet): CelestialBodyParameters => ({
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
