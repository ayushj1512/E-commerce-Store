<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <!-- Page Title -->

    <!-- Responsive Layout -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Cart Items -->
      <div class="w-full md:w-2/3 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-2xl p-4 shadow-sm"
        >
          <!-- Product Info -->
          <div class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0">
            <img
              :src="item.image"
              alt="Product"
              class="w-20 h-24 object-cover rounded-xl"
            />
            <div>
              <h2 class="font-semibold text-lg">{{ item.name }}</h2>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
              <p class="font-bold mt-1">₹{{ item.price }}</p>
            </div>
          </div>

          <!-- Quantity + Remove -->
          <div class="flex items-center space-x-3">
            <button
              @click="decreaseQty(item)"
              class="px-2 py-1 border rounded-lg hover:bg-gray-200"
            >
              -
            </button>
            <span class="font-semibold">{{ item.qty }}</span>
            <button
              @click="increaseQty(item)"
              class="px-2 py-1 border rounded-lg hover:bg-gray-200"
            >
              +
            </button>
            <button
              @click="removeItem(item)"
              class="ml-3 text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div
        class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-gray-50 md:sticky md:top-20"
      >
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>

        <!-- Subtotal -->
        <div class="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>₹{{ subtotal }}</span>
        </div>

        <!-- Delivery -->
        <div class="flex justify-between text-gray-700 mb-2">
          <span>Delivery</span>
          <span>₹40</span>
        </div>

        <!-- Coupon Code -->
        <div class="mt-4">
          <label class="block mb-2 font-medium">Apply Coupon</label>
          <div class="flex gap-2">
            <input
              v-model="couponCode"
              type="text"
              placeholder="Enter code"
              class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              @click="applyCoupon"
              class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              Apply
            </button>
          </div>
          <p v-if="couponMessage" class="text-green-600 text-sm mt-2">
            {{ couponMessage }}
          </p>
        </div>

        <!-- Total -->
        <div class="flex justify-between font-bold text-lg mt-6 border-t pt-3">
          <span>Total</span>
          <span>₹{{ total }}</span>
        </div>

        <!-- Checkout Button -->
        <button
          class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const cartItems = ref([
  {
    id: 1,
    name: "Classic White Shirt",
    description: "Pure cotton, slim fit",
    price: 1200,
    qty: 1,
    image:
      "https://i.pinimg.com/736x/88/a2/7f/88a27fb10d01781e0d5ae6bbba078214.jpg",
  },
  {
    id: 2,
    name: "Black Denim Jeans",
    description: "Comfort stretch, regular fit",
    price: 2200,
    qty: 2,
    image:
      "https://i.pinimg.com/736x/88/a2/7f/88a27fb10d01781e0d5ae6bbba078214.jpg",
  },
]);

const couponCode = ref("");
const discount = ref(0);
const couponMessage = ref("");

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

const total = computed(() => subtotal.value + 40 - discount.value);

const increaseQty = (item) => {
  item.qty++;
};

const decreaseQty = (item) => {
  if (item.qty > 1) item.qty--;
};

const removeItem = (item) => {
  cartItems.value = cartItems.value.filter((i) => i.id !== item.id);
};

// Coupon logic (dummy)
const applyCoupon = () => {
  if (couponCode.value.toLowerCase() === "save10") {
    discount.value = 200;
    couponMessage.value = "🎉 Coupon applied! You saved ₹200";
  } else {
    discount.value = 0;
    couponMessage.value = "❌ Invalid coupon code";
  }
};
</script>
