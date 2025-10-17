<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- 🔹 Top bar: Filters + Sorting -->
    <div class="flex flex-wrap gap-2 mb-4 items-center w-full">
      <div class="hidden md:flex items-center w-full gap-2">
        <button @click="toggleDrawer" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Filters
        </button>
        <SortingTags v-model="selectedSort" :options="sortOptions" />
        <div class="ml-auto text-gray-700 text-sm">
          Total Results: {{ totalProductsCount }}
        </div>
      </div>

      <!-- 🔸 Mobile -->
      <div class="flex md:hidden items-center w-full gap-2">
        <button @click="toggleDrawer" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
          Filters
        </button>
        <div class="ml-auto">
          <SortDropdown v-model="selectedSort" :options="sortOptions" />
        </div>
      </div>
    </div>

    <!-- 🔹 Selected Filters Display on Parent -->
    <div v-if="selectedCategories.length || selectedTags.length || selectedSizes.length" class="flex flex-wrap gap-2 mb-4">
      <div v-for="cat in selectedCategories" :key="'cat-' + cat" class="selected-chip" @click="removeParentFilter('category', cat)">
        {{ capitalize(cat) }} ×
      </div>
      <div v-for="tag in selectedTags" :key="'tag-' + tag" class="selected-chip" @click="removeParentFilter('tag', tag)">
        {{ capitalize(tag) }} ×
      </div>
      <div v-for="size in selectedSizes" :key="'size-' + size" class="selected-chip" @click="removeParentFilter('size', size)">
        {{ size }} ×
      </div>
    </div>

    <!-- 🔹 Drawer Overlay -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/40 z-40" @click="closeDrawer"></div>
    </transition>

    <!-- 🔹 Filter Drawer -->
    <transition name="slide-left">
      <div v-if="isOpen" class="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 overflow-y-auto">
        <Filters
          :category-number="Number(categoryIdFromRoute)"
          v-model:selectedCategories="selectedCategories"
          v-model:selectedTags="selectedTags"
          v-model:selectedSizes="selectedSizes"
        />
      </div>
    </transition>

    <!-- Voucher -->
    <AvailableVoucher :category-id="categoryIdFromRoute" class="mb-4 mt-4" />

    <!-- Mobile result count -->
    <div class="md:hidden text-gray-700 text-sm text-right mb-6">
      Total Results: {{ totalProductsCount }}
    </div>

    <!-- Products Grid -->
    <transition-group
      name="fade-slide"
      tag="div"
      class="grid gap-6 mt-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5"
    >
      <ProductCard
        v-for="(product, index) in sortedProducts"
        :id="product.id"
        :key="product.id || `product-${index}`"
        :title="product.displayName || 'Product'"
        :image="product.imageUrl"
        :hoverImage="product.hoverImageUrl"
        :price="product.displayPrice"
        :mrp="(product.displayDiscount || 0) + (product.displayPrice || 0)"
        :avgRating="product.avgRating"
        :showCartBtn="true"
        :productUrl="`/${route.params.parent || 'products'}/${product.displayCategories?.[0] || 'category'}/${product.slug}/${product.id}`"
      />
    </transition-group>

    <!-- Infinite Scroll Sentinel -->
    <div ref="sentinel" class="h-10 w-full text-center py-6 text-gray-500">
      <span v-if="isLoadingMore">Loading more...</span>
      <span v-else-if="!hasMore">No more products</span>
    </div>

    <div v-if="!sortedProducts.length" class="text-center py-10 text-gray-500">
      No products found.
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useRoute } from "#app";
import { useProductStore } from "@/stores/productStore.js";
import ProductCard from "@/components/common/ProductCard.vue";
import AvailableVoucher from "@/components/collection/AvailableVoucher.vue";
import Filters from "@/components/collection/Filters.vue";
import SortingTags from "@/components/collection/SortingTags.vue";
import SortDropdown from "@/components/collection/SortDropdown.vue";

// --- Pinia store & route
const store = useProductStore();
const route = useRoute();

// --- Drawer controls
const isOpen = ref(false);
const toggleDrawer = () => (isOpen.value = !isOpen.value);
const closeDrawer = () => (isOpen.value = false);

// --- Pagination
const currentPage = ref(1);
const perPage = 30;
const isLoadingMore = ref(false);
const hasMore = ref(true);
const totalProductsCount = ref(0);

const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  
// --- Filters & sorting
const selectedCategories = ref([]);
const selectedTags = ref([]);
const selectedSizes = ref([]);
const selectedSort = ref("default");

const sortOptions = [
  { label: "Price: Low to High", value: "lowtohigh" },
  { label: "Price: High to Low", value: "hightolow" },
  { label: "Newest", value: "latest" },
  { label: "Trending", value: "trending" },
  { label: "Rating", value: "rating" },
];

// --- Products
const allProducts = ref([]);
const filteredProducts = ref([]);

// --- Category from route
const categoryIdFromRoute = computed(() => {
  const subCategoryParam = route.params.child || "";
  const match = subCategoryParam?.match(/(\d+)$/);
  return match ? Number(match[1]) : Number(route.params.parent);
});

// --- Helpers
const isSize = (val) =>
  /^[0-9]+$|^(XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)$/i.test(val?.toString().trim());
const normalizeSize = (s) =>
  s?.toString().trim().toUpperCase().replace(/\s+/g, "") || "";

// --- Persist filters
const storageKey = computed(() => `collectionFilters_${categoryIdFromRoute.value}`);
const persistFilters = () =>
  localStorage.setItem(
    storageKey.value,
    JSON.stringify({
      categories: selectedCategories.value,
      tags: selectedTags.value,
      sizes: selectedSizes.value,
      sort: selectedSort.value,
    })
  );
