import axios from 'axios';
import { u as useAuthStore } from './auth-BNE6mzpu.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import 'pinia';
import '@vueuse/integrations/useCookies';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'lucide-vue-next';

const _sfc_main = {
  name: "Vouchers",
  data() {
    return {
      vouchers: [],
      loading: true
    };
  },
  methods: {
    async fetchVouchers() {
      this.loading = true;
      const authStore = useAuthStore();
      try {
        if (!authStore.isAuthenticated) {
          console.warn("⚠️ User not logged in");
          this.vouchers = [];
          return;
        }
        const requestData = JSON.stringify({
          gateway_action: "cart/availableVoucher",
          site: "streetstylestore",
          all: 0,
          user_hash_key: authStore.key
        });
        const response = await axios.post("https://gateway.streetstylestore.com/gateway/v1/", requestData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        console.log("🔹 Full API Response:", response.data);
        if (response.data?.voucherList?.length > 0) {
          this.vouchers = response.data.voucherList;
          console.log("🔹 Voucher List:", this.vouchers);
        } else {
          this.vouchers = [];
          console.log("🔹 No vouchers found.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch vouchers:", err);
        this.vouchers = [];
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchVouchers();
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white px-4 py-6" }, _attrs))} data-v-037c75f4><div class="flex items-center justify-between mb-6" data-v-037c75f4><h1 class="text-2xl font-bold text-black" data-v-037c75f4>Your Vouchers</h1><button class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition" data-v-037c75f4> Refresh </button></div>`);
  if ($data.loading) {
    _push(`<div class="text-center py-10 text-gray-600" data-v-037c75f4> Loading vouchers... </div>`);
  } else if ($data.vouchers.length === 0) {
    _push(`<div class="text-center py-10" data-v-037c75f4><p class="text-gray-700 text-base font-medium" data-v-037c75f4> You don’t have any vouchers yet 🪄 </p><p class="text-gray-500 text-sm" data-v-037c75f4> Shop a little and we’ll surprise you with offers! </p></div>`);
  } else {
    _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-v-037c75f4><!--[-->`);
    ssrRenderList($data.vouchers, (voucher) => {
      _push(`<div class="border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white" data-v-037c75f4><div class="flex items-center justify-between mb-3" data-v-037c75f4><h2 class="text-lg font-semibold text-black" data-v-037c75f4>${ssrInterpolate(voucher.code)}</h2><span class="text-xs px-2 py-1 rounded-full bg-black text-white" data-v-037c75f4>${ssrInterpolate(voucher.reduction || "Flat Off")}</span></div><p class="text-gray-700 text-sm mb-1" data-v-037c75f4>${ssrInterpolate(voucher.name || "Special Voucher")}</p><p class="text-gray-500 text-xs mb-2" data-v-037c75f4> Expires: ${ssrInterpolate(voucher.date_to || "N/A")}</p><p class="text-gray-600 text-xs" data-v-037c75f4>${ssrInterpolate(voucher.description || "Use this voucher to save on your next order!")}</p></div>`);
    });
    _push(`<!--]--></div>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/vouchers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const vouchers = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-037c75f4"]]);

export { vouchers as default };
//# sourceMappingURL=vouchers-B9TElaP7.mjs.map
