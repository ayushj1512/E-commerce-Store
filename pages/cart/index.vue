  <template>
    <div class="bg-gray-50 min-h-screen p-4 md:p-8">
      <!-- Main Layout -->
      <div class="flex flex-col gap-6">

        <!-- Empty Cart -->
        <EmptyCart v-if="!cart.items.length" class="w-full" />

        <!-- Cart Items & Summary -->
<template v-else>
  <!-- Cart & Summary Row -->
  <div class="flex flex-col md:flex-row gap-12">
    
    <!-- Items Section -->
    <div class="w-full md:w-2/3">
      <transition-group
        name="list"
        tag="div"
        appear
        class="flex flex-col gap-5"  
      >
        <CartCard
          v-for="item in sortedCartItems"
          :key="item._key"
          :item="item"
          :filtered-vouchers="cart.filteredItemVouchers(item)"
          :is-voucher-applied="cart.isVoucherApplied(item)"
          :final-price="cart.getFinalPrice(item)"
          :extra-discount-price="getExtraDiscount(item)"
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

    <!-- Summary Section -->
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

      <div
        v-if="isGrabAndGoOnly"
        class="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg p-3 mt-4"
      >
        <strong>Note:</strong> Debug: <b>{{ isGrabAndGoOnly }}</b>
        Because of deep discounted pricing, items from <b>Grab and Go</b> category can only
        be purchased when you also buy items from another category.
      </div>

      <button
        @click="checkout"
        :disabled="isGrabAndGoOnly"
        class="w-full bg-black text-white py-3 rounded-xl mt-6 font-semibold transition-all duration-200"
        :class="{
          'opacity-50 cursor-not-allowed hover:bg-black': isGrabAndGoOnly,
          'hover:bg-gray-800': !isGrabAndGoOnly
        }"
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

        <!-- Clear Cart Confirmation Modal -->
        <div v-if="showClearCartModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl p-6 shadow-xl w-80 text-center">
            <h3 class="text-lg font-semibold mb-4">Clear all items?</h3>
            <p class="text-gray-600 text-sm mb-6">
              This will remove all items from your cart.
            </p>
            <div class="flex gap-3 justify-center">
              <button @click="clearCartConfirmed"
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold">
                Yes, Clear
              </button>
              <button @click="showClearCartModal = false"
                class="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Remove Item Confirmation Modal -->
<div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white rounded-2xl p-6 shadow-xl w-80 text-center">
    <h3 class="text-lg font-semibold mb-4">Remove this item?</h3>
    <p class="text-gray-600 text-sm mb-6">
      Are you sure you want to remove <strong>{{ modalItem?.name }}</strong> from your cart?
    </p>
    <div class="flex gap-3 justify-center">
      <button @click="removeConfirmed"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold">
        Yes, Remove
      </button>
      <button @click="showModal = false"
        class="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium">
        Cancel
      </button>
    </div>
  </div>
</div>
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
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  padding-bottom: 0.5rem;
}

.buy-along-products::-webkit-scrollbar {
  height: 6px;
}

.buy-along-products::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.buy-along-products::-webkit-scrollbar-track {
  background: transparent;
}
</style>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
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
  } else {
    cart.removeFromCart(item);
    addToast("error", `${item.name} removed from cart`);
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
  addToast("success", `${modalItem.value.name} removed & added to wishlist`);
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
    addToast("error", "Cart is empty");
    return;
  }

  if (!auth.isAuthenticated) {
    addToast("warning", "Please login first");
    setTimeout(() => router.push("/login"), 2000);
    return;
  }

  try {
    addToast("loading", "Preparing your checkout...");
    await cart.fetchCartCheckout();

    if (cart.checkoutError) {
      addToast("error", cart.checkoutError);
      return;
    }

    router.push("/checkout");
  } catch (err) {
    addToast("error", err.message || "Checkout failed");
  }
};

// Grab & Go logic
const isGrabAndGoOnly = computed(() => {
  if (!cart.items.length) return false;
  const allGrabAndGo = cart.items.every(item => item.categories?.includes(874));
  console.log("⚙️ Grab & Go check:", cart.items, "Result:", allGrabAndGo);
  return allGrabAndGo;
});

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

// Helper to determine any extra discount for display
const getExtraDiscount = (item) => {
  // Prefer explicit extraDiscount if available
  if (item.extraDiscount && item.extraDiscount > 0) return item.extraDiscount;

  // Fallback: discount per item or computed difference
  if (item.discountPerItem && item.discountPerItem > 0)
    return item.discountPerItem;

  // As a last resort, compute from MRP and final price if applicable
  if (item.MRP_price && cart.getFinalPrice(item))
    return Math.max(item.MRP_price - cart.getFinalPrice(item), 0);

  return 0; // No discount
};

// Watch cart items
watch(
  () => cart.items,
  (newItems) => {
    console.log("🛒 Cart updated:", newItems);
    console.table(newItems.map(i => ({
      id: i.id,
      name: i.name,
      qty: i.quantity,
      size: i.size,
      finalPrice: i.finalPrice,
      discount: i.discountApplied
    })));
  },
  { deep: true }
);

// On mount
onMounted(async () => {
  console.log("🚀 Cart Page Mounted");

  await cart.loadCart();
  console.log("✅ Cart loaded:", cart.items);

  await cart.fetchVouchers();
  console.log("🎟️ Vouchers fetched:", cart.vouchers || "None");

  // Fetch checkout info if cart has items
  if (cart.items.length) {
    try {
      console.log("💳 Fetching checkout data...");
      await cart.fetchCartCheckout();
      if (cart.checkoutError) console.warn("⚠️ Checkout error:", cart.checkoutError);
      else console.log("✅ Checkout fetched:", cart.checkout);
    } catch (err) {
      console.error("❌ Checkout fetch failed:", err);
    }
  } else {
    console.log("🕳️ Cart empty, skipping checkout fetch");
  }
});

// Helper: per-unit price display
const getItemUnitPrice = (item) =>
  item.quantity > 0
    ? ((item.finalPrice || item.MRP_price * item.quantity) / item.quantity).toFixed(2)
    : item.MRP_price.toFixed(2);
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
