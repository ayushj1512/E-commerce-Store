<template>
  <div class="bg-gray-50 min-h-screen py-8 px-4 md:px-12 lg:px-24">
    <div class="max-w-7xl mx-auto space-y-10">
      <!-- Profile Header -->
      <div class="bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <img
            :src="customer.avatar"
            alt="Customer Avatar"
            class="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-black shadow-md"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 flex flex-col gap-2 text-center md:text-left">
          <h1 class="text-2xl md:text-4xl font-extrabold text-black">{{ customer.name }}</h1>
          <p class="text-gray-700 font-medium text-sm md:text-base">{{ customer.email }}</p>
          <span class="inline-block mt-2 px-3 py-1 bg-black text-white font-semibold rounded-full text-sm md:text-base">
            VIP Customer
          </span>
          <p class="mt-3 text-gray-600 italic text-sm md:text-base">"{{ randomQuote }}"</p>
        </div>
      </div>

      <!-- Orders History -->
      <section>
        <h2 class="text-xl md:text-2xl font-bold py-4 text-black">Orders History</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            <h3 class="font-semibold text-black mb-2 text-lg">Order #{{ order.id }}</h3>
            <p class="text-gray-700 text-sm mb-1">Date: {{ order.date }}</p>
            <p class="text-gray-700 text-sm mb-2">Total: ₹{{ order.total }}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="item in order.items"
                :key="item"
                class="text-xs md:text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-800"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Saved Addresses -->
      <section>
        <h2 class="text-xl md:text-2xl font-bold pt-4 pb-6 text-black">Saved Addresses</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            <p class="font-semibold text-black mb-2">{{ address.name }}</p>
            <p class="text-gray-700 text-sm mb-1">{{ address.street }}, {{ address.city }}</p>
            <p class="text-gray-700 text-sm mb-1">{{ address.state }} - {{ address.zip }}</p>
            <p class="text-gray-700 text-sm">{{ address.phone }}</p>
          </div>
        </div>
      </section>

      <!-- Raise Concern / Support -->
      <section class="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-7xl mx-auto">
        <h2 class="text-xl md:text-2xl font-bold mb-4 text-black">Raise a Concern</h2>
        <p class="text-gray-700 mb-4 text-sm md:text-base">
          Facing any issue? Let us know and our support team will assist you.
        </p>
        <textarea
          v-model="concernText"
          placeholder="Type your concern here..."
          class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mb-4 text-sm md:text-base resize-none"
          rows="4"
        ></textarea>
        <button
          @click="submitConcern"
          class="bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-shadow shadow-md text-sm md:text-base"
        >
          Submit
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Customer Details
const customer = ref({
  name: "example example",
  email: "example@gmail.com",
  avatar: "https://i.pravatar.cc/300?img=12",
});

// Fashion Quotes
const quotes = [
  "Fashion is the armor to survive the reality of everyday life.",
  "Style is a way to say who you are without having to speak.",
  "In order to be irreplaceable, one must always be different.",
  "Fashion is about dreaming and making other people dream.",
  "Elegance is not standing out, but being remembered.",
];
const randomQuote = computed(() => quotes[Math.floor(Math.random() * quotes.length)]);

// Orders
const orders = ref([
  { id: 101, date: "2025-08-01", total: 3200, items: ["White Shirt", "Black Jeans"] },
  { id: 102, date: "2025-07-21", total: 1800, items: ["Red T-Shirt", "Cap"] },
  { id: 103, date: "2025-06-15", total: 5000, items: ["Leather Jacket"] },
]);

// Addresses
const addresses = ref([
  { id: 1, name: "Home", street: "123 Street Name", city: "Delhi", state: "Delhi", zip: "110001", phone: "+91 9876543210" },
  { id: 2, name: "Office", street: "456 Another St", city: "Delhi", state: "Delhi", zip: "110002", phone: "+91 9123456780" },
]);

// Concern
const concernText = ref("");
const submitConcern = () => {
  if (!concernText.value.trim()) {
    alert("Please type your concern.");
    return;
  }
  console.log("Concern submitted:", concernText.value);
  alert("Your concern has been submitted! We will contact you soon.");
  concernText.value = "";
};
</script>

<style scoped>
/* Smooth hover for cards */
section div:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>
