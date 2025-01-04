<template>
    <SidebarProvider class="![--sidebar-width:20rem]">
        <SidebarInset>
            <GlobeVisualisation :config="config" v-model:current-time="date" />
        </SidebarInset>
        <Sidebar @update-config="c => config = c" v-model:current-time="date" />
    </SidebarProvider>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from "vue";
import { SFXPlayer } from "~/classes/audio";
import Sidebar, {
    type SimulationConfig,
} from "~/components/controls/sidebar.vue";
import GlobeVisualisation from "~/components/scene/globe-visualisation.vue";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const config = ref<SimulationConfig>({} as SimulationConfig);
const date = ref(new Date());

// When the window is first clicked, play sound
const playBgMusic = () => {
    SFXPlayer.stopAllSounds("music");
    window.removeEventListener("click", playBgMusic);
    const player = new SFXPlayer();

    player.playSound("music");
};

window.addEventListener("click", playBgMusic);

onUnmounted(() => {
    window.removeEventListener("click", playBgMusic);
});
</script>
