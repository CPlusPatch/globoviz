<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { CalendarDate } from "@internationalized/date";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { toDate } from "radix-vue/date";
import { computed, ref } from "vue";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const date = defineModel<Date>("modelValue", {
    default: new Date(),
});
const isOpen = ref(false);

const hours = Array.from({ length: 24 }, (_, i) => i).reverse();
const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

const formattedDate = computed(() => {
    return date.value
        ? // In format "Jan 1, 2022 13:00:00"
          format(date.value, "MMM d, yyyy HH:mm:ss")
        : "MM/DD/YYYY HH:MM";
});

const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (date.value) {
        const newDate = new Date(date.value);
        if (type === "hour") {
            newDate.setHours(Number.parseInt(value));
        } else if (type === "minute") {
            newDate.setMinutes(Number.parseInt(value));
        }
        date.value = newDate;
    }
};
</script>

<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
            <Button variant="outline" :class="cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
            )">
                <CalendarIcon class="mr-2 size-4" />
                <span>{{ formattedDate }}</span>
            </Button>
        </PopoverTrigger>

        <PopoverContent class="w-auto p-0">
            <div class="sm:flex">
                <Calendar :model-value="new CalendarDate(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                )" @update:model-value="s => date = toDate(s)" mode="single" initial-focus />

                <div class="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea class="w-64 sm:w-auto">
                        <div class="flex sm:flex-col p-2">
                            <Button v-for="hour in hours" :key="hour" size="icon"
                                :variant="date && date.getHours() === hour ? 'default' : 'ghost'"
                                class="sm:w-full shrink-0 aspect-square"
                                @click="handleTimeChange('hour', hour.toString())">
                                {{ hour }}
                            </Button>
                        </div>
                        <ScrollBar orientation="horizontal" class="sm:hidden" />
                    </ScrollArea>

                    <ScrollArea class="w-64 sm:w-auto">
                        <div class="flex sm:flex-col p-2">
                            <Button v-for="minute in minutes" :key="minute" size="icon"
                                :variant="date && date.getMinutes() === minute ? 'default' : 'ghost'"
                                class="sm:w-full shrink-0 aspect-square"
                                @click="handleTimeChange('minute', minute.toString())">
                                {{ minute.toString().padStart(2, '0') }}
                            </Button>
                        </div>
                        <ScrollBar orientation="horizontal" class="sm:hidden" />
                    </ScrollArea>
                </div>
            </div>
        </PopoverContent>
    </Popover>
</template>
