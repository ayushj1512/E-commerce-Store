import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('apiStore', () => {
  const sliderList = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch slider data from API
   * @param {string} menuType
   */
  const fetchSlider = async (menuType) => {
    loading.value = true
    error.value = null

    const apiUrl = `https://api.streetstylestore.com/collections/sss_config/documents/slider?a=1`
    const apiKey = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx"

    try {
      const res = await $fetch(apiUrl, {
        headers: { 'x-typesense-api-key': apiKey },
      })

      const dataField = res?.data || res?.document?.data || null
      if (dataField) {
        const parsedData = typeof dataField === 'string' ? JSON.parse(dataField) : dataField
        sliderList.value = parsedData[menuType] || []
      } else {
        sliderList.value = []
      }
    } catch (err) {
      console.error(`❌ Error fetching data for ${menuType}:`, err)
      sliderList.value = []
      error.value = err?.message || 'Failed to fetch'
    } finally {
      loading.value = false
    }
  }

  return {
    sliderList,
    loading,
    error,
    fetchSlider,
  }
})
