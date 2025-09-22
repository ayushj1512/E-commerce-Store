<template>
  <div
    :class="[
      'w-full max-w-sm p-5 my-4 rounded-2xl border shadow-md transition-colors duration-300',
      componentColor.bg,
      componentColor.border
    ]"
  >
    <h2 :class="['text-lg font-semibold mb-4', componentColor.text]">Check Pincode Availability</h2>

    <!-- Input + Button -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="pinCode"
        type="text"
        placeholder="Enter your pincode"
        :class="[
          'flex-1 rounded-lg px-4 py-2 focus:outline-none  transition',
          componentColor.text,
          componentColor.border,
          componentColor.placeholder,
          'border'
        ]"
      />
      <button
        @click="checkPinCode"
        :class="['rounded-lg font-medium flex items-center justify-center gap-1 px-4 py-2 transition', buttonColor]"
      >
        <Check class="w-4 h-4" /> Check
      </button>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="text-gray-500 text-sm mb-2 italic">Checking availability...</p>

    <!-- Result -->
    <div v-if="statusMessage" class="flex items-center gap-2 text-sm font-medium mt-1">
      <component
        :is="available === true ? Check : available === false ? X : Info"
        class="w-5 h-5"
        :class="componentColor.text"
      />
      <span :class="componentColor.text">{{ statusMessage }}</span>
    </div>

    <!-- COD / Prepaid Info -->
    <div v-if="codInfo !== null || prepaidInfo !== null" class="mt-4 flex flex-col gap-2">
      <div
        class="flex items-center gap-2 font-semibold px-3 py-2 rounded-lg"
        :class="codInfo || prepaidInfo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
      >
        <CreditCard class="w-4 h-4" /> 
        {{ codInfo || prepaidInfo ? "Delivery Available" : "Delivery Not Available" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ofetch } from "ofetch";
import { useAuthStore } from "@/stores/auth";
import { Check, X, Info, CreditCard } from "lucide-vue-next";

const authStore = useAuthStore();

const pinCode = ref("");
const loading = ref(false);
const available = ref(null);
const statusMessage = ref("");
const codInfo = ref(null);
const prepaidInfo = ref(null);

// Component colors based on status
const componentColor = computed(() => {
  if (available.value === null) {
    return {
      bg: "bg-white",
      border: "border-black",
      text: "text-black",
      placeholder: "placeholder-gray-400"
    };
  }
  if (codInfo.value || prepaidInfo.value) {
    return {
      bg: "bg-green-50",
      border: "border-green-600",
      text: "text-green-700",
      placeholder: "placeholder-green-600"
    };
  }
  return {
    bg: "bg-red-50",
    border: "border-red-600",
    text: "text-red-600",
    placeholder: "placeholder-red-600"
  };
});

// Button color based on status
const buttonColor = computed(() => {
  if (available.value === null) return "bg-black text-white hover:bg-gray-800";
  if (codInfo.value || prepaidInfo.value) return "bg-green-700 text-white hover:bg-green-800";
  return "bg-red-600 text-white hover:bg-red-700";
});

async function checkPinCode() {
  if (!pinCode.value) {
    statusMessage.value = "Please enter a valid pincode.";
    available.value = null;
    codInfo.value = null;
    prepaidInfo.value = null;
    return;
  }

  if (!authStore.key || !authStore.id_customer) {
    statusMessage.value = "Please login to check delivery availability.";
    available.value = null;
    codInfo.value = null;
    prepaidInfo.value = null;
    return;
  }

  loading.value = true;
  statusMessage.value = "";
  available.value = null;
  codInfo.value = null;
  prepaidInfo.value = null;

  try {
    const payload = {
      gateway_action: "order/checkPinCode",
      pin_code: pinCode.value,
      site: "sss",
      id_cart: authStore.id_cart || "0",
      id_customer: authStore.id_customer,
      user_hash_key: authStore.key,
    };

    const res = await ofetch("https://gateway.streetstylestore.com/gateway/v1/", {
      method: "POST",
      body: payload,
    });

    if (res.details) {
      codInfo.value = res.details.cod === 1;
      prepaidInfo.value = res.details.prepaid === 1;
      available.value = codInfo.value || prepaidInfo.value ? true : false;

      statusMessage.value = available.value
        ? `Good news! We can deliver to ${pinCode.value}.`
        : `Sorry! Delivery is not available for ${pinCode.value}.`;
    } else {
      available.value = false;
      codInfo.value = false;
      prepaidInfo.value = false;
      statusMessage.value = "Unable to fetch delivery info.";
    }
  } catch (err) {
    available.value = false;
    codInfo.value = false;
    prepaidInfo.value = false;
    statusMessage.value = "Oops! Something went wrong. Please try again later.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
input:focus {
  outline: none;
  ring-width: 2;
}
button:focus {
  outline: none;
}
</style>
