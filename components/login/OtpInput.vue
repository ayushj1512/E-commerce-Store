<template>
  <div class="w-full max-w-md mx-auto p-5 bg-black rounded-lg shadow-md flex flex-col items-center">
    <h2 class="text-xl font-semibold mb-3 text-center text-white">Enter OTP</h2>

    <img
      src="https://i.pinimg.com/736x/95/90/25/959025a4c08cc4051c00e38c7bc62cbd.jpg"
      alt="otp decorative"
      class="w-28 aspect-[4/5] mb-3 object-cover rounded"
    />

    <div class="grid grid-cols-4 gap-2 mb-4 w-full">
      <input
        v-for="(digit, index) in otpDigits"
        :key="index"
        v-model="otpDigits[index]"
        ref="otpRefs"
        type="text"
        maxlength="1"
        class="h-12 text-center border border-white rounded text-white bg-black text-xl focus:outline-none focus:border-gray-300"
        @input="moveToNext(index)"
        @keydown.backspace="moveToPrev(index, $event)"
      />
    </div>

    <button
      @click="verifyOtpHandler"
      class="w-full bg-white text-black p-3 rounded hover:bg-gray-200 text-base font-medium disabled:opacity-50"
      :disabled="authStore.loading"
    >
      {{ authStore.loading ? "Verifying..." : "Verify OTP" }}
    </button>

    <p v-if="message" class="mt-2 text-center text-red-400 text-sm">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  phoneNumber: String,
});

const emit = defineEmits(["verified"]);

const otpDigits = ref(["", "", "", ""]); // 4-digit OTP
const otpRefs = ref([]); // refs for input fields
const message = ref("");
const authStore = useAuthStore();

// Focus on first field on mount
onMounted(() => {
  if (otpRefs.value[0]) otpRefs.value[0].focus();
});

// Move to next input if current is filled
const moveToNext = (i) => {
  if (otpDigits.value[i] && i < otpDigits.value.length - 1) {
    otpRefs.value[i + 1].focus();
  }
};

// Move to previous input on backspace
const moveToPrev = (i, e) => {
  if (!otpDigits.value[i] && e.key === "Backspace" && i > 0) {
    otpRefs.value[i - 1].focus();
  }
};

// ✅ Verify OTP via proxy backend
const verifyOtpHandler = async () => {
  const enteredOtp = otpDigits.value.join("");
  if (enteredOtp.length < 4) {
    message.value = "Enter full 4-digit OTP";
    return;
  }

  try {
    console.log("[OtpInput] Verifying OTP for:", props.phoneNumber);

    const res = await fetch("http://localhost:3003/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: props.phoneNumber,
        otp: enteredOtp,
      }),
    });

    const data = await res.json();
    console.log("[OtpInput] OTP verification response:", data);

    if (res.ok) {
      if (data.newUser) {
        emit("verified", { newUser: true });
      } else {
        // ✅ Match store with "key"
        authStore.setCustomer({
          key: data.key,
          id_customer: data.id_customer,
          name: data.name,
        });

        emit("verified", data);
      }
    } else {
      message.value = data.error || "OTP verification failed. Try again.";
    }
  } catch (err) {
    console.error("[OtpInput] Error verifying OTP:", err);
    message.value = "Error connecting to server";
  }
};
</script>

<style scoped>
input {
  font-weight: 700;
  letter-spacing: 2px;
}
</style>
