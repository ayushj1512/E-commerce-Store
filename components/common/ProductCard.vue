<template>
  <div
    class="relative cursor-pointer group overflow-hidden shadow-sm hover:shadow-md transform transition-all duration-300 bg-white rounded-lg"
    @click="goToDetail"
  >
    <!-- Product Image -->
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
        class="bg-black text-white text-[10px] sm:text-xs px-2 py-0.5 font-semibold rounded"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Product info -->
    <div class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

      <button
        v-if="showCartBtn"
        class="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-1.5 bg-black text-white rounded-sm text-xs sm:text-sm hover:bg-gray-800 transition-colors duration-300"
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

const props = defineProps({
  title: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, default: null },
  tags: { type: Array, default: () => [] },
  price: { type: Number, required: true },
  mrp: { type: Number, default: null },
  showCartBtn: { type: Boolean, default: true },
  productUrl: { type: String, required: true }, // ✅ from API
})

const currentImage = ref(props.image)
const router = useRouter()

let toast = null
onMounted(() => {
  toast = useToast()
})

const goToDetail = () => {
  if (!props.productUrl) return

  // ✅ agar internal route hai
  if (props.productUrl.startsWith("/")) {
    try {
      router.push(props.productUrl)
    } catch (e) {
      console.error("Router push failed, falling back to full redirect:", e)
      window.location.href = props.productUrl
    }
  } else {
    // ✅ external URL case
    window.location.href = props.productUrl
  }
}

const addToCart = () => {
  if (!toast) return
  toast.success(`${props.title} has been added to your cart`, {
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
