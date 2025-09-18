// stores/wishlist.js
import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    favoriteProducts: [] // will store product IDs
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
        this.favoriteProducts.push(productId)
        console.log(`[Wishlist] Added product ID: ${productId}`)
      } else {
        this.favoriteProducts.splice(index, 1)
        console.log(`[Wishlist] Removed product ID: ${productId}`)
      }

      // Save back to cookies
      const favCookie = useCookie('wishlist_ids', { sameSite: 'lax' })
      favCookie.value = this.favoriteProducts
      console.log('[Wishlist] Saved to cookie:', this.favoriteProducts)
    },

    // Check if a product is in wishlist
    isFavorite(productId) {
      const exists = this.favoriteProducts.includes(productId)
      console.log(`[Wishlist] Check product ID ${productId}:`, exists)
      return exists
    },

    // Return IDs as string (for API calls)
    getFavoritesString() {
      const ids = this.favoriteProducts.join(',')
      console.log('[Wishlist] Favorites string for API:', ids)
      return ids
    }
  }
})
