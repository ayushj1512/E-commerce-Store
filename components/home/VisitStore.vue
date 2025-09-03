<template>
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Text Content -->
      <div class="flex flex-col justify-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Visit Us at Our Store</h2>
        <p class="text-gray-700 mb-2">
          Fable Street Lifestyle Solutions Private Limited
        </p>
        <p class="text-gray-700 mb-2">
          362, Phase II, Udyog Vihar, Sector 20, Gurugram, Haryana 122016
        </p>
        <p class="text-gray-700 mb-2">Timings: 09:30 AM to 06:30 PM, Mon to Sat</p>
        <p class="text-gray-700 mb-4">Ph: 01143078400 | care@fablestreet.com</p>
        <a
          href="https://maps.app.goo.gl/xkQnaFMHtzw93WKt7"
          target="_blank"
          class="inline-block px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
        >
          Get Directions
        </a>
      </div>

      <!-- Map Embed -->
      <div class="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <iframe
          class="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.708678019047!2d77.07292117516292!3d28.47459518245644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19a3ed2ff853%3A0x5b1b8e2955df0482!2sFable%20Street%20Store!5e0!3m2!1sen!2sin!4v1693560000000!5m2!1sen!2sin"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* Optional hover effect for button */
a:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
</style>
