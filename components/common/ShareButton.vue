<script setup>
import { Share2 } from "lucide-vue-next"

const shareProduct = async () => {
  const url = window.location.href

  // Friendly, inviting text
  const shareText = "Hey! I just found this amazing product and thought you might love it too 😍. Check it out below!"

  if (navigator.share) {
    try {
      await navigator.share({
        title: "A Special Recommendation Just For You!",
        text: shareText,
        url,
      })
    } catch (err) {
      console.error("Sharing failed:", err)
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`)
      alert("Link and message copied to clipboard! Share it with your friends 😊")
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
