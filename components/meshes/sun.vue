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
import sunTexture from "~/assets/textures/2k_sun.jpg";
import type { Sun } from "~/classes/bodies/planets/sun";
import { parameters } from "#imports";

const { sun } = defineProps<{
    sun: Sun;
}>();

const position = computed(() => new Vector3(0, 0, 0));
const radius = computed(
    () => sun.parameters.radius * parameters.physics.sizeScale * 1e-3,
);

const textures = await useTexture({
    map: sunTexture,
});
</script>
