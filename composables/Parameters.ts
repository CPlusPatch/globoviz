import { type Reactive, reactive } from "vue";
import type { SimulationConfig } from "~/components/controls/sidebar.vue";

const useParameters = (): Reactive<SimulationConfig> => {
    return reactive({
        physics: {
            ecefScale: 1e3,
            sizeScale: 1e-7,
        },
        time: {
            scale: 1,
            daysInYear: 365.256366,
            hoursInDay: 24,
        },
    });
};

export const parameters = useParameters();
