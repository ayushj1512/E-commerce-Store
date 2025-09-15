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
  __name: "support",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const tickets = ref([]);
    const loading = ref(true);
    const showTicketModal = ref(false);
    const selectedTicket = ref({});
    const replyMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white px-4 py-6" }, _attrs))} data-v-db6308f6><h1 class="text-2xl sm:text-3xl font-extrabold text-black text-center mb-6" data-v-db6308f6> Support Tickets </h1>`);
      if (loading.value) {
        _push(`<div class="text-center py-10 text-gray-600" data-v-db6308f6> Loading tickets... </div>`);
      } else if (tickets.value.length === 0) {
        _push(`<div class="text-center py-10" data-v-db6308f6><p class="text-gray-700 text-base font-medium" data-v-db6308f6> You have no support tickets yet 🛠️ </p><p class="text-gray-500 text-sm" data-v-db6308f6> Need help? Raise a ticket and we&#39;ll assist you promptly. </p></div>`);
      } else {
        _push(`<div class="space-y-4 max-w-3xl mx-auto" data-v-db6308f6><!--[-->`);
        ssrRenderList(tickets.value, (ticket) => {
          _push(`<div class="border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white" data-v-db6308f6><div class="flex justify-between items-center mb-2" data-v-db6308f6><h2 class="font-semibold text-black" data-v-db6308f6>#${ssrInterpolate(ticket.ticket_id)} - ${ssrInterpolate(ticket.subject)}</h2><span class="${ssrRenderClass([ticket.status === "open" ? "bg-green-500 text-white" : "bg-gray-400 text-white", "text-xs px-2 py-1 rounded-full"])}" data-v-db6308f6>${ssrInterpolate(ticket.status)}</span></div><p class="text-gray-600 text-sm" data-v-db6308f6>Created: ${ssrInterpolate(ticket.created_at)}</p></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (showTicketModal.value) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-v-db6308f6><div class="bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-2xl w-full shadow-xl overflow-y-auto max-h-[80vh]" data-v-db6308f6><h2 class="text-xl sm:text-2xl font-bold mb-4" data-v-db6308f6> Ticket #${ssrInterpolate(selectedTicket.value.ticket_id)} - ${ssrInterpolate(selectedTicket.value.subject)}</h2><p class="text-gray-600 text-sm mb-4" data-v-db6308f6>Status: ${ssrInterpolate(selectedTicket.value.status)}</p><div class="space-y-3 mb-4" data-v-db6308f6><!--[-->`);
        ssrRenderList(selectedTicket.value.messages, (msg) => {
          _push(`<div class="${ssrRenderClass([msg.sender === "customer" ? "bg-gray-100 text-black" : "bg-black text-white", "p-3 rounded-xl"])}" data-v-db6308f6><p class="text-sm" data-v-db6308f6>${ssrInterpolate(msg.message)}</p><p class="text-xs text-gray-500 mt-1" data-v-db6308f6>${ssrInterpolate(msg.date)}</p></div>`);
        });
        _push(`<!--]--></div><textarea placeholder="Type your reply..." class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mb-4 resize-none" rows="4" data-v-db6308f6>${ssrInterpolate(replyMessage.value)}</textarea><div class="flex justify-end gap-3" data-v-db6308f6><button class="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition" data-v-db6308f6> Send Reply </button><button class="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition" data-v-db6308f6> Close </button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/support.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const support = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db6308f6"]]);

export { support as default };
//# sourceMappingURL=support-CpMGkMo3.mjs.map
