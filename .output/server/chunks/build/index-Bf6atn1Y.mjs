import { mergeProps, ref, computed, withAsyncContext, unref, toValue, getCurrentInstance, onServerPrefetch, shallowRef, toRef, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRouter, a as useNuxtApp, d as asyncDataDefaults, e as createError } from './server.mjs';
import { useRouter as useRouter$1 } from 'vue-router';
import { defineStore, storeToRefs } from 'pinia';
import { P as ProductCard } from './ProductCard-BPWj2ggi.mjs';
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

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!nuxtApp._asyncData[key.value]?._init) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _sfc_main$9 = {
  __name: "HomeHeadline",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const animationDuration = ref(20);
    const repeatCount = ref(20);
    const mounted = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden py-4 w-full bg-black" }, _attrs))} data-v-788de88c>`);
      if (mounted.value) {
        _push(`<div class="flex whitespace-nowrap animate-scroll" style="${ssrRenderStyle({ animationDuration: animationDuration.value + "s" })}" data-v-788de88c><!--[-->`);
        ssrRenderList(repeatCount.value, (n) => {
          _push(`<span class="inline-block text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bebas mr-8 sm:mr-12 md:mr-16" data-v-788de88c> ALWAYS IN TREND </span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Headline.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const Headline = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-788de88c"]]);
const _sfc_main$8 = {
  __name: "HomeBannerComponent",
  __ssrInlineRender: true,
  props: {
    image: { type: String, required: true },
    // URL or public folder filename
    aspect: { type: String, default: "" },
    // Optional aspect ratio, e.g., "1200/563"
    link: { type: String, default: "" }
    // Optional navigation link
  },
  setup(__props) {
    const props = __props;
    useRouter$1();
    const computedSrc = computed(() => {
      if (!props.image) return "";
      return props.image.startsWith("http") ? props.image : `/${props.image}`;
    });
    const sectionStyle = computed(() => {
      if (!props.aspect) return "";
      const [w, h] = props.aspect.split("/").map(Number);
      if (!w || !h) return "";
      const paddingTop = h / w * 100;
      return { paddingTop: `${paddingTop}%`, position: "relative" };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "w-full overflow-hidden rounded-lg cursor-pointer",
        style: sectionStyle.value
      }, _attrs))} data-v-42124177><img${ssrRenderAttr("src", computedSrc.value)} alt="Banner" class="w-full h-full object-cover" data-v-42124177></section>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/BannerComponent.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const BannerComponent = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-42124177"]]);
const _sfc_main$7 = {
  __name: "HomeCategorySlider",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const categories = [
      { name: "Livin", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/livin_547c91cc-4810-4333-b960-d23287e6b5ef.jpg?v=1755858460", link: "/" },
      { name: "Tops", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/tops_27ae4357-df67-4215-a2de-e5b6d17d20d3.jpg?v=1755858460", link: "/collection/tops" },
      { name: "Dresses", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/dress_d6d90a45-ecec-45bf-adf8-bdedbaf90b51.jpg?v=1755858460", link: "/collection/dresses" },
      { name: "Shirts", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/shirts_3b699e77-d001-4553-9cdc-19ab53863c80.jpg?v=1755858460", link: "/collection/shirts" },
      { name: "Tee Knits", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/tee_knits.jpg?v=1755858460", link: "/collection/tee-knits" },
      { name: "Skirts", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/skirts_0047415b-cac2-4a5a-8197-0f84d1bff8e7.jpg?v=1755858460", link: "/collection/skirts" },
      { name: "Blazer", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/blazer_1affb265-815a-4b2b-aa0d-ef60e0afd387.jpg?v=1755858460", link: "/collection/blazer" },
      { name: "Coord", img: "https://cdn.shopify.com/s/files/1/0486/0634/7416/files/coord.jpg?v=1755858460", link: "/collection/coord" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "pt-6 sm:pt-8 bg-white" }, _attrs))} data-v-b29976d8><div class="flex justify-start sm:justify-center" data-v-b29976d8><div class="flex space-x-3 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide snap-x snap-mandatory" data-v-b29976d8><!--[-->`);
      ssrRenderList(categories, (category, index) => {
        _push(`<div class="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300 bg-gray-50 snap-start" data-v-b29976d8><div class="relative" data-v-b29976d8><img${ssrRenderAttr("src", category.img)}${ssrRenderAttr("alt", category.name)} class="w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 object-cover rounded-t-lg" data-v-b29976d8></div><div class="py-2 text-center" data-v-b29976d8><h3 class="text-gray-900 font-semibold text-xs sm:text-sm md:text-base" data-v-b29976d8>${ssrInterpolate(category.name)}</h3></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/CategorySlider.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const CategorySlider = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-b29976d8"]]);
const _sfc_main$6 = {
  __name: "HomeHeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const slides = ref([
      "/1.jpg",
      "/2.jpg",
      "/3.jpg",
      "/4.jpg"
    ]);
    const currentSlide = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "relative w-full overflow-hidden",
        style: { "padding-top": "46.92%" }
      }, _attrs))} data-v-60a51331><div class="absolute top-0 left-0 w-full h-full flex transition-transform duration-700" style="${ssrRenderStyle({ transform: `translateX(-${currentSlide.value * 100}%)` })}" data-v-60a51331><!--[-->`);
      ssrRenderList(slides.value, (slide, index) => {
        _push(`<div class="w-full flex-shrink-0 h-full" data-v-60a51331><img${ssrRenderAttr("src", slide)} alt="Hero Image" class="w-full h-full object-cover object-center" data-v-60a51331></div>`);
      });
      _push(`<!--]--></div><button class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20" data-v-60a51331> ❮ </button><button class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-30 p-2 rounded-full hover:bg-opacity-50 z-20" data-v-60a51331> ❯ </button><div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20" data-v-60a51331><!--[-->`);
      ssrRenderList(slides.value, (slide, index) => {
        _push(`<span class="${ssrRenderClass([
          "w-3 h-3 rounded-full cursor-pointer",
          currentSlide.value === index ? "bg-white" : "bg-gray-400"
        ])}" data-v-60a51331></span>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HeroSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-60a51331"]]);
const _sfc_main$5 = {
  __name: "HomePremiumCategories",
  __ssrInlineRender: true,
  setup(__props) {
    const premiumCategories = [
      {
        name: "Dresses",
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F3_e84a5de7-dbe6-4be6-94bd-cde74c1b0323.jpg%3Fv%3D1755859633&w=1920&q=75"
      },
      {
        name: "Gowns",
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F4_40edf0ac-b565-4529-843a-f804f91f91cd.jpg%3Fv%3D1756187367&w=1920&q=75"
      },
      {
        name: "Heels",
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F1_4217b0e5-ebac-4f61-94dc-5c82c8e2fc35.jpg%3Fv%3D1755939489&w=1920&q=75"
      },
      {
        name: "Bags",
        image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2F2_0136d282-0be9-4a57-a2b7-5af503160a48.jpg%3Fv%3D1755859633&w=1920&q=75"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "pb-0 bg-white" }, _attrs))} data-v-9a48b269><div class="hidden md:grid max-w-7xl mx-auto grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4" data-v-9a48b269><!--[-->`);
      ssrRenderList(premiumCategories, (category, index) => {
        _push(`<div class="relative cursor-pointer group overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105" data-v-9a48b269><img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} class="w-full h-56 sm:h-60 md:h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" data-v-9a48b269><div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-40 text-white text-center py-3 font-semibold text-lg transition-all group-hover:bg-opacity-60" data-v-9a48b269>${ssrInterpolate(category.name)}</div></div>`);
      });
      _push(`<!--]--></div><div class="md:hidden flex space-x-4 overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide" data-v-9a48b269><!--[-->`);
      ssrRenderList(premiumCategories, (category, index) => {
        _push(`<div class="flex-shrink-0 w-48 sm:w-52 cursor-pointer group overflow-hidden rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105" data-v-9a48b269><img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} class="w-full h-48 sm:h-52 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" data-v-9a48b269><div class="mt-2 text-center font-semibold text-gray-900 text-base sm:text-lg" data-v-9a48b269>${ssrInterpolate(category.name)}</div></div>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/PremiumCategories.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const PremiumCategories = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-9a48b269"]]);
const useHomeStore = defineStore("homeStore", () => {
  const sliderList = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const API_URL = "https://api.streetstylestore.com";
  const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";
  const fetchSlider = async (menuType) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await $fetch(`${API_URL}/collections/sss_config/documents/slider?a=1`, {
        headers: { "x-typesense-api-key": API_KEY }
      });
      const dataField = res?.data || res?.document?.data;
      sliderList.value = dataField ? JSON.parse(dataField)[menuType] || [] : [];
    } catch (err) {
      console.error("🔴 [HomeStore] Slider fetch error:", err);
      sliderList.value = [];
      error.value = err?.message || "Failed to fetch slider";
    } finally {
      loading.value = false;
    }
  };
  return { sliderList, loading, error, fetchSlider };
});
const _sfc_main$4 = {
  __name: "CommonVideoCard",
  __ssrInlineRender: true,
  props: {
    videoUrl: { type: String, required: true },
    title: { type: String, default: "" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-60 cursor-pointer group" }, _attrs))} data-v-84fc1ed6><div class="relative overflow-hidden rounded-xl shadow-lg" data-v-84fc1ed6><video${ssrRenderAttr("src", __props.videoUrl)} class="w-full aspect-[9/16] object-cover transform transition-transform duration-300 group-hover:scale-105" autoplay muted loop playsinline data-v-84fc1ed6></video></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/VideoCard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const VideoCard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-84fc1ed6"]]);
const _sfc_main$3 = {
  __name: "HomeStars",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const homeStore = useHomeStore();
    const { sliderList, loading, error } = storeToRefs(homeStore);
    const router = useRouter$1();
    [__temp, __restore] = withAsyncContext(() => useAsyncData("lookMenu", () => homeStore.fetchSlider("look_menu"))), await __temp, __restore();
    function handleCardClick(item) {
      if (!item?.link) return;
      if (item.link.startsWith("http") || item.link.startsWith("https")) {
        (void 0).open(item.link, "_blank");
      } else {
        router.push(item.link);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-6 bg-white" }, _attrs))} data-v-f5ce41e6><div class="w-full bg-black py-3 mb-4" data-v-f5ce41e6><h2 class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold" data-v-f5ce41e6> STREET STYLE HIGHLIGHTS </h2></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center text-gray-500 py-6" data-v-f5ce41e6> Loading videos... </div>`);
      } else if (unref(error)) {
        _push(`<div class="text-center text-red-500 py-6" data-v-f5ce41e6>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div class="overflow-x-auto px-4 pb-4 flex gap-4 scrollbar-hide" data-v-f5ce41e6><!--[-->`);
        ssrRenderList(unref(sliderList), (item) => {
          _push(ssrRenderComponent(VideoCard, {
            key: item.id,
            title: item.name,
            videoUrl: item.img,
            class: "flex-shrink-0 w-64 sm:w-72 md:w-80 cursor-pointer",
            onClick: ($event) => handleCardClick(item)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/stars.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Stars = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-f5ce41e6"]]);
const _sfc_main$2 = {
  __name: "HomeTrendingProducts",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter$1();
    const products = ref([]);
    const goToDetail = (url) => {
      if (!url) return;
      if (url.startsWith("/")) {
        router.push(url).catch(() => {
        });
      } else {
        (void 0).location.href = url;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-6 bg-white" }, _attrs))} data-v-c16f65b0><div class="overflow-x-auto px-4 pb-2 scrollbar-hide" data-v-c16f65b0><div class="flex space-x-4" data-v-c16f65b0><!--[-->`);
      ssrRenderList(products.value, (product) => {
        _push(ssrRenderComponent(ProductCard, {
          key: product.id,
          id: product.id,
          title: product.name,
          image: product.img,
          hoverImage: null,
          tags: product.tags,
          price: product.real_selling_price,
          mrp: product.selling_price,
          productUrl: product.product_url,
          showCartBtn: true,
          onClick: ($event) => goToDetail(product.product_url)
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/TrendingProducts.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TrendingProducts = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c16f65b0"]]);
const _sfc_main$1 = {
  __name: "HomeShopBy",
  __ssrInlineRender: true,
  setup(__props) {
    const subcategories = ["Party", "Streetwear", "Casual", "Formal", "Loungewear"];
    const selectedSubcategory = ref(subcategories[0]);
    const products = [
      { id: 1, name: "Dress 1", category: "Party", price: 2499, mrp: 2999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 2, name: "Top 1", category: "Streetwear", price: 1299, mrp: 1599, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 3, name: "Blouse 1", category: "Casual", price: 899, mrp: null, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 4, name: "Shirt 1", category: "Formal", price: 1599, mrp: 1999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75", hoverImage: null, tags: ["Best Seller"] },
      { id: 5, name: "Lounge Set 1", category: "Loungewear", price: 1999, mrp: 2299, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 6, name: "Dress 2", category: "Party", price: 2999, mrp: 3499, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 7, name: "Top 2", category: "Streetwear", price: 1499, mrp: 1799, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 8, name: "Blouse 2", category: "Casual", price: 1199, mrp: 1499, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 9, name: "Shirt 2", category: "Formal", price: 1399, mrp: 1699, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 10, name: "Lounge Set 2", category: "Loungewear", price: 1799, mrp: 1999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 11, name: "Dress 3", category: "Party", price: 2599, mrp: 2899, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 12, name: "Top 3", category: "Streetwear", price: 1599, mrp: 1899, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 13, name: "Blouse 3", category: "Casual", price: 799, mrp: 999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 14, name: "Shirt 3", category: "Formal", price: 2999, mrp: 3299, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: ["Best Seller"] },
      { id: 15, name: "Lounge Top 3", category: "Loungewear", price: 999, mrp: 1299, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 16, name: "Dress 4", category: "Party", price: 3499, mrp: 3999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 17, name: "Top 4", category: "Streetwear", price: 2199, mrp: 2599, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 18, name: "Blouse 4", category: "Casual", price: 1399, mrp: 1699, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 19, name: "Shirt 4", category: "Formal", price: 1799, mrp: 2099, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 20, name: "Lounge Pants 4", category: "Loungewear", price: 1299, mrp: 1599, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 21, name: "Dress 5", category: "Party", price: 2699, mrp: 2999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 22, name: "Top 5", category: "Streetwear", price: 1499, mrp: 1799, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 23, name: "Blouse 5", category: "Casual", price: 999, mrp: 1299, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 24, name: "Shirt 5", category: "Formal", price: 1799, mrp: 2099, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75", hoverImage: null, tags: ["Best Seller"] },
      { id: 25, name: "Lounge Set 5", category: "Loungewear", price: 1299, mrp: 1599, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 26, name: "Dress 6", category: "Party", price: 2999, mrp: 3399, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 27, name: "Top 6", category: "Streetwear", price: 1399, mrp: 1699, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 28, name: "Blouse 6", category: "Casual", price: 1099, mrp: 1399, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 29, name: "Shirt 6", category: "Formal", price: 1599, mrp: 1899, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 30, name: "Lounge Set 6", category: "Loungewear", price: 1499, mrp: 1799, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 31, name: "Dress 7", category: "Party", price: 3199, mrp: 3599, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 32, name: "Top 7", category: "Streetwear", price: 1599, mrp: 1899, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 33, name: "Blouse 7", category: "Casual", price: 1199, mrp: 1499, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 34, name: "Shirt 7", category: "Formal", price: 1999, mrp: 2299, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: ["Best Seller"] },
      { id: 35, name: "Lounge Set 7", category: "Loungewear", price: 1399, mrp: 1699, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 36, name: "Dress 8", category: "Party", price: 3299, mrp: 3699, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75", hoverImage: null, tags: ["New"] },
      { id: 37, name: "Top 8", category: "Streetwear", price: 1699, mrp: 1999, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75", hoverImage: null, tags: ["Trending"] },
      { id: 38, name: "Blouse 8", category: "Casual", price: 1299, mrp: 1599, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 39, name: "Shirt 8", category: "Formal", price: 2199, mrp: 2499, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75", hoverImage: null, tags: [] },
      { id: 40, name: "Lounge Set 8", category: "Loungewear", price: 1499, mrp: 1799, image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75", hoverImage: null, tags: [] }
    ];
    const filteredProducts = computed(
      () => products.filter((p) => p.category === selectedSubcategory.value)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-8 bg-white" }, _attrs))} data-v-ea18aaeb><div class="w-full bg-black py-3 mb-4" data-v-ea18aaeb><h2 class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold" data-v-ea18aaeb> SHOP BY STYLE </h2></div><div class="overflow-x-auto px-4 sm:px-6 mb-6 flex space-x-4 md:justify-center scrollbar-hide" data-v-ea18aaeb><!--[-->`);
      ssrRenderList(subcategories, (sub, index) => {
        _push(`<button class="${ssrRenderClass([
          "flex-shrink-0 px-4 sm:px-5 py-2 font-medium border-b-2 transition-colors whitespace-nowrap",
          selectedSubcategory.value === sub ? "border-black text-black" : "border-transparent text-gray-700 hover:text-black hover:border-gray-400"
        ])}" data-v-ea18aaeb>${ssrInterpolate(sub)}</button>`);
      });
      _push(`<!--]--></div><div class="overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide" data-v-ea18aaeb><div class="flex space-x-4 sm:space-x-6" data-v-ea18aaeb><!--[-->`);
      ssrRenderList(filteredProducts.value, (product) => {
        _push(ssrRenderComponent(ProductCard, {
          key: product.id,
          title: product.name,
          image: product.image,
          price: product.price,
          mrp: product.mrp,
          hoverImage: product.hoverImage,
          tags: product.tags,
          class: "flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80"
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/ShopBy.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ShopBy = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ea18aaeb"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}><main class="flex-1 w-full overflow-x-hidden"><div class="block md:hidden mb-4">`);
      _push(ssrRenderComponent(CategorySlider, null, null, _parent));
      _push(`</div><div class="pb-8 sm:pb-0">`);
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(`</div><div class="hidden md:block mt-4">`);
      _push(ssrRenderComponent(CategorySlider, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(PremiumCategories, null, null, _parent));
      _push(ssrRenderComponent(ShopBy, null, null, _parent));
      _push(`<div class="py-4">`);
      _push(ssrRenderComponent(BannerComponent, {
        image: "influencer.jpg",
        aspect: "1200/563",
        link: "/influencer"
      }, null, _parent));
      _push(`</div><div class="py-4">`);
      _push(ssrRenderComponent(Headline, null, null, _parent));
      _push(`</div><div class="py-4">`);
      _push(ssrRenderComponent(TrendingProducts, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(Stars, null, null, _parent));
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Bf6atn1Y.mjs.map
