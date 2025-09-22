import { defineStore } from "pinia";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "#app";
import { ofetch } from "ofetch";
import { useCookie } from "#app"; // Nuxt 4 built-in

export const useProductStore = defineStore("productStore", () => {
  // State
  const productLists = ref({}); // { [categoryId]: { products: [], currentPage: 1, total: 0 } }
  const filters = ref({
    categories: [],
    sizes: [],
    brands: [],
    maxPrice: 5000,
  });
  const loading = ref(false);
  const error = ref(null);

  // Recent searched product IDs
  const recentSearchIds = useCookie("recentSearchIds", { default: () => [] });
  const recentProducts = ref([]); // Stores actual product objects

  const API_URL = "https://api.streetstylestore.com";
  const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

  const route = useRoute();

  // Utilities
  const safeParseJSON = (str, fallback = {}) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  const slugify = (str) =>
    str?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  // Add recently searched product
// Function to add a product ID to recentSearchIds cookie without any limit
function addToRecentProducts(productId) {
  if (!recentSearchIds.value.includes(productId)) {
    recentSearchIds.value.push(productId);
    console.log("✅ Added product ID to recentSearchIds:", productId);
  } else {
    console.log("ℹ️ Product ID already exists in recentSearchIds:", productId);
  }

  console.log("📌 Current recentSearchIds cookie:", recentSearchIds.value);
}

// Fetch recent products
const fetchRecentProducts = async () => {
  if (recentSearchIds.value.length === 0) {
    recentProducts.value = [];
    return;
  }

  try {
    loading.value = true;
    const fetched = await Promise.all(
      recentSearchIds.value.map(async (id) => {
        const res = await ofetch(`${API_URL}/collections/products/documents/${id}`, {
          headers: { "x-typesense-api-key": API_KEY },
        });
        const doc = res.document ?? res;
        const parsed = doc.product_data ? safeParseJSON(doc.product_data, {}) : {};

        return {
          ...doc,
          id: doc.id,
          name: doc.name || parsed["0"]?.name || "",
          selling_price: doc.real_selling_price ?? doc.selling_price ?? parsed["0"]?.selling_price ?? 0,
          discount_price: doc.discount_price ?? parsed["0"]?.discount_price ?? 0,
          images: parsed.images || [{ img: doc.img }],
          product_size_array: doc.product_size_array || parsed["0"]?.product_size_array || [],
          tags: doc.tags || [],
          productUrl: `/category/subcategory/product/${doc.id}`,
        };
      })
    );

    recentProducts.value = fetched;
    console.log("📦 Recently Viewed Products:", recentProducts.value);
  } catch (err) {
    console.error("❌ Error fetching recently viewed products:", err);
  } finally {
    loading.value = false;
  }
};


  // Fetch products by category
  const fetchProducts = async (options = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const { categoryId, page = 1, perPage = 30, city, idBrand, shop, type } = options;

      const childParam = route?.params?.child || "";
      const parentParam = route?.params?.parent || "";

      let resolvedCatId = categoryId;
      if (!resolvedCatId) {
        const match = (childParam !== "all" ? childParam : parentParam).match(/(\d+)$/);
        resolvedCatId = match ? match[1] : "default";
      }

      const filterParts = [];
      if (resolvedCatId && !isNaN(Number(resolvedCatId))) filterParts.push(`categories:=${resolvedCatId}`);
      if (city) filterParts.push(`deal_cities:=[${city}]`);
      if (idBrand) filterParts.push(`id_brand:=${idBrand}`);
      if (shop) filterParts.push(`sss_shops:=[${shop}]`);
      if (type) filterParts.push(`product_type:=${type}`);

      const filterStr = filterParts.join(",");
      const safeFilterStr = encodeURIComponent(filterStr);

      const url = `${API_URL}/collections/products/documents/search?q=*${
        filterParts.length ? "&filter_by=" + safeFilterStr : ""
      }&per_page=${perPage}&filter_by=active:=1&page=${page}`;

      console.log("📦 Fetching products from URL:", url);

      const res = await ofetch(url, {
        method: "GET",
        headers: { "x-typesense-api-key": API_KEY },
        retry: 1,
      });

      const data = Array.isArray(res.hits)
        ? res.hits.map((hit) => {
            const doc = hit.document ?? hit;
            const parsedData = doc.product_data ? safeParseJSON(doc.product_data, {}) : {};
            const firstData = parsedData["0"] || {};

            const sizes =
              (parsedData.shoeSize || []).map((s) => s.Size).filter(Boolean) ||
              (doc.product_all_sizes || []).filter(Boolean) ||
              ["N/A"];

            const categories = firstData.categories
              ? firstData.categories.split("^").map((c) => c.split("*")[0])
              : doc.categories?.map((c) => c.toString()) || [];

            const brand = doc.brand || firstData.brand || "";

            const resolvedId =
              doc.product_id || firstData.id || doc.id || `product-${Math.random().toString(36).substring(2, 9)}`;

            const productSlug = slugify(doc.name || firstData.name || resolvedId);

            return {
              id: String(resolvedId),
              displayName: firstData.name || doc.name || "",
              displayPrice:
                Number(firstData.selling_price) ||
                Number(doc.real_selling_price) ||
                Number(doc.selling_price) ||
                0,
              displayDiscount:
                Number(firstData.discount_price) ||
                Number(doc.discount_price) ||
                0,
              sizes,
              brand,
              displayCategories: categories,
              tags: doc.tags || [],
              slug: productSlug,
              images: parsedData.images || [{ img: doc.img }],
              quantity_available: firstData.product_quantity || doc.quantity_available || 0,
              rawData: doc,
            };
          })
        : [];

      if (!productLists.value[resolvedCatId]) {
        productLists.value[resolvedCatId] = { products: [], currentPage: 1, total: 0 };
      }

      productLists.value[resolvedCatId].products =
        page === 1 ? data : [...productLists.value[resolvedCatId].products, ...data];

      productLists.value[resolvedCatId].currentPage = page;
      productLists.value[resolvedCatId].total = res.found || data.length;

      generateFilters();
    } catch (err) {
      console.error("❌ Fetch error:", err);
      error.value = err?.message || "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };

  // Generate filters dynamically
  const generateFilters = () => {
    const allCategories = new Set();
    const allSizes = new Set();
    const allBrands = new Set();
    let maxPrice = 0;

    Object.values(productLists.value).forEach((cat) => {
      cat.products.forEach((p) => {
        p.displayCategories?.forEach((c) => allCategories.add(c));
        p.sizes?.forEach((s) => allSizes.add(s));
        if (p.brand) allBrands.add(p.brand);
        if (p.displayPrice > maxPrice) maxPrice = p.displayPrice;
      });
    });

    filters.value.categories = Array.from(allCategories);
    filters.value.sizes = Array.from(allSizes);
    filters.value.brands = Array.from(allBrands);
    filters.value.maxPrice = maxPrice || 5000;
  };

  // Fetch filters independently
  const fetchFilters = async () => {
    if (Object.keys(productLists.value).length === 0) {
      await fetchProducts({ page: 1, perPage: 100 });
    } else {
      generateFilters();
    }
  };

  // Getters
  const getProductsByCategory = (categoryId) => productLists.value[categoryId]?.products || [];
  const getCurrentPage = (categoryId) => productLists.value[categoryId]?.currentPage || 1;
  const getTotalProducts = (categoryId) => productLists.value[categoryId]?.total || 0;

  const availableTags = computed(() => {
    const tags = new Set();
    Object.values(productLists.value).forEach((cat) => {
      cat.products.forEach((prod) => prod?.tags?.forEach((t) => tags.add(t)));
    });
    return Array.from(tags);
  });

  // Auto-fetch products
  onMounted(() => fetchProducts());
  watch(
    () => [route.params.parent, route.params.child],
    () => fetchProducts()
  );

  return {
    productLists,
    filters,
    loading,
    error,
    recentSearchIds,
    recentProducts,
    fetchProducts,
    fetchFilters,
    fetchRecentProducts,
    getProductsByCategory,
    getCurrentPage,
    getTotalProducts,
    availableTags,
  };
});
