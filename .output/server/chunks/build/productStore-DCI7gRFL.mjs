import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { g as useRoute } from './server.mjs';
import { z as ofetch } from '../_/nitro.mjs';

const useProductStore = defineStore("productStore", () => {
  const productLists = ref({});
  const loading = ref(false);
  const error = ref(null);
  const API_URL = "https://api.streetstylestore.com";
  const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";
  const route = useRoute();
  const safeParseJSON = (str, fallback = {}) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };
  const slugify = (str) => str?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
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
      const url = `${API_URL}/collections/products/documents/search?q=*${filterParts.length ? "&filter_by=" + safeFilterStr : ""}&per_page=${perPage}&filter_by=active:=1&page=${page}`;
      console.log("📦 Fetching products from URL:", url);
      const res = await ofetch(url, {
        method: "GET",
        headers: { "x-typesense-api-key": API_KEY },
        retry: 1
      });
      const data = Array.isArray(res.hits) ? res.hits.map((hit) => {
        const doc = hit.document ?? hit;
        const parsedData = doc.product_data ? safeParseJSON(doc.product_data, {}) : {};
        const firstData = parsedData["0"] || {};
        const sizes = (parsedData.shoeSize || []).map((s) => s.Size).filter(Boolean) || (doc.product_all_sizes || []).filter(Boolean) || ["N/A"];
        const categories = firstData.categories ? firstData.categories.split("^").map((c) => c.split("*")[0]) : doc.categories?.map((c) => c.toString()) || [];
        const resolvedId = doc.product_id || firstData.id || doc.id || `product-${Math.random().toString(36).substring(2, 9)}`;
        const productSlug = slugify(doc.name || firstData.name || resolvedId);
        return {
          id: String(resolvedId),
          displayName: firstData.name || doc.name || "",
          displayPrice: Number(firstData.selling_price) || Number(doc.real_selling_price) || Number(doc.selling_price) || 0,
          displayDiscount: Number(firstData.discount_price) || Number(doc.discount_price) || 0,
          sizes,
          displayCategories: categories,
          tags: doc.tags || [],
          slug: productSlug,
          images: parsedData.images || [{ img: doc.img }],
          quantity_available: firstData.product_quantity || doc.quantity_available || 0,
          rawData: doc
        };
      }) : [];
      if (!productLists.value[resolvedCatId]) {
        productLists.value[resolvedCatId] = { products: [], currentPage: 1, total: 0 };
      }
      productLists.value[resolvedCatId].products = page === 1 ? data : [...productLists.value[resolvedCatId].products, ...data];
      productLists.value[resolvedCatId].currentPage = page;
      productLists.value[resolvedCatId].total = res.found || data.length;
    } catch (err) {
      console.error("❌ Fetch error:", err);
      error.value = err?.message || "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };
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
    const tags = /* @__PURE__ */ new Set();
    Object.values(productLists.value).forEach((cat) => {
      cat.products.forEach((prod) => prod?.tags?.forEach((t) => tags.add(t)));
    });
    return Array.from(tags);
  });
  watch(
    () => [route.params.parent, route.params.child],
    () => fetchProducts()
  );
  return {
    productLists,
    loading,
    error,
    fetchProducts,
    getProductsByCategory,
    getCurrentPage,
    getTotalProducts,
    availableTags
  };
});

export { useProductStore as u };
//# sourceMappingURL=productStore-DCI7gRFL.mjs.map
