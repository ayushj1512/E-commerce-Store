<template>
  <div class="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4 text-center text-black">Complete Registration</h2>

    <input
      v-model="name"
      type="text"
      placeholder="Full Name"
      class="w-full p-3 border border-black rounded mb-4 text-black"
    />

    <input
      v-model="email"
      type="email"
      placeholder="Email Address"
      class="w-full p-3 border border-black rounded mb-4 text-black"
    />

    <input
      v-model="address"
      type="text"
      placeholder="Address"
      class="w-full p-3 border border-black rounded mb-4 text-black"
    />

    <button
      @click="submitHandler"
      class="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
    >
      Register
    </button>

    <p v-if="message" class="mt-2 text-center text-red-500">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  phoneNumber: String,
});

const emit = defineEmits(["registered"]);

const name = ref("");
const email = ref("");
const address = ref("");
const message = ref("");

const authStore = useAuthStore();

// ✅ Node.js backend URL
const BACKEND_URL = "http://localhost:3003/register";

const submitHandler = async () => {
  if (!name.value || !email.value || !address.value) {
    message.value = "Please fill all details.";
    return;
  }

  try {
    console.log("[NewUserForm] Submitting registration for:", props.phoneNumber);

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber: props.phoneNumber,
        name: name.value,
        email: email.value,
        address: address.value,
      }),
    });

    const data = await res.json();
    console.log("[NewUserForm] Registration response:", data);

    if (res.ok) {
      // Save token + id + name in Pinia store
      authStore.setAuth({
        token: data.token,
        id_customer: data.id_customer,
        name: data.name,
      });

      emit("registered", data);
      message.value = "Registration successful!";
    } else {
      message.value = data.error || "Registration failed. Try again.";
    }
  } catch (err) {
    console.error("[NewUserForm] Error registering user:", err);
    message.value = "Error connecting to server";
  }
};
</script>

<style scoped>
/* Input & button styling already black & white */
</style>
