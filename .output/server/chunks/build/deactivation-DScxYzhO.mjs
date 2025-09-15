import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "deactivation",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    ref(true);
    const otpSent = ref(false);
    const otp = ref("");
    const statusMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen flex flex-col py-6 px-3 sm:px-6 md:px-12 lg:px-24 overflow-x-hidden" }, _attrs))} data-v-360e4393><div class="mx-auto w-full max-w-3xl space-y-8 flex-1" data-v-360e4393><div class="text-center mb-6 px-2" data-v-360e4393><h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black break-words" data-v-360e4393> Account Deactivation </h1><p class="text-gray-700 sm:text-base md:text-lg mt-2 break-words" data-v-360e4393> Please read carefully before proceeding. Deactivating your account is permanent and cannot be undone. </p></div><div class="bg-white shadow-lg rounded-3xl p-6 md:p-10 space-y-4 overflow-hidden" data-v-360e4393><h2 class="text-xl sm:text-2xl font-bold text-black" data-v-360e4393>What happens when you deactivate:</h2><ul class="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base" data-v-360e4393><li data-v-360e4393>You will be logged out from your SSS account immediately.</li><li data-v-360e4393>Your reviews/ratings remain visible, but your profile info will be unavailable.</li><li data-v-360e4393>Wishlist items will no longer be accessible via public links.</li><li data-v-360e4393>You will be unsubscribed from promotional emails and SMS.</li><li data-v-360e4393>Order history is retained, but personal information (mobile, email, addresses) will be deleted.</li></ul></div><div class="flex justify-center mt-4" data-v-360e4393><button class="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition shadow-md font-semibold text-base" data-v-360e4393> Send Deactivation Code </button></div>`);
      if (otpSent.value) {
        _push(`<div class="bg-white shadow-lg rounded-3xl p-6 md:p-10 mt-6 space-y-4" data-v-360e4393><h3 class="text-lg sm:text-xl font-bold text-black text-center" data-v-360e4393>Enter OTP</h3><p class="text-gray-600 text-sm sm:text-base text-center" data-v-360e4393> An OTP has been sent to your registered mobile/email. Please enter it below to confirm deactivation. </p><input${ssrRenderAttr("value", otp.value)} type="text" placeholder="Enter OTP" class="w-full border border-gray-300 rounded-xl p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-center" data-v-360e4393><div class="flex justify-center gap-4 flex-wrap" data-v-360e4393><button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md" data-v-360e4393> Confirm Deactivation </button><button class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition shadow-md" data-v-360e4393> Cancel </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (statusMessage.value) {
        _push(`<div class="mt-4 text-center text-sm sm:text-base text-gray-800 font-medium" data-v-360e4393>${ssrInterpolate(statusMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/deactivation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deactivation = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-360e4393"]]);

export { deactivation as default };
//# sourceMappingURL=deactivation-DScxYzhO.mjs.map
