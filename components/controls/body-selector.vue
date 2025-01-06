<template>
    <DropdownMenu v-model:open="dropdownOpen">
        <DropdownMenuTrigger as-child>
            <SidebarMenuButton size="lg"
                :class="{ 'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground': dropdownOpen }">
                <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <component :is="getIconForBody(selectedBody)" class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                    <span class="font-semibold">Celestial Body</span>
                    <span>{{ selectedBody?.parameters.name ?? "None selected" }}</span>
                </div>
                <ChevronsUpDown class="ml-auto" />
            </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent  class="w-[--radix-dropdown-menu-trigger-width]" align="start">
            <DropdownMenuItem v-for="body in bodies" :key="body.parameters.name" @click="selectedBody = body">
                <component :is="getIconForBody(body)" class="size-4 mr-2" />
                {{ body.parameters.name }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script lang="ts" setup>
import { ChevronsUpDown, Globe, SatelliteIcon } from "lucide-vue-next";
import { ref } from "vue";
import type { CelestialBody } from "~/classes/bodies";
import { Planet } from "~/classes/bodies/planet";
import { Satellite } from "~/classes/bodies/satellite";
import { bodies } from "#imports";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";

const dropdownOpen = ref(false);
const selectedBody = defineModel<CelestialBody | undefined>("selectedBody", {
    required: true,
});

const getIconForBody = (body?: CelestialBody) => {
    if (body instanceof Satellite) {
        return SatelliteIcon;
    }

    if (body instanceof Planet) {
        return Globe;
    }

    return Globe;
};
</script>
