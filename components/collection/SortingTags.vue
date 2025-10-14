<template>
  <div class="flex flex-wrap gap-2 overflow-x-auto items-center no-scrollbar">
    <button
      v-for="option in options"
      :key="option.value"
      @click="selectOption(option)"
      :class="[
        selected === option.value
          ? 'bg-black text-white scale-105 shadow-md'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        'px-3 py-1 rounded-full border text-sm whitespace-nowrap'
      ]"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "default" },
  options: { type: Array, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const selected = ref(props.modelValue);

const selectOption = (option) => {
  selected.value = option.value;
  emit("update:modelValue", option.value);
};

watch(() => props.modelValue, (val) => {
  selected.value = val;
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
</style>
