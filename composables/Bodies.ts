import { type Ref, ref, watch } from "vue";
import type { CelestialBody } from "~/classes/bodies";

export const bodies: Ref<CelestialBody[]> = ref([]);

/*
 * Adds a new body to the list of celestial bodies, and returns a reactive reference to it
 */
export const useNewBody = (body: CelestialBody): Ref<CelestialBody> => {
    const newLength = bodies.value.push(body);

    const newRef: Ref<CelestialBody> = ref(
        bodies.value[newLength - 1],
    ) as Ref<CelestialBody>;

    watch(bodies, (newBodies) => {
        newRef.value = newBodies[newLength - 1];
    });

    return newRef;
};
