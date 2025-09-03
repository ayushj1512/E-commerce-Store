<template>
  <div
    class="relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white"
    @click="goToDetail"
  >
    <!-- Product Image with optional hover -->
    <div class="relative w-full overflow-hidden">
      <img
        :src="currentImage"
        :alt="title"
        class="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        @mouseover="hoverImage && (currentImage = hoverImage)"
        @mouseleave="currentImage = image"
      />
    </div>

    <!-- Tags -->
    <div v-if="tags && tags.length" class="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="bg-black text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Product info: Name & Price left, Add to Cart right -->
    <div class="p-3 flex items-center justify-between">
      <div class="flex flex-col">
        <h3 class="text-gray-900 font-medium text-sm sm:text-base md:text-base truncate">
          {{ title }}
        </h3>

        <div class="mt-1 flex items-center space-x-2">
          <span v-if="mrp" class="text-gray-400 line-through text-xs sm:text-sm">
            ₹{{ mrp }}
          </span>
          <span class="text-gray-900 font-semibold text-sm sm:text-base">
            ₹{{ price }}
          </span>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button
        v-if="showCartBtn"
        class="ml-4 px-4 py-1 bg-black text-white rounded-sm text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-300"
        @click.stop="addToCart"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "#app"

const props = defineProps({
  title: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, default: null }, 
  tags: { type: Array, default: () => [] }, 
  price: { type: Number, required: true },
  mrp: { type: Number, default: null },
  showCartBtn: { type: Boolean, default: true },
  slug: { type: String, required: true },    // child slug
  parent: { type: String, required: true },  // parent slug (category)
})

const currentImage = ref(props.image)
const router = useRouter()

const goToDetail = () => {
  // Navigate to /[parent]/[child]
  router.push(`/${props.parent}/${props.slug}`)
}

// Placeholder Add to Cart functionality
const addToCart = () => {
  console.log(`${props.title} added to cart!`)
}
</script>

<style scoped>
img {
  transition: transform 0.4s ease, opacity 0.3s ease;
}
</style>
