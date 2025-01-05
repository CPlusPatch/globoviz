<template>
    <div class="flex flex-1 bg-black relative">
        <header class="flex h-16 shrink-0 items-center gap-2 border-b border-l rounded-bl px-4 absolute right-0">
            <SidebarTrigger class="-ml-1" />
        </header>
        <TresCanvas :realistic="true" clear-color="#000">
            <TresPerspectiveCamera :position="[3, 3, 3]" />
            <OrbitControls />

            <Suspense>
                <Sun />
            </Suspense>

            <Suspense>
                <Earth />
            </Suspense>

            <Suspense>
                <Stars />
            </Suspense>

            <EffectComposerPmndrs>
                <BloomPmndrs :radius="0.85" :intensity="1.0" :luminance-threshold="0.1" :luminance-smoothing="0.3"
                    mipmap-blur />
            </EffectComposerPmndrs>
        </TresCanvas>

        <Transition leave-active-class="duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <Loading v-if="!hasFinishLoading" />
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { BloomPmndrs, EffectComposerPmndrs } from "@tresjs/post-processing";
import { TresCanvas } from "#components";
import Earth from "../meshes/earth.vue";
import Stars from "../meshes/stars.vue";
import Sun from "../meshes/sun.vue";
import { SidebarTrigger } from "../ui/sidebar";
import Loading from "./loading.vue";
import { useProgress } from "@tresjs/cientos";

const date = defineModel<Date>("currentTime", {
    default: new Date(),
});

const { hasFinishLoading, progress, items } = await useProgress();
</script>
