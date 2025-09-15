import { reactive, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useAddressStore } from './address-DV-O_Zdc.mjs';
import { useRouter } from 'vue-router';
import { _ as _export_sfc } from './server.mjs';
import 'pinia';
import 'axios';
import './auth-BNE6mzpu.mjs';
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
  __name: "add-address",
  __ssrInlineRender: true,
  setup(__props) {
    const addressStore = useAddressStore();
    useRouter();
    const form = reactive({
      email: "",
      firstName: "",
      lastName: "",
      mobile: "",
      pinCode: "",
      flatNo: "",
      locality: "",
      landmark: "",
      city: "",
      state: "",
      defaultAddress: false,
      addressType: "Home"
    });
    const isEditing = computed(() => Object.keys(addressStore.editAddress).length > 0);
    watch(
      () => addressStore.editAddress,
      (newVal) => {
        if (Object.keys(newVal).length > 0) {
          Object.assign(form, newVal);
        }
      },
      { immediate: true }
    );
    const buttonClass = (type) => form.addressType === type ? "bg-black text-white border-black" : "bg-white text-gray-700 hover:bg-gray-100";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen py-6 px-4 sm:px-6 md:px-12 lg:px-24" }, _attrs))} data-v-15320498><div class="max-w-5xl mx-auto bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-md space-y-8" data-v-15320498><h1 class="text-2xl sm:text-3xl font-bold text-center" data-v-15320498>${ssrInterpolate(isEditing.value ? "Edit Address" : "Add New Address")}</h1><section class="space-y-6" data-v-15320498><h2 class="font-semibold text-gray-700 text-lg sm:text-xl" data-v-15320498> Contact Details <span class="text-red-500" data-v-15320498>*</span></h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-15320498><input${ssrRenderAttr("value", form.email)} type="email" placeholder="Email *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><div class="flex gap-2 items-center" data-v-15320498><span class="text-gray-600 text-sm sm:text-base" data-v-15320498>+91</span><input${ssrRenderAttr("value", form.mobile)} type="tel" placeholder="Mobile Number *" maxlength="10" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498></div><input${ssrRenderAttr("value", form.firstName)} type="text" placeholder="First Name *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><input${ssrRenderAttr("value", form.lastName)} type="text" placeholder="Last Name *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498></div></section><section class="space-y-6" data-v-15320498><h2 class="font-semibold text-gray-700 text-lg sm:text-xl" data-v-15320498>Address Details</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-15320498><input${ssrRenderAttr("value", form.pinCode)} type="text" placeholder="Pin Code *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><input${ssrRenderAttr("value", form.flatNo)} type="text" placeholder="Flat/House No, Street, Floor, Area *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><input${ssrRenderAttr("value", form.locality)} type="text" placeholder="Locality/Town *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><input${ssrRenderAttr("value", form.landmark)} type="text" placeholder="Landmark (Optional)" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><input${ssrRenderAttr("value", form.city)} type="text" placeholder="City/District *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498><input${ssrRenderAttr("value", form.state)} type="text" placeholder="State *" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" data-v-15320498></div><div class="flex flex-col gap-2 mt-2" data-v-15320498><label class="text-gray-600 text-sm sm:text-base" data-v-15320498>Save Address As</label><div class="flex flex-wrap gap-3 md:gap-4" data-v-15320498><button type="button" class="${ssrRenderClass([buttonClass("Home"), "py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]"])}" data-v-15320498>Home</button><button type="button" class="${ssrRenderClass([buttonClass("PG"), "py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]"])}" data-v-15320498>PG</button><button type="button" class="${ssrRenderClass([buttonClass("Hostel"), "py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]"])}" data-v-15320498>Hostel</button><button type="button" class="${ssrRenderClass([buttonClass("Office"), "py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]"])}" data-v-15320498>Office</button></div></div></section><button class="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-base sm:text-lg md:text-xl" data-v-15320498>${ssrInterpolate(isEditing.value ? "Update Address" : "Save Address")}</button></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/add-address.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const addAddress = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-15320498"]]);

export { addAddress as default };
//# sourceMappingURL=add-address-Cgdk3xA5.mjs.map
