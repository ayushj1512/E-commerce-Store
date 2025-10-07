<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <Confetti ref="confettiRef" />

      <!-- Empty Cart -->
      <EmptyCart v-if="!cart.items.length" class="w-full" />

      <!-- Cart Items & Summary -->
      <template v-else>
        <!-- Items -->
        <transition-group
          name="list"
          tag="div"
          class="w-full md:w-2/3 space-y-4"
          appear
        >
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

        <!-- Summary -->
        <div
          class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-white md:sticky md:top-20 space-y-4"
        >
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>

          <div class="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{{ cart.subtotal }}</span>
          </div>

          <div
            v-if="cart.discount > 0"
            class="flex justify-between text-green-600 font-semibold"
          >
            <span>Discount</span>
            <span>-₹{{ cart.discount }}</span>
          </div>

          <div
            v-if="cart.discount > 0"
            class="text-green-700 font-medium text-sm"
          >
            You saved ₹{{ cart.discount }} on this order!
          </div>

          <div
            class="flex justify-between font-bold text-2xl mt-6 border-t pt-4 text-gray-900"
          >
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
      </template>

      <!-- Confirm Remove Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white rounded-xl p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">Remove Item</h3>
          <p class="mb-6">
            Are you sure you want to remove
            <strong>{{ modalItem?.name }}</strong> from the cart?
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="removeConfirmed"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
            >
              Yes, Remove
            </button>
            <button
              @click="showModal = false"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Clear Cart Modal -->
      <div
        v-if="showClearCartModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white rounded-xl p-6 w-80">
          <h3 class="text-lg font-semibold mb-4">Clear Cart</h3>
          <p class="mb-6">Are you sure you want to clear all items from the cart?</p>
          <div class="flex justify-end gap-3">
            <button
              @click="clearCartConfirmed"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
            >
              Yes, Clear
            </button>
            <button
              @click="showClearCartModal = false"
              class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Global Toast -->
      <GlobalToast />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/auth";
import GlobalToast, { addToast } from "@/components/common/GlobalToast.vue";
import Confetti from "@/components/cart/confetti.vue";
import CartCard from "@/components/cart/CartCard.vue";
import EmptyCart from "@/components/cart/EmptyCart.vue";

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const confettiRef = ref(null);

const sortedCartItems = computed(() => {
  const withDiscount = cart.items.filter((i) => i.discountApplied);
  const withoutDiscount = cart.items.filter((i) => !i.discountApplied);
  return [...withDiscount, ...withoutDiscount];
});

const increaseQty = (i) => {
  cart.updateQuantity(i, i.quantity + 1, i.size);
  console.log("🟢 Increased:", i.name, "| New Qty:", i.quantity + 1);
  console.log("🧾 Current Cart Total:", cart.total, "COD Amount:", cart.codAmount);
  addToast("success", `+ ${i.name}`);
};

const decreaseQty = (i) => {
  if (i.quantity > 1) {
    cart.updateQuantity(i, i.quantity - 1, i.size);
    console.log("🔻 Decreased:", i.name, "| New Qty:", i.quantity - 1);
    console.log("🧾 Current Cart Total:", cart.total, "COD Amount:", cart.codAmount);
    addToast("warning", `- ${i.name}`);
  }
};

const showModal = ref(false);
const modalItem = ref(null);
const confirmRemove = (i) => ((modalItem.value = i), (showModal.value = true));
const removeConfirmed = () => {
  cart.removeFromCart(modalItem.value);
  addToast("error", `${modalItem.value.name} removed from cart`);
  showModal.value = false;
};

const showClearCartModal = ref(false);
const confirmClearCart = () => (showClearCartModal.value = true);
const clearCartConfirmed = () => {
  cart.clearCart();
  addToast("update", "Cart cleared");
  showClearCartModal.value = false;
};

const checkout = () => {
  if (!cart.items.length) {
    addToast("error", "Cart empty");
    return;
  }

  if (!auth.isAuthenticated) {
    addToast("warning", "Please login first");
    setTimeout(() => router.push("/login"), 2000);
    return;
  }

  router.push("/checkout");
};

const slugify = (t) =>
  t?.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
const goToDetail = (i) =>
  router.push(
    `/${route.params.parent || "products"}/${slugify(
      i.categories?.[0] || "general"
    )}/${slugify(i.name || "item")}/${i.id}`
  );
const goToVoucherLink = (link) => {
  if (link) router.push(link);
};

onMounted(async () => {
  cart.loadCart();
  await cart.fetchVouchers();
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
