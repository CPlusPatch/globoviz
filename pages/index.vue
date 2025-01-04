<template>
    <SidebarProvider class="![--sidebar-width:20rem]">
        <SidebarInset>
            <GlobeVisualisation :config="config" v-model:current-time="date" />
        </SidebarInset>
        <Sidebar @update-config="c => config = c" v-model:current-time="date" />
    </SidebarProvider>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Sidebar, {
    type SimulationConfig,
} from "~/components/controls/sidebar.vue";
import GlobeVisualisation from "~/components/scene/globe-visualisation.vue";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

const config = ref<SimulationConfig>({} as SimulationConfig);
const date = ref(new Date());
</script>
