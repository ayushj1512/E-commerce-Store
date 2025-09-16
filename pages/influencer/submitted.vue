<template>
  <section class="bg-white min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 md:px-20 py-16 text-center">
    
    <!-- Success Icon -->
    <div class="mb-8">
      <svg class="w-20 h-20 text-green-500 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- Heading -->
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-black">
      Application Submitted!
    </h1>

    <!-- Subtext -->
    <p class="text-gray-700 text-base sm:text-lg md:text-xl mb-8 max-w-xl">
      Thank you for registering as an influencer. Your application has been successfully received.
      Our team will review it and get back to you shortly.
    </p>

    <!-- Awaiting Message -->
    <p class="text-gray-600 text-sm sm:text-base md:text-lg italic mb-10">
      While you await approval, feel free to explore our latest collections and shop your favorites. 🛍️
    </p>

    <!-- Back to Home -->
    <router-link 
      to="/" 
      class="inline-block bg-black text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg hover:bg-gray-900 transition">
      Back to Home
    </router-link>

  </section>
</template>

<script setup>
// No JS needed
</script>

<style scoped>
/* Optional animation */
.animate-bounce {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15%); }
}
</style>
