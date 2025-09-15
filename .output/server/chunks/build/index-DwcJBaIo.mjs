import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
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
import 'lucide-vue-next';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    useRouter();
    const step = ref(1);
    const otpDigits = ref(["", "", "", ""]);
    const message = ref("");
    const otpMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col justify-center items-center p-4 bg-white" }, _attrs))} data-v-522fbff6>`);
      if (step.value === 1) {
        _push(`<div class="w-full max-w-sm text-center" data-v-522fbff6><h1 class="text-3xl font-bold mb-2 text-black" data-v-522fbff6>Welcome Back!</h1><p class="text-gray-700 mb-6" data-v-522fbff6>You&#39;re just a step away from your favorite clothes </p><div class="flex items-center border border-gray-400 rounded-lg overflow-hidden mb-4 shadow-sm" data-v-522fbff6><span class="px-3 text-black font-semibold" data-v-522fbff6>+91</span><input${ssrRenderAttr("value", unref(auth).mobileNumber)} type="tel" maxlength="10" placeholder="Enter mobile number" class="w-full p-4 focus:outline-none text-black text-lg" data-v-522fbff6></div><button class="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-md"${ssrIncludeBooleanAttr(unref(auth).loading || !unref(auth).mobileNumber || unref(auth).mobileNumber.length < 10) ? " disabled" : ""} data-v-522fbff6>${ssrInterpolate(unref(auth).loading ? "Sending OTP..." : "Send OTP")}</button>`);
        if (message.value) {
          _push(`<p class="mt-2 text-red-500 text-sm" data-v-522fbff6>${ssrInterpolate(message.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (step.value === 2) {
        _push(`<div class="w-full max-w-sm text-center" data-v-522fbff6><h2 class="text-2xl font-bold mb-2 text-black" data-v-522fbff6>Almost There!</h2><p class="text-gray-700 mb-4" data-v-522fbff6>We sent a 4-digit OTP to ${ssrInterpolate(unref(auth).mobileNumber)}</p><div class="flex justify-center space-x-3 mb-4" data-v-522fbff6><!--[-->`);
        ssrRenderList(otpDigits.value, (digit, index2) => {
          _push(`<input${ssrRenderAttr("value", otpDigits.value[index2])} type="text" maxlength="1" class="w-16 h-16 text-center border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-2xl font-bold shadow-sm" data-v-522fbff6>`);
        });
        _push(`<!--]--></div><button class="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-md"${ssrIncludeBooleanAttr(unref(auth).loading || otpDigits.value.join("").length < 4) ? " disabled" : ""} data-v-522fbff6>${ssrInterpolate(unref(auth).loading ? "Verifying..." : "Verify OTP")}</button>`);
        if (otpMessage.value) {
          _push(`<p class="mt-2 text-red-500 text-sm" data-v-522fbff6>${ssrInterpolate(otpMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (step.value === 3) {
        _push(`<div class="text-center" data-v-522fbff6><h2 class="text-3xl font-bold mb-2 text-black" data-v-522fbff6>Welcome, ${ssrInterpolate(unref(auth).name)}!</h2><p class="text-gray-700 mb-4" data-v-522fbff6>You&#39;re all set to grab your favorite clothes </p><div class="w-20 h-20 mx-auto border-4 border-black rounded-full animate-ping mt-4" data-v-522fbff6></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-522fbff6"]]);

export { index as default };
//# sourceMappingURL=index-DwcJBaIo.mjs.map
