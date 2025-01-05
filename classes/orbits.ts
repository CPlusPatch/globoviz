import { Vector3 } from "three";
import type { CelestialBody } from "./bodies";

export interface OrbitParameters {
    /** Parent celestial body */
    parent: CelestialBody;
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
    /** True anomaly, in degrees */
    trueAnomaly: number;
}

/**
 * Utility class for calculating orbital parameters
 */
export class Orbit {
    constructor(private parameters: OrbitParameters) {}

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

        const trueAnomaly = 2 * Math.PI * i;
        const r =
            (semiMajorAxis * (1 - eccentricity ** 2)) /
            (1 + eccentricity * Math.cos(trueAnomaly));
        const x =
            r *
            (Math.cos(longitudeOfAscendingNode) *
                Math.cos(argumentOfPeriapsis + trueAnomaly) -
                Math.sin(longitudeOfAscendingNode) *
                    Math.sin(argumentOfPeriapsis + trueAnomaly) *
                    Math.cos(inclination));
        const y =
            r *
            (Math.sin(longitudeOfAscendingNode) *
                Math.cos(argumentOfPeriapsis + trueAnomaly) +
                Math.cos(longitudeOfAscendingNode) *
                    Math.sin(argumentOfPeriapsis + trueAnomaly) *
                    Math.cos(inclination));
        const z =
            r *
            (Math.sin(argumentOfPeriapsis + trueAnomaly) *
                Math.sin(inclination));

        return new Vector3(x, y, z);
    }

    getParameters(): OrbitParameters {
        return this.parameters;
    }

    setParameters(parameters: OrbitParameters): void {
        this.parameters = parameters;
    }

    setParameter<K extends keyof OrbitParameters>(
        key: K,
        value: OrbitParameters[K],
    ): void {
        this.parameters[key] = value;
    }
}
