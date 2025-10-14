<template>
  <div class="relative w-36 sm:w-35">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      class="w-full flex justify-between items-center px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition transform bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <span class="flex items-center gap-1 truncate">
        {{ currentLabel }}
        <ArrowUp
          v-if="selected === 'hightolow'"
          class="w-4 h-4 text-gray-600 animate-bounce"
        />
        <ArrowDown
          v-if="selected === 'lowtohigh'"
          class="w-4 h-4 text-gray-600 animate-bounce"
        />
      </span>
      <ChevronDown
        class="w-4 h-4 text-gray-600 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <ul
        v-if="isOpen"
        class="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-y-auto max-h-60"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          @keydown.enter.prevent="selectOption(option)"
          tabindex="0"
          class="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer transition font-medium focus:bg-gray-100 truncate"
          :class="{ 'bg-gray-50 text-gray-900': selected === option.value }"
          role="option"
          :aria-selected="selected === option.value"
        >
          <Check
            v-if="selected === option.value"
            class="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
          />
          <span class="truncate">{{ option.label }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ChevronDown, Check, ArrowUp, ArrowDown } from "lucide-vue-next";

const props = defineProps({
  modelValue: { type: String, default: "default" },
  options: { type: Array, required: true }
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selected = ref(props.modelValue);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  selected.value = option.value;
  isOpen.value = false;
  emit("update:modelValue", option.value);
};

const currentLabel = computed(() => {
  const opt = props.options.find(o => o.value === selected.value);
  return opt ? opt.label : "Sort";
});

watch(() => props.modelValue, (val) => {
  selected.value = val;
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
.rotate-180 {
  transform: rotate(180deg);
}
.animate-bounce {
  animation: bounce 0.6s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
</style>
