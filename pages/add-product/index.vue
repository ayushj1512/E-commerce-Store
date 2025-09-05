<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">

      <h1 class="text-2xl font-bold text-gray-800 text-center">Add New Product</h1>

      <!-- Product Name -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Product Name</label>
        <input v-model="name" type="text" placeholder="Enter product name"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
      </div>

      <!-- Price & Discounted Price -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-gray-700 font-medium mb-1">Price</label>
          <input v-model.number="price" type="number" placeholder="₹"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
        <div class="flex-1">
          <label class="block text-gray-700 font-medium mb-1">Discounted Price</label>
          <input v-model.number="discountedPrice" type="number" placeholder="₹"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
      </div>

      <!-- Image Upload OR URL -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">Product Image</label>
        <input ref="fileInput" type="file" accept="image/*" @change="handleFileUpload"
          class="w-full mb-2" />
        <input v-model="imageUrl" type="text" placeholder="Or enter image URL"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
      </div>

      <!-- Loader & Logs -->
      <div v-if="loading" class="py-2">
        <div v-for="(msg, i) in logMessages" :key="i" class="text-purple-700 font-medium">
          {{ msg }}
        </div>
        <svg class="animate-spin h-6 w-6 text-purple-600 mt-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>

      <!-- Auto-generated Tags -->
      <div v-if="tags.length">
        <p class="text-gray-600 font-medium mb-2">Detected Tags:</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in tags" :key="tag" class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Submit Button -->
      <button @click="submitProduct"
        :disabled="loading || !name || !price || (!imageFile && !imageUrl)"
        class="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        Submit Product
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const name = ref("");
const price = ref(0);
const discountedPrice = ref(0);
const imageFile = ref(null);
const imageUrl = ref("");
const tags = ref([]);
const fileInput = ref(null);
const loading = ref(false);
const logMessages = ref([]);

// Handle file input
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  imageUrl.value = "";
};

// Submit product
const submitProduct = async () => {
  if (!name.value || !price.value || (!imageFile.value && !imageUrl.value)) {
    alert("Please fill all required fields and provide an image");
    return;
  }

  loading.value = true;
  logMessages.value = ["Preparing data..."];
  tags.value = [];

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("price", price.value);
  formData.append("discountedPrice", discountedPrice.value);
  if (imageFile.value) formData.append("image", imageFile.value);
  else formData.append("imageUrl", imageUrl.value);

  try {
    logMessages.value.push("Sending request to backend...");
    const res = await axios.post("http://localhost:5000/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.tags && res.data.tags.length > 0) {
      tags.value = res.data.tags;
      logMessages.value.push(`Tags detected: ${tags.value.join(", ")}`);
    } else {
      logMessages.value.push(res.data.error || "No tags detected from backend.");
    }

    alert("Product added successfully!");

    // Reset form
    name.value = "";
    price.value = 0;
    discountedPrice.value = 0;
    imageFile.value = null;
    imageUrl.value = "";
    if (fileInput.value) fileInput.value.value = "";
    logMessages.value.push("Form reset complete.");

  } catch (err) {
    console.error("Error:", err.response?.data || err);
    alert(err.response?.data?.error || "Error adding product");
    logMessages.value.push("Error occurred while submitting product.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
::-webkit-scrollbar { display: none; }
</style>
