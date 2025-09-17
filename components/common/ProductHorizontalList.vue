<!-- src/components/common/ProductHorizontalList.vue -->
<template>
  <section class="pt-6 bg-white">
    <!-- Products Horizontal Scroll -->
    <div class="overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-3 scrollbar-hide">
      <!-- Shimmer while loading -->
      <div
        v-if="loading"
        class="flex space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6 snap-x snap-mandatory"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="flex-shrink-0 w-36 sm:w-44 md:w-52 lg:w-60 xl:w-64 h-72 shimmer rounded-md"
        ></div>
      </div>

      <!-- Product Cards -->
      <div
        v-else
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

const props = defineProps({
  categoryId: {
    type: [String, Number],
    default: 373, // fallback category
  },
  perPage: {
    type: Number,
    default: 12,
  },
});

const router = useRouter();
const products = ref([]);
const loading = ref(true);

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
    loading.value = true;
    const res = await axios.get(
      `https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=categories:=${props.categoryId}&filter_by=active:=1&sort_by=avg_rating:desc&per_page=${props.perPage}&page=1`,
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
  } finally {
    loading.value = false;
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

/* Shimmer */
.shimmer {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
}
.shimmer::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 150px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
