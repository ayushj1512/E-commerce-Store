<script setup>
import { Share2 } from "lucide-vue-next"

const shareProduct = async () => {
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this product!",
        text: "Found this product, have a look 👇",
        url,
      })
    } catch (err) {
      console.error("Sharing failed:", err)
    }
  } else {
    try {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    } catch (err) {
      console.error("Copy failed:", err)
    }
  }
}
</script>

<template>
  <button
    @click="shareProduct"
    class="p-3 rounded-full bg-black text-white border border-gray-800 shadow-md hover:scale-110 hover:bg-gray-900 transition-transform duration-200 flex items-center justify-center"
    aria-label="Share this product"
  >
    <Share2 class="w-5 h-5" />
  </button>
</template>
