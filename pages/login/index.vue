<template>
  <div class="min-h-screen flex flex-col justify-center items-center p-6 sm:p-10 bg-gradient-to-br from-gray-100 to-gray-200 space-y-6">

    <!-- Step 1: Mobile Number Input -->
    <div
      v-if="step === 1"
      class="w-full max-w-md sm:max-w-lg text-center bg-white/80 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 border border-gray-100"
    >
      <div class="space-y-2">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back!</h1>
        <p class="text-gray-600 text-base">You're just a step away from your wardrobe needs</p>
      </div>

      <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-black">
        <span class="px-4 text-gray-700 font-semibold">+91</span>
        <input
          v-model="auth.mobileNumber"
          type="tel"
          maxlength="10"
          placeholder="Enter mobile number"
          class="w-full p-4 focus:outline-none text-gray-900 text-lg placeholder-gray-400"
        />
      </div>

      <!-- Send OTP Button -->
      <button
        class="w-full relative flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl font-semibold shadow-lg transform transition-all duration-300 group hover:-translate-y-1 hover:scale-[1.05] hover:shadow-2xl active:scale-[0.98]"
        @click="sendOTP"
        :disabled="auth.loading || !auth.mobileNumber || auth.mobileNumber.length < 10"
      >
        <RefreshCw class="w-5 h-5 animate-spin" v-if="auth.loading" />
        <span class="relative z-10">{{ auth.loading ? 'Sending OTP...' : 'Send OTP' }}</span>
      </button>

      <p v-if="message" class="text-red-500 text-sm mt-2">{{ message }}</p>
    </div>

    <!-- Step 2: OTP Verification -->
    <div
      v-if="step === 2"
      class="w-full max-w-md sm:max-w-lg text-center bg-white/80 backdrop-blur-lg p-10 sm:p-12 rounded-3xl shadow-2xl space-y-8 border border-gray-100"
    >
      <div class="space-y-2">
        <h2 class="text-2xl font-extrabold text-gray-900">Almost There!</h2>
        <p class="text-gray-600">
          We sent a 6-digit OTP to <span class="font-semibold text-gray-900">{{ auth.mobileNumber }}</span>
        </p>
      </div>

      <!-- OTP Inputs (Responsive fix) -->
      <div class="flex justify-center gap-2 w-full px-2">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          v-model="otpDigits[index]"
          type="text"
          maxlength="1"
          class="flex-1 min-w-[36px] max-w-[56px] h-12 sm:h-14 md:h-16 text-center border border-gray-300 rounded-xl focus:outline-none
                 focus:ring-2 focus:ring-black text-lg sm:text-xl font-bold shadow-sm transition-all bg-white"
          @input="focusNext(index, $event)"
          @keydown.backspace="focusPrev(index, $event)"
        />
      </div>

      <!-- Verify OTP Button -->
      <button
        class="w-full relative flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl font-semibold shadow-lg transform transition-all duration-300 group hover:-translate-y-1 hover:scale-[1.05] hover:shadow-2xl active:scale-[0.98]"
        @click="verifyOTP"
        :disabled="auth.loading || otpDigits.join('').length < otpLength"
      >
        <Check class="w-5 h-5" v-if="!auth.loading" />
        <span class="relative z-10">{{ auth.loading ? 'Verifying...' : 'Verify OTP' }}</span>
      </button>

      <p v-if="otpMessage" class="text-red-500 text-sm">{{ otpMessage }}</p>

      <!-- Resend OTP Buttons -->
      <div v-if="timer <= 0" class="flex flex-col gap-4 mt-4">
        <button
          class="resend-btn bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:scale-[1.05] hover:shadow-xl"
          @click="resendOTP(false)"
          :disabled="auth.loading"
        >
          <MessageCircle class="w-5 h-5" />
          <span>Resend via SMS</span>
        </button>

        <button
          class="resend-btn bg-gradient-to-r from-green-500 to-green-700 text-white hover:scale-[1.05] hover:shadow-xl"
          @click="resendOTP(true)"
          :disabled="auth.loading"
        >
          <span class="w-5 h-5" v-html="whatsappSVG"></span>
          <span>Resend via WhatsApp</span>
        </button>
      </div>

      <p v-else class="text-gray-500 text-sm">
        You can resend OTP in <span class="font-semibold">{{ timer }}s</span>
      </p>
    </div>

    <!-- Step 3: Success -->
    <div
      v-if="step === 3"
      class="text-center bg-white/80 backdrop-blur-lg p-10 sm:p-12 rounded-3xl shadow-2xl space-y-4 border border-gray-100"
    >
      <h2 class="text-3xl font-extrabold text-gray-900">Welcome, {{ auth.name }}!</h2>
      <p class="text-gray-600">You're all set to grab your wardrobe needs</p>
      <div class="w-20 h-20 mx-auto border-4 border-black rounded-full animate-ping mt-6"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { RefreshCw, MessageCircle, Check } from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();

