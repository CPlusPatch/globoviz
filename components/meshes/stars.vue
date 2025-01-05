<script setup lang="ts">
import { useTexture } from "@tresjs/core";
import { ref, watchEffect } from "vue";
import ecef from "~/assets/data/ecef.json";
import sunGlow from "~/assets/textures/sun_glow.png";
import type { ECEF } from "~/classes/renderer";
import { parameters } from "#imports";

const position = ref<Float32Array | undefined>();
const color = ref<Float32Array | undefined>();

const setStars = () => {
    const starData = (ecef as ECEF).stars;
    const colorList = [
        [0.235, 0.875, 1.0],
        [1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0],
        [1.0, 0.573, 0.282],
    ];

    const positionArray: number[] = [];

    const generateStars = (
        position: [number, number, number],
        scale: number,
    ): number[] => {
        return [
            position[0] * scale * parameters.physics.ecefScale * 0.2,
            position[1] * scale * parameters.physics.ecefScale * 0.2,
            position[2] * scale * parameters.physics.ecefScale * 0.2,
        ];
    };

    for (const [index, star] of starData.xyz.entries()) {
        const size = 1 / starData.size[index];
        const generatedStars = generateStars(star, size);

        positionArray.push(...generatedStars);
    }

    position.value = new Float32Array(positionArray);
    color.value = new Float32Array(
        starData.xyz.flatMap(() => {
            const chosenColor =
                colorList[Math.floor(Math.random() * colorList.length)];

            return [chosenColor[0], chosenColor[1], chosenColor[2]];
        }),
    );
};

watchEffect(() => {
    setStars();
});

const map = await useTexture({
    map: sunGlow,
});
</script>

<template>
    <TresPoints>
        <TresBufferGeometry :position="[position, 3]" :color="[color, 3]" />
        <TresPointsMaterial :map="map.map" />
    </TresPoints>
</template>
