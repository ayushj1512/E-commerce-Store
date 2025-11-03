import { defineNuxtPlugin, useRouter } from "#app"
import { SHA256 } from "crypto-js"
import { useAuthStore } from "~/stores/auth"
import { useCartStore } from "~/stores/cartStore"
import { useAddressStore } from "~/stores/address"
import { useCookies } from "@vueuse/integrations/useCookies"

/**
 * 🪄 Nuxt 4 Meta (Facebook) Pixel Plugin
 * -------------------------------------------------------
 * Sends Meta Pixel ecommerce events with hashed user data,
 * cart contents, environment info, and tracking data.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const addressStore = useAddressStore()
  const cookies = useCookies()

  /* -------------------------------------------------------------------------- */
  /* 🧭 Detect Environment (Meta, Instagram, WebView)                           */
  /* -------------------------------------------------------------------------- */
  function getClientInfo() {
    const ua = (navigator.userAgent || navigator.vendor || "").toLowerCase()
    const uad = (navigator as any).userAgentData || null

    const isInstagram =
      ua.includes("instagram") ||
      (/fban|fbav/.test(ua) && ua.includes("instagram"))

    const isAndroid =
      /android/.test(ua) ||
      (uad && (uad.platform || "").toLowerCase() === "android")

    const isMetaInApp = /fban|fbav|instagram/.test(ua)
    const isAndroidWebView = isAndroid && (ua.includes("; wv") || ua.includes("version/"))

    return { isInstagram, isAndroid, isMetaInApp, isAndroidWebView, ua }
  }

  /* -------------------------------------------------------------------------- */
  /* 🔧 Auto Initialize Meta Pixel (if not present)                             */
  /* -------------------------------------------------------------------------- */
  const META_PIXEL_ID = useRuntimeConfig().public.metaPixelId || ""

  if (process.client && META_PIXEL_ID && typeof window.fbq !== "function") {
    (function (f, b, e, v, n?, t?, s?) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = "2.0"
      n.queue = []
      t = b.createElement(e)
      t.async = true
      t.src = "https://connect.facebook.net/en_US/fbevents.js"
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(window, document, "script")

    window.fbq("init", META_PIXEL_ID)
    console.log(`[Meta Pixel] Initialized → ${META_PIXEL_ID}`)
  }

  /* -------------------------------------------------------------------------- */
  /* 🧩 Helper: Safe FBQ Call                                                   */
  /* -------------------------------------------------------------------------- */
  const fbTrack = (event: string, data: any = {}) => {
    if (!process.client) return
    if (typeof window.fbq !== "function") {
      console.warn("[Meta Pixel] fbq not found — event skipped:", event)
      return
    }

    // Attach environment info
    const clientEnv = getClientInfo()
    const payload = { ...data, clientEnv }

    window.fbq("track", event, payload)
    console.log(`[Meta Pixel] Event "${event}" →`, payload)
  }

  /* -------------------------------------------------------------------------- */
  /* 👤 Build Hashed User Data for Matching                                     */
  /* -------------------------------------------------------------------------- */
  const getUserData = () => {
    const userData: any = { em: "", ph: "", fn: "", ln: "", ct: "", st: "", zp: "" }

    if (authStore.email) userData.em = SHA256(authStore.email).toString()
    if (authStore.mobileNumber) userData.ph = SHA256(authStore.mobileNumber).toString()

    if (authStore.name) {
      const [first, last] = authStore.name.split(" ")
      if (first) userData.fn = SHA256(first).toString()
      if (last) userData.ln = SHA256(last).toString()
    }

    const delivery = addressStore.deliveryAddress || {}
    if (delivery.city) userData.ct = SHA256(delivery.city).toString()
    if (delivery.state) userData.st = SHA256(delivery.state).toString()
    if (delivery.postcode) userData.zp = SHA256(delivery.postcode).toString()

    return userData
  }

  /* -------------------------------------------------------------------------- */
  /* 📦 Prepare Product Contents for Meta Pixel                                 */
  /* -------------------------------------------------------------------------- */
  const getFbContents = () => {
    return cartStore.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.MRP_price,
    }))
  }

  /* -------------------------------------------------------------------------- */
  /* 💰 Purchase Event                                                         */
  /* -------------------------------------------------------------------------- */
  const fbPurchaseEvent = (orderId: string) => {
    const contents = getFbContents()
    const fbData = {
      contents,
      content_type: "product",
      value: cartStore.total,
      currency: "INR",
      order_id: orderId,
      ...getUserData(),
    }
    fbTrack("Purchase", fbData)
  }

  /* -------------------------------------------------------------------------- */
  /* 📈 Generic Ecommerce Event                                                 */
  /* -------------------------------------------------------------------------- */
  const fbEcomEvent = (event: string, extraData: any = {}) => {
    const contents = getFbContents()
    const fbData = {
      contents,
      content_type: "product",
      value: cartStore.total,
      currency: "INR",
      ...extraData,
      ...getUserData(),
    }
    fbTrack(event, fbData)
  }

  /* -------------------------------------------------------------------------- */
  /* 🧭 Common Event Shortcuts                                                  */
  /* -------------------------------------------------------------------------- */
  const fbViewItem = (item: any) => fbEcomEvent("ViewContent", { content_ids: [item.id], value: item.MRP_price })
  const fbAddToCart = (item: any) => fbEcomEvent("AddToCart", { content_ids: [item.id], value: item.MRP_price })
  const fbCheckoutStart = () => fbEcomEvent("InitiateCheckout")

  /* -------------------------------------------------------------------------- */
  /* 💉 Provide to Nuxt App                                                    */
  /* -------------------------------------------------------------------------- */
  nuxtApp.provide("fbTrack", fbTrack)
  nuxtApp.provide("fbEcomEvent", fbEcomEvent)
  nuxtApp.provide("fbPurchaseEvent", fbPurchaseEvent)
  nuxtApp.provide("fbViewItem", fbViewItem)
  nuxtApp.provide("fbAddToCart", fbAddToCart)
  nuxtApp.provide("fbCheckoutStart", fbCheckoutStart)
})
