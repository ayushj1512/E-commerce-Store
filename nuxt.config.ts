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
    '~/plugins/cashfree.client.ts', // ✅ Added Cashfree plugin
  ],

  app: {
    head: {
      link: [
        // ✅ Favicon configuration
        { rel: 'icon', type: 'image/x-icon', href: '/sss-logo.ico' },
      ],
      script: [
        {
          src: "https://sdk.cashfree.com/js/v3/cashfree.js", // ✅ Cashfree SDK v3
          defer: true,
        },
      ],
    },
  },

  // @ts-ignore
  nuxtToast: {
    position: 'top-right',
    duration: 3000,
    dismissible: true,
    max: 5,
    theme: 'bubble',
  },
})
