<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
    <h1 class="text-2xl font-bold mb-6">Nuxt Toast Test Page</h1>

    <div class="flex flex-col md:flex-row gap-4">
      <button
        @click="showSuccessToast"
        class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Show Success Toast
      </button>

      <button
        @click="showErrorToast"
        class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Show Error Toast
      </button>

      <button
        @click="showInfoToast"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Show Info Toast
      </button>

      <button
        @click="showWarningToast"
        class="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
      >
        Show Warning Toast
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "nuxt-toast";

// Initialize toast composable
const toast = useToast();

// Functions to show toast messages
const showSuccessToast = () => {
  toast.success("✅ This is a success message!", { duration: 2000 });
};

const showErrorToast = () => {
  toast.error("❌ Something went wrong!", { duration: 2000 });
};

const showInfoToast = () => {
  toast.info("ℹ️ Here is some information.", { duration: 2000 });
};

const showWarningToast = () => {
  toast.warning("⚠️ This is a warning!", { duration: 2000 });
};
</script>

<style>
body {
  font-family: Inter, sans-serif;
}
</style>
