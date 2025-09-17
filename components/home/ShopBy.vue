<template>
  <section class="py-8 bg-white">
    <!-- Section Heading -->
    <div class="w-full bg-black py-3 mb-4">
      <h2
        class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide"
      >
        SHOP BY STYLE
      </h2>
    </div>

    <!-- Subcategories: horizontal scroll on mobile -->
    <div
      class="overflow-x-auto px-4 sm:px-6 mb-6 flex space-x-4 md:justify-center scrollbar-hide"
    >
      <button
        v-for="(sub, index) in subcategories"
        :key="index"
        @click="selectedSubcategory = sub"
        :class="[
          'flex-shrink-0 px-5 py-2 font-medium border-b-2 transition-all duration-300 whitespace-nowrap',
          selectedSubcategory === sub
            ? 'border-black text-black'
            : 'border-transparent text-gray-600 hover:text-black hover:border-gray-400'
        ]"
      >
        {{ sub }}
      </button>
    </div>

    <!-- Products Horizontal Scroll -->
    <transition name="fade" mode="out-in">
      <div
        :key="selectedSubcategory"
        class="overflow-x-auto px-4 sm:px-6 pb-4 scrollbar-hide"
      >
        <div class="flex space-x-4 sm:space-x-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :title="product.name"
            :image="product.image"
            :price="product.price"
            :mrp="product.mrp"
            :hoverImage="product.hoverImage"
            :tags="product.tags"
            class="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80"
          />
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import ProductCard from "@/components/common/ProductCard.vue";

const subcategories = ["Party", "Streetwear", "Casual", "Formal", "Loungewear"];
const selectedSubcategory = ref(subcategories[0]);

const products = [
{id:1,name:"Dress 1",category:"Party",price:2499,mrp:2999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:2,name:"Top 1",category:"Streetwear",price:1299,mrp:1599,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:3,name:"Blouse 1",category:"Casual",price:899,mrp:null,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",hoverImage:null,tags:[]},
{id:4,name:"Shirt 1",category:"Formal",price:1599,mrp:1999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",hoverImage:null,tags:["Best Seller"]},
{id:5,name:"Lounge Set 1",category:"Loungewear",price:1999,mrp:2299,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75",hoverImage:null,tags:[]},
{id:6,name:"Dress 2",category:"Party",price:2999,mrp:3499,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:7,name:"Top 2",category:"Streetwear",price:1499,mrp:1799,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:8,name:"Blouse 2",category:"Casual",price:1199,mrp:1499,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:[]},
{id:9,name:"Shirt 2",category:"Formal",price:1399,mrp:1699,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",hoverImage:null,tags:[]},
{id:10,name:"Lounge Set 2",category:"Loungewear",price:1799,mrp:1999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",hoverImage:null,tags:[]},
{id:11,name:"Dress 3",category:"Party",price:2599,mrp:2899,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75",hoverImage:null,tags:[]},
{id:12,name:"Top 3",category:"Streetwear",price:1599,mrp:1899,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:13,name:"Blouse 3",category:"Casual",price:799,mrp:999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:[]},
{id:14,name:"Shirt 3",category:"Formal",price:2999,mrp:3299,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:["Best Seller"]},
{id:15,name:"Lounge Top 3",category:"Loungewear",price:999,mrp:1299,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",hoverImage:null,tags:[]},
{id:16,name:"Dress 4",category:"Party",price:3499,mrp:3999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:17,name:"Top 4",category:"Streetwear",price:2199,mrp:2599,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:18,name:"Blouse 4",category:"Casual",price:1399,mrp:1699,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75",hoverImage:null,tags:[]},
{id:19,name:"Shirt 4",category:"Formal",price:1799,mrp:2099,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:[]},
{id:20,name:"Lounge Pants 4",category:"Loungewear",price:1299,mrp:1599,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:[]},
{id:21,name:"Dress 5",category:"Party",price:2699,mrp:2999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:22,name:"Top 5",category:"Streetwear",price:1499,mrp:1799,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:23,name:"Blouse 5",category:"Casual",price:999,mrp:1299,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",hoverImage:null,tags:[]},
{id:24,name:"Shirt 5",category:"Formal",price:1799,mrp:2099,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",hoverImage:null,tags:["Best Seller"]},
{id:25,name:"Lounge Set 5",category:"Loungewear",price:1299,mrp:1599,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75",hoverImage:null,tags:[]},
{id:26,name:"Dress 6",category:"Party",price:2999,mrp:3399,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:27,name:"Top 6",category:"Streetwear",price:1399,mrp:1699,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:28,name:"Blouse 6",category:"Casual",price:1099,mrp:1399,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:[]},
{id:29,name:"Shirt 6",category:"Formal",price:1599,mrp:1899,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",hoverImage:null,tags:[]},
{id:30,name:"Lounge Set 6",category:"Loungewear",price:1499,mrp:1799,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",hoverImage:null,tags:[]},
{id:31,name:"Dress 7",category:"Party",price:3199,mrp:3599,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:32,name:"Top 7",category:"Streetwear",price:1599,mrp:1899,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:33,name:"Blouse 7",category:"Casual",price:1199,mrp:1499,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:[]},
{id:34,name:"Shirt 7",category:"Formal",price:1999,mrp:2299,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:["Best Seller"]},
{id:35,name:"Lounge Set 7",category:"Loungewear",price:1399,mrp:1699,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH424BLST_2.jpg%3Fv%3D1754030952&w=1920&q=75",hoverImage:null,tags:[]},
{id:36,name:"Dress 8",category:"Party",price:3299,mrp:3699,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FTR166DGRY_2.jpg%3Fv%3D1726144103&w=1920&q=75",hoverImage:null,tags:["New"]},
{id:37,name:"Top 8",category:"Streetwear",price:1699,mrp:1999,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FKNTR121BLAC_4_70ee5ab4-e7f1-4adb-8176-e55b6ac511f8.jpg%3Fv%3D1753776030&w=1920&q=75",hoverImage:null,tags:["Trending"]},
{id:38,name:"Blouse 8",category:"Casual",price:1299,mrp:1599,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSSH260WHPR_2.jpg%3Fv%3D1746621652&w=1920&q=75",hoverImage:null,tags:[]},
{id:39,name:"Shirt 8",category:"Formal",price:2199,mrp:2499,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FJK135BRWN_4.jpg%3Fv%3D1722498899&w=1920&q=75",hoverImage:null,tags:[]},
{id:40,name:"Lounge Set 8",category:"Loungewear",price:1499,mrp:1799,image:"https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSTR240OFWH_2.jpg%3Fv%3D1714641820&w=1920&q=75",hoverImage:null,tags:[]}
];



const filteredProducts = computed(() =>
  products.filter((p) => p.category === selectedSubcategory.value)
);
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Hide horizontal scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
}
</style>
