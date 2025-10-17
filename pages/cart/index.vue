  <template>
    <div class="bg-gray-50 min-h-screen p-4 md:p-8">
      <!-- Main Layout -->
      <div class="flex flex-col gap-6">

        <!-- Empty Cart -->
        <EmptyCart v-if="!cart.items.length" class="w-full" />

        <!-- Cart Items & Summary -->
        <template v-else>
          <!-- Cart & Summary Row -->
          <div class="flex flex-col md:flex-row gap-6">

            <!-- Items -->
            <div class="w-full md:w-2/3 space-y-4">
              <transition-group name="list" tag="div" appear>
                <CartCard
                  v-for="item in sortedCartItems"
                  :key="item._key"
                  :item="item"
                  :filtered-vouchers="cart.filteredItemVouchers(item)"
                  :is-voucher-applied="cart.isVoucherApplied(item)"
                  :final-price="cart.getFinalPrice(item)"
                  @increase="increaseQty"
                  @decrease="decreaseQty"
                  @remove="confirmRemove"
                  @go-to-detail="goToDetail"
                  @go-to-voucher="goToVoucherLink"
                />
              </transition-group>

              <!-- Buy Along Products Section (📱 Mobile Only, Above Summary) -->
              <div class="my-8 md:hidden">
                <h2 class="text-xl font-bold mb-4">Customers Also Bought</h2>
                <div class="overflow-x-auto flex gap-4 pb-2">
                  <BuyAlongProducts />
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-white md:sticky md:top-20 space-y-4">
              <h2 class="text-xl font-bold mb-4">Order Summary</h2>

              <div class="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{{ cart.subtotal }}</span>
              </div>

              <div v-if="cart.discount > 0" class="flex justify-between text-green-600 font-semibold">
                <span>Discount</span>
                <span>-₹{{ cart.discount }}</span>
              </div>

              <div v-if="cart.discount > 0" class="text-green-700 font-medium text-sm">
                You saved ₹{{ cart.discount }} on this order!
              </div>

              <div class="flex justify-between font-bold text-2xl mt-6 border-t pt-4 text-gray-900">
                <span>Total Amount</span>
                <span>₹{{ cart.total }}</span>
              </div>

              <button
                @click="checkout"
                class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 font-semibold transition-all duration-200"
              >
                Proceed to Checkout
              </button>

              <button
                @click="confirmClearCart"
                class="w-full bg-red-500 text-white py-3 rounded-xl mt-3 hover:bg-red-600 font-semibold transition-all duration-200"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <!-- Buy Along Products Section (💻 Desktop Only, Below Cart Row) -->
          <div class="my-10 hidden md:block">
            <h2 class="text-xl font-bold mb-4">Customers Also Bought</h2>
            <div class="overflow-x-auto flex gap-4 pb-2">
              <BuyAlongProducts />
            </div>
          </div>
        </template>

        <!-- Modals and Toasts remain unchanged -->
      </div>
    </div>
  </template>


  <style scoped>
  /* Horizontal scroll for Buy Along Products */
  .buy-along-products {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0,0,0,0.3) transparent;
    padding-bottom: 0.5rem;
  }

  .buy-along-products::-webkit-scrollbar {
    height: 6px;
  }

  .buy-along-products::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.3);
    border-radius: 3px;
  }

  .buy-along-products::-webkit-scrollbar-track {
    background: transparent;
  }
  </style>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/auth";
import { useWishlistStore } from "@/stores/wishlist";
import GlobalToast, { addToast } from "@/components/common/GlobalToast.vue";
import Confetti from "@/components/cart/confetti.vue";
import CartCard from "@/components/cart/CartCard.vue";
import EmptyCart from "@/components/cart/EmptyCart.vue";
import BuyAlongProducts from "@/components/cart/BuyAlongProducts.vue";

const cart = useCartStore();
const auth = useAuthStore();
const wishlist = useWishlistStore();
wishlist.loadWishlist();

const router = useRouter();
const route = useRoute();
const confettiRef = ref(null);

// Sort cart items: discounted first
const sortedCartItems = computed(() => {
  const withDiscount = cart.items.filter((i) => i.discountApplied);
  const withoutDiscount = cart.items.filter((i) => !i.discountApplied);
  return [...withDiscount, ...withoutDiscount];
});

// Quantity handlers
const increaseQty = (item) => {
  cart.updateQuantity(item, item.quantity + 1, item.size);
  addToast("success", `+ ${item.name}`);
};

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    cart.updateQuantity(item, item.quantity - 1, item.size);
    addToast("warning", `- ${item.name}`);
  }
};

// Remove modal
const showModal = ref(false);
const modalItem = ref(null);

const confirmRemove = (item) => {
  modalItem.value = item;
  showModal.value = true;
};

const removeConfirmed = () => {
  cart.removeFromCart(modalItem.value);
  addToast("error", `${modalItem.value.name} removed from cart`);
  showModal.value = false;
};

const removeAndWishlist = () => {
  cart.removeFromCart(modalItem.value);
  wishlist.toggleFavorite(modalItem.value.id);
  addToast(
    "success",
    `${modalItem.value.name} removed from cart & added to wishlist`
  );
  showModal.value = false;
};

// Clear cart modal
const showClearCartModal = ref(false);
const confirmClearCart = () => (showClearCartModal.value = true);
const clearCartConfirmed = () => {
  cart.clearCart();
  addToast("update", "Cart cleared");
  showClearCartModal.value = false;
};

// Checkout handler
const checkout = async () => {
  if (!cart.items.length) {
    addToast("error", "Cart empty");
    return;
  }

  if (!auth.isAuthenticated) {
    addToast("warning", "Please login first");
    setTimeout(() => router.push("/login"), 2000);
    return;
  }

  try {
    addToast("loading", "Preparing your checkout...");

    // Fetch checkout data (auto-fills all required fields)
    await cart.fetchCartCheckout();

    if (cart.checkoutError) {
      addToast("error", cart.checkoutError);
      return;
    }

    console.log("Checkout payload response:", cart.cartData);

    // Navigate to checkout page
    router.push("/checkout");
  } catch (err) {
    addToast("error", err.message || "Checkout failed");
  }
};

// Navigation helpers
const slugify = (text) =>
  text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const goToDetail = (item) =>
  router.push(
    `/${route.params.parent || "products"}/${slugify(item.categories?.[0] || "general")}/${slugify(item.name || "item")}/${item.id}`
  );

const goToVoucherLink = (link) => {
  if (link) router.push(link);
};

// On mount: load cart, vouchers, and fetch checkout data
onMounted(async () => {
  cart.loadCart();
  await cart.fetchVouchers();

  // ✅ Automatically fetch checkout data if cart has items
  if (cart.items.length) {
    try {
      await cart.fetchCartCheckout();
      if (cart.checkoutError) {
        console.warn("Checkout fetch error:", cart.checkoutError);
      } else {
        console.log("Cart checkout fetched successfully on page load");
      }
    } catch (err) {
      console.error("Failed to fetch checkout on mount:", err);
    }
  }
});
</script>

  <style>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  </style>
