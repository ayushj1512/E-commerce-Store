<template>
  <div class="bg-gray-50 min-h-screen flex flex-col py-6 px-3 sm:px-6 md:px-12 lg:px-24 overflow-x-hidden">
    <div class="mx-auto w-full max-w-3xl space-y-8 flex-1">

      <!-- Header -->
      <div class="text-center mb-6 px-2">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black break-words">
          Account Deactivation
        </h1>
        <p class="text-gray-700 sm:text-base md:text-lg mt-2 break-words">
          Please read carefully before proceeding. Deactivating your account is permanent and cannot be undone.
        </p>
      </div>

      <!-- Info Card -->
      <div class="bg-white shadow-lg rounded-3xl p-6 md:p-10 space-y-4 overflow-hidden">
        <h2 class="text-xl sm:text-2xl font-bold text-black">What happens when you deactivate:</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
          <li>You will be logged out from your SSS account immediately.</li>
          <li>Your reviews/ratings remain visible, but your profile info will be unavailable.</li>
          <li>Wishlist items will no longer be accessible via public links.</li>
          <li>You will be unsubscribed from promotional emails and SMS.</li>
          <li>Order history is retained, but personal information (mobile, email, addresses) will be deleted.</li>
        </ul>
      </div>

      <!-- Send OTP Button -->
      <div class="flex justify-center mt-4">
        <button @click="sendOTP"
          class="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition shadow-md font-semibold text-base">
          Send Deactivation Code
        </button>
      </div>

      <!-- OTP Input Section -->
      <transition name="fade-scale">
        <div v-if="otpSent" class="bg-white shadow-lg rounded-3xl p-6 md:p-10 mt-6 space-y-4">
          <h3 class="text-lg sm:text-xl font-bold text-black text-center">Enter OTP</h3>
          <p class="text-gray-600 text-sm sm:text-base text-center">
            An OTP has been sent to your registered mobile/email. Please enter it below to confirm deactivation.
          </p>
          <input v-model="otp"
            type="text"
            placeholder="Enter OTP"
            class="w-full border border-gray-300 rounded-xl p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-center" />
          <div class="flex justify-center gap-4 flex-wrap">
            <button @click="verifyOTP"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-md">
              Confirm Deactivation
            </button>
            <button @click="otpSent = false"
              class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition shadow-md">
              Cancel
            </button>
          </div>
        </div>
      </transition>

      <!-- Status Message -->
      <div v-if="statusMessage" class="mt-4 text-center text-sm sm:text-base text-gray-800 font-medium">
        {{ statusMessage }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const mounted = ref(true);

const otpSent = ref(false);
const otp = ref('');
const statusMessage = ref('');

// Send OTP
const sendOTP = async () => {
  statusMessage.value = '';
  try {
    const response = await auth.sendDeactivtionCode();
    if (response?.success) {
      otpSent.value = true;
      statusMessage.value = 'OTP sent successfully. Please check your registered mobile/email.';
    } else {
      statusMessage.value = response?.message || 'Failed to send OTP.';
    }
  } catch (err) {
    console.error(err);
    statusMessage.value = 'Something went wrong. Please try again.';
  }
};

// Verify OTP
const verifyOTP = async () => {
  if (!otp.value.trim()) {
    statusMessage.value = 'Please enter the OTP.';
    return;
  }
  try {
    const response = await auth.verifyDeactivationCode(otp.value);
    if (response?.success) {
      statusMessage.value = 'Your account has been successfully deactivated. Logging out...';
      setTimeout(() => {
        auth.logout();
        window.location.href = '/login';
      }, 2000);
    } else {
      statusMessage.value = response?.message || 'Invalid OTP. Please try again.';
    }
  } catch (err) {
    console.error(err);
    statusMessage.value = 'Something went wrong. Please try again.';
  }
};
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
