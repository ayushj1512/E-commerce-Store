<template>
  <!-- Toast container -->
  <div
    class="fixed z-50 flex flex-col gap-3 pointer-events-none
           left-1/2 top-5 transform -translate-x-1/2
           md:left-auto md:top-5 md:right-5 md:translate-x-0"
  >
    <transition-group name="toast" tag="div" class="flex flex-col gap-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-3xl shadow-xl cursor-pointer max-w-xs w-full backdrop-blur-xl"
        :class="toastClasses(toast.type)"
        @click="removeToast(toast.id)"
      >
        <span class="text-lg">{{ toast.icon }}</span>
        <span class="flex-1 font-medium text-sm">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { reactive } from 'vue'

// Global reactive toasts store
const toasts = reactive([])

// Emoji mapping for events including new scenarios
const icons = {
  success: '🎉',
  error: '🔥',
  warning: '⚡',
  update: '✅',
  'product-added': '🛒',
  'product-removed': '❌',
}

// Add toast function
function addToast(type, message) {
  const id = Date.now() + Math.floor(Math.random() * 1000)
  const icon = icons[type] || 'ℹ️'
  toasts.push({ id, type, message, icon })

  setTimeout(() => removeToast(id), 2500)
}

// Remove toast
function removeToast(id) {
  const index = toasts.findIndex(t => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

// Dynamic text color
function toastClasses(type) {
  switch (type) {
    case 'success': return 'text-green-600'
    case 'error': return 'text-red-600'
    case 'warning': return 'text-yellow-600'
    case 'update': return 'text-blue-600'
    case 'product-added': return 'text-green-700'
    case 'product-removed': return 'text-red-700'
    default: return 'text-black'
  }
}

export default {
  name: 'GlobalToast',
  setup() {
    return {
      toasts,
      addToast,
      removeToast,
      toastClasses
    }
  }
}

// Export addToast globally for use in other components
export { addToast }
</script>

<style scoped>
/* Poppy animation */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  transform: translateY(-40px) scale(0.8);
  opacity: 0;
}
.toast-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.toast-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.toast-leave-to {
  transform: translateY(-20px) scale(0.9);
  opacity: 0;
}

/* Optional: Responsive positioning tweaks */
@media (min-width: 768px) {
  /* Medium screens and above: top-right corner */
  .toast-container {
    left: auto !important;
    right: 1.25rem; /* 5 */
    top: 1.25rem; /* 5 */
    transform: none !important;
  }
}
</style>
