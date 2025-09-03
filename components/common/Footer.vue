<template>
  <footer class="bg-black text-white px-6 py-8 sm:py-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- Left Row: Street Style Store + About -->
      <div class="flex flex-wrap gap-8">
        <!-- Street Style Store Section -->
        <div class="flex-1 min-w-[150px]">
          <h3 class="text-lg font-bold mb-3 sm:mb-4">Street Style Store</h3>
          <ul class="space-y-1 sm:space-y-2 text-sm">
            <li @click="navigate('/returns')" class="hover:underline cursor-pointer">Returns & Exchange</li>
            <li @click="navigate('/shipping')" class="hover:underline cursor-pointer">Shipping Policy</li>
            <li @click="navigate('/faq')" class="hover:underline cursor-pointer">FAQ's</li>
            <li @click="navigate('/terms')" class="hover:underline cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        <!-- About Section -->
        <div class="flex-1 min-w-[150px]">
          <h3 class="text-lg font-bold mb-3 sm:mb-4">About SSS</h3>
          <ul class="space-y-1 sm:space-y-2 text-sm">
            <li @click="navigate('/about')" class="hover:underline cursor-pointer">About Us</li>
            <li @click="navigate('/policy')" class="hover:underline cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </div>

      <!-- Connect Section -->
      <div class="mt-6 md:mt-0">
        <h3 class="text-lg font-bold mb-3 sm:mb-4">Connect</h3>
        <p class="text-sm mb-1 sm:mb-2">Office: No.356, Aggarwal Metro Heights, Netaji Subhash Place, Pitampura, North West Delhi, Delhi-110034</p>
        <p class="text-sm mb-3 sm:mb-4">Phone: +91-11-41171712 (10 AM - 6 PM, Mon to Sat)</p>

        <!-- Social Icons -->
        <div class="flex space-x-4 mb-3 text-xl">
          <a href="https://www.facebook.com/streetstylestorefans" target="_blank" class="hover:text-gray-400">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/streetstylestoreofficial" target="_blank" class="hover:text-gray-400">
            <i class="fab fa-instagram"></i>
          </a>
        </div>

        <!-- App Store Buttons -->
        <div class="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
          <a href="https://play.google.com/store" target="_blank" class="flex items-center justify-center sm:justify-start bg-white text-black px-3 py-2 rounded shadow-sm hover:shadow-md transition">
            <i class="fab fa-google-play text-xl mr-2"></i>
            <span class="text-xs sm:text-sm">Google Play</span>
          </a>
          <a href="https://www.apple.com/app-store/" target="_blank" class="flex items-center justify-center sm:justify-start bg-white text-black px-3 py-2 rounded shadow-sm hover:shadow-md transition">
            <i class="fab fa-apple text-xl mr-2"></i>
            <span class="text-xs sm:text-sm">App Store</span>
          </a>
        </div>
      </div>

    </div>

    <!-- Bottom -->
    <div class="border-t border-white/20 mt-6 sm:mt-8 pt-3 text-center text-sm text-white/70">
      <p>Street Style Store © 2024. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const navigate = (path) => router.push(path)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

li:hover, a:hover {
  color: #ccc;
  transition: 0.3s ease;
}
</style>
