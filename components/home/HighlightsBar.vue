<template>
  <section class="border-t text-center overflow-hidden">
    <!-- 🖤 Feature Cards -->
    <div
      class="flex justify-start sm:justify-center gap-4 py-8 overflow-x-auto sm:overflow-visible px-3 sm:px-8 scrollbar-hide snap-x snap-mandatory flex-nowrap sm:flex-wrap"
    >
      <motion-div
        v-for="(feature, index) in features"
        :key="index"
        class="group flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-100 p-4 w-48 sm:w-64 md:w-72 snap-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.2 + 0.5, duration: 0.6 }
        }"
      >
        <div class="flex items-center justify-center mb-3 text-black" aria-hidden="true">
          <!-- ✅ Icon changes to green on hover -->
          <component
            :is="feature.icon"
            class="w-7 h-7 sm:w-9 sm:h-9 text-gray-500 transition-colors duration-300 group-hover:text-green-500"
          />
        </div>

        <h3 class="font-semibold text-base sm:text-lg text-gray-900 mb-1">
          {{ feature.title }}
        </h3>
        <p class="text-gray-600 text-xs sm:text-sm leading-snug">
          {{ feature.description }}
        </p>
      </motion-div>
    </div>
  </section>
</template>

<script setup>
import {
  Star,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
} from "lucide-vue-next";

const features = [
  {
    title: "New Sizes Added",
    icon: Sparkles,
    description:
      "Inclusive fits crafted for every body type — because confidence comes in all shapes.",
  },
  {
    title: "Trending Fashion",
    icon: TrendingUp,
    description:
      "The latest drops loved by Gen-Z — from street chic to timeless elegance.",
  },
  {
    title: "Premium Quality",
    icon: Star,
    description:
      "Handpicked fabrics and craftsmanship you can feel in every stitch.",
  },
  {
    title: "Style Community",
    icon: HeartHandshake,
    description:
      "Join a movement of bold women defining modern fashion together.",
  },
  {
    title: "Effortless Shopping",
    icon: ShoppingBag,
    description:
      "Seamless browsing and checkout built for your busy lifestyle.",
  },
];
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
