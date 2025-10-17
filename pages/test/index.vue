<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <!-- Main page content -->
    <div class="p-6 flex-1">
      <h1 class="text-3xl font-bold mb-4">Street Style Store Demo</h1>
      <p class="text-gray-700 mb-2">
        Scroll the content to see the bottom app download banner.
      </p>
      <p class="text-gray-700">
        Test on mobile, tablet, and desktop for responsiveness.
      </p>

      <!-- Filler content to simulate scrolling -->
      <div class="h-[1200px]"></div>
    </div>

    <!-- Bottom App Download Banner -->
    <AppDownload />
  </div>
</template>

<script setup>
import AppDownload from "@/components/home/AppDownload.vue";
</script>

<style scoped>
/* Optional: demo content styling */
</style>
