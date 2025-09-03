<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 w-72">
    <transition-group name="slide-fade" tag="div">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="px-4 py-3 rounded-xl shadow-lg text-white flex items-center justify-between"
        :class="{
          'bg-green-500': n.type === 'success',
          'bg-red-500': n.type === 'error',
          'bg-yellow-500': n.type === 'warning',
          'bg-blue-500': n.type === 'info',
        }"
      >
        <span class="text-sm font-medium">{{ n.message }}</span>
        <button @click="removeNotification(n.id)" class="ml-3 text-white font-bold">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotification } from "@/composables/useNotification";

const { notifications, removeNotification } = useNotification();
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
