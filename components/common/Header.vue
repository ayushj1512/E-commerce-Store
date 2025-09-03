<template>
  <header class="bg-white text-black shadow-md relative z-50">

    <!-- Mobile Header -->
    <div class="flex items-center justify-between px-4 py-3 md:hidden">
      <!-- Hamburger (Left) -->
      <button @click="mobileSidebarOpen = true" class="focus:outline-none">
        <Menu class="w-6 h-6" />
      </button>

      <!-- Brand Centered -->
      <div class="text-xl font-bold cursor-pointer" @click="navigateTo('/')">
        SSS
      </div>

      <!-- Right Icons -->
      <div class="flex items-center space-x-4">
        <ShoppingCart
          class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors"
          @click="navigateTo('/cart')"
        />
        <User
          class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors"
          @click="navigateTo('/profile')"
        />
        <Heart
          class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors"
          @click="navigateTo('/wishlist')"
        />
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:flex items-center justify-between px-6 py-3">
      <!-- Brand -->
      <div class="text-2xl font-bold cursor-pointer" @click="router.push('/')">
        Street Style Store
      </div>

      <!-- Menu + Search -->
      <div class="flex items-center space-x-6">
        <nav class="flex space-x-4">
          <div
            v-for="menu in menus"
            :key="menu.name"
            class="relative cursor-pointer"
            @click="router.push('/collection')"
          >
            <button class="font-medium hover:text-gray-600 transition-colors">
              {{ menu.name }}
            </button>
          </div>
        </nav>

        <!-- Search Field -->
        <div>
          <input
            type="text"
            placeholder="Search..."
            class="border border-black rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <!-- Right Icons -->
      <div class="flex items-center space-x-4">
        <ShoppingCart
          class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors"
          @click="router.push('/cart')"
        />
        <User
          class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors"
          @click="router.push('/profile')"
        />
        <Heart
          class="w-6 h-6 hover:text-gray-600 cursor-pointer transition-colors"
          @click="router.push('/wishlist')"
        />
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="slide">
      <div
        v-if="mobileSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click.self="mobileSidebarOpen = false"
      >
        <div class="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col overflow-y-auto">
          <!-- Close Button -->
          <div class="flex justify-end p-4">
            <button @click="mobileSidebarOpen = false" class="focus:outline-none">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Menu -->
          <nav class="flex flex-col">
            <div
              v-for="menu in menus"
              :key="menu.name"
              class="border-b border-gray-200"
            >
              <button
                @click="toggleMenu(menu.name)"
                class="w-full text-left px-4 py-3 font-medium hover:bg-gray-100 flex justify-between items-center"
              >
                {{ menu.name }}
                <span class="text-lg font-bold">{{ openMenus.includes(menu.name) ? '-' : '+' }}</span>
              </button>
              <ul
                v-if="openMenus.includes(menu.name)"
                class="flex flex-col bg-gray-50"
              >
                <li
                  v-for="item in menu.items"
                  :key="item"
                  class="px-6 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm"
                  @click="navigateTo('/collection')"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </nav>

          <!-- Mobile Search -->
          <div class="px-4 py-3 mt-auto">
            <input
              type="text"
              placeholder="Search..."
              class="border border-gray-300 rounded-md px-3 py-2 w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </transition>

  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ShoppingCart, User, Heart, Menu, X } from 'lucide-vue-next';

const router = useRouter();

const menus = [
  { name: "Tops", items: ["Crop Tops", "Blouses", "Shirts", "Tunics", "Graphic Tees"] },
  { name: "Dresses", items: ["Party Dresses", "Casual Dresses", "Maxi Dresses", "Midi Dresses"] },
  { name: "Bottoms", items: ["Jeans", "Skirts", "Shorts", "Trousers", "Leggings"] },
  { name: "Accessories", items: ["Bags", "Belts", "Hats", "Scarves", "Sunglasses"] },
  { name: "Footwear", items: ["Flats", "Heels", "Sneakers", "Sandals"] },
];

const mobileSidebarOpen = ref(false);
const openMenus = ref([]);

const toggleMenu = (name) => {
  if (openMenus.value.includes(name)) {
    openMenus.value = openMenus.value.filter((n) => n !== name);
  } else {
    openMenus.value.push(name);
  }
};

// Navigate and close mobile sidebar automatically
const navigateTo = (path) => {
  router.push(path);
  mobileSidebarOpen.value = false; // auto close sidebar on mobile
};
</script>

<style scoped>
/* Sidebar slide animation */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
