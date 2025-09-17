<template>
  <section class="pt-6 bg-white">
    <!-- Products Horizontal Scroll -->
    <div class="overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-3 scrollbar-hide">
      <div
        class="flex space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6 snap-x snap-mandatory touch-pan-x"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :id="product.id"
          :title="product.name"
          :image="product.img"
          :hoverImage="null"
          :price="product.real_selling_price"
          :mrp="product.selling_price"
          :productUrl="product.product_url"
          :showCartBtn="true"
          class="flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64 snap-start"
          @click="goToDetail(product.product_url)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import ProductCard from "@/components/common/ProductCard.vue";

const router = useRouter();
const products = ref([]);

// Navigate to product detail
const goToDetail = (url) => {
  if (!url) return;
  if (url.startsWith("/")) {
    router.push(url).catch(() => {});
  } else {
    window.location.href = url;
  }
};

const fetchProducts = async () => {
  try {
    const res = await axios.get(
      "https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=categories:=373&filter_by=active:=1&sort_by=avg_rating:desc&per_page=12&page=1",
      {
        headers: {
          "X-Typesense-Api-Key": "VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh",
        },
      }
    );

    products.value = res.data.hits.map((hit) => ({
      id: hit.document.id,
      name: hit.document.name,
      img: hit.document.img,
      real_selling_price: hit.document.real_selling_price,
      selling_price: hit.document.selling_price,
      tags: hit.document.tags || [],
      product_url: hit.document.product_url,
    }));
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* Hide horizontal scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Smooth horizontal scroll */
.overflow-x-auto {
  scroll-behavior: smooth;
}
</style>
