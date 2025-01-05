// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        "@nuxtjs/color-mode",
        "@nuxt/fonts",
        "nuxt-security",
        "@vueuse/nuxt",
        "@tresjs/nuxt",
    ],
    imports: {
        autoImport: false,
    },
    security: {
        headers: {
            contentSecurityPolicy: {
                "img-src": [
                    "'self'",
                    "data:",
                    "https://raw.githubusercontent.com",
                ],
            },
        },
    },
    colorMode: {
        classSuffix: "",
    },
    components: false,
    ssr: false,
});
