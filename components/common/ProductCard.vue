<template>
  <div
    class="relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white rounded-lg flex flex-col"
    @click="goToDetail"
  >
    <!-- Product Image -->
    <div class="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 flex-shrink-0 overflow-hidden">
      <img
        :src="currentImage"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        @mouseover="hoverImage && (currentImage = hoverImage)"
        @mouseleave="currentImage = image"
      />
    </div>

    <!-- Tags -->
    <div v-if="tags && tags.length" class="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="bg-black text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold rounded"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Product info -->
    <div class="p-3 flex flex-col flex-1 justify-between gap-2">
      <div class="flex flex-col flex-1">
        <h3
          class="text-gray-900 font-medium text-sm sm:text-base md:text-base truncate"
          :title="title"
        >
          {{ title }}
        </h3>
        <div class="mt-1 flex items-center space-x-1 sm:space-x-2">
          <span v-if="mrp" class="text-gray-400 line-through text-[10px] sm:text-sm">₹{{ mrp }}</span>
          <span class="text-gray-900 font-semibold text-sm sm:text-base">₹{{ price }}</span>
        </div>
      </div>

      <!-- Sizes Dropdown -->
      <div v-if="sizes && sizes.length" class="mt-2">
        <select
          v-model="selectedSize"
          class="border rounded-sm px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option v-for="(s, idx) in sizes" :key="idx" :value="s">Size: {{ s }}</option>
        </select>
      </div>

      <!-- Add to Cart Button -->
      <button
        v-if="showCartBtn"
        class="w-full sm:w-auto mt-2 sm:mt-3 px-4 py-1.5 bg-black text-white rounded-sm text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-300"
        @click.stop="addToCart"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "#app"
import { useToast } from "vue-toastification"
import { useCartStore } from "@/stores/cartStore"

const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, default: null },
  tags: { type: Array, default: () => [] },
  price: { type: Number, required: true },
  mrp: { type: Number, default: null },
  showCartBtn: { type: Boolean, default: true },
  productUrl: { type: String, required: true },
  sizes: { type: Array, default: () => [] },
})

const currentImage = ref(props.image)
const selectedSize = ref(props.sizes?.[0] ?? null)
const router = useRouter()
const cart = useCartStore()
let toast = null

onMounted(() => {
  toast = useToast()
})

const goToDetail = () => {
  if (!props.productUrl) return
  if (props.productUrl.startsWith("/")) {
    router.push(props.productUrl).catch(() => {})
  } else {
    window.location.href = props.productUrl
  }
}

const addToCart = () => {
  // Prepare product object matching cart store
  const productToAdd = {
    id: props.id,
    name: props.title,
    price: props.price,
    quantity: 1,
    size: selectedSize.value,
    image: props.image,
  }

  cart.addToCart(productToAdd)

  toast?.success(`${props.title} has been added to your cart`, {
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    icon: "🛒",
  })
}
</script>

<style scoped>
img {
  transition: transform 0.4s ease, opacity 0.3s ease;
}
</style>
