// stores/checkoutStore.js
import { defineStore } from 'pinia'
import { useOrdersStore } from './orders'
import { useNuxtApp } from '#app'

export const useCheckoutStore = defineStore('checkoutStore', {
  state: () => ({
    cartItems: [],
    cartTotal: 0,
    bankOption: '',
    selectedPayment: 'cod',
  }),

  actions: {
    async setOrder() {
      const ordersStore = useOrdersStore()
      const nuxtApp = useNuxtApp()
      const { $api, $axios, $globals } = nuxtApp

      // Detect device type
      let orderFrom = 'Mobile'
      if (process.client && window.innerWidth >= 1024) {
        orderFrom = 'Desktop'
      }

      // Payment mode
      let payment = this.selectedPayment
      if (payment === 'cod' && this.cartTotal === 0) {
        payment = 'Free Order'
      }

      const deliveryAddress = this.getDeliveryAddress()

      const payload = JSON.stringify({
        gateway_action: "order/setOrder",
        id_address_delivery: deliveryAddress?.id_address,
        payment,
        bankOption: this.bankOption || '',
        site: $globals.site,
        version: $globals.version,
        checkout: $globals.checkout,
        orderFrom,
        deal_city: this.getDealCity(),
      })

      try {
        const result = await $api.gatewayServerCall(
          $axios,
          $globals.gatewayUrl,
          payload,
          '',
          true
        )

        if (!result.status && result.errors?.length) {
          return result
        } else if (result.status === true) {
          // ✅ Successful order placed
          await ordersStore.setOrderItems(this.cartItems)
          await ordersStore.setOrderId(result.idOrder)
          await ordersStore.setOrderReference(result.orderReference)
          return result
        } else {
          return result
        }
      } catch (err) {
        console.error('Checkout error:', err)
        return {
          status: false,
          errors: ['Something went wrong while placing the order'],
        }
      }
    },

    getDeliveryAddress() {
      return this.$pinia.state.value.modules.address.deliveryAddress
    },

    getDealCity() {
      return this.$pinia.state.value.modules.config.dealCity
    },

    getUserInfo() {
      const user = this.$pinia.state.value.modules.user.userInfo
      if (!user) return ''
      return `${user.id_customer}~${user.firstname}~${user.lastname}~${user.phone}~${user.email}`
    },
  },
})
