<template>
    <Popover v-model:open="open">
        <PopoverTrigger :as-child="true">
            <SidebarMenuButton size="lg"
            :class="{ 'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground': open }">
                <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <component :is="getIconForBody(selectedBody)" class="size-4" />
                </div>
                <span class="flex flex-col gap-0.5 leading-none">
                    <span class="font-semibold">Celestial Body</span>
                    <span>{{ selectedBody?.parameters.name ?? "None selected" }}</span>
                </span>
                <ChevronsUpDown class="ml-auto" />
            </SidebarMenuButton>
        </PopoverTrigger>
        <PopoverContent class="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command v-model="selectedBody">
                <CommandInput placeholder="Search bodies..." />
                <CommandEmpty>No bodies found.</CommandEmpty>
                <CommandList>
                    <CommandGroup heading="Stars" v-if="stars.length > 0">
                        <CommandItem v-for="star in stars" :key="star.parameters.name" :value="star"  @select="open = false">
                            <component :is="getIconForBody(star)" class="size-4 mr-2" />
                            <span>{{ star.parameters.name }}</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Planets" v-if="planets.length > 0">
                        <CommandItem v-for="planet in planets" :key="planet.parameters.name" :value="planet"  @select="open = false">
                            <component :is="getIconForBody(planet)" class="size-4 mr-2" />
                            <span>{{ planet.parameters.name }}</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Satellites" v-if="satellites.length > 0">
                        <CommandItem v-for="satellite in satellites" :key="satellite.parameters.name" :value="satellite"  @select="open = false">
                            <component :is="getIconForBody(satellite)" class="size-4 mr-2" />
                            <span>{{ satellite.parameters.name }}</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<script lang="ts" setup>
import { ChevronsUpDown, Globe, SatelliteIcon, SunIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import type { CelestialBody } from "~/classes/bodies";
import { Planet } from "~/classes/bodies/planet";
import { Sun } from "~/classes/bodies/planets/sun";
import { Satellite } from "~/classes/bodies/satellite";
import { bodies } from "#imports";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarMenuButton } from "../ui/sidebar";

const open = ref(false);
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

    if (body instanceof Sun) {
        return SunIcon;
    }

    return Globe;
};

const stars = computed(() =>
    bodies.value.filter((body) => body instanceof Sun),
);
const planets = computed(() =>
    bodies.value.filter((body) => body instanceof Planet),
);
const satellites = computed(() =>
    bodies.value.filter((body) => body instanceof Satellite),
);
</script>
