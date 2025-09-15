<template>
  <div class="w-full bg-black text-white overflow-hidden relative h-10 flex items-center">
    <div class="whitespace-nowrap flex animate-marquee">
      <span
        v-for="(item, index) in items"
        :key="index"
        class="mx-2 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium cursor-pointer"
      >
        {{ item }} <span class="mx-2">|</span>
      </span>
      <!-- Repeat for seamless loop -->
      <span
        v-for="(item, index) in items"
        :key="'repeat-' + index"
        class="mx-2 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium cursor-pointer"
      >
        {{ item }} <span class="mx-2">|</span>
      </span>
    </div>
  </div>
</template>

<script setup>
const items = [
  "Flat 20% off on first order! Use code FIRST20",
  "Trending: 'Streetwear Essentials' collection live now",
  "Free delivery on orders above ₹199",
  "Quote of the day: 'Style is a way to say who you are without speaking.'",
  "New arrivals: Check out the latest accessories!",
];
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: inline-flex;
  animation: marquee 20s linear infinite;
}
</style>
