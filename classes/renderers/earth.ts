import night from "~/assets/textures/8081_earthlights10k.jpg";
import day from "~/assets/textures/8081_earthmap10k.jpg";
import type { Earth } from "../bodies/earth";
import { PlanetRenderer } from "./planet";

export class EarthRenderer extends PlanetRenderer {
    constructor(body: Earth) {
        super(body, {
            day,
            night,
        });
    }
}
