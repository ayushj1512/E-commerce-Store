<template>
  <div class="relative flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-60 cursor-pointer group">
    
    <!-- Video Container -->
    <div class="relative overflow-hidden rounded-xl shadow-lg">
      <video
        :src="videoUrl"
        class="w-full aspect-[9/16] object-cover transform transition-transform duration-300 group-hover:scale-105"
        autoplay
        muted
        loop
        playsinline
      ></video>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  videoUrl: { type: String, required: true }
});
</script>

<style scoped>
/* Optional hover scale effect */
.group:hover video {
  transform: scale(1.05);
}
</style>
