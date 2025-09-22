<template>
    <div v-if="products.length > 0" class="space-y-6">
        <!-- Heading -->
        <div class="w-full bg-black py-4 rounded-lg shadow-md">
            <h2 class="text-white text-center text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
                YOUR RECENT PICK AWAITS
            </h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-gray-500 text-center py-10">Loading...</div>

        <!-- Products Row -->
        <div v-else class="flex gap-5 overflow-x-auto px-1 hide-scrollbar py-2">
            <div v-for="(p, index) in displayedProducts" :key="index"
                class="flex-shrink-0 w-48 md:w-52 bg-white shadow-md rounded-xl p-3 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition transform relative"
                @click="p.viewAll ? goToViewAll() : goToProduct(p.productUrl)">
                <div class="w-full h-44 md:h-48 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img v-if="!p.viewAll" :src="p.images[0]?.bigImg || p.images[0]?.img || ''" alt="Product"
                        class="w-full h-full object-contain" loading="lazy" />
                    <div v-else
                        class="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg font-semibold text-gray-700 text-center text-base md:text-lg">
                        View All
                    </div>
                </div>
                <p v-if="!p.viewAll" class="text-sm md:text-base font-medium mt-3 truncate text-center">
                    {{ p.name }}
                </p>
                <p v-if="!p.viewAll" class="text-sm md:text-base font-semibold mt-1 text-center">
                    ₹{{ p.selling_price }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCookie } from "#app";
import { ofetch } from "ofetch";

const recentIds = useCookie("recentProducts", { default: () => [] });
const products = ref([]);
const loading = ref(true);

const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";
const API_URL = "https://api.streetstylestore.com";

// Fetch recently viewed products
const fetchRecentlyViewed = async () => {
    if (!recentIds.value.length) {
        products.value = [];
        loading.value = false;
        return;
    }

    loading.value = true;
    try {
        const fetched = await Promise.all(
            recentIds.value.map(async (id) => {
                const res = await ofetch(`${API_URL}/collections/products/documents/${id}`, {
                    headers: { "x-typesense-api-key": API_KEY },
                });
                const doc = res.document ?? res;
                const parsed = doc.product_data ? JSON.parse(doc.product_data) : {};
                const firstData = parsed["0"] || {};

                return {
                    ...doc,
                    id: doc.id,
                    name: doc.name || firstData.name || "",
                    selling_price: doc.real_selling_price ?? doc.selling_price ?? firstData.selling_price ?? 0,
                    discount_price: doc.discount_price ?? firstData.discount_price ?? 0,
                    images: parsed.images || [{ bigImg: doc.img }],
                    product_size_array: doc.product_size_array || firstData.product_size_array || [],
                    tags: doc.tags || [],
                    productUrl: `/category/subcategory/product/${doc.id}`,
                };
            })
        );

        products.value = fetched;
    } catch (err) {
        console.error("❌ Error fetching recently viewed products:", err);
    } finally {
        loading.value = false;
    }
};

// Navigate to individual product
const goToProduct = (url) => {
    window.location.href = url;
};

// Navigate to view all page
const goToViewAll = () => {
    window.location.href = "/profile/recently-viewed";
};

// Show max 8 products + last "View All" card
const displayedProducts = computed(() => {
    const slice = products.value.slice(0, 8);
    return [...slice, { viewAll: true }];
});

onMounted(() => {
    fetchRecentlyViewed();
});
</script>

<style>
/* Hide horizontal scrollbar */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
