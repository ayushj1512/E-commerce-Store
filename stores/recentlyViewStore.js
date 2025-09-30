import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { ofetch } from 'ofetch';

export const useRecentlyViewStore = defineStore('recentlyView', {
  state: () => ({
    recentlyViewed: [], // array of product IDs
  }),

  actions: {
    loadRecentlyViewed() {
      const cookie = useCookie('recently_viewed_ids', { default: () => [] });
      this.recentlyViewed = cookie.value || [];
      console.log('[Recently Viewed] Loaded from cookie:', this.recentlyViewed);
    },

    addProduct(productId) {
      // Remove if already exists
      const index = this.recentlyViewed.indexOf(productId);
      if (index !== -1) this.recentlyViewed.splice(index, 1);

      // Add to beginning
      this.recentlyViewed.unshift(productId);
      if (this.recentlyViewed.length > 20) this.recentlyViewed.pop();

      const cookie = useCookie('recently_viewed_ids', { sameSite: 'lax' });
      cookie.value = this.recentlyViewed;
      console.log('[Recently Viewed] Updated cookie:', this.recentlyViewed);
    },

    async getProducts() {
      if (!this.recentlyViewed.length) return [];

      try {
        // Build IDs string
        const idsString = this.recentlyViewed.join(',');

        const url = `https://api.streetstylestore.com/collections/products/documents/search?q=*&filter_by=product_id:[${idsString}]&filter_by=active:=1&sort_by=date_updated_unix:desc&per_page=100&page=1`;

        const res = await ofetch(url, {
          headers: {
            'x-typesense-api-key': 'Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx',
          },
        });

        if (!res?.hits?.length) return [];

        // Normalize each product
        const products = res.hits.map(hit => {
          const doc = hit.document;
          return {
            id: doc.id || doc.product_id,
            name: doc.name,
            selling_price: doc.selling_price || doc.real_selling_price || 0,
            images: doc.images?.length
              ? doc.images.map(img => ({
                  img: img.img,
                  bigImg: img.bigImg || img.img,
                }))
              : [{ img: doc.img, bigImg: doc.img }],
            productUrl: doc.product_url || `/product/${doc.id}`,
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
