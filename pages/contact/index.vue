<template>
  <div class="container mx-auto px-4 py-12 space-y-12">
    <!-- Page Title -->
    <h1
      class="text-4xl font-bold text-center text-gray-900 animate-fadeIn"
    >
      Contact Us
    </h1>

    <!-- Attention Notice -->
    <transition name="fade-slide" appear>
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md flex items-start space-x-3 shadow-md">
        <AlertTriangleIcon class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p class="text-yellow-900 font-semibold">
          Attention! All phone numbers on the internet claiming to be Street Style Store are fraud. NEVER give your credit card information to anyone.
        </p>
      </div>
    </transition>

    <!-- Online Queries -->
    <transition name="fade-slide" appear>
      <div class="bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 class="text-2xl font-semibold text-gray-900">For Online Queries Contact</h2>

        <div class="flex items-center space-x-2 text-gray-700">
          <PhoneIcon class="w-5 h-5 text-gray-800" />
          <span>+91-11-41171712 (10 AM - 6 PM, Mon to Sat)</span>
        </div>
        <p class="text-gray-600">Preferred method for Priority Support</p>
        <p class="text-gray-600">Response time is generally 24 to 48 hours. Click below for your query type:</p>

        <div class="grid sm:grid-cols-3 gap-4 mt-4">
          <button
            class="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
            @click="handleClick('order')"
          >
            <PackageIcon class="w-5 h-5" />
            Have a query regarding your order?
          </button>

          <button
            class="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
            @click="handleClick('support')"
          >
            <HelpCircleIcon class="w-5 h-5" />
            For Support
          </button>

          <button
            class="flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
            @click="handleClick('payment')"
          >
            <CreditCardIcon class="w-5 h-5" />
            Payment deducted but order not created?
          </button>
        </div>
      </div>
    </transition>

    <!-- Office Address -->
    <transition name="fade-slide" appear>
      <div class="bg-white shadow-lg rounded-xl p-6 space-y-2">
        <h2 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <MapPinIcon class="w-5 h-5" /> Office Address
        </h2>
        <p class="text-gray-700">
          Office No.706, Pearl Business Park, Netaji Subhash Place, Pitampura, North West Delhi, Delhi-110034
        </p>
      </div>
    </transition>

    <!-- Legal Info -->
    <transition name="fade-slide" appear>
      <div class="bg-white shadow-lg rounded-xl p-6 space-y-2">
        <h2 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <FileTextIcon class="w-5 h-5" /> Legal
        </h2>
        <p class="text-gray-700">
          Streetstylestore.com is owned by CUTECODE STREET STYLE STORE LLP
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification"
import {
  AlertTriangleIcon,
  PhoneIcon,
  PackageIcon,
  HelpCircleIcon,
  CreditCardIcon,
  MapPinIcon,
  FileTextIcon
} from "lucide-vue-next"

const toast = useToast()

function handleClick(type) {
  let message = ""
  if (type === "order") {
    message = "You clicked: Have a query regarding your order?"
  } else if (type === "support") {
    message = "You clicked: For Support"
  } else if (type === "payment") {
    message = "You clicked: Payment deducted but order not created?"
  }

  toast.info(message, { timeout: 2500 })
}
</script>

<style scoped>
body {
  background-color: #f4f4f9;
}

/* Fade + Slide Animation */
.fade-slide-enter-active {
  transition: all 0.7s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Simple Fade for title */
.animate-fadeIn {
  animation: fadeIn 1s ease forwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
