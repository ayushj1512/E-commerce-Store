<template>
  <section class="py-6 bg-white">
    <!-- Products Horizontal Scroll -->
    <div class="overflow-x-auto px-4 pb-2 scrollbar-hide">
      <div class="flex space-x-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :title="product.name"
          :image="product.image"
          :hoverImage="product.hoverImage"
          :price="product.price"
          :mrp="product.mrp"
          :tags="product.tags"
          :showCartBtn="true"
          :productUrl="product.productUrl"  
          class="flex-shrink-0"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from "@/components/common/ProductCard.vue";

const products = [
  {
    id: 1,
    name: "Party Dress",
    price: 2499,
    mrp: 2999,
    image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_1_3da0b44a-741d-4e1c-ac17-1f6cb89df721.jpg%3Fv%3D1752472623&w=1920&q=75",
    hoverImage: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_2_98a7a948-b126-4608-82eb-f159260c3628.jpg%3Fv%3D1752472623&w=1920&q=75",
    tags: ["New"],
    productUrl: "/product/party-dress"
  },
  {
    id: 2,
    name: "Streetwear Top",
    price: 1299,
    mrp: 1599,
    image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_1_3da0b44a-741d-4e1c-ac17-1f6cb89df721.jpg%3Fv%3D1752472623&w=1920&q=75",
    hoverImage: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_2_98a7a948-b126-4608-82eb-f159260c3628.jpg%3Fv%3D1752472623&w=1920&q=75",
    tags: ["Trending"],
    productUrl: "/product/streetwear-top"
  },
  {
    id: 3,
    name: "Casual Tee",
    price: 899,
    mrp: null,
    image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_1_3da0b44a-741d-4e1c-ac17-1f6cb89df721.jpg%3Fv%3D1752472623&w=1920&q=75",
    hoverImage: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_2_98a7a948-b126-4608-82eb-f159260c3628.jpg%3Fv%3D1752472623&w=1920&q=75",
    tags: [],
    productUrl: "/product/casual-tee"
  },
  {
    id: 4,
    name: "Formal Blouse",
    price: 1599,
    mrp: 1999,
    image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_1_3da0b44a-741d-4e1c-ac17-1f6cb89df721.jpg%3Fv%3D1752472623&w=1920&q=75",
    hoverImage: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_2_98a7a948-b126-4608-82eb-f159260c3628.jpg%3Fv%3D1752472623&w=1920&q=75",
    tags: ["Best Seller"],
    productUrl: "/product/formal-blouse"
  },
  {
    id: 5,
    name: "Loungewear Set",
    price: 1999,
    mrp: 2299,
    image: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_1_3da0b44a-741d-4e1c-ac17-1f6cb89df721.jpg%3Fv%3D1752472623&w=1920&q=75",
    hoverImage: "https://www.fablestreet.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0486%2F0634%2F7416%2Ffiles%2FFSKNSH400PINK_2_98a7a948-b126-4608-82eb-f159260c3628.jpg%3Fv%3D1752472623&w=1920&q=75",
    tags: [],
    productUrl: "/product/loungewear-set"
  }
];
</script>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
