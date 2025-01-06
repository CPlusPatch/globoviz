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
import ecef from "~/assets/data/ecef.json";
import earthTexture from "~/assets/textures/8081_earthmap10k.jpg";
import type { Planet } from "~/classes/bodies/planet";
import type { Satellite } from "~/classes/bodies/satellite";
import type { ECEF } from "~/classes/renderer";
import { parameters, useIntervalFn, useNewBody } from "#imports";
import OrbitVue from "./orbit.vue";

const { planet } = defineProps<{
    planet: Planet;
    sats?: Satellite[];
}>();

const sunPosition = computed(() =>
    new Vector3(...(ecef as ECEF).sun[0]).multiplyScalar(
        parameters.physics.ecefScale,
    ),
);

const body = useNewBody(planet);

const position = computed(() => new Vector3(0, 0, 0));
const radius = computed(
    () => body.value.parameters.radius * parameters.physics.sizeScale,
);

// Light should be positioned between the sun and the earth, at a distance of 2*radius of the earth from the earth
const lightPosition = computed(() =>
    sunPosition.value
        .sub(position.value)
        .normalize()
        .multiplyScalar(2000 * radius.value),
);

const textures = await useTexture({
    map: earthTexture,
});

const rotation = ref(
    body.value.getPositionAndRotationForDate(new Date()).rotation,
);

useIntervalFn(() => {
    rotation.value = body.value.getPositionAndRotationForDate(
        new Date(),
    ).rotation;
}, 10);
</script>
