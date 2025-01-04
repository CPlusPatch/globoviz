<template>
    <Sidebar side="right">
        <SidebarRail />
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <BodySelector />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <Form>
                <SidebarGroup>
                    <SidebarGroupLabel>Physics</SidebarGroupLabel>
                    <SidebarGroupContent class="px-2 space-y-4">
                        <FormField v-slot="{ componentField, value, setValue }" name="axialTilt"
                            v-model:model-value="config.physics.axialTilt">
                            <FormItem>
                                <FormLabel>Axial Tilt</FormLabel>
                                <FormControl>
                                    <Slider v-bind="componentField" :model-value="[config.physics.axialTilt]"
                                        @update:model-value="m => setValue(m?.[0])" :max="180" :min="-180" :step="1" />
                                    <FormDescription class="flex justify-between gap-2">
                                        <span>The angle of the body's axis relative to its orbit</span>
                                        <span>{{ value }}&deg;</span>
                                    </FormDescription>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Time</SidebarGroupLabel>
                    <SidebarGroupContent class="px-2 space-y-4">
                        <FormField v-slot="{ componentField, value }" name="scale"
                            v-model:model-value="config.time.scale">
                            <FormItem>
                                <FormLabel>Time Scale</FormLabel>
                                <FormControl>
                                    <Input type="number" v-bind="componentField" :min="-100_000_000"
                                        :max="100_000_000" />
                                    <FormDescription class="flex justify-between gap-2">
                                        <span>The speed at which time progresses</span>
                                        <span>{{ value }}x</span>
                                    </FormDescription>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField, value }" name="hoursInDay"
                            v-model:model-value="config.time.hoursInDay">
                            <FormItem>
                                <FormLabel>Day Length</FormLabel>
                                <FormControl>
                                    <Input type="number" v-bind="componentField" :min="1" :max="1000" />
                                    <FormDescription class="flex justify-between gap-2">
                                        <span></span>
                                        <span>{{ value }} hours</span>
                                    </FormDescription>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField, value }" name="daysInYear"
                            v-model:model-value="config.time.daysInYear">
                            <FormItem>
                                <FormLabel>Year Length</FormLabel>
                                <FormControl>
                                    <Input type="number" v-bind="componentField" :min="1" :max="1000" />
                                    <FormDescription class="flex justify-between gap-2">
                                        <span></span>
                                        <span>{{ value }} days</span>
                                    </FormDescription>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </SidebarGroupContent>
                </SidebarGroup>
            </Form>
        </SidebarContent>
        <SidebarFooter>
            <DatetimePicker v-model="currentTime" />
        </SidebarFooter>
    </Sidebar>
</template>

<script lang="ts" setup>
import { Form } from "vee-validate";
import { reactive } from "vue";
import { z } from "zod";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "~/components/ui/sidebar";
import { DatetimePicker } from "../ui/datetime-picker";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import BodySelector from "./body-selector.vue";

const currentTime = defineModel<Date>("current-time", {
    default: new Date(),
});

const simConfigSchema = z.object({
    axialTilt: z
        .number()
        .min(-180, {
            message: "Axial tilt must be at least -180",
        })
        .max(180, {
            message: "Axial tilt must be at most 180",
        })
        .step(0.1)
        .default(23.5)
        .describe("Axial tilt"),
    scale: z
        .number()
        .int()
        .min(1, {
            message: "Time scale must be at least 1",
        })
        .max(10_000_000, {
            message: "Time scale must be at most 10,000,000",
        })
        .step(1)
        .default(1)
        .describe("Time scale"),
    hoursInDay: z
        .number()
        .min(1, {
            message: "Day length must be at least 1",
        })
        .max(100, {
            message: "Day length must be at most 1000",
        })
        .default(24)
        .describe("Day length"),
    daysInYear: z
        .number()
        .min(1, {
            message: "Year length must be at least 1",
        })
        .max(1000, {
            message: "Year length must be at most 1000",
        })
        .default(365.256366)
        .describe("Year length"),
});

export interface SimulationConfig {
    physics: {
        axialTilt: number;
    };
    time: {
        scale: number;
        hoursInDay: number;
        daysInYear: number;
    };
}

const defaultValues = simConfigSchema.parse({});
const config = reactive<SimulationConfig>({
    physics: {
        axialTilt: defaultValues.axialTilt,
    },
    time: {
        scale: defaultValues.scale,
        hoursInDay: defaultValues.hoursInDay,
        daysInYear: defaultValues.daysInYear,
    },
});

const emit = defineEmits<{
    updateConfig: [config: SimulationConfig];
}>();

emit("updateConfig", config);
</script>
