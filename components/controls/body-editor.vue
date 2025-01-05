<template>
    <SidebarGroup>
        <SidebarGroupLabel>Physics</SidebarGroupLabel>
        <SidebarGroupContent class="px-2 space-y-4">
            <FormField v-slot="{ componentField, value, setValue }" name="axialTilt"
                v-model:model-value="parameters.axialTilt">
                <FormItem>
                    <FormLabel>Axial Tilt</FormLabel>
                    <FormControl>
                        <Slider v-bind="componentField" :model-value="[parameters.axialTilt]"
                            @update:model-value="m => setValue(m?.[0])" :max="180" :min="-180" :step="1" />
                    </FormControl>
                    <FormDescription class="flex justify-between gap-2">
                        <span>The angle of the body's axis relative to its orbit</span>
                        <span>{{ value }}&deg;</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
        </SidebarGroupContent>
    </SidebarGroup>
    <Separator />
    <SidebarGroup>
        <SidebarGroupLabel>Orbit</SidebarGroupLabel>
        <SidebarGroupContent class="px-2 space-y-4">
            <FormField v-slot="{ componentField, value }" name="semiMajorAxis"
                v-model:model-value="orbitParameters.semiMajorAxis">
                <FormItem>
                    <FormLabel>Semi-Major Axis</FormLabel>
                    <FormControl>
                        <Input type="number" v-bind="componentField" :min="-100_000_000" :max="100_000_000" />
                    </FormControl>
                    <FormDescription class="flex justify-between gap-2">
                        <span></span>
                        <span>{{ value }}m</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Separator />
            <FormField v-slot="{ componentField, value, setValue }" name="eccentricity"
                v-model:model-value="orbitParameters.eccentricity">
                <FormItem>
                    <FormLabel>Eccentricity</FormLabel>
                    <FormControl>
                        <Slider v-bind="componentField" :model-value="[orbitParameters.eccentricity]"
                            @update:model-value="m => setValue(m?.[0])" :max="1" :min="0" :step="0.01" />
                    </FormControl>
                    <FormDescription class="flex justify-between gap-2">
                        <span>The shape of the orbit</span>
                        <span>{{ value }}</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Separator />
            <FormField v-slot="{ componentField, value, setValue }" name="inclination"
                v-model:model-value="orbitParameters.inclination">
                <FormItem>
                    <FormLabel>Inclination</FormLabel>
                    <FormControl>
                        <Slider v-bind="componentField" :model-value="[orbitParameters.inclination]"
                            @update:model-value="m => setValue(m?.[0])" :max="180" :min="-180" :step="1" />
                    </FormControl>
                    <FormDescription class="flex justify-between gap-2">
                        <span>The angle of the orbit relative to the equator</span>
                        <span>{{ value }}&deg;</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Separator />
            <FormField v-slot="{ componentField, value, setValue }" name="longitudeOfAscendingNode"
                v-model:model-value="orbitParameters.longitudeOfAscendingNode">
                <FormItem>
                    <FormLabel>Longitude of Ascending Node</FormLabel>
                    <FormControl>
                        <Slider v-bind="componentField" :model-value="[orbitParameters.longitudeOfAscendingNode]"
                            @update:model-value="m => setValue(m?.[0])" :max="180" :min="-180" :step="1" />
                    </FormControl>
                    <FormDescription class="flex justify-between gap-2">
                        <span>The angle of the orbit's ascending node relative to the vernal equinox</span>
                        <span>{{ value }}&deg;</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField>
            <!-- <FormField v-slot="{ componentField, value, setValue }" name="animate"
                v-model:model-value="orbitParameters.animate">
                <FormItem>
                    <div class="grid grid-cols-[auto,1fr] gap-2 w-full items-center">
                        <FormLabel>Animated</FormLabel>
                        <FormControl>
                            <Switch v-bind="componentField" :checked="orbitParameters.animate"
                                @update:checked="m => setValue(m)" class="ml-auto" />
                        </FormControl>
                    </div>
                    <FormDescription class="flex justify-between gap-2">
                        <span>Whether the orbit should be animated</span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            </FormField> -->
        </SidebarGroupContent>
    </SidebarGroup>
</template>

<script lang="ts" setup>
import { Switch } from "@/components/ui/switch";
import { reactive, watch } from "vue";
import type { CelestialBody } from "~/classes/bodies";
import {
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "~/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";

const body = defineModel<CelestialBody>("selectedBody", {
    required: true,
});

// Workaround the fact that orbit and parent are classes, not plain objects, which means they can't be watched
const parameters = reactive({ ...body.value.parameters, orbit: null });
const orbitParameters = reactive({
    ...body.value.parameters.orbit.parameters,
    parent: null,
});
watch(parameters, (np) => {
    body.value.parameters = {
        ...np,
        orbit: body.value.parameters.orbit,
    };
});

watch(orbitParameters, (np) => {
    body.value.parameters.orbit.parameters = {
        ...np,
        parent: body.value.parameters.orbit.parameters.parent,
    };
});
</script>
