import { Euler, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import type { Orbit } from "../orbits";

export interface Atmosphere {
    /** Density, in kg/m³ */
    density: number;
    /** Full height until the atmosphere is considered space, in meters */
    fullHeight: number;
    /** Wavelength of the atmosphere, in meters */
    wavelength: [number, number, number];
    /** Rayleigh scattering coefficient */
    raighleighCoefficient: number;
    /** Mie scattering coefficient */
    mieCoefficient: number;
}

export interface CelestialBodyParameters {
    /** Radius of the body, in meters */
    radius: number;
    /** Mass of the body, in kilograms */
    mass: number;
    /** Rotation period, in seconds */
    rotationPeriod: number;
    /** Axial tilt, in degrees */
    axialTilt: number;
    /** Common designation */
    name: string;
    /** Atmosphere */
    atmosphere: Atmosphere | null;
    /** Orbits */
    orbit: Orbit;
    /** g, in m/s² */
    g: number;
}

/**
 * Celestial body
 */
export class CelestialBody {
    constructor(protected parameters: CelestialBodyParameters) {}

    getParameters(): CelestialBodyParameters {
        return this.parameters;
    }

    setParameters(parameters: CelestialBodyParameters): void {
        this.parameters = parameters;
    }

    setParameter<K extends keyof CelestialBodyParameters>(
        key: K,
        value: CelestialBodyParameters[K],
    ): void {
        this.parameters[key] = value;
    }

    /**
     * Calculate the rotation of the body for a given date
     *
     * Assumes the earth is at rotation 0 on January 1st 1970
     * @param date
     * @returns
     */
    private getRotationForDate = (date: Date): number => {
        const msSinceEpoch = date.getTime();
        const msSince1970 = msSinceEpoch - 0;
        const msPerDay = 1000 * this.parameters.rotationPeriod;
        const daysSince1970 = msSince1970 / msPerDay;
        const rotation = (daysSince1970 * Math.PI * 2) % (Math.PI * 2);

        return rotation;
    };

    /**
     * Calculate the full position and rotation of the body for a given date
     *
     * @param date
     */
    public getPositionAndRotationForDate(date: Date): {
        position: Vector3;
        rotation: Euler;
    } {
        const yawRotation = this.getRotationForDate(date);
        const pitchRotation = degToRad(this.parameters.axialTilt);

        return {
            position: new Vector3(0, 0, 0),
            rotation: new Euler(pitchRotation, yawRotation, 0),
        };
    }

    /**
     * Calculate orbital period of the body, in seconds, based on its orbit
     *
     * Uses Kepler's third law of planetary motion
     * @returns {number} Orbital period in seconds
     */
    public calculateOrbitalPeriod(): number {
        const { semiMajorAxis } = this.parameters.orbit.getParameters();
        const parent = this.parameters.orbit.getParameters().parent;

        if (!parent) {
            throw new Error("Can't calculate orbital period without a parent");
        }

        const G = 6.6743e-11;

        return (
            2 *
            Math.PI *
            Math.sqrt(semiMajorAxis ** 3 / (G * parent.getParameters().mass))
        );
    }
}
