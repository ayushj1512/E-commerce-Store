// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'nuxt-toast',
  ],

  css: ["@/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  plugins: [
    '~/plugins/global.client.js',
  ],

  // @ts-ignore
  nuxtToast: {
    position: 'top-right',
    duration: 3000,
    dismissible: true,
    max: 5,
    theme: 'bubble',
  },
})
