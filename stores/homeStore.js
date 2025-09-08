// stores/homeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHomeStore = defineStore('homeStore', () => {
  const sliderList = ref([])
  const loading = ref(false)
  const error = ref(null)

  const API_URL = 'https://api.streetstylestore.com'
  const API_KEY = 'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx'

  // Fetch slider for top_menu or any other menu type
  const fetchSlider = async (menuType) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch(`${API_URL}/collections/sss_config/documents/slider?a=1`, {
        headers: { 'x-typesense-api-key': API_KEY }
      })
      const dataField = res?.data || res?.document?.data
      sliderList.value = dataField ? JSON.parse(dataField)[menuType] || [] : []
    } catch (err) {
      console.error('🔴 [HomeStore] Slider fetch error:', err)
      sliderList.value = []
      error.value = err?.message || 'Failed to fetch slider'
    } finally {
      loading.value = false
    }
  }

  return { sliderList, loading, error, fetchSlider }
})
