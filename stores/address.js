// stores/address.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth' // Auth store import

// 🌐 Global Config
const globals = {
  currencySymbol: "₹",
  siteLogo: "https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg",
  cookieAge: 60 * 60 * 24 * 180,
  apiUrl: "https://api.streetstylestore.com/",
  apiKey: {
    product: "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
    config: "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
    pinCode: "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
    productReviews: "9phsLIHZD9o6iBVkETcf2D3BFWTRCqDX",
  },
  serviceUrl: "http://localhost:5000/",
  gatewayUrl: "https://gateway.streetstylestore.com/gateway/v1/",
  baseUrl: "https://streetstylestore.com/",
  site: "sss",
  version: "1",
}

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [],            // All user addresses
    lastUsedAddress: {},      // Last used address (optional)
    deliveryAddress: {},      // ✅ Currently selected address (for checkout)
    saveAddressClick: false,
    saveAddressButton: false,
    editAddress: {},
    checkAddressValidation: false,
  }),

  getters: {
    getAddresses: (state) => state.addresses,
    getLastUsedAddress: (state) => state.lastUsedAddress,
    getDeliveryAddress: (state) => state.deliveryAddress,
    getAddressClick: (state) => state.saveAddressClick,
    getSaveAddressButton: (state) => state.saveAddressButton,
    getEditAddress: (state) => state.editAddress,
    getCheckAddressValidation: (state) => state.checkAddressValidation,
  },

  actions: {
    // 🔄 Initialize the address store
    async init() {
      await this.fetchAddresses()
    },

    // 📦 Fetch all addresses from API
    async fetchAddresses() {
      const auth = useAuthStore()
      if (!auth.isAuthenticated || !auth.key) {
        console.warn("[Address Store] ⚠️ User not authenticated, skipping fetchAddresses")
        return
      }

      const requestData = JSON.stringify({
        gateway_action: 'customer/getCustomerAddresses',
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        site: globals.site,
      })

      console.log("[Address Store] 📤 Fetch Addresses Request:", requestData)

      try {
        const { data } = await axios.post(globals.gatewayUrl, requestData, {
          headers: { 'Content-Type': 'application/json' },
        })

        console.log("[Address Store] 📩 Fetch Addresses Response:", data)

        if (Array.isArray(data)) {
          this.setAddresses(data)
        } else {
          console.warn("[Address Store] ⚠️ Unexpected response format:", data)
          this.addresses = []
        }

      } catch (error) {
        console.error("[Address Store] ❌ Error fetching addresses:", error)
      }
    },

    // 💾 Save or update address
    async saveAddress(payload) {
      const auth = useAuthStore()
      if (!auth.isAuthenticated || !auth.key) return

      const requestData = JSON.stringify({
        gateway_action: 'customer/saveCustomerAddress',
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        address: payload,
        site: globals.site,
      })

      console.log("[Address Store] 📤 Save Address Request:", requestData)

      try {
        await axios.post(globals.gatewayUrl, requestData, {
          headers: { 'Content-Type': 'application/json' },
        })

        await this.fetchAddresses()
      } catch (error) {
        console.error("[Address Store] ❌ Error saving address:", error)
      }
    },

    // ❌ Remove an address
    async removeAddress(id_address) {
      const auth = useAuthStore()
      if (!auth.isAuthenticated || !auth.key) return

      const requestData = JSON.stringify({
        gateway_action: 'customer/removeCustomerAddress',
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        id_address,
        site: globals.site,
        version: globals.version,
      })

      console.log("[Address Store] 📤 Remove Address Request:", requestData)

      try {
        await axios.post(globals.gatewayUrl, requestData, {
          headers: { 'Content-Type': 'application/json' },
        })

        await this.fetchAddresses()

        // If the deleted address was selected
        if (this.deliveryAddress?.id_address === id_address) {
          console.log("[Address Store] 🧹 Removed selected delivery address from store")
          this.deliveryAddress = {}
        }
      } catch (error) {
        console.error("[Address Store] ❌ Error removing address:", error)
      }
    },

    // 🧠 Local setters
    setSaveAddressClick(val) { this.saveAddressClick = val },
    setSaveAddressButton(val) { this.saveAddressButton = val },
    setLastUsedAddress(val) { this.lastUsedAddress = val },
    setEditAddress(val) { this.editAddress = val },
    setCheckAddressValidation(val) { this.checkAddressValidation = val },

    // ✅ Store the current selected delivery address
    setDeliveryAddress(address) {
      if (!address || !address.id_address) {
        console.warn("[Address Store] ⚠️ Invalid address selected:", address)
        return
      }
      this.deliveryAddress = address
      console.log("✅ [Address Store] Delivery address set:", address)
    },

    // 📋 Update the address list and sync selected address
    setAddresses(list) {
      if (!Array.isArray(list) || list.length === 0) {
        console.warn("[Address Store] ⚠️ No addresses found.")
        this.addresses = []
        this.lastUsedAddress = {}
        this.deliveryAddress = {}
        return
      }

      this.addresses = list

      // Pick last used or first one if none selected
      const preferred = list.find(a => a.recent === "1") || list[0]
      this.lastUsedAddress = preferred

      if (!this.deliveryAddress?.id_address) {
        this.deliveryAddress = preferred
        console.log("📦 [Address Store] Default delivery address set:", preferred)
      }
    },
  },
})
