import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import type { CelestialBody } from "./bodies";

export interface OrbitParameters {
    /** Parent celestial body */
    parent: CelestialBody | null;
    /** Semi-major axis, in meters */
    semiMajorAxis: number;
    /** Eccentricity */
    eccentricity: number;
    /** Inclination, in degrees */
    inclination: number;
    /** Longitude of the ascending node, in degrees */
    longitudeOfAscendingNode: number;
    /** Argument of periapsis, in degrees */
    argumentOfPeriapsis: number;
    /** Mean anomaly, in degrees */
    meanAnomaly: number;
    /** Show animation in UI */
    animate?: boolean;
}

/**
 * Utility class for calculating orbital parameters
 */
export class Orbit {
    constructor(public parameters: OrbitParameters) {}

    /**
     * Calculate every point of the orbit around the parent body, relative to the parent body's center
     *
     * @param i Range from 0 to 1
     * @returns Array of points
     * @see https://en.wikipedia.org/wiki/Orbital_elements
     */
    public calculatePoints(i: number): Vector3 {
        const {
            semiMajorAxis,
            eccentricity,
            inclination,
            longitudeOfAscendingNode,
            argumentOfPeriapsis,
        } = this.parameters;

        const loa = degToRad(longitudeOfAscendingNode);
        const aop = degToRad(argumentOfPeriapsis);
        const inc = degToRad(inclination);

        const trueAnomaly = 2 * Math.PI * i;
        const r =
            (semiMajorAxis * (1 - eccentricity ** 2)) /
            (1 + eccentricity * Math.cos(trueAnomaly));
        const x =
            r *
            (Math.cos(loa) * Math.cos(aop + trueAnomaly) -
                Math.sin(loa) * Math.sin(aop + trueAnomaly) * Math.cos(inc));
        const y =
            r *
            (Math.sin(loa) * Math.cos(aop + trueAnomaly) +
                Math.cos(loa) * Math.sin(aop + trueAnomaly) * Math.cos(inc));
        const z = r * (Math.sin(aop + trueAnomaly) * Math.sin(inc));

        return new Vector3(x, y, z);
    }

    /**
     * Calculates the apoapsis and periapsis of the orbit
     * @returns [apoapsis, periapsis]
     */
    public calculateApoapsisPeriapsis(): [number, number] {
        const { semiMajorAxis, eccentricity } = this.parameters;
        return [
            semiMajorAxis * (1 + eccentricity),
            semiMajorAxis * (1 - eccentricity),
        ];
    }
}
