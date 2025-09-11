<template>
  <div class="w-full max-w-md mx-auto p-5 bg-black rounded-lg shadow-md flex flex-col items-center">
    <h2 class="text-xl font-semibold mb-3 text-center text-white">Enter Your Phone Number</h2>

    <img
      src="https://i.pinimg.com/736x/95/90/25/959025a4c08cc4051c00e38c7bc62cbd.jpg"
      alt="otp decorative"
      class="w-28 aspect-[4/5] mb-3 object-cover rounded"
    />

    <input
      v-model="phone"
      type="tel"
      placeholder="Enter 10-digit number"
      maxlength="10"
      @keypress.enter="sendOtp"
      class="w-full h-12 mb-4 px-3 rounded text-black text-lg focus:outline-none"
    />

    <button
      @click="sendOtp"
      class="w-full bg-white text-black p-3 rounded hover:bg-gray-200 text-base font-medium"
    >
      Send OTP
    </button>

    <p v-if="message" class="mt-2 text-center text-red-400 text-sm">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["otpSent"]);

const phone = ref("");
const message = ref("");

const sendOtp = async () => {
  // Sanitize number
  const sanitizedPhone = phone.value.trim();

  if (!/^\d{10}$/.test(sanitizedPhone)) {
    message.value = "Enter a valid 10-digit phone number";
    return;
  }

  try {
    const res = await fetch("http://localhost:3003/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: sanitizedPhone }),
    });

    const data = await res.json();
    console.log("[PhoneNumberInput] Send OTP response:", data);

    if (res.ok) {
      message.value = ""; // ✅ Clear any previous error
      emit("otpSent", {
        phoneNumber: sanitizedPhone,
        otp: data.otp,
        existingUser: data.existingUser,
      });
    } else {
      message.value = data.error || "Failed to send OTP. Try again.";
    }
  } catch (err) {
    console.error("[PhoneNumberInput] Error sending OTP:", err);
    message.value = "Error connecting to server";
  }
};
</script>

<style scoped>
input {
  font-weight: 500;
}
</style>
