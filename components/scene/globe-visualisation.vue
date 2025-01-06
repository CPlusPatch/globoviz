<template>
    <div class="flex flex-1 bg-black relative">
        <header class="flex h-16 shrink-0 bg-background items-center gap-2 border-b border-l rounded-bl px-4 absolute right-0 z-10">
            <SidebarTrigger class="-ml-1" />
        </header>

        <Footer class="absolute left-0 bottom-0 z-10" />

        <TresCanvas :realistic="true" clear-color="#000">
            <TresPerspectiveCamera :position="[3, 3, 3]" />
            <OrbitControls />

            <Suspense>
                <SunMesh :sun="sun" />
            </Suspense>

            <Suspense v-for="planet in planets" :key="planet.parameters.name">
                <PlanetMesh :planet="planet" :sats="sats.filter((sat) => sat.parameters.orbit.parent === planet)" />
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
            <Loading v-if="!hasFinishLoading" class="z-20" />
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { useProgress } from "@tresjs/cientos";
import { BloomPmndrs, EffectComposerPmndrs } from "@tresjs/post-processing";
import { Planet } from "~/classes/bodies/planet";
import { Sun } from "~/classes/bodies/planets/sun";
import { Satellite } from "~/classes/bodies/satellite";
import { solarSystem } from "~/classes/bodies/solarsystem";
import { TresCanvas } from "#components";
import PlanetMesh from "../meshes/planet.vue";
import Stars from "../meshes/stars.vue";
import SunMesh from "../meshes/sun.vue";
import { SidebarTrigger } from "../ui/sidebar";
import Footer from "./footer.vue";
import Loading from "./loading.vue";

const date = defineModel<Date>("currentTime", {
    default: new Date(),
});

const sun = solarSystem.find((body) => body instanceof Sun) as Sun;
const planets = solarSystem.filter(
    (body) => body instanceof Planet && !(body instanceof Sun),
);
const sats = solarSystem.filter((body) => body instanceof Satellite);

const { hasFinishLoading } = await useProgress();
</script>
