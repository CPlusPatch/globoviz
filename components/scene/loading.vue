<template>
    <div class="absolute inset-0 flex items-center justify-center bg-background">
        <Loader class="size-12 animate-spin" />

        <div class="absolute bottom-8 left-8 max-w-xl z-20">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    &OpenCurlyDoubleQuote;The Earth is the cradle of humanity, but mankind cannot stay in the cradle
                    forever.&CloseCurlyDoubleQuote;
                </p>
                <footer class="text-sm">
                    &mdash; Konstantin Tsiolkovsky
                </footer>
            </blockquote>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Loader } from "lucide-vue-next";
</script>
