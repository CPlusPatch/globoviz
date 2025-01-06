import { CelestialBody, type CelestialBodyParameters } from ".";

export class Planet extends CelestialBody {
    // biome-ignore lint/complexity/noUselessConstructor: Needed for instanceof to work
    constructor(params: CelestialBodyParameters) {
        super(params);
    }
}
