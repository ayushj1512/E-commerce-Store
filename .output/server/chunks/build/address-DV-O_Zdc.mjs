import { defineStore } from 'pinia';
import axios from 'axios';
import { u as useAuthStore } from './auth-BNE6mzpu.mjs';

const globals = {
  currencySymbol: "₹",
  siteLogo: "https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg",
  cookieAge: 60 * 60 * 24 * 180,
  apiUrl: "https://api.streetstylestore.com/",
  apiKey: {
    product: "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
    config: "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
    pinCode: "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
    productReviews: "9phsLIHZD9o6iBVkETcf2D3BFWTRCqDX"
  },
  serviceUrl: "http://localhost:5000/",
  gatewayUrl: "https://gateway.streetstylestore.com/gateway/v1/",
  baseUrl: "https://streetstylestore.com/",
  site: "sss",
  version: "1"
};
const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: [],
    lastUsedAddress: {},
    deliveryAddress: {},
    saveAddressClick: false,
    saveAddressButton: false,
    editAddress: {},
    checkAddressValidation: false
  }),
  getters: {
    getAddresses: (state) => state.addresses,
    getLastUsedAddress: (state) => state.lastUsedAddress,
    getAddressClick: (state) => state.saveAddressClick,
    getSaveAddressButton: (state) => state.saveAddressButton,
    getDeliveryAddress: (state) => state.deliveryAddress,
    getEditAddress: (state) => state.editAddress,
    getCheckAddressValidation: (state) => state.checkAddressValidation
  },
  actions: {
    async init() {
      await this.fetchAddresses();
    },
    async fetchAddresses() {
      const auth = useAuthStore();
      if (!auth.isAuthenticated || !auth.key) {
        console.warn("[Address Store] ⚠️ User not authenticated, skipping fetchAddresses");
        return;
      }
      const requestData = JSON.stringify({
        gateway_action: "customer/getCustomerAddresses",
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        // 👈 renamed to match gateway expectations
        site: globals.site
      });
      console.log("[Address Store] 📤 Fetch Addresses Request:", requestData);
      try {
        const { data } = await axios.post(globals.gatewayUrl, requestData, {
          headers: { "Content-Type": "application/json" }
        });
        console.log("[Address Store] 📩 Fetch Addresses Response:", data);
        this.setAddresses(data);
      } catch (error) {
        console.error("[Address Store] ❌ Error fetching addresses:", error);
      }
    },
    async saveAddress(payLoad) {
      const auth = useAuthStore();
      if (!auth.isAuthenticated || !auth.key) return;
      const requestData = JSON.stringify({
        gateway_action: "customer/saveCustomerAddress",
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        address: payLoad,
        site: globals.site
      });
      console.log("[Address Store] 📤 Save Address Request:", requestData);
      await axios.post(globals.gatewayUrl, requestData, {
        headers: { "Content-Type": "application/json" }
      });
      await this.fetchAddresses();
    },
    async removeAddress(id_address) {
      const auth = useAuthStore();
      if (!auth.isAuthenticated || !auth.key) return;
      const requestData = JSON.stringify({
        gateway_action: "customer/removeCustomerAddress",
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        id_address,
        site: globals.site,
        version: globals.version
      });
      console.log("[Address Store] 📤 Remove Address Request:", requestData);
      await axios.post(globals.gatewayUrl, requestData, {
        headers: { "Content-Type": "application/json" }
      });
      await this.fetchAddresses();
      if (this.deliveryAddress?.id_address === id_address) {
        this.deliveryAddress = {};
      }
    },
    // Local setters
    setSaveAddressClick(val) {
      this.saveAddressClick = val;
    },
    setSaveAddressButton(val) {
      this.saveAddressButton = val;
    },
    setLastUsedAddress(val) {
      this.lastUsedAddress = val;
    },
    setDeliveryAddress(val) {
      this.deliveryAddress = val;
    },
    setEditAddress(val) {
      this.editAddress = val;
    },
    setCheckAddressValidation(val) {
      this.checkAddressValidation = val;
    },
    setAddresses(list) {
      if (!Array.isArray(list) || list.length === 0) {
        this.addresses = [];
        this.lastUsedAddress = {};
        if (!this.deliveryAddress || Object.keys(this.deliveryAddress).length === 0) {
          this.deliveryAddress = {};
        }
        return;
      }
      this.addresses = list;
      const [lastUsedAddress, ...otherAddresses] = list;
      if (lastUsedAddress) {
        this.lastUsedAddress = lastUsedAddress;
        if (!this.deliveryAddress || Object.keys(this.deliveryAddress).length === 0) {
          this.deliveryAddress = lastUsedAddress;
        }
      } else if (otherAddresses.length === 1) {
        if (!this.deliveryAddress || Object.keys(this.deliveryAddress).length === 0) {
          this.deliveryAddress = otherAddresses[0];
        }
      }
    }
  }
});

export { useAddressStore as u };
//# sourceMappingURL=address-DV-O_Zdc.mjs.map
