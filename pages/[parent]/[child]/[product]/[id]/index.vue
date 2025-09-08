<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-10 font-sans">
    <!-- Loading Shimmer -->
    <div v-if="loading" class="space-y-6">
      <div class="w-full h-[450px] bg-gray-200 rounded-xl animate-pulse"></div>
      <div class="flex gap-4 overflow-x-auto">
        <div class="h-40 w-40 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" v-for="n in 6" :key="n"></div>
      </div>
      <div class="space-y-4 max-w-md">
        <div class="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="flex gap-4">
          <div class="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div class="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20 text-red-500">{{ error }}</div>

    <!-- Product Content -->
    <div v-else>
      <div class="flex flex-col md:flex-row gap-10">
        <!-- Left Images -->
        <div class="md:w-1/2 flex flex-col gap-4">
          <!-- Thumbnails (show only if more than 1 image) -->
          <div v-if="product.images.length > 1" class="order-2 md:order-1 flex gap-4 overflow-x-auto w-full mt-4 md:mt-0">
            <div
              v-for="(img, index) in product.images"
              :key="index"
              class="bg-gray-50 rounded-xl flex items-center justify-center p-3 cursor-pointer transition transform hover:scale-105 flex-shrink-0"
              style="width: 160px; height: 160px;"
              @click="selectImage(index)"
              :class="selectedIndex === index ? 'border-2 border-black' : 'border-2 border-gray-200'"
            >
              <img :src="img.img" alt="Product Image" class="rounded-lg w-full h-full object-contain" />
            </div>
          </div>

          <!-- Selected Image -->
          <div class="w-full rounded-xl flex items-center justify-center p-6 h-[450px] transition order-1 md:order-2">
            <img :src="selectedImage" alt="Selected Product Image" class="rounded-lg w-full h-full object-contain" />
          </div>
        </div>

        <!-- Product Info -->
        <div class="md:w-1/2 space-y-6">
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">{{ product.name }}</h1>

          <div class="flex items-baseline gap-3">
            <p class="text-2xl font-semibold">₹{{ product.selling_price }}</p>
            <p v-if="product.discount_price > 0" class="text-base line-through text-gray-500">
              ₹{{ (parseFloat(product.selling_price) + parseFloat(product.discount_price)).toFixed(2) }}
            </p>
          </div>

          <p v-if="product.description_short" class="text-gray-600 leading-relaxed">{{ product.description_short }}</p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button class="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition">
              Buy Now
            </button>
            <button class="flex-1 border-2 border-black text-black py-3 px-6 rounded-full font-semibold hover:bg-black hover:text-white transform hover:scale-105 transition">
              Add to Cart
            </button>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <h3 class="font-semibold">Delivery Information</h3>
            <p class="text-gray-600 text-sm leading-relaxed mt-1">{{ product.delivery_information }}</p>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <h3 class="font-semibold">Return Information</h3>
            <p class="text-gray-600 text-sm leading-relaxed mt-1" v-html="product.return_information"></p>
          </div>
        </div>
      </div>

      <!-- Size Chart & Guidance -->
      <div class="mt-12 max-w-3xl mx-auto">
        <button @click="showSizeChart = !showSizeChart" class="w-full flex justify-between items-center px-5 py-4 bg-gray-100 rounded-lg text-left hover:shadow transition transform hover:scale-102">
          <span class="font-semibold tracking-wide">Size Chart & Guidance</span>
          <span class="text-2xl">{{ showSizeChart ? '−' : '+' }}</span>
        </button>
        <transition name="fade">
          <div v-if="showSizeChart" class="p-6 border border-gray-200 rounded-lg mt-4 bg-white overflow-x-auto transition">
            <table class="table-auto border-collapse border border-gray-300 w-full text-sm text-center">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="(header, i) in product.customSizeChartArr.header" :key="i" class="border border-gray-300 px-3 py-2 font-medium">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in product.customSizeChartArr.tableBody" :key="ri">
                  <td v-for="(cell, ci) in row" :key="ci" class="border border-gray-300 px-3 py-2">{{ cell }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mt-6 space-y-4">
              <div v-for="(note, i) in product.customSizeChartArr.bottomRow" :key="i" class="text-sm text-gray-700 leading-relaxed">
                <strong class="block">{{ note.title }}</strong>
                <p>{{ note.description }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Additional Info -->
      <div class="mt-12 max-w-3xl mx-auto">
        <h3 class="font-semibold mb-3 text-lg">More Information</h3>
        <ul class="space-y-2 text-sm text-gray-700">
          <li v-for="(desc, i) in product.description" :key="i">
            <strong>{{ desc.name }}:</strong> {{ desc.value }}
          </li>
        </ul>
      </div>

      <!-- Frequently Bought Together -->
      <div class="mt-12 max-w-5xl mx-auto">
        <h3 class="font-semibold mb-5 text-lg">Frequently Bought Together</h3>
        <div class="flex gap-4 py-2 overflow-x-auto">
          <div v-for="(item, i) in product.fbt" :key="i" class="flex-shrink-0 w-48 border border-gray-200 rounded-lg p-3 transform hover:scale-102 transition">
            <div class="bg-gray-50 rounded-md flex items-center justify-center h-48">
              <img :src="item.img" alt="" class="max-h-40 object-contain" />
            </div>
            <p class="mt-3 text-sm font-semibold">{{ item.name }}</p>
            <p class="text-gray-600 text-xs">₹{{ item.selling_price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ofetch } from "ofetch";

const showSizeChart = ref(false);
const selectedIndex = ref(0);
const selectedImage = ref("");
const product = ref({});
const loading = ref(true);
const error = ref(null);

const route = useRoute();
const API_URL = "https://api.streetstylestore.com";
const API_KEY = "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx";

async function fetchProduct() {
  loading.value = true;
  error.value = null;

  if (history.state && history.state.product) {
    product.value = history.state.product;
    selectedImage.value = product.value.images[0]?.bigImg || "";
    loading.value = false;
    return;
  }

  try {
    const productId = route.params.id;
    const url = `${API_URL}/collections/products/documents/${productId}`;
    const res = await ofetch(url, { headers: { "x-typesense-api-key": API_KEY } });

    const doc = res.document ?? res;
    let parsedData = {};
    try { parsedData = doc.product_data ? JSON.parse(doc.product_data) : {}; } catch (e) {}

    const firstData = parsedData["0"] || {};
    product.value = {
      ...doc,
      name: doc.name || firstData.name || "",
      selling_price: doc.real_selling_price ?? doc.selling_price ?? parseFloat(firstData.selling_price) ?? 0,
      discount_price: doc.discount_price ?? parseFloat(firstData.discount_price) ?? 0,
      description_short: firstData.description_short || doc.description_short || "",
      images: parsedData.images || [],
      customSizeChartArr: parsedData.customSizeChartArr || { header: [], tableBody: [], bottomRow: [] },
      description: parsedData.description || doc.description || [],
      fbt: parsedData.fbt || [],
      delivery_information: parsedData.delivery_information || doc.delivery_information || "",
      return_information: parsedData.return_information || doc.return_information || "",
    };

    selectedImage.value = product.value.images[0]?.bigImg || "";
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch product data.";
  } finally {
    loading.value = false;
  }
}

function selectImage(index) {
  selectedIndex.value = index;
  selectedImage.value = product.value.images[index].bigImg;
}

onMounted(fetchProduct);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
