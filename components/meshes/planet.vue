<template>
    <TresGroup :rotation="rotation" :position="position">
        <TresMesh :receive-shadow="true">
            <TresSphereGeometry :args="[radius, 32, 32]" />
            <TresMeshLambertMaterial :map="textures.map" />
        </TresMesh>

        <!-- Planet axis -->
        <Line2
            :points="[[0, -1.5 * 1e7 * parameters.physics.sizeScale * radius, 0], [0, 1.5 * 1e7 * parameters.physics.sizeScale * radius, 0]]"
            :line-width="5" :color="new Color('green')" />

        <!-- Rotate to account for different coordinate systems -->
        <TresGroup :rotation="new Euler(degToRad(90), 0, 0)">
            <Suspense v-for="sat in sats" :key="sat.parameters.name">
                <OrbitVue :satellite="sat" />
            </Suspense>
        </TresGroup>
    </TresGroup>
    <TresDirectionalLight :position="lightPosition" :intensity="1" :look-at="position">
        <Lensflare :scale="1" :color="new Color('orange')" />
    </TresDirectionalLight>
</template>

<script lang="ts" setup>
import { Line2 } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { Color, Euler, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { computed, ref } from "vue";
import earthTexture from "~/assets/textures/8081_earthmap10k.jpg";
import type { Planet } from "~/classes/bodies/planet";
import type { Satellite } from "~/classes/bodies/satellite";
import { parameters, useIntervalFn } from "#imports";
import OrbitVue from "./orbit.vue";

const { planet, sats } = defineProps<{
    planet: Planet;
    sats?: Satellite[];
}>();

const sunPosition = new Vector3(0, 0, 0); // The sun is at the origin in this model

const position = computed(() =>
    planet.orbit
        .calculateWorldPosition(0)
        .multiplyScalar(parameters.physics.distanceScale),
);

const radius = computed(
    () => planet.parameters.radius * parameters.physics.sizeScale,
);

// Light should be positioned between the sun and the earth, at a distance of 2*radius of the earth from the earth
// Set to position moved towards the sun by 2*radius
const lightPosition = computed(() =>
    sunPosition.clone().sub(
        position.value
            .clone()
            .normalize()
            .multiplyScalar(2 * radius.value),
    ),
);

const textures = await useTexture({
    map: earthTexture,
});

const rotation = ref(planet.getPositionAndRotationForDate(new Date()).rotation);

useIntervalFn(() => {
    rotation.value = planet.getPositionAndRotationForDate(new Date()).rotation;
}, 10);
</script>
