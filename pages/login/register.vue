<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
      <!-- Greeting -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-black">Welcome!</h2>
        <p class="text-gray-600 text-sm">Let's create your account in just a few steps.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Mobile Number -->
        <div>
          <label class="block text-sm font-medium text-black mb-1">Mobile Number</label>
          <div class="flex items-center border border-gray-300 rounded-md px-3">
            <Phone class="w-4 h-4 text-gray-500 mr-2" />
            <input
              v-model="mobileNumber"
              type="text"
              placeholder="Enter mobile number"
              class="w-full py-2 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-black mb-1">Email</label>
          <div class="flex items-center border border-gray-300 rounded-md px-3">
            <Mail class="w-4 h-4 text-gray-500 mr-2" />
            <input
              v-model="email"
              type="email"
              placeholder="Enter email"
              class="w-full py-2 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-black mb-1">Password</label>
          <div class="flex items-center border border-gray-300 rounded-md px-3">
            <Lock class="w-4 h-4 text-gray-500 mr-2" />
            <input
              v-model="password"
              type="password"
              placeholder="Enter password"
              class="w-full py-2 focus:outline-none"
              required
            />
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-black mb-1">Confirm Password</label>
          <div class="flex items-center border border-gray-300 rounded-md px-3">
            <Check class="w-4 h-4 text-gray-500 mr-2" />
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              class="w-full py-2 focus:outline-none"
              required
            />
          </div>
          <p v-if="passwordMismatch" class="text-red-600 text-xs mt-1">Passwords do not match.</p>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          class="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition disabled:opacity-50"
          :disabled="loading || passwordMismatch"
        >
          <span v-if="loading">Creating Account...</span>
          <span v-else>Register</span>
        </button>
      </form>

      <!-- Alert -->
      <p v-if="alertMessage" class="text-red-600 text-sm text-center mt-4">{{ alertMessage }}</p>
      
      <!-- Cute fallback message -->
      <p v-else class="text-gray-500 text-sm text-center mt-4">
        Already have an account? Login and start exploring!
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Phone, Mail, Lock, Check } from "lucide-vue-next";

export default {
  name: "Register",
  components: { Phone, Mail, Lock, Check },
  data() {
    return {
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      alertMessage: "",
    };
  },
  computed: {
    passwordMismatch() {
      return this.password && this.confirmPassword && this.password !== this.confirmPassword;
    },
  },
  methods: {
    async handleRegister() {
      if (this.passwordMismatch) {
        this.alertMessage = "Passwords must match!";
        return;
      }

      this.loading = true;
      this.alertMessage = "";

      try {
        const requestData = JSON.stringify({
          gateway_action: "customer/createAccount",
          mobileNumber: this.mobileNumber,
          site: "streetstylestore",
          passwd: this.password,
          email: this.email,
          firstName: "",
          lastName: "",
          checkout: false,
        });

        const response = await axios.post(import.meta.env.VITE_BASE_URL, requestData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (response.data.status === 200) {
          console.log("✅ Registration Success:", response.data);
          this.$router.push("/profile");
        } else {
          this.alertMessage = response.data.alertMessage || "Registration failed.";
        }
      } catch (error) {
        console.error("❌ Error during registration:", error);
        this.alertMessage = "Something went wrong. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Mobile Optimization */
@media (max-width: 640px) {
  .max-w-md {
    width: 100%;
    padding: 1rem;
  }
}
</style>
