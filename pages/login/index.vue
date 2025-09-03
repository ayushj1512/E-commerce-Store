<template>
  <section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md">
      <!-- Step 1: Enter Number -->
      <PhoneNumberInput v-if="!otpSent" @otpSent="handleOtpSent" />

      <!-- Step 2: Enter OTP -->
      <OtpInput
        v-else-if="!verified"
        :sentOtp="sentOtp"
        :phoneNumber="phoneNumber"
        :isNewUser="isNewUser"
        @verified="handleVerified"
      />

      <!-- Step 3: New User Registration -->
      <NewUserForm
        v-else-if="isNewUser"
        :phoneNumber="phoneNumber"
        @registered="handleRegistered"
      />

      <!-- Step 4: Logged In Existing User -->
      <div v-else class="text-center mt-4 text-black text-xl font-bold">
        Welcome back! You are logged in.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// Import the components
import PhoneNumberInput from "@/components/login/PhoneNumberInput.vue";
import OtpInput from "@/components/login/OtpInput.vue";
import NewUserForm from "@/components/login/NewUserForm.vue";

// State
const phoneNumber = ref("");
const sentOtp = ref("");
const otpSent = ref(false);
const verified = ref(false);
const isNewUser = ref(false);

// Handle OTP sent from PhoneNumberInput
const handleOtpSent = ({ phoneNumber: num, otp }) => {
  phoneNumber.value = num;
  sentOtp.value = otp;

  // Dummy logic: numbers ending with "0" are considered existing users
  isNewUser.value = !num.endsWith("0");

  otpSent.value = true;
};

// Handle OTP verified
const handleVerified = () => {
  verified.value = true;
};

// Handle new user registration
const handleRegistered = (data) => {
  console.log("New user registered:", data);

  // After registration, mark user as verified & not new
  isNewUser.value = false;
};
</script>

<style scoped>
/* Overall page black & white theme handled in components */
</style>
