<template>
  <div class="w-full max-w-md mx-auto p-5 bg-black rounded-lg shadow-md flex flex-col items-center">
    <h2 class="text-xl font-semibold mb-3 text-center text-white">Enter OTP</h2>

    <!-- Image below heading -->
    <img
      src="https://i.pinimg.com/736x/95/90/25/959025a4c08cc4051c00e38c7bc62cbd.jpg"
      alt="otp decorative"
      class="w-28 aspect-[4/5] mb-3 object-cover rounded"
    />

    <!-- 4 Digit OTP Input -->
    <div class="grid grid-cols-4 gap-2 mb-4 w-full">
      <input
        v-for="(digit, index) in otpDigits"
        :key="index"
        v-model="otpDigits[index]"
        type="text"
        maxlength="1"
        class="h-12 text-center border border-white rounded text-white bg-black text-xl focus:outline-none focus:border-gray-300"
        @input="moveToNext(index)"
        @keydown.backspace="moveToPrev(index, $event)"
      />
    </div>

    <!-- Button -->
    <button
      @click="verifyOtpHandler"
      class="w-full bg-white text-black p-3 rounded hover:bg-gray-200 text-base font-medium"
    >
      Verify OTP
    </button>

    <p v-if="message" class="mt-2 text-center text-red-400 text-sm">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  sentOtp: String,
  phoneNumber: String,
  isNewUser: Boolean,
});

const emit = defineEmits(["verified"]);

const otpDigits = ref(["", "", "", ""]);
const message = ref("");

// Move to next input automatically
const moveToNext = (index) => {
  if (otpDigits.value[index] && index < otpDigits.value.length - 1) {
    const nextInput = document.querySelectorAll("input")[index + 1];
    nextInput.focus();
  }
};

// Move back on backspace
const moveToPrev = (index, event) => {
  if (!otpDigits.value[index] && event.key === "Backspace" && index > 0) {
    const prevInput = document.querySelectorAll("input")[index - 1];
    prevInput.focus();
  }
};

const verifyOtpHandler = () => {
  const enteredOtp = otpDigits.value.join("");
  if (enteredOtp !== props.sentOtp) {
    message.value = "Invalid OTP. Try again.";
    return;
  }

  emit("verified", { phoneNumber: props.phoneNumber, isNewUser: props.isNewUser });
};
</script>

<style scoped>
/* Make digits bold */
input {
  font-weight: 700;
  letter-spacing: 2px;
}
</style>
