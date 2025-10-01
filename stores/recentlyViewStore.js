import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { ofetch } from 'ofetch';

export const useRecentlyViewStore = defineStore('recentlyView', {
  state: () => ({
    recentlyViewed: [], // Array of product IDs
  }),

  actions: {
    // Load recently viewed product IDs from cookie
    loadRecentlyViewed() {
      const cookie = useCookie('recently_viewed_ids', { default: () => [] });
      this.recentlyViewed = Array.isArray(cookie.value) ? cookie.value : [];
      console.log('[Recently Viewed] Loaded from cookie:', this.recentlyViewed);
    },

    // Add a product ID to recently viewed
    addProduct(productId) {
      if (!productId) return;

      // Remove if already exists
      const index = this.recentlyViewed.indexOf(productId);
      if (index !== -1) this.recentlyViewed.splice(index, 1);

      // Add to the beginning
      this.recentlyViewed.unshift(productId);

      // Limit to 20 items
      if (this.recentlyViewed.length > 20) this.recentlyViewed.pop();

      // Update cookie
      const cookie = useCookie('recently_viewed_ids', { sameSite: 'lax' });
      cookie.value = this.recentlyViewed;

      console.log('[Recently Viewed] Updated cookie:', this.recentlyViewed);
    },

    // Fetch product details from API
    async getProducts() {
      if (!this.recentlyViewed.length) return [];

      try {
        const idsString = this.recentlyViewed.join(',');

        // Fixed filter_by syntax
        const url = `https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=product_id:=[${idsString}] && active:=1&sort_by=date_updated_unix:desc&per_page=100&page=1`;

        const res = await ofetch(url, {
          headers: {
            'x-typesense-api-key': 'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx',
          },
        });

        if (!res?.hits?.length) {
          console.warn('[Recently Viewed] No products found in API response.');
          return [];
        }

        // Normalize products
        const products = res.hits.map(hit => {
          const doc = hit.document || {};
          return {
            id: doc.id || doc.product_id,
            name: doc.name || 'Unnamed Product',
            actual_selling_price: doc.selling_price || doc.real_selling_price || 0,
            selling_price: doc.selling_price || doc.real_selling_price || 0,
            images: Array.isArray(doc.images) && doc.images.length
              ? doc.images.map(img => ({
                  img: img.img || '/fallback.jpg',
                  bigImg: img.bigImg || img.img || '/fallback.jpg',
                }))
              : [{ img: doc.img || '/fallback.jpg', bigImg: doc.img || '/fallback.jpg' }],
            productUrl: doc.product_url || `/product/${doc.id || doc.product_id}`,
            tags: doc.tags || [],
            sizes: doc.sizes || [],
          };
        });

        console.log('[Recently Viewed] Normalized products:', products);
        return products;
      } catch (err) {
        console.error('[Recently Viewed] Failed to fetch products:', err);
        return [];
      }
    },
  },
});
