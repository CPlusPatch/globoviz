<template>
    <TresGroup :position="position">
        <TresMesh :receive-shadow="false">
            <TresSphereGeometry :args="[radius, 32, 32]" />
            <TresMeshLambertMaterial :map="textures.map" :emissive="new Color('orange')" :emissive-intensity="4" />
        </TresMesh>
    </TresGroup>
</template>

<script lang="ts" setup>
import { useTexture } from "@tresjs/core";
import { Color, Vector3 } from "three";
import { computed } from "vue";
import ecef from "~/assets/data/ecef.json";
import sunTexture from "~/assets/textures/2k_sun.jpg";
import type { Sun } from "~/classes/bodies/planets/sun";
import type { ECEF } from "~/classes/renderer";
import { parameters, useNewBody } from "#imports";

const { sun } = defineProps<{
    sun: Sun;
}>();

useNewBody(sun);

const position = computed(() =>
    new Vector3(...(ecef as ECEF).sun[0]).multiplyScalar(
        parameters.physics.ecefScale,
    ),
);
const radius = computed(
    () => sun.parameters.radius * parameters.physics.sizeScale,
);

const textures = await useTexture({
    map: sunTexture,
});
</script>
