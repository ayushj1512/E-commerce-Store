<template>
  <div class="min-h-screen bg-white text-black  px-4 md:px-10">
    <!-- Loader -->
    <div v-if="loading" class="flex flex-col justify-center items-center h-screen">
      <div class="loader border-black border-t-gray-300"></div>
      <p class="text-gray-700 mt-3 font-medium text-lg animate-pulse">Loading product...</p>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class=" mx-auto rounded-2xl  sm:p-6 md:p-10 space-y-8 animate-fade-in">
      <!-- Product Title -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tight animate-slide-up">
        {{ product.name }}
      </h1>

      <div class="flex flex-col md:flex-row ">

        <!-- Left Side: Images -->
      <div class="w-full md:w-1/2 relative flex flex-col items-center md:items-start">
  <!-- Main Product Image -->
  <div
    class="w-full max-w-[350px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] border border-gray-200 rounded-2xl shadow-xl overflow-hidden relative hover:shadow-lg transition-shadow duration-300"
    style="aspect-ratio: 9/16; max-height: 500px;">
    <img :src="selectedImage" alt="Product Image"
      class="w-full h-full object-contain transition-transform duration-500 hover:scale-105" />
    <!-- Left Arrow -->
    <button @click="prevImage"
      class="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all hover:scale-110">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <!-- Right Arrow -->
    <button @click="nextImage"
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all hover:scale-110">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <!-- Thumbnails -->
  <div class="mt-3 sm:mt-4">
  <!-- Thumbnails -->
  <div
    class="flex md:flex-wrap flex-nowrap gap-2 sm:gap-3 justify-start overflow-x-auto md:overflow-x-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    <img v-for="(img, idx) in product.images || []" :key="idx" :src="img || fallbackImage"
      @click="selectedImage = img"
      :class="[
        'w-16 sm:w-20 h-28 sm:h-36 object-contain rounded-lg cursor-pointer border-2 transition-all duration-300 transform flex-shrink-0',
        selectedImage === img
          ? 'border-black scale-105 shadow-lg animate-pulse'
          : 'border-gray-300 hover:border-black hover:scale-105'
      ]" />
  </div>
</div>

</div>





        <!-- Right Side: Info -->
        <div class="flex-1 flex flex-col justify-start space-y-4 sm:space-y-5 animate-slide-up delay-150">
          <!-- Price & Offer -->
          <div class="flex flex-wrap items-center gap-3 sm:gap-4">
            <span class="text-xl sm:text-2xl font-bold text-black">₹ {{ product.price }}</span>
            <span v-if="product.mrp" class="line-through text-gray-400 text-sm sm:text-base">₹ {{ product.mrp }}</span>
            <span v-if="product.offer"
              class="text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded animate-bounce-offer">
              {{ product.offer }}
            </span>
          </div>

          <!-- Size Selection -->
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <button v-for="size in ['XS', 'S', 'M', 'L', 'XL']" :key="size" @click="selectedSize = size" :class="[
              'py-1 sm:py-2 px-3 sm:px-4 border rounded-lg font-semibold cursor-pointer transition-transform duration-200 text-sm sm:text-base',
              selectedSize === size
                ? 'bg-black text-white border-black shadow-lg scale-105'
                : 'bg-white text-black border-gray-400 hover:bg-gray-50 hover:scale-105'
            ]">
              {{ size }}
            </button>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 sm:gap-4 mt-2">
            <button
              class="bg-black text-white font-semibold py-2 px-4 sm:py-2 sm:px-6 rounded-lg hover:bg-gray-800 transition-all shadow-md transform hover:scale-105"
              @click="addToCart(product)">
              Add to Cart
            </button>
            <button
              class="bg-white border border-black text-black font-semibold py-2 px-4 sm:py-2 sm:px-6 rounded-lg hover:bg-black hover:text-white transition-all shadow-md transform hover:scale-105">
              Buy Now
            </button>
          </div>

          <!-- Description -->
          <div class="text-gray-800 leading-relaxed mt-3 sm:mt-4 text-sm sm:text-base" v-html="product.description">
          </div>

          <!-- Delivery & Returns -->
          <div class="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
            <h3 class="font-semibold text-black text-base sm:text-lg">Delivery Information</h3>
            <p>Products are generally dispatched in 3-21 days depending upon the product you have ordered. We guarantee
              our products are worth the wait with premium quality and designs.</p>
            <h3 class="font-semibold text-black text-base sm:text-lg mt-2">Returns & Exchange</h3>
            <p>Size exchange is free. Rs 100 fee applies for product exchange. <a href="#"
                class="underline text-black hover:text-gray-600">Click here for details</a>.</p>
          </div>
        </div>
      </div>

      <!-- Customer Reviews -->
    <ReviewsAndRating/>

      <relatedProducts />
    </div>

    <!-- Fallback -->
    <div v-else class="flex justify-center items-center h-60">
      <p class="text-gray-500 text-lg font-medium">Product not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from '#app'
