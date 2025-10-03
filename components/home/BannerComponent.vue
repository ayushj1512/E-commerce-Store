<template>
  <section
    class="w-full overflow-hidden rounded-lg cursor-pointer"
    :style="sectionStyle"
    @click="navigate"
  >
    <!-- Banner Image with fade-in -->
    <transition name="fade">
      <img
        :src="computedSrc"
        alt="Banner"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </transition>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  image: { type: String, required: true }, // URL or public folder filename
  aspect: { type: String, default: "" }, // Optional aspect ratio, e.g., "1200/563"
  link: { type: String, default: "" } // Optional navigation link
});

const router = useRouter();

// Computed src to handle both external URLs and public folder assets
const computedSrc = computed(() => {
  if (!props.image) return "";
  return props.image.startsWith("http") ? props.image : `/${props.image}`;
});

// Computed style for aspect ratio
const sectionStyle = computed(() => {
  if (!props.aspect) return "";
  const [w, h] = props.aspect.split("/").map(Number);
  if (!w || !h) return "";
  const paddingTop = (h / w) * 100;
  return { paddingTop: `${paddingTop}%`, position: "relative" };
});

// Navigate if link is provided
const navigate = () => {
  if (!props.link) return;
  if (props.link.startsWith("http")) {
    window.open(props.link, "_blank");
  } else {
    router.push(props.link);
  }
};
</script>

<style scoped>
/* Make img fill the section */
section img {
  position: absolute;
  top: 0;
  left: 0;
}

/* Fade-in animation */
.fade-enter-active {
  transition: opacity 1s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
</style>
