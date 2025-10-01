// stores/wishlist.js
import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    favoriteProducts: [], // will store product IDs
    lastAddedId: null     // track last added item for animation
  }),

  actions: {
    // Load from cookies on app start
    loadWishlist() {
      const favCookie = useCookie('wishlist_ids')
      this.favoriteProducts = favCookie.value ? favCookie.value : []
      console.log('[Wishlist] Loaded from cookie:', this.favoriteProducts)
    },

    // Toggle product in wishlist
    toggleFavorite(productId) {
      const index = this.favoriteProducts.indexOf(productId)

      if (index === -1) {
        // ✅ Add product
        this.favoriteProducts.push(productId)
        this.lastAddedId = productId // mark for animation
        console.log(`[Wishlist] Added product ID: ${productId}`)
      } else {
        // ❌ Remove product
        this.favoriteProducts.splice(index, 1)
        console.log(`[Wishlist] Removed product ID: ${productId}`)
      }

      // Save back to cookies
      const favCookie = useCookie('wishlist_ids', { sameSite: 'lax' })
      favCookie.value = this.favoriteProducts
      console.log('[Wishlist] Saved to cookie:', this.favoriteProducts)
    },

    // Reset last added (after animation is consumed in UI)
    clearLastAdded() {
      this.lastAddedId = null
    },

    // Check if a product is in wishlist
    isFavorite(productId) {
      return this.favoriteProducts.includes(productId)
    },

    // Return IDs as string (for API calls)
    getFavoritesString() {
      const ids = this.favoriteProducts.join(',')
      console.log('[Wishlist] Favorites string for API:', ids)
      return ids
    }
  }
})
