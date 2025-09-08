import { defineStore } from "pinia";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "#app";
import { ofetch } from "ofetch";

export const useProductStore = defineStore("productStore", () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const API_URL = "https://api.streetstylestore.com";
  const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

  const route = useRoute();

  // ✅ Utility to safely parse JSON
  const safeParseJSON = (str, fallback = {}) => {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  };

  const fetchProducts = async (options = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const {
        categoryId,
        page = 1,
        perPage = 30,
        city,
        idBrand,
        shop,
        type,
      } = options;

      // ✅ Resolve category ID from route params if not provided
      const childParam = route?.params?.child || "";
      const parentParam = route?.params?.parent || "";

      let resolvedCatId = categoryId;
      if (!resolvedCatId) {
        const match = (childParam !== "all" ? childParam : parentParam).match(
          /(\d+)$/
        );
        resolvedCatId = match ? match[1] : null;
      }

      // ✅ Build filter string
      const filterParts = [];
      if (resolvedCatId && !isNaN(Number(resolvedCatId)))
        filterParts.push(`categories:=${resolvedCatId}`);
      if (city) filterParts.push(`deal_cities:=[${city}]`);
      if (idBrand) filterParts.push(`id_brand:=${idBrand}`);
      if (shop) filterParts.push(`sss_shops:=[${shop}]`);
      if (type) filterParts.push(`product_type:=${type}`);

      const filterStr = filterParts.join(",");
      const safeFilterStr = encodeURIComponent(filterStr);

      const url = `${API_URL}/collections/products/documents/search?q=*&${
        filterParts.length ? "filter_by=" + safeFilterStr + "&" : ""
      }per_page=${perPage}&filter_by=active:=1&page=${page}`;

      console.log("📦 Fetching products from URL:", url);

      const res = await ofetch(url, {
        method: "GET",
        headers: { "x-typesense-api-key": API_KEY },
        retry: 1,
      });

      // ✅ Normalize products
      const data = Array.isArray(res.hits)
        ? res.hits.map((hit) => {
            const doc = hit.document ?? hit;
            const parsedData = doc.product_data
              ? safeParseJSON(doc.product_data, {})
              : {};

            // Product 0 (first variant) data
            const firstData = parsedData["0"] || {};

            // ✅ Build category array
            const categories = firstData.categories
              ? firstData.categories.split("^")
              : doc.categories?.map((c) => c.toString()) || [];

            // ✅ Build slug (for clean URLs)
            const slugify = (str) =>
              str
                ?.toString()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            const productSlug = slugify(
              doc.name || firstData.name || `product-${doc.id}`
            );

            return {
              ...doc,
              parsedData,
              displayName: doc.name || firstData.name || "",
              displayPrice:
                Number(doc.real_selling_price) ||
                Number(doc.selling_price) ||
                Number(firstData.selling_price) ||
                0,
              displayDiscount:
                Number(doc.discount_price) ||
                Number(firstData.discount_price) ||
                0,
              displayCategories: categories,
              tags: doc.tags || [],
              slug: productSlug, // ✅ for /category/.../slug/id route
            };
          })
        : [];

      products.value = page === 1 ? data : [...products.value, ...data];
    } catch (err) {
      console.error("❌ Fetch error:", err);
      error.value = err?.message || "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };

  // ✅ Extract all tags from loaded products
  const availableTags = computed(() => {
    const tags = new Set();
    products.value.forEach((prod) => {
      if (prod?.tags) {
        prod.tags.forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags);
  });

  // ✅ Auto-fetch on mount & when category route changes
  onMounted(() => fetchProducts());
  watch(
    () => [route.params.parent, route.params.child],
    () => fetchProducts()
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    availableTags,
  };
});
