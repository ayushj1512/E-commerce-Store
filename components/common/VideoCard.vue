<template>
  <div
    class="relative flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-60 cursor-pointer group"
    @click="handleClick"
  >
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

    <!-- Optional Title -->
    <!-- <div v-if="title" class="absolute bottom-2 left-2 right-2 text-white font-semibold text-sm sm:text-base">
      {{ title }}
    </div> -->
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  videoUrl: { type: String, required: true },
  title: { type: String, default: '' }
});

const emit = defineEmits(['click']);

// Emit click event upwards
function handleClick() {
  emit('click');
}
</script>

<style scoped>
/* Optional hover scale effect */
.group:hover video {
  transform: scale(1.05);
}
</style>
