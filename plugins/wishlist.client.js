// plugins/wishlist.client.js
import { useWishlistStore } from '../stores/wishlist'

export default defineNuxtPlugin(() => {
  const wishlist = useWishlistStore()
  wishlist.loadWishlist()
})
