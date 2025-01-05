<template>
    <TresGroup>
        <Line2
            :points="finalPoints" :line-width="3"
            :color="new Color('skyblue')" />
    </TresGroup>
</template>

<script lang="ts" setup>
import { Line2 } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { Color, type Vector3 } from "three";
import { computed, ref } from "vue";
import earthTexture from "~/assets/textures/8081_earthmap10k.jpg";
import { Earth } from "~/classes/bodies/earth";
import { ISS } from "~/classes/bodies/iss";
import type { Orbit } from "~/classes/orbits";
import { parameters, useIntervalFn } from "#imports";

const parent = new Earth();
const body = new ISS(parent);
const orbit = body.getParameters().orbits?.[0] as Orbit;

const textures = await useTexture({
    map: earthTexture,
});

const orbitResolution = 100;
const points = computed(() => {
    const points: Vector3[] = [];
    for (let i = 0; i <= orbitResolution; i++) {
        const position = orbit
            .calculatePoints(i / orbitResolution)
            .multiplyScalar(parameters.physics.sizeScale);
        points.push(position);
    }
    return points;
});

// milliseconds
const animationDuration = computed(
    () => (body.getParameters().orbitalPeriod * 1000) / parameters.time.scale,
);
const ratioShown = ref(0.5);
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
