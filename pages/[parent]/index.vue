<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 py-6">
    <!-- Loader -->
    <div v-if="showLoader" class="flex justify-center items-center h-screen">
      <div class="flex flex-col items-center space-y-3">
        <div class="loader"></div>
        <p class="text-gray-600 font-medium text-lg">Loading content...</p>
      </div>
    </div>

    <!-- ✅ Collection Page -->
    <CollectionPage v-else-if="route.params.parent === 'collection'" />

    <!-- Stores Page -->
    <div v-else-if="stores.length > 0" class="px-4 md:px-10">
      <h2 class="text-4xl font-bold text-gray-800 mb-8 text-center">Our Stores</h2>
      <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="(store, storeIndex) in stores" :key="storeIndex">
          <div
            class="relative bg-gradient-to-br from-white via-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col justify-between h-full"
          >
            <!-- Store Badge -->
            <div
              v-if="store.isNew"
              class="absolute top-4 right-4 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg"
            >
              NEW
            </div>

            <!-- Store Header -->
            <div class="flex items-center gap-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-7 h-7 text-purple-600"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <h5 class="text-xl font-bold text-gray-900">{{ store.name }}</h5>
            </div>

            <!-- Store Address -->
            <div class="text-gray-700 text-sm mb-6 space-y-1">
              <div>{{ store.address1 }}</div>
              <div>{{ store.address2 }}</div>
              <div>{{ store.city }}, {{ store.postcode }}</div>
              <div>{{ store.country }}</div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3 mt-auto">
              <a
                :href="store.note"
                target="_blank"
                class="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-2 rounded-lg text-center shadow-md hover:scale-105 transition-transform"
              >
                Get Directions
              </a>
              <button
                @click="viewCatalog(store.website_url, 'clothing')"
                class="border border-purple-600 text-purple-700 font-semibold py-2 rounded-lg text-center hover:bg-purple-50 hover:text-purple-900 transition"
              >
                View Clothing
              </button>
              <button
                @click="viewCatalog(store.website_url, 'shoes')"
                class="border border-purple-600 text-purple-700 font-semibold py-2 rounded-lg text-center hover:bg-purple-50 hover:text-purple-900 transition"
              >
                View Shoes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CMS Content -->
    <div v-else-if="cmsContent" class="px-4 md:px-10">
      <div class="cmsContent prose max-w-none text-gray-800" v-html="cmsContent"></div>
    </div>

    <!-- Error Handler Fallback -->
    <ErrorHandler v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "#app";
import axios from "axios";
import CollectionPage from "~/components/collection/collectionPage.vue";
import ErrorHandler from "~/components/common/errorHandler.vue"; // ✅ Import ErrorHandler

const route = useRoute();
const router = useRouter();

// Reactive state
const cmsContent = ref("");
const showLoader = ref(false);
const stores = ref([]);

// Globals
const $globals = {
  site: "sss",
  microSite: "sss",
  gatewayUrl: "https://gateway.streetstylestore.com/gateway/v1/",
};

// SSR-safe: only run on client
const isClient = typeof window !== "undefined";

// Fetch CMS content
const getCMSContent = async (idCMS) => {
  if (!isClient) return null; // Prevent SSR fetch
  try {
    const requestData = {
      gateway_action: "common/cmsContent",
      microSite: $globals.microSite,
      site: $globals.site,
      idCMS,
    };
    const response = await axios.post($globals.gatewayUrl, requestData);
    return response.data;
  } catch (err) {
    console.error("Error fetching CMS content:", err);
    return null;
  }
};

// Fetch page data
const fetchPageData = async () => {
  if (!isClient) return; // SSR-safe
  if (route.params.parent !== "collection") {
    showLoader.value = true;
    const returnVal = await getCMSContent(route.params.parent);
    if (returnVal) {
      if (route.params.parent === "stores") {
        stores.value = returnVal.content.map((s) => ({
          ...s,
          isNew: Math.random() < 0.3, // random badge
        }));
      } else {
        cmsContent.value = returnVal.content;
      }
    }
    showLoader.value = false;
  }
};

// Navigate to catalog
const viewCatalog = (storeUrl, type) => {
  if (!isClient) return;
  router.push(`/store/${storeUrl}/${type}`);
};

// Mount only on client
if (isClient) {
  onMounted(fetchPageData);
}
</script>

<style scoped>
/* Loader Animation */
.loader {
  border: 4px solid #ddd;
  border-top-color: #7c3aed; /* purple accent */
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* CMS Content Styles */
.cmsContent > p > strong {
  color: #7c3aed;
}
.cmsContent > p {
  margin-bottom: 0.8rem;
  color: #4a4343;
  font-family: "Lato", sans-serif;
}
.prose img {
  max-width: 100%;
  height: auto;
}
.cmsContent.prose {
  font-family: "Lato", sans-serif;
  color: #4a4343;
  line-height: 1.7;
  max-width: 100%;
}
.cmsContent.prose h1,
.cmsContent.prose h2,
.cmsContent.prose h3,
.cmsContent.prose h4 {
  font-weight: 800;
  color: #7c3aed; /* purple theme */
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
.cmsContent.prose p {
  margin-bottom: 1rem;
  font-size: 1rem;
}
.cmsContent.prose a {
  color: #9333ea;
  font-weight: 600;
  text-decoration: underline;
  transition: color 0.3s;
}
.cmsContent.prose a:hover {
  color: #7c3aed;
}
.cmsContent.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}
.cmsContent.prose ul,
.cmsContent.prose ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.cmsContent.prose blockquote {
  border-left: 4px solid #7c3aed;
  padding-left: 1rem;
  color: #555;
  font-style: italic;
  margin: 1rem 0;
}
</style>
