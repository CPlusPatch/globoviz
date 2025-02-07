<template>
    <Sidebar side="right">
        <SidebarRail />
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <BodySelector v-model:selected-body="selectedBody" />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <Form>
                <BodyEditor v-if="selectedBody" v-model:selected-body="selectedBody" />
                <SidebarGroup>
                    <SidebarGroupLabel>Physics</SidebarGroupLabel>
                    <SidebarGroupContent class="px-2 space-y-4">
                        <FormField v-slot="{ componentField, value, setValue }" name="axialTilt"
                            v-model:model-value="parameters.physics.axialTilt">
                            <FormField v-slot="{ componentField, value }" name="ecefScale"
                            v-model:model-value="parameters.physics.ecefScale">
                                <FormItem>
                                    <FormLabel>Distance Scale</FormLabel>
                                    <FormControl>
                                        <Input type="number" v-bind="componentField" :min="-100_000_000"
                                            :max="100_000_000" />
                                        <FormDescription class="flex justify-between gap-2">
                                            <span></span>
                                            <span>{{ value }}x</span>
                                        </FormDescription>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                            <FormField v-slot="{ componentField, value }" name="sizeScale"
                            v-model:model-value="parameters.physics.sizeScale">
                                <FormItem>
                                    <FormLabel>Size Scale</FormLabel>
                                    <FormControl>
                                        <Input type="number" v-bind="componentField" :min="1e-10"
                                            :max="1e-3" :step="1e-6" />
                                        <FormDescription class="flex justify-between gap-2">
                                            <span></span>
                                            <span>{{ value }}x</span>
                                        </FormDescription>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                        </FormField>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Time</SidebarGroupLabel>
                    <SidebarGroupContent class="px-2 space-y-4">
                        <FormField v-slot="{ componentField, value }" name="scale"
                            v-model:model-value="parameters.time.scale">
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
import { type Ref, ref } from "vue";
import type { CelestialBody } from "~/classes/bodies";
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
import { parameters } from "#imports";
import { DatetimePicker } from "../ui/datetime-picker";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import BodyEditor from "./body-editor.vue";
import BodySelector from "./body-selector.vue";

const currentTime = defineModel<Date>("current-time", {
    default: new Date(),
});

const selectedBody: Ref<CelestialBody | undefined> = ref(undefined);

export interface SimulationConfig {
    physics: {
        axialTilt: number;
        ecefScale: number;
        sizeScale: number;
    };
    time: {
        scale: number;
        hoursInDay: number;
        daysInYear: number;
    };
}
</script>