const step = ref(1);
const otpLength = 6;
const otpDigits = ref(Array(otpLength).fill(""));
const message = ref("");
const otpMessage = ref("");
const timer = ref(30);
let timerInterval = null;

const whatsappSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor"><path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1z"/></svg>`;

onMounted(() => {
  if (auth?.isAuthenticated || auth?.session) router.replace("/profile");
  startWebOTPListener();
});

const startTimer = () => {
  timer.value = 30;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timer.value > 0) timer.value--;
    else clearInterval(timerInterval);
  }, 1000);
};

const sendOTP = async () => {
  if (!auth.mobileNumber || auth.mobileNumber.length < 10) {
    message.value = "Enter a valid 10-digit number";
    return;
  }
  message.value = "";
  try {
    await auth.sendLoginOTP(false);
    step.value = 2;
    otpDigits.value = Array(otpLength).fill("");
    startTimer();
  } catch (err) {
    message.value = "Failed to send OTP. Try again.";
    console.error(err);
  }
};

const resendOTP = async (viaWhatsapp = false) => {
  otpDigits.value = Array(otpLength).fill("");
  otpMessage.value = "";
  try {
    await auth.sendLoginOTP(viaWhatsapp);
    startTimer();
  } catch (err) {
    otpMessage.value = "Failed to resend OTP. Try again.";
    console.error(err);
  }
};

const focusNext = (index, event) => {
  if (event.target.value.length === 1 && index < otpLength - 1) {
    event.target.nextElementSibling.focus();
  }
};
const focusPrev = (index, event) => {
  if (!otpDigits.value[index] && event.key === "Backspace" && index > 0) {
    event.target.previousElementSibling.focus();
  }
};

const verifyOTP = async () => {
  const otp = otpDigits.value.join("");
  if (otp.length < otpLength) {
    otpMessage.value = `Enter the full ${otpLength}-digit OTP`;
    return;
  }
  otpMessage.value = "";
  try {
    const res = await auth.verifyOtp(otp);
    if (res?.newUser) otpMessage.value = "New user detected. Registration required.";
    else {
      step.value = 3;
      setTimeout(() => router.push("/profile"), 1500);
    }
  } catch (err) {
    otpMessage.value = "OTP verification failed. Try again.";
    console.error(err);
  }
};

const startWebOTPListener = async () => {
  if ("OTPCredential" in window && navigator.credentials) {
    try {
      const content = await navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: new AbortController().signal,
      });
      if (content && content.code) {
        otpDigits.value = content.code.split("").slice(0, otpLength);
        verifyOTP();
      }
    } catch (err) {
      console.log("Web OTP not supported or denied:", err);
    }
  }
};

onMounted(() => () => clearInterval(timerInterval));
</script>

<style scoped>
.resend-btn {
  @apply w-full flex items-center justify-center gap-3 p-4 rounded-2xl shadow-md transform transition-all duration-300 font-medium overflow-hidden relative;
}
input:focus {
  transition: all 0.2s ease-in-out;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
</style>
