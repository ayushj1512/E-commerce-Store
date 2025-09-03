<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Filters Sidebar -->
      <div class="w-full md:w-1/5 flex-shrink-0">
        <FilterSidebar
          :categories="categories"
          :selectedCategories="selectedCategories"
          :priceRange="priceRange"
          @applyPrice="applyPriceFilter"
          @clear="clearFilters"
        />
      </div>

      <!-- Products Section -->
      <div class="w-full md:w-4/5">
        <!-- Tags + Quick Filters Row -->
        <div class="flex flex-wrap gap-2 mb-4 overflow-x-auto">
          <!-- Tags Filter -->
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'px-3 py-1 rounded-full border text-sm whitespace-nowrap flex-shrink-0 transform transition-all duration-300',
              selectedTags.includes(tag)
                ? 'bg-black text-white border-black scale-105 shadow-md'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:scale-105'
            ]"
          >
            {{ tag }}
          </button>

          <!-- Quick Filter Buttons -->
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="applySort(option)"
            :class="[
              'px-3 py-1 rounded-full border text-sm whitespace-nowrap flex-shrink-0 transform transition-all duration-300',
              selectedSort.value === option.value
                ? 'bg-black text-white border-black scale-105 shadow-md'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:scale-105'
            ]"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- Products Grid -->
        <transition-group
          name="fade-slide"
          tag="div"
          class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :title="product.name"
            :image="product.image"
            :hoverImage="product.hoverImage"
            :tags="product.tags"
            :price="product.price"
            :mrp="product.mrp"
            :showCartBtn="true"
            :slug="product.slug"
            :parent="product.parent"
            @click="goToProduct(product)"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "#app";
import ProductCard from "@/components/common/ProductCard.vue";
import FilterSidebar from "@/components/collection/FilterSidebar.vue";

const router = useRouter();

const products = ref([
  { id: 1, name: "Classic White Shirt", slug: "classic-white-shirt", parent: "shirts", category: "Shirts", price: 1200, mrp: 1500, image: "https://i.pinimg.com/736x/32/a0/94/32a0944320c93cbf7d47d69f606925dd.jpg", hoverImage: null, tags: ["New","Best Seller"] },
  { id: 2, name: "Black Denim Jeans", slug: "black-denim-jeans", parent: "jeans", category: "Jeans", price: 2200, mrp: 2500, image: "https://i.pinimg.com/736x/31/84/8c/31848cdd1e8a118cfc206b107139d244.jpg", hoverImage: null, tags: ["Trending"] },
  { id: 3, name: "Red T-Shirt", slug: "red-t-shirt", parent: "t-shirts", category: "T-Shirts", price: 800, mrp: 1000, image: "https://i.pinimg.com/736x/a5/d7/11/a5d71185a01f926838790a5b254531cb.jpg", hoverImage: null, tags: ["Sale"] },
]);

const categories = ref(["Shirts","Jeans","T-Shirts"]);
const selectedCategories = ref([]);
const priceRange = ref({ min: null, max: null });
const selectedTags = ref([]);
const selectedSort = ref("price_asc");

const sortOptions = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

const availableTags = computed(() => {
  const tags = new Set();
  products.value.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags);
});

const toggleTag = (tag) => {
  selectedTags.value.includes(tag)
    ? selectedTags.value = selectedTags.value.filter(t => t !== tag)
    : selectedTags.value.push(tag);
};

const filteredProducts = computed(() => {
  return products.value
    .filter(p => {
      const inCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category);
      const inPrice = (!priceRange.value.min || p.price >= priceRange.value.min) && (!priceRange.value.max || p.price <= priceRange.value.max);
      const inTags = selectedTags.value.length === 0 || p.tags.some(t => selectedTags.value.includes(t));
      return inCategory && inPrice && inTags;
    })
    .sort((a,b) => {
      if(selectedSort.value === "price_asc") return a.price - b.price;
      if(selectedSort.value === "price_desc") return b.price - a.price;
      return b.id - a.id;
    });
});

const applyPriceFilter = () => {};
const clearFilters = () => {
  selectedCategories.value = [];
  priceRange.value = { min: null, max: null };
  selectedTags.value = [];
};
const applySort = (option) => { selectedSort.value = option.value; };

const goToProduct = (product) => {
  router.push(`/${product.parent}/${product.slug}`);
};
</script>

<style>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }
.fade-slide-enter-to, .fade-slide-leave-from { opacity: 1; transform: translateY(0); }

button { transition: all 0.3s ease; }
</style>
