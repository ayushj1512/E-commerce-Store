<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-8 lg:px-16">
    <!-- Header -->
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <User class="w-7 h-7 text-gray-800" />
      Profile & Stats
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center h-40">
      <span class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-600 font-medium text-center">
      {{ error }}
    </div>

    <!-- Not Influencer -->
    <div
      v-else-if="!isInfluencer"
      class="flex flex-col items-center justify-center h-60 text-center space-y-4"
    >
      <p class="text-gray-800 text-lg font-medium">
        You aren't eligible for this program right now.
      </p>
      <p class="text-gray-600">
        Sign up for our influencer program and start earning!
      </p>
      <button
        @click="$router.push('/influencer')"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
      >
        Join Influencer Program
      </button>
    </div>

    <!-- Influencer Content -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <!-- Total Commission (Green) -->
      <div class="stat-card bg-green-50">
        <div class="flex items-center gap-2">
          <DollarSign class="w-5 h-5 text-green-600" />
          <h2 class="stat-title text-green-700">Total Commission</h2>
        </div>
        <p class="stat-value text-green-600">₹{{ summary.total_commission }}</p>
      </div>

      <!-- Orders -->
      <div class="stat-card bg-white">
        <div class="flex items-center gap-2">
          <Package class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Orders</h2>
        </div>
        <ul class="mt-3 space-y-1 text-gray-800">
          <li>Total: <span class="font-semibold">{{ summary.total_orders }}</span></li>
          <li>Exchanges: <span class="font-semibold">{{ summary.total_exchange }}</span></li>
          <li>RTO: <span class="font-semibold">{{ summary.total_rto }}</span></li>
          <li>Value: <span class="font-semibold">₹{{ summary.total_order_value }}</span></li>
        </ul>
      </div>

      <!-- Customers -->
      <div class="stat-card bg-white">
        <div class="flex items-center gap-2">
          <Users class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Customers</h2>
        </div>
        <p class="stat-value text-gray-800">{{ summary.total_customers }}</p>
      </div>

      <!-- Coupons -->
      <div class="stat-card bg-white">
        <div class="flex items-center gap-2">
          <TicketPercent class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Coupons</h2>
        </div>
        <p class="stat-value text-gray-800">{{ summary.total_coupons }}</p>
      </div>

      <!-- Products Assigned -->
      <div class="stat-card bg-white">
        <div class="flex items-center gap-2">
          <ShoppingBag class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Products Assigned</h2>
        </div>
        <p class="stat-value text-gray-800">{{ summary.total_product_assigned }}</p>
      </div>

      <!-- Posts -->
      <div class="stat-card bg-white">
        <div class="flex items-center gap-2">
          <FileText class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Posts</h2>
        </div>
        <p class="stat-value text-gray-800">{{ summary.total_posts }}</p>
      </div>

      <!-- Social Handles -->
      <div class="stat-card md:col-span-2 lg:col-span-3 bg-white">
        <div class="flex items-center gap-2">
          <Globe class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Social Profiles</h2>
        </div>
        <ul class="mt-3 space-y-1 text-gray-800">
          <li>
            Instagram:
            <span class="font-medium">
              <a
                v-if="summary.instagram_handle"
                :href="`https://instagram.com/${summary.instagram_handle.replace('@','')}`"
                target="_blank"
                class="hover:underline text-gray-900"
              >
                {{ summary.instagram_handle }}
              </a>
              <span v-else>—</span>
            </span>
          </li>
          <li>
            YouTube:
            <span class="font-medium">
              <a
                v-if="summary.youtube_channel"
                :href="`https://youtube.com/${summary.youtube_channel}`"
                target="_blank"
                class="hover:underline text-gray-900"
              >
                {{ summary.youtube_channel }}
              </a>
              <span v-else>—</span>
            </span>
          </li>
          <li>
            Facebook:
            <span class="font-medium">
              <a
                v-if="summary.facebook_profile"
                :href="`https://facebook.com/${summary.facebook_profile.replace('@','')}`"
                target="_blank"
                class="hover:underline text-gray-900"
              >
                {{ summary.facebook_profile }}
              </a>
              <span v-else>—</span>
            </span>
          </li>
        </ul>
      </div>

      <!-- Account Created -->
      <div
        v-if="summary.date_add"
        class="stat-card md:col-span-2 lg:col-span-3 bg-white"
      >
        <div class="flex items-center gap-2">
          <Calendar class="w-5 h-5 text-gray-700" />
          <h2 class="stat-title text-gray-900">Account Created</h2>
        </div>
        <p class="mt-2 text-gray-800">{{ summary.date_add }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useCookies } from "@vueuse/integrations/useCookies"
import {
  User,
  DollarSign,
  Package,
  Users,
  TicketPercent,
  ShoppingBag,
  FileText,
  Globe,
  Calendar
} from "lucide-vue-next"

const summary = ref(null)
const loading = ref(true)
const error = ref(null)
const isInfluencer = ref(false)

const cookies = useCookies()
const key = cookies.get("key") || null
const id_customer = cookies.get("id_customer") || null
const mobile = cookies.get("mobileNumber") || ""

const checkInfluencer = async () => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL,
      {
        gateway_action: "customer/index",
        type: "checkIsInfluencer",
        mobile,
        site: "sss",
        id_customer,
        user_hash_key: key,
      },
      { headers: { "Content-Type": "application/json" } }
    )
    if (response.data?.is_influencer === "1") {
      isInfluencer.value = true
      await fetchResellerSummary()
    } else {
      isInfluencer.value = false
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const fetchResellerSummary = async () => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL,
      {
        gateway_action: "customer/reseller/index",
        type: "summary",
        mobile,
        site: "sss",
        id_customer,
        user_hash_key: key,
      },
      { headers: { "Content-Type": "application/json" } }
    )

    if (response.data?.status === "success" && response.data?.data) {
      summary.value = response.data.data
    } else {
      summary.value = response.data
    }
  } catch (err) {
    error.value = err.message
  }
}

onMounted(checkInfluencer)
</script>

<style scoped>
.stat-card {
  @apply shadow rounded-xl p-5 transition transform hover:shadow-lg hover:-translate-y-1 bg-white;
}
.stat-title {
  @apply text-lg font-semibold;
}
.stat-value {
  @apply text-2xl font-bold mt-2;
}
</style>
