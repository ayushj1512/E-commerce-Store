<template>
  <div class="flex flex-col items-center justify-center w-full px-4 mb-10">
    <!-- Unified Card -->
    <div
      class="w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 flex flex-col space-y-8"
    >
      <!-- Message Section -->
      <div class="flex flex-col items-center text-center space-y-4">
        <Frown
          v-if="query?.trim()"
          class="text-black w-20 h-20 animate-bounce"
        />
        <h2
          v-if="query?.trim()"
          class="text-2xl sm:text-3xl font-semibold text-gray-900"
        >
          We can’t find what you’re looking for.
        </h2>
        <p
          v-if="query?.trim()"
          class="text-gray-600 text-base sm:text-lg max-w-2xl"
        >
          But don’t worry — here are some picks we think you’ll love:
        </p>
      </div>

      <!-- Suggested Products -->
      <div v-if="suggestedProducts.length" class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 text-center">
          Recommended For You
        </h3>
        <div
          class="flex space-x-4 overflow-x-auto pb-2"
          style="scrollbar-width: thin;"
        >
          <ProductCard
            v-for="item in suggestedProducts"
            :key="item.id"
            :id="item.product_id"
            :image="item.image"
            :hoverImage="item.alternate_img"
            :title="item.name"
            :price="item.real_selling_price || item.selling_price"
            :mrp="item.real_selling_price ? item.selling_price : null"
            :productUrl="item.url"
            class="flex-shrink-0 w-44"
          />
        </div>
      </div>

      <!-- No Suggestions -->
      <div
        v-else
        class="text-gray-500 text-center bg-gray-50 rounded-xl p-6 border border-dashed border-gray-300"
      >
        No suggestions found. Try exploring categories!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Frown } from "lucide-vue-next";
import ProductCard from "@/components/common/ProductCard.vue";

const props = defineProps({
  query: { type: String, default: "" },
  recentSearches: { type: Array, default: () => [] },
  popularSearches: {
    type: Array,
    default: () => ["Maxi Dress", "Sunglasses", "Flats", "Belts"],
  },
});

const suggestedProducts = ref([]);
const perPage = 12;
const activeCategories = ref([]);

// --- Fetch active categories ---
const fetchActiveCategories = async () => {
  try {
    const res = await fetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/sss-active-categories?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    const data = await res.json();
    activeCategories.value = JSON.parse(data.data);
  } catch (err) {
    console.error("[NoResults] Error fetching active categories:", err);
  }
};

// --- Fetch suggested products ---
const fetchSuggestions = async () => {
  if (!activeCategories.value.length) return;

  try {
    let queries = [];
    if (props.recentSearches.length) {
      queries = props.recentSearches.slice(0, 3);
    } else {
      queries = props.popularSearches.slice(0, 3);
    }

    let allResults = [];

    for (const q of queries) {
      const url = `https://api.streetstylestore.com/collections/products/documents/search?q=${encodeURIComponent(
        q
      )}&filter_by=categories:=[${activeCategories.value.join(
        ","
      )}]&query_by=tags,name,product_id&filter_by=active:=1&sort_by=date_updated_unix:desc&per_page=${perPage}&x-typesense-api-key=VvSmt6K1hvlGJhtTPsxjVrq8RNm9tSXh`.replace(
        /\s+/g,
        ""
      );

      const res = await fetch(url);
      const data = await res.json();

      const mapped = data.hits.map((h) => ({
        id: h.document.id,
        product_id: h.document.product_id,
        name: h.document.name,
        selling_price: h.document.selling_price, // MRP
        real_selling_price: h.document.real_selling_price, // Discount price
        image: h.document.img || h.document.images?.[0],
        alternate_img: h.document.alternate_img,
        url: h.document.product_url,
      }));

      allResults.push(...mapped);
    }

    // Shuffle and slice to perPage
    suggestedProducts.value = allResults
      .sort(() => 0.5 - Math.random())
      .slice(0, perPage);
  } catch (err) {
    console.error("[NoResults] Error fetching suggestions:", err);
  }
};

onMounted(async () => {
  await fetchActiveCategories();
  await fetchSuggestions();
});
</script>
