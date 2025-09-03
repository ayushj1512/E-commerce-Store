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
import { ref, defineEmits, defineProps } from "vue";

const props = defineProps({
  phoneNumber: String
});

const emit = defineEmits(["registered"]);

const name = ref("");
const email = ref("");
const address = ref("");
const message = ref("");

const submitHandler = () => {
  if (!name.value || !email.value || !address.value) {
    message.value = "Please fill all details.";
    return;
  }

  // Send registration data to parent (dummy for now)
  emit("registered", {
    phoneNumber: props.phoneNumber,
    name: name.value,
    email: email.value,
    address: address.value
  });

  message.value = "Registration complete!";
};
</script>

<style scoped>
/* Theme already black & white */
</style>
