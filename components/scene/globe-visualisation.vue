<template>
    <div class="h-full w-full bg-cover bg-center" :style="{ backgroundImage: `url(${stars})` }">
        <div ref="container" class="h-full w-full"></div>
    </div>
</template>

<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import type { FeatureCollection } from "geojson";
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import countries from "~/assets/data/globe-data.json";
import stars from "~/assets/textures/stars.jpg";
import { GlobeVisualization } from "~/classes/renderer";
import type { SimulationConfig } from "../controls/sidebar.vue";

const container = useTemplateRef<HTMLDivElement>("container");
const globe = ref<GlobeVisualization | null>(null);

const props = defineProps<{
    config: SimulationConfig;
}>();

const date = defineModel<Date>("currentTime", {
    default: new Date(),
});

onMounted(() => {
    const containerReal = container.value as HTMLDivElement;

    globe.value = new GlobeVisualization(
        {
            container: containerReal,
            width: containerReal.clientWidth,
            height: containerReal.clientHeight,
        },
        props.config,
    );
    globe.value.updateCountries(countries as unknown as FeatureCollection);
    globe.value.updateOrbits([
        {
            apoapsis: 240,
            periapsis: 100,
            inclination: 0,
        },
    ]);
});

watch(props.config, (newConfig) => {
    globe.value?.updateConfig(newConfig);
});

useIntervalFn(() => {
    if (globe.value) {
        date.value = globe.value.currentDate;
    }
}, 100);

watch(date, (newDate) => {
    if (globe.value) {
        globe.value.currentDate = newDate;
    }
});

onUnmounted(() => {
    globe.value?.dispose();
});
</script>