const restoreFilters = () => {
  const saved = localStorage.getItem(storageKey.value);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      selectedCategories.value = parsed.categories || [];
      selectedTags.value = parsed.tags || [];
      selectedSizes.value = parsed.sizes || [];
      selectedSort.value = parsed.sort || "default";
    } catch {}
  }
};

// --- Fetch from Pinia store
const fetchProductsFromStore = async (page = 1) => {
  const catId = categoryIdFromRoute.value;
  if (!catId) return;

  await store.fetchProducts({
    categoryId: catId,
    page,
    perPage,
    append: page > 1,
  });

  const list = store.productLists[catId];
  if (!list) return;

  if (page === 1) {
    allProducts.value = [...(list.products || [])];
  } else {
    // prevent duplicates
    const newProducts = (list.products || []).filter(
      (p) => !allProducts.value.some((ap) => ap.id === p.id)
    );
    allProducts.value.push(...newProducts);
  }

  totalProductsCount.value = list.total || 0;
  hasMore.value = allProducts.value.length < totalProductsCount.value;
};

// --- Infinite Scroll
const sentinel = ref(null);
let observer;

const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return;
  isLoadingMore.value = true;
  currentPage.value++;
  await fetchProductsFromStore(currentPage.value);
  await computeFilteredProducts();
  isLoadingMore.value = false;
};

const initObserver = async () => {
  await nextTick();
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) loadMore();
    },
    { threshold: 1 }
  );
  if (sentinel.value) observer.observe(sentinel.value);
};

onMounted(initObserver);
onBeforeUnmount(() => observer && observer.disconnect());

// --- Compute filtered products
const computeFilteredProducts = async () => {
  const catId = categoryIdFromRoute.value;
  if (!catId) return;

  const allProds = allProducts.value.map((p) => ({
    ...p,
    imageUrl: p.images?.[0]?.img || "",
    hoverImageUrl: p.images?.[1]?.img || p.images?.[0]?.img || "",
    displayPrice: Number(p.displayPrice ?? p.price ?? 0),
    displayDiscount: Number(p.displayDiscount ?? 0),
    avgRating: Number(p.avgRating ?? p.rawData?.avg_rating ?? 0),
    tags: p.tags || [],
    sizes: (p.sizes || []).map(normalizeSize),
  }));

  // no filters selected
  if (
    !selectedCategories.value.length &&
    !selectedTags.value.length &&
    !selectedSizes.value.length
  ) {
    filteredProducts.value = allProds;
    persistFilters();
    return;
  }

  try {
    const filters = [`categories:=${catId}`, `active:=1`];
    const tags = [...selectedCategories.value, ...selectedTags.value].filter(
      (v) => !isSize(v)
    );
    const sizes = [...selectedSizes.value].filter(isSize).map(normalizeSize);

    if (tags.length)
      filters.push(`tags:=[${tags.map((t) => `"${t}"`).join(",")}]`);
    if (sizes.length)
      filters.push(
        `product_size_array:=[${sizes.map((s) => `"${s}"`).join(",")}]`
      );

    const url = `https://api.streetstylestore.com/collections/products/documents/search?q=*&sort_by=date_updated_unix:desc&per_page=${perPage}&page=1${filters
      .map((f) => `&filter_by=${f}`)
      .join("")}&x-typesense-api-key=VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh`;

    const res = await fetch(url);
    const data = await res.json();

    const apiIds = data.hits?.map((h) => h.document.id) || [];
    filteredProducts.value = apiIds.length
      ? allProds.filter((p) => apiIds.includes(p.id))
      : allProds;

    totalProductsCount.value = data.found || totalProductsCount.value;
  } catch {
    filteredProducts.value = allProds;
  }

  persistFilters();
};

// --- Sort
const sortedProducts = computed(() => {
  const arr = [...filteredProducts.value];
  switch (selectedSort.value) {
    case "lowtohigh":
      return arr.sort((a, b) => a.displayPrice - b.displayPrice);
    case "hightolow":
      return arr.sort((a, b) => b.displayPrice - a.displayPrice);
    case "latest":
      return arr.sort(
        (a, b) => (b.date_added_unix || 0) - (a.date_added_unix || 0)
      );
    case "rating":
      return arr.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    case "trending":
      return arr.sort(
        (a, b) => (b.trending_score || 0) - (a.trending_score || 0)
      );
    default:
      return arr;
  }
});

// --- Watchers
watch(
  [selectedCategories, selectedTags, selectedSizes, selectedSort],
  async () => {
    currentPage.value = 1;
    await computeFilteredProducts();
  },
  { deep: true }
);

watch(
  [() => route.params.parent, () => route.params.child],
  async () => {
    restoreFilters();
    currentPage.value = 1;
    allProducts.value = [];
    await fetchProductsFromStore();
    await computeFilteredProducts();
    await initObserver();
  }
);

// --- Mounted init
onMounted(async () => {
  restoreFilters();
  await fetchProductsFromStore();
  await computeFilteredProducts();
  await initObserver();
});

// --- Remove filter chip
const removeParentFilter = (type, value) => {
  if (type === "category")
    selectedCategories.value = selectedCategories.value.filter(
      (v) => v !== value
    );
  if (type === "tag")
    selectedTags.value = selectedTags.value.filter((v) => v !== value);
  if (type === "size")
    selectedSizes.value = selectedSizes.value.filter((v) => v !== value);
  persistFilters();
};
</script>

<style scoped>
.selected-chip {
  background: #000;
  color: #fff;
  padding: 0.35rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s ease;
}
.selected-chip:hover { background: #333; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
