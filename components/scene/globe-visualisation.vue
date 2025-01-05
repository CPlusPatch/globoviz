<template>
    <div class="flex flex-1 bg-black relative">
        <header class="flex h-16 shrink-0 items-center gap-2 border-b border-l rounded-bl px-4 absolute right-0">
            <SidebarTrigger class="-ml-1" />
        </header>
        <div ref="container" class="h-full w-full"></div>

        <Transition leave-active-class="duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <Loading v-if="!loaded" />
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { GlobeVisualization } from "~/classes/renderer";
import type { SimulationConfig } from "../controls/sidebar.vue";
import { SidebarTrigger } from "../ui/sidebar";
import Loading from "./loading.vue";

const container = useTemplateRef<HTMLDivElement>("container");
const globe = ref<GlobeVisualization | null>(null);

const props = defineProps<{
    config: SimulationConfig;
}>();

const date = defineModel<Date>("currentTime", {
    default: new Date(),
});
const loaded = ref(false);

onMounted(async () => {
    const containerReal = container.value as HTMLDivElement;

    globe.value = new GlobeVisualization(
        {
            container: containerReal,
            width: containerReal.clientWidth,
            height: containerReal.clientHeight,
        },
        props.config,
    );

    await globe.value.init();
    loaded.value = true;
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
