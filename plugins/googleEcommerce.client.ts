import { defineNuxtPlugin, useRouter } from "#app"
import { SHA256 } from "crypto-js"
import { useAuthStore } from "~/stores/auth"
import { useAddressStore } from "~/stores/address"
import { useCartStore } from "~/stores/cartStore"
import { useCookies } from "@vueuse/integrations/useCookies"

/**
 * Nuxt 4 Google Tag + Ecommerce Plugin (Enhanced)
 * ------------------------------------------------
 * Handles all GTM / GA4 Ecommerce pushes using Pinia stores
 * and SSS Analytics payload structure.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const cookies = useCookies()

  // 🏪 Pinia stores
  const authStore = useAuthStore()
  const addressStore = useAddressStore()
  const cartStore = useCartStore()

  /* -------------------------------------------------------------------------- */
  /* 🧠 Helper: GTAG Push                                                      */
  /* -------------------------------------------------------------------------- */
  const gtag = (...args: any[]) => {
    if (!process.client) return
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push(...args)
    window.dataLayer.push({ ecommerce: null })
    console.log("[GTAG] Event pushed →", args)
  }

  /* -------------------------------------------------------------------------- */
  /* 📦 Send Google Ecommerce Data                                              */
  /* -------------------------------------------------------------------------- */
  const sendGoogleEcomData = (eventName: string, ecommerceData: any = {}, itemsData: any[] = []) => {
    if (!process.client) return

    window.dataLayer = window.dataLayer || []
    const dataLayer = window.dataLayer

    let ecomData = { ...ecommerceData }
    if (itemsData?.length) ecomData.items = itemsData
    if (Object.keys(ecomData).length === 0) ecomData = null

    /* ----------------------------- 👤 USER DATA ----------------------------- */
    const userData: any = {
      firstName: "",
      lastName: "",
      mobileNumber: authStore.mobileNumber || "",
      email: authStore.email || "",
      city: "",
      stateName: "",
      postCode: "",
      sha56: {},
    }

    // Hash user identifiers
    Object.entries(userData).forEach(([k, v]) => {
      if (v && typeof v === "string") {
        userData.sha56[k] = SHA256(v).toString()
      }
    })

    // Derive names
    if (authStore.name) {
      const [first, last] = authStore.name.split(" ")
      userData.firstName = first || ""
      userData.lastName = last || ""
      if (first) userData.sha56.firstName = SHA256(first).toString()
      if (last) userData.sha56.lastName = SHA256(last).toString()
    }

    // 📍 Address data
    const delivery = addressStore.deliveryAddress || {}
    if (Object.keys(delivery).length) {
      userData.city = delivery.city || ""
      userData.stateName = delivery.state || ""
      userData.postCode = delivery.postcode || ""
      Object.entries({
        city: userData.city,
        stateName: userData.stateName,
        postCode: userData.postCode,
      }).forEach(([key, val]) => {
        if (val) userData.sha56[key] = SHA256(val).toString()
      })
    }

    ecomData.user = {
      id_customer: authStore.id_customer,
      name: authStore.name,
      cart_id: authStore.cart_id,
      ...userData,
    }

    /* ----------------------------- 📈 MARKETING DATA ----------------------------- */
    const marketingData = {
      fbc: cookies.get("_fbc") || "",
      fbp: cookies.get("_fbp") || "",
      utm_source: cookies.get("sss_source") || "",
      utm_medium: cookies.get("sss_medium") || "",
      utm_campaign: cookies.get("sss_campaign") || "",
      utm_term: cookies.get("sss_term") || "",
      utm_content: cookies.get("sss_content") || "",
      gcl: cookies.get("_gcl_id_") || "",
      snapcl: cookies.get("_snapcl_") || "",
    }

    ecomData.marketingData = marketingData

    /* ----------------------------- 🔥 Push to GTM ----------------------------- */
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
      event: eventName,
      ecommerce: ecomData,
    })
    dataLayer.push({ ecommerce: null })

    console.log(`[GTM] Event "${eventName}" →`, ecomData)

    /* ----------------------------- 📊 Analytics Payload ----------------------------- */
    const validEvents = [
      "view_item", "view_cart", "add_to_cart", "remove_from_cart",
      "begin_checkout", "address_select", "purchase", "add_to_wishlist",
      "cc_get_support", "cc_cancel_order", "cc_track_order",
      "cc_view_my_account", "cc_view_coupons", "cc_view_wishlist", "search"
    ]

    if (!validEvents.includes(eventName)) return

    const payLoad: Record<string, any> = {
      page_title: document.title,
      page_url: router.currentRoute.value.fullPath,
      event_type: eventName,
    }

    // Items data
    itemsData.forEach((item, idx) => {
      payLoad[`item[${idx}]`] = Object.entries(item)
        .map(([k, v]) => `${k}:${v}`)
        .join("~")
    })

    // Totals from cartStore
    if (["view_cart", "begin_checkout", "address_select", "purchase"].includes(eventName)) {
      payLoad.sub_total = cartStore.subtotal
      payLoad.discount = cartStore.discount
      payLoad.total = cartStore.total
      payLoad.cod_selected = cartStore.codSelected
    }

    // Address
    if (delivery && Object.keys(delivery).length) {
      payLoad.city = delivery.city
      payLoad.state_name = delivery.state
      payLoad.pin_code = delivery.postcode
    }

    // User info
    if (authStore.isAuthenticated) {
      payLoad.user_id = authStore.id_customer
      payLoad.user_info = `${authStore.id_customer}~${userData.firstName}~${userData.lastName}~${userData.mobileNumber}~${userData.email}`
    }

    if (eventName === "purchase") {
      payLoad.payment_type = ecomData.payment_type
    }

    if (eventName === "search") {
      payLoad.search_term = ecomData.search_term
    }

    console.log("[📊 Analytics Payload]", payLoad)
  }

  /* -------------------------------------------------------------------------- */
  /* 💳 Checkout Helper                                                        */
  /* -------------------------------------------------------------------------- */
  const gtmCheckOut = (eventName: string, paymentInfo = false) => {
    const googleEcomData: any = {
      currency: "INR",
      value: cartStore.total,
      payment_type: paymentInfo ? (cartStore.codSelected ? "COD" : "Online") : undefined,
    }

    const googleItems = cartStore.items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      quantity: i.quantity,
      price: i.MRP_price,
      discount: i.discountPerItem,
      item_list_id: i.item_list_id,
      item_list_name: i.item_list_name,
      item_category: (i.categories || []).join(","),
      item_variant: i.size || "",
    }))

    sendGoogleEcomData(eventName, googleEcomData, googleItems)
  }

  /* -------------------------------------------------------------------------- */
  /* 🧾 Purchase Event Helper (GA4)                                            */
  /* -------------------------------------------------------------------------- */
  const trackPurchase = (orderId: string | number) => {
    if (!process.client) return

    const paymentType = cartStore.codSelected ? "COD" : "Prepaid"

    const googleEcomData = {
      transaction_id: orderId,
      value: cartStore.total,
      tax: 0,
      shipping: 0,
      currency: "INR",
      payment_type: paymentType,
    }

    const googleItems = cartStore.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.MRP_price,
      discount: item.discountPerItem,
      item_category: (item.categories || []).join(","),
      item_variant: item.size || "",
      google_business_vertical: "retail",
    }))

    sendGoogleEcomData("purchase", googleEcomData, googleItems)

    console.log("✅ GA4 Purchase Event Sent:", { orderId, googleEcomData, googleItems })
  }

  /* -------------------------------------------------------------------------- */
  /* 💉 Provide to Nuxt App                                                    */
  /* -------------------------------------------------------------------------- */
  nuxtApp.provide("gtag", gtag)
  nuxtApp.provide("sendGoogleEcomData", sendGoogleEcomData)
  nuxtApp.provide("gtmCheckOut", gtmCheckOut)
  nuxtApp.provide("trackPurchase", trackPurchase)
})
