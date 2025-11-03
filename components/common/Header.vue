<template>
  <div class="header-wrapper">
    <header
      :class="[
        'bg-white text-black shadow-md z-50',
        !isListingPage ? 'sticky top-0' : 'md:sticky md:top-0'
      ]"
    >
      <!-- 🌐 Mobile Header -->
      <div class="flex items-center justify-between px-4 py-3 md:hidden">
        <button @click="mobileSidebarOpen = true" class="focus:outline-none">
          <Menu class="w-6 h-6" />
        </button>

        <!-- Logo -->
        <div class="cursor-pointer" @click="navigateTo('/')">
          <img
            src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg"
            alt="Street Style Store"
            class="h-10 object-contain"
          />
        </div>

        <!-- Search / Icons -->
        <div class="flex items-center space-x-4">
          <button
            @click="navigateToSearch()"
            class="hover:text-gray-600 transition-colors"
          >
            <SearchIcon class="w-6 h-6" />
          </button>

          <span><ProfileIcon /></span>
          <span><WishlistIcon /></span>
          <span><CartIcon /></span>
        </div>
      </div>

      <!-- 💻 Desktop Header -->
      <div class="hidden md:flex items-center justify-between px-6 py-3 relative">
        <!-- Logo -->
        <div class="cursor-pointer" @click="navigateTo('/')">
          <img
            src="https://images.streetstylestore.com/new-sssnew-images/sss-logo.jpg"
            alt="Street Style Store"
            class="h-10 object-contain"
          />
        </div>

        <!-- Menu -->
        <nav class="flex-1 flex justify-center space-x-6">
          <div
            v-for="menu in menus"
            :key="menu.name"
            class="relative cursor-pointer"
          >
            <button
              class="font-medium hover:text-gray-600 transition-colors"
              @click="navigateToCategory(menu.name)"
            >
              {{ menu.name }}
            </button>
          </div>
        </nav>

        <!-- Right Icons -->
        <div class="flex items-center space-x-4">
          <button
            @click="navigateToSearch()"
            class="hover:text-gray-600 transition-colors"
          >
            <SearchIcon class="w-6 h-6" />
          </button>
          <span><ProfileIcon /></span>
          <span><WishlistIcon /></span>
          <span><CartIcon /></span>
        </div>
      </div>

      <!-- 📱 Mobile Sidebar -->
      <transition name="slide">
        <div
          v-if="mobileSidebarOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-50"
          @click.self="mobileSidebarOpen = false"
        >
          <div
            class="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col overflow-y-auto"
          >
            <!-- Close -->
            <div class="flex justify-end p-4">
              <button
                @click="mobileSidebarOpen = false"
                class="focus:outline-none"
              >
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
                  @click="handleMobileCategory(menu.name)"
                  class="w-full text-left px-4 py-3 font-medium hover:bg-gray-100 transition-colors"
                >
                  {{ menu.name }}
                </button>
              </div>
            </nav>
          </div>
        </div>
      </transition>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, X, SearchIcon } from "lucide-vue-next";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlist";
import slugify from "slugify";

import WishlistIcon from "@/components/header/WishlistIcon.vue";
import CartIcon from "@/components/header/CartIcon.vue";
import ProfileIcon from "@/components/header/ProfileIcon.vue";

const cart = useCartStore();
const wishlist = useWishlistStore();
const router = useRouter();
const route = useRoute();

const isListingPage = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  return segments.length === 2;
});

// 🧭 Menu list
const menus = [
  { name: "Tops" },
  { name: "Dress" },
  { name: "Bottoms" },
  { name: "Bags" },
  { name: "Boots" },
];

const mobileSidebarOpen = ref(false);

onMounted(() => {
  cart.loadCart();
  wishlist.loadWishlist();
});

// 🧩 Navigation Helpers
const navigateTo = (path) => {
  router.push(path);
  mobileSidebarOpen.value = false;
};

const navigateToCategory = (category) => {
  const slug = slugify(category, { lower: true });
  router.push(`/collection/${slug}`);
};

const handleMobileCategory = (category) => {
  navigateToCategory(category);
  mobileSidebarOpen.value = false;
};

const navigateToSearch = (query) => {
  if (typeof window !== "undefined" && window.innerWidth < 768)
    router.push("/search");
  else if (query)
    router.push(`/search-results?query=${encodeURIComponent(query)}`);
  else router.push("/search");
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
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
