<template>
  <div class="bg-gray-50 min-h-screen py-6 px-3 sm:px-6 md:px-12 lg:px-24 flex flex-col">
    <div class="mx-auto w-full max-w-5xl flex flex-col gap-6">
      
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-black mb-2">Choose Your Avatar</h1>
        <p class="text-gray-700 text-base">Select an avatar to use as your profile picture.</p>
      </div>

      <!-- Avatar Grid -->
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6">
        <div 
          v-for="(img, idx) in avatars" 
          :key="idx" 
          class="relative cursor-pointer rounded-full border-4 transition-all duration-300"
          :class="{'border-black scale-105 shadow-lg': img === selectedAvatar, 'border-gray-200': img !== selectedAvatar}"
          @click="selectAvatar(img)"
        >
          <img :src="img" alt="Avatar" class="w-full h-full object-cover rounded-full"/>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-center mt-6">
        <button 
          @click="saveAvatar"
          class="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition shadow-md font-semibold text-base"
        >
          Save & Continue
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';

const router = useRouter();
const cookies = useCookies(['user_avatar']);

const avatars = [
  "https://i.pinimg.com/736x/fc/cf/99/fccf996f13c5752df6b32ae216471dd3.jpg",
  "https://i.pinimg.com/736x/f3/74/ae/f374ae1dcad3e0b5920d23041130dadc.jpg",
  "https://i.pinimg.com/736x/fa/ed/6f/faed6f43b006a945656fe336ee7a1cc4.jpg",
  "https://i.pinimg.com/736x/c8/0a/ce/c80ace7a33192b8efed0c69c378d7077.jpg",
  "https://i.pinimg.com/736x/18/64/cd/1864cd9eca5d91553b5a2d794ba4f0ce.jpg",
  "https://i.pinimg.com/736x/0f/f7/35/0ff73532f7d36d6e47c718aa33a46037.jpg",
  "https://i.pinimg.com/736x/5c/f4/a7/5cf4a79c860f6cfc05998a39ffa1e0ff.jpg",
  "https://i.pinimg.com/1200x/60/63/7a/60637ae29beae63d98efc9c835c0412e.jpg",
  "https://i.pinimg.com/736x/52/7a/92/527a923dc33290ce005013e4efc8e2ee.jpg",
  "https://i.pinimg.com/736x/b4/d0/00/b4d000bba0b2ff0f069192939c005743.jpg",
  "https://i.pinimg.com/736x/dd/8e/0b/dd8e0ba530a6febe11342385a164bdf5.jpg",
  "https://i.pinimg.com/1200x/1a/c3/62/1ac36242f08f474672e5717653fd3a29.jpg"
];

// Initialize selected avatar from cookies or default to first avatar
const selectedAvatar = ref(cookies.get('user_avatar') || avatars[0]);

const selectAvatar = (img) => {
  selectedAvatar.value = img;
};

const saveAvatar = () => {
  // Save avatar in cookie for 30 days
  cookies.set('user_avatar', selectedAvatar.value, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  router.push('/profile'); // Navigate back to profile page
};
</script>

<style scoped>
img:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}
</style>
