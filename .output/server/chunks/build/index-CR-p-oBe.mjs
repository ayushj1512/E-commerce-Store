import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { useToast } from 'vue-toastification';
import { _ as _export_sfc } from './server.mjs';
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
import 'pinia';
import 'vue-router';
import 'lucide-vue-next';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useToast();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 py-10 space-y-10" }, _attrs))} data-v-a3353aa5><h1 class="text-4xl font-bold text-center" data-v-a3353aa5>Contact Us</h1><div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md" data-v-a3353aa5><p class="text-yellow-900 font-semibold" data-v-a3353aa5> ⚠️ Attention! : All Phone Numbers present on the internet claiming to be Street Style Store number are of fraudsters. NEVER give your credit card information to anyone. </p></div><div class="bg-white shadow-md rounded-lg p-6 space-y-4" data-v-a3353aa5><h2 class="text-2xl font-semibold" data-v-a3353aa5>For Online Queries Contact</h2><p class="text-gray-700" data-v-a3353aa5>📞 +91-11-41171712 (10 AM - 6 PM, Mon to Sat)</p><p class="text-gray-600" data-v-a3353aa5>Preferred method for Priority Support</p><p class="text-gray-600" data-v-a3353aa5>If you have a query please click on below section. The response time is generally 24 to 48 Hours.</p><div class="flex flex-col sm:flex-row gap-4 mt-4" data-v-a3353aa5><button class="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition" data-v-a3353aa5> Have a query regarding your order? Click here </button><button class="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition" data-v-a3353aa5> For Support Click here </button><button class="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition" data-v-a3353aa5> If your payment is deducted and order not created? Click here </button></div></div><div class="bg-white shadow-md rounded-lg p-6" data-v-a3353aa5><h2 class="text-2xl font-semibold mb-2" data-v-a3353aa5>Office Address</h2><p data-v-a3353aa5>Office No.706, Pearl Business Park, Netaji Subhash Place, Pitampura, North West Delhi, Delhi-110034</p></div><div class="bg-white shadow-md rounded-lg p-6" data-v-a3353aa5><h2 class="text-2xl font-semibold mb-2" data-v-a3353aa5>Legal</h2><p data-v-a3353aa5>Streetstylestore.com is owned by CUTECODE STREET STYLE STORE LLP</p></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a3353aa5"]]);

export { index as default };
//# sourceMappingURL=index-CR-p-oBe.mjs.map
