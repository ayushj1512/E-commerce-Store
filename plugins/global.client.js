// plugins/global.client.js
import axios from "axios";

const globals = {
  name: "globals",
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
  serviceKey: "",
  gatewayUrl: "https://gateway.streetstylestore.com/gateway/v1/",
  baseUrl: "https://streetstylestore.com/",
  site: "sss",
  version: "1",
};

// Nuxt 4 plugin
export default defineNuxtPlugin((nuxtApp) => {
  console.log("[Plugin] Providing globals and axios");

  nuxtApp.provide("globals", globals);
  nuxtApp.provide("axios", axios);
});
