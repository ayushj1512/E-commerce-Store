import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BNE6mzpu.mjs';
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
  __name: "refunds",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const mounted = ref(false);
    const refunds2 = ref([]);
    const loading = ref(true);
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    };
    const statusClass = (status) => {
      switch (status?.toLowerCase()) {
        case "pending":
          return "bg-yellow-500";
        case "approved":
          return "bg-green-500";
        case "rejected":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (mounted.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24 flex flex-col overflow-x-hidden" }, _attrs))} data-v-65907dc8><div class="mx-auto w-full max-w-6xl space-y-8 sm:space-y-10 flex-1" data-v-65907dc8><div class="text-center mb-6 px-2" data-v-65907dc8><h1 class="text-2xl sm:text-3xl font-extrabold text-black break-words" data-v-65907dc8> Refunds </h1><p class="text-gray-700 sm:text-base md:text-lg mt-1 break-words" data-v-65907dc8> View all your refund requests and their status. </p></div>`);
        if (loading.value) {
          _push(`<div class="text-center py-10 text-gray-600" data-v-65907dc8> Loading refunds... </div>`);
        } else if (refunds2.value.length === 0) {
          _push(`<div class="text-center py-10 text-gray-600" data-v-65907dc8><p class="text-gray-700 text-base font-medium" data-v-65907dc8> No refunds found 🪄 </p><p class="text-gray-500 text-sm" data-v-65907dc8> Once you request a refund, it will appear here. </p></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-v-65907dc8><!--[-->`);
          ssrRenderList(refunds2.value, (refund) => {
            _push(`<div class="border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white overflow-hidden" data-v-65907dc8><div class="flex items-center justify-between mb-3" data-v-65907dc8><h2 class="text-lg font-semibold text-black break-words" data-v-65907dc8>Order: ${ssrInterpolate(refund.order_id)}</h2><span class="${ssrRenderClass([statusClass(refund.status), "text-xs px-2 py-1 rounded-full text-white whitespace-nowrap"])}" data-v-65907dc8>${ssrInterpolate(refund.status)}</span></div><p class="text-gray-700 text-sm mb-1 break-words" data-v-65907dc8> Amount: ₹${ssrInterpolate(refund.amount || "N/A")}</p><p class="text-gray-500 text-xs mb-2 break-words" data-v-65907dc8> Requested On: ${ssrInterpolate(formatDate(refund.requested_on) || "N/A")}</p><p class="text-gray-600 text-xs break-words" data-v-65907dc8> Reason: ${ssrInterpolate(refund.reason || "No reason provided")}</p></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/refunds.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const refunds = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-65907dc8"]]);

export { refunds as default };
//# sourceMappingURL=refunds-BG6MNfNm.mjs.map
