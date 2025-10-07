// stores/orders.js
import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

/**
 * Main order store
 * Usage:
 *   import { useOrdersStore } from '~/stores/orders'
 *   const orderStore = useOrdersStore();
 */
export const useOrdersStore = defineStore("order", {
  state: () => ({
    orderItems: [],
    idOrder: "",
    orderReference: "",
    orderDetail: {},
  }),

  actions: {
    setOrderItems(items) {
      this.orderItems = items;
    },

    setOrderId(id) {
      this.idOrder = id;
    },

    setOrderReference(ref) {
      this.orderReference = ref;
    },

    setOrderDetail(detail) {
      this.orderDetail = detail;
    },

    async sendOrderConfirmation() {
      if (!this.idOrder) return null;
      const { $api, $globals, $axios } = useNuxtApp();
      const payload = JSON.stringify({
        gateway_action: "order/sendOrderConfirmation",
        id_order: this.idOrder,
        version: "1",
        affiliateInfo: $globals.affiliateInfo || {},
      });
      return await $api.gatewayServerCall(
        $axios,
        $globals.baseUrl + "admin2014/custom-api/order/sendOrderConfirmation.php",
        payload,
        "",
        true
      );
    },

    async getCustomerOrderList({ orderType, orderTime, id_cart, id_customer, user_hash_key }) {
      const { $api, $globals, $axios } = useNuxtApp();
      const payload = JSON.stringify({
        gateway_action: "customer/getCustomerOrderList",
        version: "1",
        orderType,
        orderTime,
        id_cart,
        id_customer,
        user_hash_key,
      });
      return await $api.gatewayServerCall($axios, $globals.gatewayUrl, payload, "", true);
    },

    async trackOrder({ idOrder, idCarrier, shippingNumber }) {
      const { $api, $globals, $axios } = useNuxtApp();
      const payload = JSON.stringify({
        gateway_action: "customer/customerOrder",
        site: $globals.site,
        type: "trackOrder",
        idOrder,
        idCarrier,
        shippingNumber,
      });
      return await $api.gatewayServerCall($axios, $globals.gatewayUrl, payload, "", true);
    },

    async sendPreOrderConfirmation(orderId) {
      if (!orderId) return null;
      const { $api, $globals, $axios } = useNuxtApp();
      const payload = JSON.stringify({
        gateway_action: "order/confirmation/index",
        id_order: orderId,
        version: "1",
      });
      return await $api.gatewayServerCall($axios, $globals.gatewayUrl, payload, "", true);
    },

    async getSpecificOrder({ orderType, idOrder, id_cart, id_customer, user_hash_key }) {
      const { $api, $globals, $axios } = useNuxtApp();
      const payload = JSON.stringify({
        gateway_action: "customer/getCustomerOrderList",
        version: "1",
        orderType,
        idOrder,
        id_cart,
        id_customer,
        user_hash_key,
      });
      return await $api.gatewayServerCall($axios, $globals.gatewayUrl, payload, "", true);
    },
  },

  getters: {
    getOrderItems: (state) => state.orderItems,
    getOrderQty: (state) => state.orderItems.reduce((total, item) => total + (item.product_qty || 0), 0),
    getOrderId: (state) => state.idOrder,
    getOrderDetail: (state) => state.orderDetail,
  },
});
