<template>
  <section class="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
    <h2 class="text-2xl font-semibold text-center mb-8 text-gray-800">
      🧪 ProductCard1 Test Showcase
    </h2>

    <!-- Responsive product grid -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center"
    >
      <!-- Example products -->
      <ProductCard1
        v-for="(product, index) in testProducts"
        :key="index"
        :id="product.id"
        :title="product.title"
        :image="product.image"
        :hoverImage="product.hoverImage"
        :price="product.price"
        :mrp="product.mrp"
        :productUrl="product.productUrl"
        :avgRating="product.avgRating"
        :categories="product.categories"
      />
    </div>
  </section>
</template>

<script setup>
import ProductCard1 from "@/components/common/ProductCard1.vue"

const testProducts = [
  {
    id: 1,
    title: "Classic Cotton T-Shirt",
    image: "https://picsum.photos/id/237/400/400",
    hoverImage: "https://picsum.photos/id/238/400/400",
    price: 799,
    mrp: 999,
    avgRating: 4.2,
    categories: [101],
    productUrl: "/product/classic-tshirt",
  },
  {
    id: 2,
    title: "Denim Blue Jeans",
    image: "https://picsum.photos/id/239/400/400",
    hoverImage: "https://picsum.photos/id/240/400/400",
    price: 1199,
    mrp: 1499,
    avgRating: 4.5,
    categories: [102],
    productUrl: "/product/denim-jeans",
  },
  {
    id: 3,
    title: "Urban Hoodie",
    image: "https://picsum.photos/id/241/400/400",
    hoverImage: "https://picsum.photos/id/242/400/400",
    price: 1399,
    mrp: 1699,
    avgRating: 4.7,
    categories: [103],
    productUrl: "/product/urban-hoodie",
  },
  {
    id: 4,
    title: "Casual Sneakers",
    image: "https://picsum.photos/id/243/400/400",
    hoverImage: "https://picsum.photos/id/244/400/400",
    price: 1899,
    mrp: 2299,
    avgRating: 4.3,
    categories: [104],
    productUrl: "/product/casual-sneakers",
  },
]
</script>
