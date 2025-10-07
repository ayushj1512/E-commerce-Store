import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHomeStore = defineStore('homeStore', () => {
  const sliderList = ref([])
  const instaImages = ref([])
  const doubledImages = ref([])
  const loading = ref(false)
  const instaLoading = ref(false)
  const error = ref(null)

  const API_URL = 'https://api.streetstylestore.com'
  const API_KEY = 'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx'

  /** ---------- SSR-safe fetch using useAsyncData ---------- **/
  const fetchSlider = async (menuType = 'top_menu') => {
    if (sliderList.value.length > 0) return sliderList.value
    try {
      const { data } = await useAsyncData(`slider-${menuType}`, async () => {
        const res = await $fetch(`${API_URL}/collections/sss_config/documents/slider?a=1`, {
          headers: { 'x-typesense-api-key': API_KEY },
        })
        const dataField = res?.data || res?.document?.data
        return dataField ? JSON.parse(dataField)[menuType] || [] : []
      })
      sliderList.value = data.value || []
    } catch (err) {
      console.error('🔴 [HomeStore] Slider fetch error:', err)
      sliderList.value = []
    }
    return sliderList.value
  }

  const fetchInstagramFeed = async () => {
    if (instaImages.value.length > 0) return instaImages.value
    try {
      const { data } = await useAsyncData('instagram-feed', async () => {
        const res = await $fetch(`${API_URL}/collections/sss_config/documents/slider?a=1`, {
          headers: { 'x-typesense-api-key': API_KEY },
        })
        const parsed = res?.data ? JSON.parse(res.data) : null
        return parsed?.instagram_images || []
      })
      instaImages.value = data.value || []
      doubledImages.value = [...instaImages.value, ...instaImages.value]
    } catch (err) {
      console.error('❌ [HomeStore] Instagram feed error:', err)
      instaImages.value = []
      doubledImages.value = []
    }
    return instaImages.value
  }

  return {
    sliderList,
    instaImages,
    doubledImages,
    loading,
    instaLoading,
    error,
    fetchSlider,
    fetchInstagramFeed,
  }
})
