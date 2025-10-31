export default defineNuxtPlugin(async (nuxtApp) => {
  const appId = useRuntimeConfig().public.cashfreeAppId
  const mode = useRuntimeConfig().public.cashfreeMode
  const sdkUrl = useRuntimeConfig().public.cashfreeSdkUrl

  /**
   * Helper to dynamically load the Cashfree UI SDK if not already loaded.
   */
  const loadCashfreeSDK = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return reject('Not in browser')
      if ((window as any).Cashfree) return resolve()

      const script = document.createElement('script')
      script.src = sdkUrl
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject('❌ Failed to load Cashfree SDK')
      document.head.appendChild(script)
    })

  try {
    await loadCashfreeSDK()

    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if ((window as any).Cashfree) {
          clearInterval(check)
          resolve()
        }
      }, 100)
    })

    console.log('✅ Cashfree UI SDK loaded successfully')
    const cashfree = (window as any).Cashfree({ mode })
    nuxtApp.provide('cashfree', cashfree)
    nuxtApp.provide('cashfreeAppId', appId)
  } catch (err) {
    console.error('❌ Error initializing Cashfree UI SDK:', err)
  }
})
