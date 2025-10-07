<template>
  <div v-if="colors && colors.length" class="flex gap-3 mt-4 flex-wrap">
    <div
      v-for="(color, index) in colors"
      :key="index"
      @click="selectColor(color)"
      :title="color.name"
      :class="['w-10 h-10 rounded-full cursor-pointer border-2', selectedColor?.hex === color.hex ? 'border-black' : 'border-gray-200']"
      :style="{ backgroundColor: color.hex }"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
  colors: { type: Array, default: () => [] },
  modelValue: { type: Object, default: null } // selected color
});

const emits = defineEmits(['update:modelValue', 'update:image']);

const { modelValue } = toRefs(props);
const selectedColor = ref(modelValue.value);

const selectColor = (color) => {
  selectedColor.value = color;
  emits('update:modelValue', color);
  emits('update:image', color.verticalImg); // update main product image
};

watch(modelValue, (newVal) => {
  selectedColor.value = newVal;
});
</script>

<style scoped>
/* Hover effect removed */
</style>
