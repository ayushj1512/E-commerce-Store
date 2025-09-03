// ~/plugins/vue-toastification.client.js
import { defineNuxtPlugin } from 'nuxt/app'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Install Vue Toastification with slightly smaller notifications
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 2500,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    transition: 'Vue-Toastification__fade',
    toastClassName: 'bg-white text-black border-l-4 max-w-[280px] py-2 px-3 rounded-lg shadow-md',
    bodyClassName: 'font-medium text-sm', // slightly smaller font
    icon: true,
  })

  // Provide $toast globally
  nuxtApp.provide('toast', nuxtApp.vueApp.config.globalProperties.$toast)
})
