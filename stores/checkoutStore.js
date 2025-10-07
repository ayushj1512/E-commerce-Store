// stores/checkoutStore.js
import { defineStore } from 'pinia'
import { useOrdersStore } from './orders'

export const useCheckoutStore = defineStore('checkoutStore', {
  state: () => ({
    cartItems: [],
    cartTotal: 0,
    bankOption: '',
    selectedPayment: 'cod', // track selected payment
  }),
  actions: {
    async setOrder() {
      const ordersStore = useOrdersStore()

      // Detect device type safely (client-only)
      let orderFrom = 'Mobile'
      if (process.client && window.innerWidth >= 1024) {
        orderFrom = 'Desktop'
      }

      let payment = this.selectedPayment
      if (payment === 'cod' && this.cartTotal === 0) {
        payment = 'Free Order'
      }

      // Example: get delivery address from a global/store method
      const deliveryAddress = this.getDeliveryAddress()

      const payload = JSON.stringify({
        gateway_action: "order/setOrder",
        id_address_delivery: deliveryAddress.id_address,
        payment,
        bankOption: this.bankOption || '',
        site: this.$globals.site,
        version: this.$globals.version,
        checkout: this.$globals.checkout,
        orderFrom,
        deal_city: this.getDealCity()
      })

      try {
        const result = await this.$api.gatewayServerCall(this.$axios, this.$globals.gatewayUrl, payload, '', true)

        if (!result.status && result.errors?.length) {
          return result
        } else if (result.status === true) {
          // Success
          await ordersStore.setOrderItems(this.cartItems)
          await ordersStore.setOrderId(result.idOrder)
          await ordersStore.setOrderReference(result.orderReference)
          return result
        } else {
          return result
        }
      } catch (err) {
        console.error('Checkout error:', err)
        return { status: false, errors: ['Something went wrong while placing the order'] }
      }
    },

    getDeliveryAddress() {
      // Replace with your address store getter
      return this.$pinia.state.value.modules.address.deliveryAddress
    },

    getDealCity() {
      // Replace with your config store getter
      return this.$pinia.state.value.modules.config.dealCity
    }
  }
})
