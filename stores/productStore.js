import { defineStore } from "pinia";
import { ref, computed, watch, onServerPrefetch } from "vue";
import { useRoute, useCookie } from "#app";
import { ofetch } from "ofetch";
import axios from "axios";

export const useProductStore = defineStore("productStore", () => {
  const productLists = ref({});
  const filters = ref({ categories: [], sizes: [], brands: [], maxPrice: 5000 });
  const loading = ref(false);
  const error = ref(null);

  const recentSearchIds = useCookie("recentSearchIds", { default: () => [] });
  const recentProducts = ref([]);

  const trendingProducts = ref([]);
  const trendingLoading = ref(false);
  const trendingError = ref(null);

  const vouchers = ref([]);

  const API_URL = "https://api.streetstylestore.com";
  const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";
  const route = useRoute();

  const safeParseJSON = (str, fallback = {}) => { try { return JSON.parse(str); } catch { return fallback; } };
  const slugify = str => str?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  // ------------------------------
  // Fetch Vouchers
  // ------------------------------
  const fetchVouchers = async () => {
    try {
      const res = await axios.get(
        "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
      );
      const data = JSON.parse(res.data.data || "[]");
      vouchers.value = data.map(v => ({
        code: v.code || v.id_cart_rule,
        id_cart_rule: v.id_cart_rule,
        categoryId: Number(v.id_category),
        discount: parseFloat(v.discount_per_item || 0),
        minQty: parseInt(v.quantity || 1),
        category_name: v.category_name,
        link: v.link,
      }));
    } catch (err) {
      console.error("Failed to fetch vouchers:", err);
      vouchers.value = [];
    }
  };

  // ------------------------------
  // Recent Products
  // ------------------------------
  const addToRecentProducts = id => {
    const idx = recentSearchIds.value.indexOf(id);
    if (idx !== -1) recentSearchIds.value.splice(idx, 1);
    recentSearchIds.value.unshift(id);
    if (recentSearchIds.value.length > 48) recentSearchIds.value = recentSearchIds.value.slice(0, 48);
  };

  const fetchRecentProducts = async () => {
    if (!recentSearchIds.value.length) { recentProducts.value = []; return; }
    loading.value = true;
    try {
      const fetched = await Promise.all(
        recentSearchIds.value.map(async id => {
          try {
            const res = await ofetch(`${API_URL}/collections/products/documents/${id}`, { headers: { "x-typesense-api-key": API_KEY } });
            const doc = res.document ?? res;
            const parsed = doc.product_data ? safeParseJSON(doc.product_data) : {};

            const displayCategories = parsed["0"]?.categories?.split("^").map(c => c.split("*")[0]) || doc.categories?.map(String) || [];
            const matchedVoucher = vouchers.value.find(v => displayCategories.includes(String(v.categoryId)));

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
              voucherName: matchedVoucher?.category_name || null
            };
          } catch { return null; }
        })
      );
      recentProducts.value = fetched.filter(Boolean);
    } finally { loading.value = false; }
  };

  // ------------------------------
  // Trending Products
  // ------------------------------
  const fetchTrendingProducts = async () => {
    trendingLoading.value = true;
    trendingError.value = null;
    try {
      const res = await ofetch(`${API_URL}/collections/products/documents/search?q=*&filter_by=active:=1&sort_by=date_updated_unix:desc&sort_by=avg_rating:desc&per_page=12&page=1`, {
        headers: { "x-typesense-api-key": API_KEY }
      });
      trendingProducts.value = (res.hits?.map(hit => {
        const doc = hit.document ?? hit;
        const parsed = doc.product_data ? safeParseJSON(doc.product_data) : {};
        const first = parsed["0"] || {};

        const displayCategories = first.categories ? first.categories.split("^").map(c => c.split("*")[0]) : doc.categories?.map(String) || [];
        const matchedVoucher = vouchers.value.find(v => displayCategories.includes(String(v.categoryId)));

        return {
          id: doc.id,
          name: doc.name || first.name || "",
          img: doc.img,
          price: Number(doc.real_selling_price) || Number(first.selling_price) || 0,
          mrp: Number(doc.selling_price) || Number(first.mrp) || 0,
          tags: doc.tags || [],
          product_url: doc.product_url,
          voucherName: matchedVoucher?.category_name || null
        };
      })) || [];
    } catch (err) { trendingError.value = err?.message; }
    finally { trendingLoading.value = false; }
  };

  // ------------------------------
  // Fetch Products by Category
  // ------------------------------
 const fetchProducts = async (options = {}) => {
  loading.value = true;
  error.value = null;

  try {
    const {
      categoryId,
      perPage = 250, // fetch max per request
      city,
      idBrand,
      shop,
      type,
      tags = [],
      maxPrice
    } = options;

    const childParam = route?.params?.child || "";
    const parentParam = route?.params?.parent || "";
    let resolvedCatId = categoryId;

    if (!resolvedCatId) {
      const match = (childParam !== "all" ? childParam : parentParam).match(/(\d+)$/);
      resolvedCatId = match ? match[1] : "default";
    }

    // 🔹 Start filter params with active:=1 always
    const filterParams = ["active:=1"];
    if (resolvedCatId && !isNaN(Number(resolvedCatId))) filterParams.push(`categories:=${resolvedCatId}`);
    if (city) filterParams.push(`deal_cities:=[${city}]`);
    if (idBrand) filterParams.push(`id_brand:=${idBrand}`);
    if (shop) filterParams.push(`sss_shops:=[${shop}]`);
    if (type) filterParams.push(`product_type:=${type}`);
    if (tags.length) filterParams.push(`tags:=[${tags.join(",")}]`);

    let allProducts = [];
    let page = 1;
    let totalFetched = 0;
    let totalFound = 0;

    do {
      const url = `${API_URL}/collections/products/documents/search?q=*&${filterParams
        .map(f => `filter_by=${encodeURIComponent(f)}`)
        .join("&")}&per_page=${perPage}&page=${page}`;

      const res = await ofetch(url, { headers: { "x-typesense-api-key": API_KEY } });
      totalFound = res.found || 0;

      const data = Array.isArray(res.hits)
        ? res.hits
            .map(hit => {
              const doc = hit.document ?? hit;
              const parsed = doc.product_data ? safeParseJSON(doc.product_data) : {};
              const first = parsed["0"] || {};
              const price =
                Number(first.selling_price) ||
                Number(doc.real_selling_price) ||
                Number(doc.selling_price) ||
                0;

              if (maxPrice != null && price > maxPrice) return null;

              const displayCategories =
                first.categories
                  ? first.categories.split("^").map(c => c.split("*")[0])
                  : doc.categories?.map(String) || [];

              const matchedVoucher = vouchers.value.find(v =>
                displayCategories.includes(String(v.categoryId))
              );

              return {
                id: String(doc.product_id || first.id || doc.id),
                displayName: first.name || doc.name || "",
                displayPrice: price,
                displayDiscount: Number(first.discount_price) || Number(doc.discount_price) || 0,
                sizes:
                  (parsed.shoeSize || []).map(s => s.Size).filter(Boolean) ||
                  (doc.product_all_sizes || []).filter(Boolean) ||
                  ["N/A"],
                brand: doc.brand || first.brand || "",
                displayCategories,
                tags: doc.tags || [],
                slug: slugify(doc.name || first.name || doc.id),
                images: parsed.images || [{ img: doc.img }],
                quantity_available: first.product_quantity || doc.quantity_available || 0,
                rawData: doc,
                voucherName: matchedVoucher?.category_name || null
              };
            })
            .filter(Boolean)
        : [];

      allProducts.push(...data);
      totalFetched += data.length;
      page++;
    } while (totalFetched < totalFound);

    if (!productLists.value[resolvedCatId])
      productLists.value[resolvedCatId] = { products: [], currentPage: 1, total: 0 };

    productLists.value[resolvedCatId].products = allProducts;
    productLists.value[resolvedCatId].currentPage = page - 1;
    productLists.value[resolvedCatId].total = totalFound;

    generateFilters();
  } catch (err) {
    error.value = err?.message || "Failed to fetch products";
  } finally {
    loading.value = false;
  }
};



  const generateFilters = () => {
    const allCategories = new Set(), allSizes = new Set(), allBrands = new Set();
    let maxPrice = 0;
    Object.values(productLists.value).forEach(cat => {
      cat.products.forEach(p => {
        p.displayCategories?.forEach(c => allCategories.add(c));
        p.sizes?.forEach(s => allSizes.add(s));
        if (p.brand) allBrands.add(p.brand);
        if (p.displayPrice > maxPrice) maxPrice = p.displayPrice;
      });
    });
    filters.value.categories = Array.from(allCategories);
    filters.value.sizes = Array.from(allSizes);
    filters.value.brands = Array.from(allBrands);
    filters.value.maxPrice = maxPrice || 5000;
  };

  // ------------------------------
  // SSR Prefetch
  // ------------------------------
  onServerPrefetch(async () => {
    await fetchVouchers();
    await fetchTrendingProducts();
    await fetchRecentProducts();
  });

  // Client-only route watch
  if (process.client) {
    watch(() => [route.params.parent, route.params.child], () => fetchProducts());
  }

  const getProductsByCategory = id => productLists.value[id]?.products || [];
  const getCurrentPage = id => productLists.value[id]?.currentPage || 1;
  const getTotalProducts = id => productLists.value[id]?.total || 0;
  const availableTags = computed(() => {
    const tags = new Set();
    Object.values(productLists.value).forEach(cat => cat.products.forEach(p => p.tags?.forEach(t => tags.add(t))));
    return Array.from(tags);
  });

  return {
    productLists, filters, loading, error,
    recentSearchIds, recentProducts,
    trendingProducts, trendingLoading, trendingError,
    fetchProducts, fetchFilters: generateFilters,
    fetchRecentProducts, fetchTrendingProducts,
    getProductsByCategory, getCurrentPage, getTotalProducts, availableTags,
    addToRecentProducts, vouchers, fetchVouchers
  };
});
