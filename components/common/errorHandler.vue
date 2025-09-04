<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white flex items-center justify-center px-4 py-12">
    
    <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl space-y-6 transform transition-all duration-700 animate-fade-in">

      <!-- Sad Face Icon -->
      <div class="flex justify-center mb-4">
        <div class="w-28 h-28 rounded-full bg-red-400 flex items-center justify-center animate-bounce-forever shadow-2xl">
          <Frown class="h-14 w-14 text-white"/>
        </div>
      </div>

      <!-- Header -->
      <h1 class="text-4xl md:text-5xl font-great-vibes text-black font-bold tracking-wide">
        Oops! We couldn't find that.
      </h1>

      <!-- Message -->
      <p class="text-gray-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
        Looks like the page you’re looking for doesn’t exist. Don’t worry, we’ll help you get back on track! 😊
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <button
          class="bg-black text-white font-semibold py-3 px-7 rounded-xl shadow-md hover:bg-white hover:text-black transition transform hover:-translate-y-1 hover:scale-105"
          @click="goHome"
        >
          Go Back Home
        </button>

        <button
          class="bg-teal-500 text-white font-semibold py-3 px-7 rounded-xl shadow-md hover:bg-teal-600 transition transform hover:-translate-y-1 hover:scale-105"
          @click="continueShopping"
        >
          Continue Shopping
        </button>
      </div>

      <!-- Optional Footer -->
      <p class="text-xs text-gray-400 mt-6">
        If you think this is a mistake, contact <a href="mailto:support@sss.com" class="underline hover:text-gray-600">support@sss.com</a>
      </p>

    </div>

  </div>
</template>

<script setup>
import { Frown } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
}

const continueShopping = () => {
  router.push('/collection'); // Update with your shop route
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.font-great-vibes {
  font-family: 'Great Vibes', cursive;
  font-weight: 700;
}

/* Bounce animation for the icon */
@keyframes bounce-forever {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.animate-bounce-forever {
  animation: bounce-forever 0.8s ease-in-out infinite;
}

/* Fade-in animation for card */
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s ease forwards;
}
</style>
