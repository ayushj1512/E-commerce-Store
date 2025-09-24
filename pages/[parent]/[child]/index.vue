<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- Top bar: Filters Drawer + Sorting Tags + Results count -->
    <div class="flex flex-wrap gap-2 mb-4 items-center">
      
      <!-- Filters Drawer -->
      <div class="flex items-center">
        <button
          @click="toggleDrawer"
          class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Filters
        </button>
      </div>

      <!-- Sorting tags -->
      <div class="flex flex-wrap gap-2 overflow-x-auto flex-1 items-center">
        <button 
          v-for="option in sortOptions" 
          :key="option.value" 
          @click="applySort(option)"
          :class="[ 
            selectedSort === option.value 
              ? 'bg-black text-white scale-105 shadow-md' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
            'px-3 py-1 rounded-full border text-sm whitespace-nowrap'
          ]"
        >
          {{ option.label }}
        </button>

        <span class="ml-auto text-gray-700 text-sm">
          Results found: {{ filteredProducts.length }}
        </span>
      </div>
    </div>

    <!-- Drawer Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 z-40"
        @click="closeDrawer"
      ></div>
    </transition>

    <!-- Drawer -->
    <transition name="slide">
      <aside
        v-if="isOpen"
        class="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 overflow-y-auto"
      >
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Filters</h2>
          <button @click="closeDrawer" class="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div class="p-4 space-y-4">
          <!-- Categories -->
          <div v-if="availableCategories.length">
            <h3 class="font-medium mb-2">Category</h3>
            <ul class="space-y-2">
              <li v-for="cat in availableCategories" :key="cat">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedCategories" :value="cat" />
                  <span>{{ cat }}</span>
                </label>
              </li>
            </ul>
          </div>

          <!-- Popular Tags -->
          <div v-if="popularTags.length">
            <h3 class="font-medium mb-2">Popular Tags</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in popularTags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[ selectedTags.includes(tag) 
                    ? 'bg-black text-white scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  'px-3 py-1 rounded-full border text-sm']"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Other Tags -->
          <div v-if="availableTags.length">
            <h3 class="font-medium mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[ selectedTags.includes(tag) 
                    ? 'bg-black text-white scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
                  'px-3 py-1 rounded-full border text-sm']"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Apply Button -->
          <button
            @click="applyFilters"
            class="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </transition>

    <!-- AVAILABLE VOUCHER COMPONENT -->
    <AvailableVoucher :category-id="categoryIdFromRoute" class="mb-6" />

    <!-- Products Grid -->
    <transition-group 
      name="fade-slide" 
      tag="div"
      class="grid gap-6 mt-10 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
    >
      <ProductCard 
        v-for="(product, index) in filteredProducts" 
        :key="product.id || `product-${index}`"
        :id="product.id || `product-${index}`" 
        :title="product.displayName" 
        :image="product.imageUrl"
        :hoverImage="product.hoverImageUrl" 
        :price="product.displayPrice" 
        :mrp="product.displayDiscount + product.displayPrice"
        :showCartBtn="true"
        :productUrl="`/${route.params.parent || 'products'}/${product.displayCategories?.[0] || 'category'}/${product.slug}/${product.id}`" 
      />
    </transition-group>

    <div v-if="!filteredProducts.length" class="text-center py-10 text-gray-500">
      No products found.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import ProductCard from "@/components/common/ProductCard.vue";
import AvailableVoucher from "@/components/collection/AvailableVoucher.vue";

const store = useProductStore();
const route = useRoute();

// --- Drawer ---
const isOpen = ref(false);
const toggleDrawer = () => (isOpen.value = !isOpen.value);
const closeDrawer = () => (isOpen.value = false);

// --- Sorting ---
const selectedSort = ref("default");
const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];
const applySort = (option) => (selectedSort.value = option.value);

// --- Category ID ---
const categoryIdFromRoute = computed(() => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam.match(/(\d+)$/);
  return match ? match[1] : route.params.parent;
});

// --- Filters ---
const availableCategories = ref(["Men", "Women", "Shoes"]);
const availableTags = ref(["T-Shirts", "Jackets", "Hoodies"]);
const popularTags = ref(["prom", "formal", "casual", "boutique"]);

const selectedCategories = ref([]);
const selectedTags = ref([]);

const toggleTag = (tag) => {
  selectedTags.value.includes(tag)
    ? (selectedTags.value = selectedTags.value.filter((t) => t !== tag))
    : selectedTags.value.push(tag);
};

const applyFilters = async () => {
  await fetchProducts();
  closeDrawer();
};

// --- Fetch Products ---
const fetchProducts = async () => {
  const catId = categoryIdFromRoute.value;
  if (!catId) return;

  await store.fetchProducts({
    categoryId: catId,
    page: 1,
    perPage: 250,
    tags: selectedTags.value,
  });

  await nextTick();
};

// --- Filtered Products ---
const filteredProducts = computed(() => {
  const products = store.productLists[categoryIdFromRoute.value]?.products || [];
  const mapped = products.map((p) => ({
    ...p,
    imageUrl: p.images?.[0]?.img || "",
    hoverImageUrl: p.images?.[1]?.img || p.images?.[0]?.img || "",
    slug: p.slug || `product-${p.id}`,
    displayCategories: p.displayCategories || ["category"],
    tags: Array.isArray(p.tags) ? p.tags : [],
    displayPrice: Number(p.displayPrice ?? p.price ?? 0),
    displayDiscount: Number(p.displayDiscount ?? 0),
  }));

  const filtered = mapped.filter((p) => {
    if (selectedTags.value.length && !p.tags.some((t) => selectedTags.value.includes(t)))
      return false;
    return true;
  });

  return filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case "lowtohigh":
        return a.displayPrice - b.displayPrice;
      case "hightolow":
        return b.displayPrice - a.displayPrice;
      case "latest":
        return (new Date(b.rawData?.date_added) || 0) - (new Date(a.rawData?.date_added) || 0);
      case "rating":
        return (b.rawData?.avg_rating ?? 0) - (a.rawData?.avg_rating ?? 0);
      case "trending":
        return (b.rawData?.sales ?? 0) - (a.rawData?.sales ?? 0);
      default:
        return 0;
    }
  });
});

// --- Lifecycle ---
onMounted(fetchProducts);
watch([() => route.params.parent, () => route.params.child], fetchProducts);
</script>
