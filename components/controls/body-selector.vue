<template>
    <DropdownMenu v-model:open="dropdownOpen">
        <DropdownMenuTrigger as-child>
            <SidebarMenuButton size="lg"
                :class="{ 'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground': dropdownOpen }">
                <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <component :is="selectedBody.icon" class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                    <span class="font-semibold">Celestial Body</span>
                    <span>{{ selectedBody.title }}</span>
                </div>
                <ChevronsUpDown class="ml-auto" />
            </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent  class="w-[--radix-dropdown-menu-trigger-width]" align="start">
            <DropdownMenuItem v-for="body in bodies" :key="body.title" @click="selectedBody = body">
                <component :is="body.icon" class="size-4 mr-2" />
                {{ body.title }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script lang="ts" setup>
import { ChevronsUpDown, Globe } from "lucide-vue-next";
import { ref } from "vue";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";

const dropdownOpen = ref(false);

const bodies = [
    {
        title: "Earth",
        icon: Globe,
    },
];

const selectedBody = ref(bodies[0]);
</script>
