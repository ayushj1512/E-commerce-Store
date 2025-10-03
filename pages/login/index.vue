<template>
  <div class="min-h-screen flex flex-col justify-center items-center p-4 bg-white">

    <!-- Step 1: Mobile Number Input -->
    <div v-if="step === 1" class="w-full max-w-sm text-center">
      <h1 class="text-3xl font-bold mb-2 text-black">Welcome Back!</h1>
      <p class="text-gray-700 mb-6">You're just a step away from your wardrobe needs</p>

      <div class="flex items-center border border-gray-400 rounded-lg overflow-hidden mb-4 shadow-sm">
        <span class="px-3 text-black font-semibold">+91</span>
        <input
          v-model="auth.mobileNumber"
          type="tel"
          maxlength="10"
          placeholder="Enter mobile number"
          class="w-full p-4 focus:outline-none text-black text-lg"
        />
      </div>

      <button
        class="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-md"
        @click="sendOTP"
        :disabled="auth.loading || !auth.mobileNumber || auth.mobileNumber.length < 10"
      >
        {{ auth.loading ? "Sending OTP..." : "Send OTP" }}
      </button>

      <p v-if="message" class="mt-2 text-red-500 text-sm">{{ message }}</p>
    </div>

    <!-- Step 2: OTP Verification -->
    <div v-if="step === 2" class="w-full max-w-sm text-center">
      <h2 class="text-2xl font-bold mb-2 text-black">Almost There!</h2>
      <p class="text-gray-700 mb-4">We sent a 4-digit OTP to {{ auth.mobileNumber }}</p>

      <!-- OTP Inputs -->
      <div class="flex justify-center space-x-3 mb-4">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          v-model="otpDigits[index]"
          type="text"
          maxlength="1"
          class="w-16 h-16 text-center border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-2xl font-bold shadow-sm"
          @input="focusNext(index, $event)"
          @keydown.backspace="focusPrev(index, $event)"
        />
      </div>

      <button
        class="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-md"
        @click="verifyOTP"
        :disabled="auth.loading || otpDigits.join('').length < 4"
      >
        {{ auth.loading ? "Verifying..." : "Verify OTP" }}
      </button>

      <p v-if="otpMessage" class="mt-2 text-red-500 text-sm">{{ otpMessage }}</p>
    </div>

    <!-- Step 3: Success -->
    <div v-if="step === 3" class="text-center">
      <h2 class="text-3xl font-bold mb-2 text-black">Welcome, {{ auth.name }}!</h2>
      <p class="text-gray-700 mb-4">You're all set to grab your wardrobe needs</p>
      <div class="w-20 h-20 mx-auto border-4 border-black rounded-full animate-ping mt-4"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const step = ref(1);
const otpDigits = ref(["", "", "", ""]);
const message = ref("");
const otpMessage = ref("");

// ✅ Redirect if session already exists
onMounted(() => {
  if (auth?.isAuthenticated || auth?.session) {
    router.replace("/profile");
  }
});

// Send OTP
const sendOTP = async () => {
  if (!auth.mobileNumber || auth.mobileNumber.length < 10) {
    message.value = "Enter a valid 10-digit number";
    return;
  }
  message.value = "";
  try {
    await auth.sendLoginOTP();
    step.value = 2;
  } catch (err) {
    message.value = "Failed to send OTP. Try again.";
    console.error("Send OTP error:", err);
  }
};

// Focus next OTP input
const focusNext = (index, event) => {
  if (event.target.value.length === 1 && index < otpDigits.value.length - 1) {
    event.target.nextElementSibling.focus();
  }
};

// Focus previous on backspace
const focusPrev = (index, event) => {
  if (!otpDigits.value[index] && event.key === "Backspace" && index > 0) {
    event.target.previousElementSibling.focus();
  }
};

// Verify OTP
const verifyOTP = async () => {
  const otp = otpDigits.value.join("");
  if (otp.length < 4) {
    otpMessage.value = "Enter the full 4-digit OTP";
    return;
  }
  otpMessage.value = "";
  try {
    const res = await auth.verifyOtp(otp);
    if (res?.newUser) {
      otpMessage.value = "New user detected. Registration required.";
    } else {
      step.value = 3;
      setTimeout(() => router.push("/profile"), 1500);
    }
  } catch (err) {
    otpMessage.value = "OTP verification failed. Try again.";
    console.error("OTP verify error:", err);
  }
};
</script>

<style scoped>
input:focus {
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
