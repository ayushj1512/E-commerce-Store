<template>
  <section class="py-6 bg-white relative">
    <!-- Section Heading -->
    <div class="w-full bg-black py-2 sm:py-3 mb-4">
      <h2 class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
        SHOP BY STYLE
      </h2>
    </div>

    <!-- Subcategories: horizontal scroll -->
    <div
  class="overflow-x-auto px-4 sm:px-6 mb-6 flex space-x-6 md:justify-center scrollbar-hide"
>
  <button
    v-for="(sub, index) in subcategories"
    :key="index"
    @click="selectedSubcategory = sub"
    :class="[
      'relative flex-shrink-0 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 pb-1',
      selectedSubcategory === sub
        ? 'text-black after:w-full after:bg-black'
        : 'text-gray-500 hover:text-black after:w-0 hover:after:w-full after:bg-gray-400'
    ]"
  >
    {{ sub }}
    <!-- Underline animation -->
    <span
      class="absolute left-0 bottom-0 h-[2px] transition-all duration-300 rounded-full"
      :class="[
        selectedSubcategory === sub ? 'w-full bg-black' : 'w-0 group-hover:w-full bg-gray-400'
      ]"
    ></span>
  </button>
</div>


    <!-- Products Horizontal Scroll -->
    <transition-group
      name="fade-move"
      tag="div"
      class="overflow-x-auto px-4 sm:px-6 pb-4 flex space-x-4 sm:space-x-6 scrollbar-hide relative"
    >
      <!-- Loading placeholders -->
      <div v-if="loading">
        <div
          v-for="n in placeholderCount"
          :key="'placeholder-' + n"
          class="flex-shrink-0 w-40 sm:w-56 md:w-64 h-80 sm:h-96 bg-gray-200 rounded-xl animate-pulse"
        ></div>
      </div>

      <!-- Product Cards -->
      <ProductCard
        v-else
        v-for="(product, index) in filteredProducts"
        :key="product.id"
        :title="product.name"
        :image="product.image"
        :price="product.price"
        :mrp="product.mrp"
        :hoverImage="product.hoverImage"
        class="flex-shrink-0 w-40 sm:w-56 md:w-64 h-80 sm:h-96"
        :style="{ transitionDelay: (index * 80) + 'ms' }"
      />
    </transition-group>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";

// Subcategories
const subcategories = ["Party", "Streetwear", "Casual", "Formal", "Loungewear"];
const selectedSubcategory = ref(subcategories[0]);

// Loading placeholder
const loading = ref(false);
const placeholderCount = 6;

// Images and tags
const images = [
  "https://cdn.streetstylestore.com/3/1/0/7/3/9/310739-sss_vertical.webp",
  "https://cdn.streetstylestore.com/3/1/0/5/6/6/310566-sss_vertical.webp",
  "https://cdn.streetstylestore.com/3/0/3/6/6/0/303660-sss_vertical.webp",
  "https://cdn.streetstylestore.com/3/0/9/1/1/8/309118-sss_vertical.webp",
  "https://cdn.streetstylestore.com/new-sssnew-images/style/128830_2.jpeg",
  "https://cdn.streetstylestore.com/3/0/8/9/3/0/308930-sss_vertical.webp",
  "https://cdn.streetstylestore.com/2/7/7/9/2/1/277921-sss_vertical.webp",
  "https://cdn.streetstylestore.com/3/1/0/5/5/7/310557-sss_vertical.webp",
  "https://cdn.streetstylestore.com/3/0/7/7/0/6/307706-vertical_default.webp",
  "https://cdn.streetstylestore.com/2/1/5/7/8/4/215784-vertical_default.webp",
  "https://cdn.streetstylestore.com/3/0/4/6/6/8/304668-vertical_default.webp"
];

const tagsList = [["New"], ["Trending"], ["Best Seller"], [], ["Limited"]];

// Generate 40 products dynamically
const products = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: subcategories[i % subcategories.length],
  price: Math.floor(Math.random() * 2000) + 1000,
  mrp: Math.floor(Math.random() * 2000) + 2000,
  image: images[i % images.length],
  hoverImage: null,
  tags: tagsList[i % tagsList.length]
}));

// Filter products by selected subcategory
const filteredProducts = computed(() =>
  products.filter((p) => p.category === selectedSubcategory.value)
);
</script>

<style scoped>
/* --- ✨ Enhanced Crossfade Animation --- */
.fade-move-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-move-leave-active {
  transition: all 0.4s ease;
  position: absolute; /* prevents layout jump during fade-out */
}

.fade-move-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.96);
}
.fade-move-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-move-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fade-move-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* --- Scrollbar Hide + Smooth Scroll --- */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
</style>
