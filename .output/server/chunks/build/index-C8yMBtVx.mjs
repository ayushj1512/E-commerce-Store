import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-white text-black min-h-screen flex flex-col items-center justify-start px-6 md:px-20 py-16" }, _attrs))} data-v-0447bbce><div class="text-center max-w-3xl mb-20 space-y-6" data-v-0447bbce><h1 class="text-4xl md:text-6xl font-extrabold leading-tight animate-slide-up" data-v-0447bbce> Monetize Your Influence </h1><p class="text-lg md:text-xl text-gray-800 animate-fade-in" data-v-0447bbce> Join our affiliate program to turn your influence into income. Share products you love and earn rewards for every sale. Perfect for influencers, content creators, and social media enthusiasts. </p><a href="/influencer/register" class="inline-block bg-black text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-gray-900 transition animate-fade-in" data-v-0447bbce> Join Now </a></div><div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 mb-20" data-v-0447bbce><div class="flex flex-col items-center text-center space-y-4 p-8 border border-black/20 rounded-xl hover:bg-black/5 transition transform hover:-translate-y-1" data-v-0447bbce><div class="text-4xl font-bold" data-v-0447bbce>1</div><h3 class="text-xl font-semibold" data-v-0447bbce>Sign Up</h3><p class="text-gray-800" data-v-0447bbce>Create your influencer account in minutes and get instant access to your unique affiliate link.</p></div><div class="flex flex-col items-center text-center space-y-4 p-8 border border-black/20 rounded-xl hover:bg-black/5 transition transform hover:-translate-y-1" data-v-0447bbce><div class="text-4xl font-bold" data-v-0447bbce>2</div><h3 class="text-xl font-semibold" data-v-0447bbce>Promote Products</h3><p class="text-gray-800" data-v-0447bbce>Share your favorite products via social media or blogs. Every click and sale is tracked seamlessly.</p></div><div class="flex flex-col items-center text-center space-y-4 p-8 border border-black/20 rounded-xl hover:bg-black/5 transition transform hover:-translate-y-1" data-v-0447bbce><div class="text-4xl font-bold" data-v-0447bbce>3</div><h3 class="text-xl font-semibold" data-v-0447bbce>Earn Rewards</h3><p class="text-gray-800" data-v-0447bbce>Earn competitive commissions and track your performance in real time.</p></div></div><div class="max-w-4xl text-center mb-20 space-y-6" data-v-0447bbce><h2 class="text-3xl md:text-4xl font-bold" data-v-0447bbce>Why Join Our Affiliate Program?</h2><ul class="text-gray-800 list-disc list-inside space-y-3 text-lg text-left md:text-left" data-v-0447bbce><li data-v-0447bbce>Maximize earnings with high commission rates.</li><li data-v-0447bbce>Access exclusive trending and premium products.</li><li data-v-0447bbce>Flexible promotions anytime, anywhere.</li><li data-v-0447bbce>Real-time tracking of clicks, conversions, and payouts.</li><li data-v-0447bbce>Supportive community and influencer resources to grow your reach.</li><li data-v-0447bbce>Monthly performance reports and top-performer bonuses.</li></ul></div><div class="w-full max-w-5xl mb-20" data-v-0447bbce><h2 class="text-3xl md:text-4xl font-bold mb-8 text-center" data-v-0447bbce>Hear From Our Influencers</h2><div class="overflow-hidden relative" data-v-0447bbce><div class="flex animate-scroll gap-8" data-v-0447bbce><div class="testimonial-card" data-v-0447bbce><p class="text-gray-800 mb-4 italic" data-v-0447bbce>&quot;Joining this affiliate program boosted my income significantly. The products are high-quality and my audience loves them!&quot;</p><p class="font-semibold" data-v-0447bbce>- Riya Sharma</p></div><div class="testimonial-card" data-v-0447bbce><p class="text-gray-800 mb-4 italic" data-v-0447bbce>&quot;Tracking clicks and sales is effortless. I know exactly how much I earn from each post.&quot;</p><p class="font-semibold" data-v-0447bbce>- Arjun Mehta</p></div><div class="testimonial-card" data-v-0447bbce><p class="text-gray-800 mb-4 italic" data-v-0447bbce>&quot;The community support and resources helped me grow my reach and maximize my commissions.&quot;</p><p class="font-semibold" data-v-0447bbce>- Kavya Patel</p></div><div class="testimonial-card" data-v-0447bbce><p class="text-gray-800 mb-4 italic" data-v-0447bbce>&quot;Joining this affiliate program boosted my income significantly. The products are high-quality and my audience loves them!&quot;</p><p class="font-semibold" data-v-0447bbce>- Riya Sharma</p></div><div class="testimonial-card" data-v-0447bbce><p class="text-gray-800 mb-4 italic" data-v-0447bbce>&quot;Tracking clicks and sales is effortless. I know exactly how much I earn from each post.&quot;</p><p class="font-semibold" data-v-0447bbce>- Arjun Mehta</p></div><div class="testimonial-card" data-v-0447bbce><p class="text-gray-800 mb-4 italic" data-v-0447bbce>&quot;The community support and resources helped me grow my reach and maximize my commissions.&quot;</p><p class="font-semibold" data-v-0447bbce>- Kavya Patel</p></div></div></div></div><div class="mb-20 text-center" data-v-0447bbce><h3 class="text-2xl md:text-3xl font-bold mb-6" data-v-0447bbce>Ready to Start Earning?</h3><a href="/influencer/register" class="bg-black text-white font-bold px-12 py-4 rounded-full text-lg hover:bg-gray-900 transition" data-v-0447bbce> Join Now </a></div><footer class="mt-16 text-gray-500 text-sm text-center" data-v-0447bbce> © 2025 Your Brand. All rights reserved. </footer></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/influencer/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0447bbce"]]);

export { index as default };
//# sourceMappingURL=index-C8yMBtVx.mjs.map
