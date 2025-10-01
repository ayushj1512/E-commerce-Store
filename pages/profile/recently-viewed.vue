<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-12">
    <!-- Header with Sort -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div class="flex flex-col md:block w-full md:w-auto mb-4 md:mb-0">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
          Your Recently Viewed Picks
        </h1>
        <p class="text-gray-600 md:text-lg text-center md:text-left">
          Here's a collection of products you explored recently.
        </p>
      </div>

      <!-- Sort Dropdown -->
      <div class="relative w-56 self-end md:self-auto md:ml-auto">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="w-full bg-white text-gray-800 border border-gray-300 rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition flex items-center justify-between focus:outline-none"
        >
          <span>{{ getSortLabel(sortBy) }}</span>
          <ChevronDown
            :class="['w-4 h-4 ml-2 transition-transform', dropdownOpen ? 'rotate-180' : 'rotate-0']"
          />
        </button>

        <transition name="fade">
          <ul
            v-if="dropdownOpen"
            class="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
          >
            <li
              v-for="option in sortOptions"
              :key="option.value"
              @click="setSort(option.value)"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              :class="{ 'bg-gray-100 font-semibold': sortBy === option.value }"
            >
              <div class="flex items-center gap-2">
                <component :is="option.icon" class="w-4 h-4 text-gray-500" />
                <span>{{ option.label }}</span>
              </div>
              <Check v-if="sortBy === option.value" class="w-4 h-4 text-gray-700" />
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading your recently viewed products...
    </div>

    <!-- Empty State -->
    <div v-else-if="recentProducts.length === 0" class="text-center py-10 text-gray-500">
      You haven't viewed any products yet.
    </div>

    <!-- Products Grid -->
    <div v-else>
      <transition-group
        name="fade"
        tag="div"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        move-class="move"
      >
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="cursor-pointer relative transform transition hover:scale-105"
          @click="goToProduct(product)"
        >
          <ProductCard
            :id="product.id"
            :title="product.name"
            :image="product.images[0]?.bigImg || product.images[0]?.img || '/fallback.jpg'"
            :hoverImage="product.images[1]?.bigImg || product.images[1]?.img || product.images[0]?.bigImg || product.images[0]?.img || '/fallback.jpg'"
            :price="product.actual_selling_price"
            :mrp="product.selling_price"
            :avgRating="0"
            :sizes="product.sizes || []"
            :productUrl="product.productUrl || ''"
          />
        </div>
      </transition-group>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-3 mt-8">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Prev
        </button>

        <span class="text-gray-700 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>

        <button
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ChevronDown, ArrowDown, ArrowUp, Check } from "lucide-vue-next";
import { useRecentlyViewStore } from "@/stores/recentlyViewStore";
import ProductCard from "@/components/common/ProductCard.vue";

const router = useRouter();
const recentlyViewStore = useRecentlyViewStore();

// Load from cookie immediately
recentlyViewStore.loadRecentlyViewed();

const sortBy = ref("latest");
const dropdownOpen = ref(false);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 20;

const sortOptions = [
  { value: "latest", label: "Recently Viewed", icon: ArrowDown },
  { value: "priceLowHigh", label: "Price: Low to High", icon: ArrowDown },
  { value: "priceHighLow", label: "Price: High to Low", icon: ArrowUp },
];

const getSortLabel = (value) => sortOptions.find(o => o.value === value)?.label || "Sort By";
const setSort = (value) => { sortBy.value = value; dropdownOpen.value = false; currentPage.value = 1; };

const recentProducts = ref([]);

// Fetch products using store's getProducts
const fetchRecentProducts = async () => {
  loading.value = true;
  try {
    const products = await recentlyViewStore.getProducts();

    // Normalize images to always have at least 2 items
    recentProducts.value = (products || []).map(p => {
      const images = p.images || [];
      if (images.length === 1) images.push(images[0]);
      return { ...p, images };
    });

  } catch (err) {
    recentProducts.value = [];
    console.error("Error fetching recently viewed products:", err);
  } finally {
    loading.value = false;
  }
};

// Computed: sorted and paginated products
const sortedProducts = computed(() => {
  const products = [...recentProducts.value];
  switch (sortBy.value) {
    case "priceLowHigh":
      return products.sort((a, b) => (a.actual_selling_price || 0) - (b.actual_selling_price || 0));
    case "priceHighLow":
      return products.sort((a, b) => (b.actual_selling_price || 0) - (a.actual_selling_price || 0));
    default:
      return products;
  }
});

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedProducts.value.slice(start, start + itemsPerPage);
});

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// Watch for store changes so products update immediately
watch(() => recentlyViewStore.recentlyViewed, fetchRecentProducts, { deep: true });

// Fetch products on mount
onMounted(fetchRecentProducts);

// Navigate to product detail
const goToProduct = (product) => {
  const slug = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  router.push(`/parent/child/${slug}/${product.id}`).catch(() => {});
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Move animation for rearrangement */
.move {
  transition: transform 0.3s ease;
}
</style>
