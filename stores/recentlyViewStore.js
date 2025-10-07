import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCookie } from '#app';
import { ofetch } from 'ofetch';

export const useRecentlyViewStore = defineStore('recentlyView', () => {
  const recentlyViewed = ref([]); // product IDs
  const products = ref([]); // full product details
  const loading = ref(false);

  const cookie = useCookie('recently_viewed_ids', { default: () => [] });

  // Load IDs from cookie (client-side)
  const loadRecentlyViewed = () => {
    if (process.client) {
      recentlyViewed.value = Array.isArray(cookie.value) ? cookie.value : [];
    }
  };

  // Add product to recently viewed
  const addProduct = (productId) => {
    if (!productId || !process.client) return;

    const index = recentlyViewed.value.indexOf(productId);
    if (index !== -1) recentlyViewed.value.splice(index, 1);
    recentlyViewed.value.unshift(productId);
    if (recentlyViewed.value.length > 20) recentlyViewed.value = recentlyViewed.value.slice(0, 20);
    cookie.value = recentlyViewed.value;
  };

  // Fetch products (client-only)
  const fetchProducts = async () => {
    if (!process.client || !recentlyViewed.value.length) {
      products.value = [];
      return;
    }

    loading.value = true;
    try {
      const idsString = recentlyViewed.value.join(',');
      const url = `https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=product_id:=[${idsString}] && active:=1&sort_by=date_updated_unix:desc&per_page=100&page=1`;

      const res = await ofetch(url, {
        headers: {
          'x-typesense-api-key': 'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx',
        },
      });

      const newProducts = (res.hits || []).map(hit => {
        const doc = hit.document || {};
        const imgs = Array.isArray(doc.images) && doc.images.length
          ? doc.images.map(img => ({
              img: img.img || '/fallback.jpg',
              bigImg: img.bigImg || img.img || '/fallback.jpg',
            }))
          : [{ img: doc.img || '/fallback.jpg', bigImg: doc.img || '/fallback.jpg' }];

        return {
          id: doc.id || doc.product_id,
          name: doc.name?.trim() || 'Unnamed Product',
          selling_price: doc.selling_price || doc.real_selling_price || 0,
          actual_selling_price: doc.real_selling_price || doc.selling_price || 0,
          images: imgs,
          productUrl: doc.product_url || `/product/${doc.id || doc.product_id}`,
          tags: doc.tags || [],
          sizes: doc.product_size_array || doc.sizes || [],
        };
      });

      // preserve order
      const productMap = Object.fromEntries(newProducts.map(p => [p.id, p]));
      products.value = recentlyViewed.value.map(id => productMap[id]).filter(Boolean);

    } catch (err) {
      console.error('[Recently Viewed] Failed to fetch products:', err);
      products.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    recentlyViewed,
    products,
    loading,
    loadRecentlyViewed,
    addProduct,
    fetchProducts,
  };
});
