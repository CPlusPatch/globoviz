<template>
    <TresGroup>
        <Line2
            :points="finalPoints" :line-width="3"
            :color="new Color('skyblue')" />
    </TresGroup>
</template>

<script lang="ts" setup>
import { Line2 } from "@tresjs/cientos";
import { Color, type Vector3 } from "three";
import { type ComputedRef, computed, ref, watch } from "vue";
import { Earth } from "~/classes/bodies/planets/earth";
import { Iss } from "~/classes/bodies/satellites/iss";
import type { Orbit } from "~/classes/orbits";
import { parameters, useIntervalFn, useNewBody } from "#imports";

const parent = new Earth();
const body = useNewBody(new Iss(parent));
const orbit: ComputedRef<Orbit> = computed(
    () => body.value.orbit,
) as ComputedRef<Orbit>;

const orbitResolution = 1000;
const points = computed(() => {
    const points: Vector3[] = [];
    for (let i = 0; i <= orbitResolution; i++) {
        const position = orbit.value
            .calculatePoints(i / orbitResolution)
            .multiplyScalar(parameters.physics.sizeScale);
        points.push(position);
    }
    return points;
});

// milliseconds
const animationDuration = computed(
    () => (body.value.calculateOrbitalPeriod() * 1000) / parameters.time.scale,
);
const ratioShown = ref(1.0);
const offset = ref(0);

const finalPoints = computed(() => {
    // Get slice from offset to offset + ratioShown * orbitResolution, wrapping around
    if (offset.value + ratioShown.value * orbitResolution < orbitResolution) {
        return points.value.slice(
            offset.value,
            offset.value + ratioShown.value * orbitResolution,
        );
    }
    return [
        ...points.value.slice(offset.value, orbitResolution),
        ...points.value.slice(
            0,
            offset.value + ratioShown.value * orbitResolution - orbitResolution,
        ),
    ];
});

const interval = computed(() => animationDuration.value / orbitResolution);
useIntervalFn(() => {
    offset.value = (offset.value + 1) % orbitResolution;
}, interval);
</script>
