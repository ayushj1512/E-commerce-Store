<template>
  <div class="min-h-screen bg-white px-4 py-6">
    <!-- Heading -->
    <h1 class="text-2xl sm:text-3xl font-extrabold text-black text-center mb-6">
      Support Tickets
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10 text-gray-600">
      Loading tickets...
    </div>

    <!-- Empty State -->
    <div v-else-if="tickets.length === 0" class="text-center py-10">
      <p class="text-gray-700 text-base font-medium">
        You have no support tickets yet 🛠️
      </p>
      <p class="text-gray-500 text-sm">
        Need help? Raise a ticket and we'll assist you promptly.
      </p>
    </div>

    <!-- Tickets List -->
    <div v-else class="space-y-4 max-w-3xl mx-auto">
      <div
        v-for="ticket in tickets"
        :key="ticket.ticket_id"
        class="border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white"
        @click="viewTicket(ticket.ticket_id)"
      >
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-semibold text-black">#{{ ticket.ticket_id }} - {{ ticket.subject }}</h2>
          <span
            class="text-xs px-2 py-1 rounded-full"
            :class="ticket.status === 'open' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'"
          >
            {{ ticket.status }}
          </span>
        </div>
        <p class="text-gray-600 text-sm">Created: {{ ticket.created_at }}</p>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <transition name="fade-scale">
      <div
        v-if="showTicketModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-2xl p-6 sm:p-8 md:p-10 max-w-2xl w-full shadow-xl overflow-y-auto max-h-[80vh]"
        >
          <h2 class="text-xl sm:text-2xl font-bold mb-4">
            Ticket #{{ selectedTicket.ticket_id }} - {{ selectedTicket.subject }}
          </h2>
          <p class="text-gray-600 text-sm mb-4">Status: {{ selectedTicket.status }}</p>

          <!-- Ticket messages -->
          <div class="space-y-3 mb-4">
            <div
              v-for="msg in selectedTicket.messages"
              :key="msg.id"
              class="p-3 rounded-xl"
              :class="msg.sender === 'customer' ? 'bg-gray-100 text-black' : 'bg-black text-white'"
            >
              <p class="text-sm">{{ msg.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ msg.date }}</p>
            </div>
          </div>

          <!-- Reply Section -->
          <textarea
            v-model="replyMessage"
            placeholder="Type your reply..."
            class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mb-4 resize-none"
            rows="4"
          ></textarea>
          <div class="flex justify-end gap-3">
            <button
              @click="submitReply"
              class="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Send Reply
            </button>
            <button
              @click="closeTicketModal"
              class="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const tickets = ref([]);
const loading = ref(true);

// Ticket modal
const showTicketModal = ref(false);
const selectedTicket = ref({});
const replyMessage = ref("");

// Fetch ticket list
const fetchTickets = async () => {
  loading.value = true;
  try {
    if (!auth.isAuthenticated) {
      tickets.value = [];
      return;
    }

    const requestData = JSON.stringify({
      gateway_action: "customer/support",
      action: "list",
      version: "1",
      id_customer: auth.loginData.id_customer,
    });

    const response = await axios.post(import.meta.env.VITE_BASE_URL, requestData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("Ticket List Response:", response.data);
    tickets.value = response.data?.tickets || [];
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    tickets.value = [];
  } finally {
    loading.value = false;
  }
};

// View ticket detail
const viewTicket = async (ticketId) => {
  try {
    const requestData = JSON.stringify({
      gateway_action: "customer/support",
      action: "detail",
      version: "1",
      id_customer: auth.loginData.id_customer,
      ticket_id: ticketId,
    });

    const response = await axios.post(import.meta.env.VITE_BASE_URL, requestData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("Ticket Detail Response:", response.data);
    selectedTicket.value = response.data || {};
    showTicketModal.value = true;
  } catch (err) {
    console.error("Failed to fetch ticket detail:", err);
  }
};

// Submit reply
const submitReply = async () => {
  if (!replyMessage.value.trim()) {
    alert("Please type a reply message.");
    return;
  }

  try {
    const requestData = JSON.stringify({
      gateway_action: "customer/support",
      action: "reply",
      version: "1",
      id_customer: auth.loginData.id_customer,
      ticket_id: selectedTicket.value.ticket_id,
      message: replyMessage.value,
      image: "",
    });

    const response = await axios.post(import.meta.env.VITE_BASE_URL, requestData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("Reply Response:", response.data);
    alert("Reply sent successfully!");

    // Refresh ticket detail
    viewTicket(selectedTicket.value.ticket_id);
    replyMessage.value = "";
  } catch (err) {
    console.error("Failed to send reply:", err);
    alert("Failed to send reply. Please try again.");
  }
};

// Close modal
const closeTicketModal = () => {
  showTicketModal.value = false;
  selectedTicket.value = {};
};

onMounted(() => {
  fetchTickets();
});
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
