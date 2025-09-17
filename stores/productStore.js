import { defineStore } from "pinia";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "#app";
import { ofetch } from "ofetch";

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

  const API_URL = "https://api.streetstylestore.com";
  const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

  const route = useRoute();

  // Utilities
  const safeParseJSON = (str, fallback = {}) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  const slugify = (str) =>
    str?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

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

      // Initialize category if not present
      if (!productLists.value[resolvedCatId]) {
        productLists.value[resolvedCatId] = { products: [], currentPage: 1, total: 0 };
      }

      // Append or replace products
      productLists.value[resolvedCatId].products =
        page === 1 ? data : [...productLists.value[resolvedCatId].products, ...data];

      productLists.value[resolvedCatId].currentPage = page;
      productLists.value[resolvedCatId].total = res.found || data.length;

      // Update filters dynamically
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
        // Categories
        p.displayCategories?.forEach((c) => allCategories.add(c));

        // Sizes
        p.sizes?.forEach((s) => allSizes.add(s));

        // Brands
        if (p.brand) allBrands.add(p.brand);

        // Max Price
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
  const getProductsByCategory = (categoryId) => {
    return productLists.value[categoryId]?.products || [];
  };

  const getCurrentPage = (categoryId) => {
    return productLists.value[categoryId]?.currentPage || 1;
  };

  const getTotalProducts = (categoryId) => {
    return productLists.value[categoryId]?.total || 0;
  };

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
    fetchProducts,
    fetchFilters,
    getProductsByCategory,
    getCurrentPage,
    getTotalProducts,
    availableTags,
  };
});
