<template>
  <div
    :class="[
      'w-full max-w-sm p-3 my-2 rounded-xl border shadow-sm transition-colors duration-300',
      componentColor.bg,
      componentColor.border
    ]"
  >
    <h2 :class="['text-base font-semibold mb-2', componentColor.text]">Check Pincode</h2>

    <!-- Input + Button -->
    <div class="flex gap-2 mb-2">
      <input
        v-model="pinCode"
        type="text"
        placeholder="Enter pincode"
        :class="[
          'flex-1 rounded-md px-3 py-1.5 text-sm focus:outline-none transition border',
          componentColor.text,
          componentColor.border,
          componentColor.placeholder
        ]"
      />
      <button
        @click="checkPinCode"
        :class="['rounded-md text-sm font-medium flex items-center justify-center gap-1 px-3 py-1.5 transition', buttonColor]"
      >
        <Check class="w-4 h-4" /> Check
      </button>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="text-gray-500 text-xs italic">Checking...</p>

    <!-- Result -->
    <div v-if="statusMessage" class="flex items-center gap-1 text-xs font-medium mt-1">
      <component
        :is="available === true ? Check : available === false ? X : Info"
        class="w-4 h-4"
        :class="componentColor.text"
      />
      <span :class="componentColor.text">{{ statusMessage }}</span>
    </div>

    <!-- COD / Prepaid Info -->
    <div v-if="codInfo !== null || prepaidInfo !== null" class="mt-2">
      <div
        class="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md"
        :class="codInfo || prepaidInfo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'"
      >
        <CreditCard class="w-3 h-3" /> 
        {{ codInfo || prepaidInfo ? "Delivery Available" : "Delivery Not Available" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ofetch } from "ofetch";
import { Check, X, Info, CreditCard } from "lucide-vue-next";

const pinCode = ref("");
const loading = ref(false);
const available = ref(null);
const statusMessage = ref("");
const codInfo = ref(null);
const prepaidInfo = ref(null);

// Dynamic colors
const componentColor = computed(() => {
  if (available.value === null) {
    return { bg: "bg-white", border: "border-black", text: "text-black", placeholder: "placeholder-gray-400" };
  }
  if (codInfo.value || prepaidInfo.value) {
    return { bg: "bg-green-50", border: "border-green-600", text: "text-green-700", placeholder: "placeholder-green-600" };
  }
  return { bg: "bg-red-50", border: "border-red-600", text: "text-red-600", placeholder: "placeholder-red-600" };
});

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

  loading.value = true;
  statusMessage.value = "";
  available.value = null;
  codInfo.value = null;
  prepaidInfo.value = null;

  try {
    // Minimal payload without auth
    const payload = {
      gateway_action: "order/checkPinCode",
      pin_code: pinCode.value,
      site: "sss",
      id_cart: "0", // default dummy cart
      id_customer: "0", // dummy user
      user_hash_key: "", // no login
    };

    const res = await ofetch("https://gateway.streetstylestore.com/gateway/v1/", { method: "POST", body: payload });

    if (res.details) {
      codInfo.value = res.details.cod === 1;
      prepaidInfo.value = res.details.prepaid === 1;
      available.value = codInfo.value || prepaidInfo.value ? true : false;

      statusMessage.value = available.value
        ? `Good news! We deliver to ${pinCode.value}.`
        : `Sorry! Not available for ${pinCode.value}.`;
    } else {
      available.value = false;
      codInfo.value = false;
      prepaidInfo.value = false;
      statusMessage.value = "Unable to fetch info.";
    }
  } catch (err) {
    available.value = false;
    codInfo.value = false;
    prepaidInfo.value = false;
    statusMessage.value = "Something went wrong.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>