import relatedProducts from '../../components/cart/relatedProducts.vue'
import ReviewsAndRating from '@/components/productDetail/reviews&rating.vue'

const route = useRoute()
const loading = ref(true)
const product = ref(null)
const selectedImage = ref('')
const selectedSize = ref('M')
const fallbackImage = 'https://via.placeholder.com/400x400?text=No+Image'

// Dummy product data
const allProducts = [
  {
    slug: 'classic-white-shirt',
    parent: 'shirts',
    name: 'Classic White Shirt',
    price: 1200,
    mrp: 1500,
    offer: '20% off',
    description: '<p>Elegant classic white shirt perfect for formal and casual wear.</p>',
    images: [
      'https://cdn.streetstylestore.com/3/0/3/2/8/8/303288-sss_vertical.webp',
      'https://cdn.streetstylestore.com/3/0/3/2/8/6/303286-sss_vertical.webp',
      'https://cdn.streetstylestore.com/3/0/3/2/8/7/303287-sss_vertical.webp',
      'https://cdn.streetstylestore.com/3/0/3/2/8/8/303288-sss_vertical.webp',
      'https://cdn.streetstylestore.com/3/0/3/2/8/6/303286-sss_vertical.webp',
      'https://cdn.streetstylestore.com/3/0/3/2/8/7/303287-sss_vertical.webp'
    ],
    reviews: [
      { name: 'Alice', rating: 5, comment: 'Loved it! Great quality.', photos: ['https://randomuser.me/api/portraits/women/65.jpg', 'https://randomuser.me/api/portraits/women/66.jpg'] },
      { name: 'Bob', rating: 4, comment: 'Good fit, nice fabric.', photos: ['https://randomuser.me/api/portraits/men/65.jpg'] }
    ]
  }
]

// Fetch product
const fetchProduct = async (parentSlug, childSlug) => {
  loading.value = true
  await new Promise(res => setTimeout(res, 300))
  product.value = allProducts.find(p => p.slug === childSlug && p.parent === parentSlug) || allProducts[0]
  selectedImage.value = product.value?.images?.[0] || fallbackImage
  loading.value = false
}

watch(() => route.params, ({ parent, slug }) => {
  if (parent && slug) fetchProduct(parent, slug)
}, { immediate: true })

const addToCart = (prod) => {
  console.log(`${prod.name} added to cart!`)
}

// Image slider
const prevImage = () => {
  const index = product.value.images.indexOf(selectedImage.value)
  const newIndex = (index - 1 + product.value.images.length) % product.value.images.length
  selectedImage.value = product.value.images[newIndex]
}

const nextImage = () => {
  const index = product.value.images.indexOf(selectedImage.value)
  const newIndex = (index + 1) % product.value.images.length
  selectedImage.value = product.value.images[newIndex]
}
</script>

<style scoped>
@keyframes bounce-offer {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

.animate-bounce-offer {
  animation: bounce-offer 1s infinite;
}


/* Loader */
.loader {
  border: 4px solid #ddd;
  border-top-color: #000;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
