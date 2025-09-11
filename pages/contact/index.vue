<template>
  <div class="container mx-auto px-4 py-10 space-y-10">
    <h1 class="text-4xl font-bold text-center">Contact Us</h1>

    <!-- Attention Notice -->
    <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md">
      <p class="text-yellow-900 font-semibold">
        ⚠️ Attention! : All Phone Numbers present on the internet claiming to be Street Style Store number are of fraudsters. NEVER give your credit card information to anyone.
      </p>
    </div>

    <!-- Online Queries -->
    <div class="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 class="text-2xl font-semibold">For Online Queries Contact</h2>
      <p class="text-gray-700">📞 +91-11-41171712 (10 AM - 6 PM, Mon to Sat)</p>
      <p class="text-gray-600">Preferred method for Priority Support</p>
      <p class="text-gray-600">If you have a query please click on below section. The response time is generally 24 to 48 Hours.</p>

      <div class="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          class="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
          @click="handleClick('order')"
        >
          Have a query regarding your order? Click here
        </button>
        <button
          class="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
          @click="handleClick('support')"
        >
          For Support Click here
        </button>
        <button
          class="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
          @click="handleClick('payment')"
        >
          If your payment is deducted and order not created? Click here
        </button>
      </div>
    </div>

    <!-- Office Address -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-2">Office Address</h2>
      <p>Office No.706, Pearl Business Park, Netaji Subhash Place, Pitampura, North West Delhi, Delhi-110034</p>
    </div>

    <!-- Legal Info -->
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-2">Legal</h2>
      <p>Streetstylestore.com is owned by CUTECODE STREET STYLE STORE LLP</p>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'

const toast = useToast()

function handleClick(type) {
  let message = ''
  if (type === 'order') {
    message = 'You clicked: Have a query regarding your order?'
  } else if (type === 'support') {
    message = 'You clicked: For Support'
  } else if (type === 'payment') {
    message = 'You clicked: Payment deducted but order not created?'
  }

  toast.info(message, { timeout: 2500 })
}
</script>

<style scoped>
body {
  background-color: #f4f4f9;
}
</style>
