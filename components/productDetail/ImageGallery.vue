<template>
  <div class="flex flex-col gap-4">
    <!-- 🔄 Loading Shimmer -->
    <template v-if="loading">
      <div class="w-full h-[450px] bg-gray-200 rounded-xl animate-pulse"></div>
      <div class="flex gap-4 overflow-x-auto mt-4 no-scrollbar">
        <div
          v-for="n in 4"
          :key="n"
          class="h-36 w-36 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
        ></div>
      </div>
    </template>

    <!-- ✅ Actual Images -->
    <template v-else>
      <!-- Main Image -->
      <div
        class="w-full h-[450px] p-4 bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <!-- Left Arrow -->
        <button
          v-if="images.length > 1"
          @click="prevImage"
          class="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
        >
          ‹
        </button>

        <img
          :src="selectedImage"
          alt="Selected Product"
          class="rounded-lg w-full h-full object-contain transition-transform duration-300"
          :style="{ transform: `translateX(${slideOffset}px)` }"
        />

        <!-- Right Arrow -->
        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow"
        >
          ›
        </button>
      </div>

      <!-- Thumbnails -->
      <div v-if="images.length > 1" class="flex gap-4 overflow-x-auto mt-4 no-scrollbar">
        <div
          v-for="(img, i) in images"
          :key="i"
          @click="selectImage(i)"
          :class="[
            'p-2 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 border-2',
            selectedIndex === i ? 'border-black' : 'border-gray-200'
          ]"
          style="width:140px;height:140px"
        >
          <img
            :src="img.img"
            alt="Thumb"
            class="rounded-lg w-full h-full object-contain"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  images: { type: Array, required: true },
  modelValue: { type: String, default: "" },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue"]);

const selectedIndex = ref(0);
const selectedImage = ref(props.modelValue || (props.images[0]?.bigImg || props.images[0]?.img || ""));

// Swipe tracking
let startX = 0;
const slideOffset = ref(0);

const onTouchStart = (e) => {
  startX = e.touches[0].clientX;
};

const onTouchEnd = (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (Math.abs(diff) > 50 && props.images.length > 1) {
    if (diff < 0) nextImage();
    else prevImage();
  }
  slideOffset.value = 0;
};

const selectImage = (idx) => {
  selectedIndex.value = idx;
  selectedImage.value = props.images[idx]?.bigImg || props.images[idx]?.img || "";
  emit("update:modelValue", selectedImage.value);
};

const nextImage = () => {
  if (props.images.length <= 1) return;
  selectedIndex.value = (selectedIndex.value + 1) % props.images.length;
  selectImage(selectedIndex.value);
};

const prevImage = () => {
  if (props.images.length <= 1) return;
  selectedIndex.value = (selectedIndex.value - 1 + props.images.length) % props.images.length;
  selectImage(selectedIndex.value);
};

// Watch for parent changes
watch(
  () => props.modelValue,
  (val) => {
    if (val) selectedImage.value = val;
  }
);
</script>

<style>
/* ✅ Hide scrollbar for thumbnails */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE */
  scrollbar-width: none; /* Firefox */
}
</style>
