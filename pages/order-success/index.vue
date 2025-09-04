<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 space-y-8 relative">

      <!-- Success Tick Animation -->
      <div class="flex justify-center mb-4">
        <div class="w-24 h-24 rounded-full bg-teal-400 flex items-center justify-center animate-bounce-forever shadow-lg">
          <!-- Lucide Check Icon -->
          <Check class="h-12 w-12 text-white"/>
        </div>
      </div>

      <!-- Header -->
      <div class="text-center space-y-2">
<h1 class="text-3xl md:text-4xl text-black font-great-vibes font-bold">Thanks for your order!</h1>
        <p class="text-gray-600 text-sm md:text-base">
          Hey Vladimir,<br/>
          Your order <span class="text-blue-500 font-medium">U5635680</span> has been successfully placed at <span class="font-semibold">Street Style Store (SSS)</span>. You’ll find all details below, and we’ll send a shipping confirmation email soon.
        </p>
        <p class="text-gray-500 text-sm">
          Questions? Suggestions? <a href="#" class="text-blue-500 underline hover:text-blue-600">Shoot us an email.</a>
        </p>
      </div>

      <!-- Order Info -->
      <div class="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-4 text-sm text-gray-700">
        <div>
          <p class="font-semibold">Order Number</p>
          <p>U5635680</p>
        </div>
        <div>
          <p class="font-semibold">Order Date</p>
          <p>17 January 2017</p>
        </div>
      </div>

      <!-- Addresses -->
      <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p class="font-semibold">Shipping Address</p>
          <p>Vladimir Kudinov<br/>340 Main St. STE. 680,<br/>Venice, CA 90291</p>
        </div>
        <div>
          <p class="font-semibold">Billing Address</p>
          <p>Vladimir Kudinov<br/>340 Main St. STE. 680,<br/>Venice, CA 90291</p>
        </div>
      </div>

      <!-- Ordered Products -->
      <div>
        <p class="font-semibold text-gray-900 mb-2">Here’s what you ordered:</p>
        <div class="space-y-4">
          <div class="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-lg transition transform hover:scale-102 shadow-sm">
            <img src="https://cdn.streetstylestore.com/3/0/3/2/8/8/303288-sss_vertical.webp" alt="Yanagi Tea Kettle" class="w-16 h-16 object-cover rounded-md border"/>
            <div class="flex-1">
              <p class="font-medium text-gray-900">Yanagi Tea Kettle</p>
              <p class="text-gray-500 text-sm">Sori Yanagi Medium</p>
            </div>
            <div class="text-right">
              <p class="text-gray-600">Qty: 1</p>
              <p class="font-semibold text-gray-900">Rs49</p>
            </div>
          </div>

          <div class="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-lg transition transform hover:scale-102 shadow-sm">
            <img src="https://cdn.streetstylestore.com/3/0/3/2/8/8/303288-sss_vertical.webp" alt="Analog Travel Alarm Clock" class="w-16 h-16 object-cover rounded-md border"/>
            <div class="flex-1">
              <p class="font-medium text-gray-900">Analog Travel Alarm Clock</p>
              <p class="text-gray-500 text-sm">Braun</p>
            </div>
            <div class="text-right">
              <p class="text-gray-600">Qty: 1</p>
              <p class="font-semibold text-gray-900">Rs29</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Breakdown -->
      <div class="border-t border-gray-200 pt-4 text-sm text-gray-700 space-y-2">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>Rs78</span>
        </div>
        <div class="flex justify-between">
          <span>Shipping</span>
          <span>Rs5</span>
        </div>
        <div class="flex justify-between">
          <span>Tax</span>
          <span>Rs0</span>
        </div>
        <div class="flex justify-between font-bold text-gray-900 border-t border-gray-300 pt-2 text-lg">
          <span>Total</span>
          <span>Rs83</span>
        </div>
      </div>

      <!-- Back to Shop -->
      <div class="text-center">
        <button class="bg-black hover:bg-white hover:text-black text-white font-medium py-3 px-6 rounded-xl shadow-md transition transform hover:-translate-y-1 hover:scale-105">
         Continue Shopping
        </button>
      </div>

      <!-- Footer -->
      <div class="text-center text-xs text-gray-400 space-y-1">
        <p>HELP CENTER · SUPPORT 24/7 · ACCOUNT</p>
        <p>Copyright © 2017 Street Style Store (SSS). All Rights Reserved.</p>
        <p>help@sss.com · 1(800)232-90-26 · <a href="#" class="underline hover:text-gray-600">Unsubscribe</a></p>
        <div class="flex justify-center space-x-3 mt-2 text-gray-400 text-lg">
          <i class="fab fa-instagram cursor-pointer hover:text-pink-500 transition"></i>
          <i class="fab fa-facebook cursor-pointer hover:text-blue-600 transition"></i>
          <i class="fab fa-twitter cursor-pointer hover:text-blue-400 transition"></i>
          <i class="fab fa-google cursor-pointer hover:text-red-500 transition"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.font-great-vibes {
  font-family: 'Great Vibes', cursive;
}

@keyframes bounce-forever {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.animate-bounce-forever {
  animation: bounce-forever 0.8s ease-in-out infinite;
}

/* Slight scale-up hover for cards */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

.font-great-vibes {
  font-family: 'Great Vibes', cursive;
  font-weight: 700; /* makes it visually bolder */
}
</style>
