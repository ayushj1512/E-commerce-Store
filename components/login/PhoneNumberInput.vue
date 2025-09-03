<template>
    <div class="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h2 class="text-2xl font-bold mb-4 text-center text-black">Enter Mobile Number</h2>

        <img src="https://i.pinimg.com/736x/25/7d/36/257d3658f5c87f706a1ee9404e7519ef.jpg" alt="decorative"
            class="w-50 object-contain rounded" />


        <input v-model="phoneNumber" type="tel" maxlength="10" placeholder="Enter your mobile number"
            @input="handleInput" class="w-full p-3 border border-black rounded mb-4 text-black text-lg text-center" />

        <!-- Image below the input -->


        <button @click="sendOtpHandler" class="w-full bg-black text-white p-3 rounded hover:bg-gray-800">
            Send OTP
        </button>

        <p v-if="message" class="mt-2 text-center text-red-500">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const phoneNumber = ref("");
const message = ref("");

const emit = defineEmits(["otpSent"]);

const sendOtpHandler = () => {
    if (!/^\d{10}$/.test(phoneNumber.value)) {
        message.value = "Please enter a valid 10-digit mobile number.";
        return;
    }

    // Generate dummy OTP for demo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    emit("otpSent", { phoneNumber: phoneNumber.value, otp });

    message.value = `OTP sent to ${phoneNumber.value}`;
};

const handleInput = () => {
    if (phoneNumber.value.length === 10) {
        sendOtpHandler();
    }
};
</script>

<style scoped>
input {
    font-weight: 500;
}

/* Focus effect */
input:focus {
    outline: none;
    border-color: black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
