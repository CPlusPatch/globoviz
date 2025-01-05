<template>
    <TresGroup :rotation="rotation">
        <TresMesh :position="position" :receive-shadow="true">
            <TresSphereGeometry :args="[radius, 32, 32]" />
            <TresMeshLambertMaterial :map="textures.map" />
        </TresMesh>
        <!-- Earth axis -->
        <Line2
            :points="[[0, -1.5 * 1e7 * parameters.physics.sizeScale * radius, 0], [0, 1.5 * 1e7 * parameters.physics.sizeScale * radius, 0]]" :line-width="5"
            :color="new Color('green')" />

            <Suspense>
                <OrbitVue />
            </Suspense>
        </TresGroup>
        <TresDirectionalLight :position="lightPosition" :intensity="1" :look-at="position">
            <Lensflare :scale="1" :color="new Color('orange')" />
        </TresDirectionalLight>
</template>

<script lang="ts" setup>
import { Line2 } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { Color, Vector3 } from "three";
import { computed, ref } from "vue";
import ecef from "~/assets/data/ecef.json";
import earthTexture from "~/assets/textures/8081_earthmap10k.jpg";
import { Earth } from "~/classes/bodies/earth";
import type { ECEF } from "~/classes/renderer";
import { parameters, useIntervalFn, useNewBody } from "#imports";
import OrbitVue from "./orbit.vue";

const sunPosition = computed(() =>
    new Vector3(...(ecef as ECEF).sun[0]).multiplyScalar(
        parameters.physics.ecefScale,
    ),
);

const body = useNewBody(new Earth());

const position = computed(() => new Vector3(0, 0, 0));
const radius = computed(
    () => body.value.getParameters().radius * parameters.physics.sizeScale,
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
