<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-6">
    <h1 class="text-2xl font-bold mb-6">Combo Product Card Test</h1>

    <ComboProductCard
      v-for="product in products"
      :key="product.id"
      :id="product.id"
      :title="product.title"
      :image="product.image"
      :hover-image="product.hoverImage"
      :tags="product.tags"
      :price="product.price"
      :mrp="product.mrp"
      :product-url="product.url"
      :avg-rating="product.avgRating"
      :combo="product.combo"
    />
  </div>
</template>

<script setup>
import ComboProductCard from "../../components/common/ProductCard.vue"

const products = [
  {
    id: 1,
    title: "Summer Combo T-Shirt + Shorts",
    image: "https://via.placeholder.com/300x300.png?text=Product+1",
    hoverImage: "https://via.placeholder.com/300x300.png?text=Product+1+Hover",
    tags: ["Summer", "Hot Deal"],
    price: 799,
    mrp: 999,
    url: "/product/1",
    avgRating: 4.5,
    combo: {
      name: "Summer Fun Combo"
    }
  },
  {
    id: 2,
    title: "Winter Combo Hoodie + Gloves",
    image: "https://via.placeholder.com/300x300.png?text=Product+2",
    hoverImage: null,
    tags: ["Winter", "Trending"],
    price: 1299,
    mrp: 1599,
    url: "/product/2",
    avgRating: 4.8,
    combo: {
      name: "Winter Warm Combo"
    }
  },
  {
    id: 3,
    title: "Gaming Combo Mouse + Keyboard",
    image: "https://via.placeholder.com/300x300.png?text=Product+3",
    hoverImage: "https://via.placeholder.com/300x300.png?text=Product+3+Hover",
    tags: ["Gaming", "Exclusive"],
    price: 2499,
    mrp: 2999,
    url: "/product/3",
    avgRating: 4.7,
    combo: {
      name: "Pro Gamer Combo"
    }
  }
]
</script>
