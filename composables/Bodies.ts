import { type Ref, ref, watch } from "vue";
import type { CelestialBody } from "~/classes/bodies";
import { solarSystem } from "~/classes/bodies/solarsystem.ts";

export const bodies: Ref<CelestialBody[]> = ref(solarSystem as CelestialBody[]);

export const selectedBody: Ref<CelestialBody> = ref(bodies.value[1]);
