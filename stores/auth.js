// stores/auth.js
import { defineStore } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    key: null,
    id_customer: null,
    name: null,
    cart_id: null,          // <-- Added cart_id
    isAuthenticated: false,
    loading: false,
    error: null,
    mobileNumber: "",
    newCustomer: false,
  }),

  actions: {
    setCustomer(payload) {
      if (!payload || !payload.key) {
        console.warn("[Auth Store] ⚠️ Invalid payload:", payload);
        return;
      }
      this.key = payload.key;
      this.id_customer = payload.id_customer;
      this.name = payload.first_name || payload.name || "User";
      this.cart_id = payload.cart_id || null;   // <-- Save cart_id
      this.isAuthenticated = true;

      const cookies = useCookies();
      cookies.set("key", this.key, { path: "/", sameSite: "lax" });
      cookies.set("id_customer", this.id_customer, { path: "/", sameSite: "lax" });
      cookies.set("name", this.name, { path: "/", sameSite: "lax" });
      cookies.set("cart_id", this.cart_id, { path: "/", sameSite: "lax" });  // <-- Persist cart_id
      if (this.mobileNumber) {
        cookies.set("mobileNumber", this.mobileNumber, { path: "/", sameSite: "lax" });
      }

      console.log("[Auth Store] ✅ Session persisted:", {
        key: this.key,
        id_customer: this.id_customer,
        name: this.name,
        cart_id: this.cart_id,
        mobileNumber: this.mobileNumber,
      });
    },

    loadSession() {
      if (process.client) {
        const cookies = useCookies();
        this.key = cookies.get("key") || null;
        this.id_customer = cookies.get("id_customer") || null;
        this.name = cookies.get("name") || null;
        this.cart_id = cookies.get("cart_id") || null;   // <-- Load cart_id
        this.mobileNumber = cookies.get("mobileNumber") || "";
        this.isAuthenticated = !!this.key;

        console.log("[Auth Store] 🔄 Session loaded:", {
          key: this.key,
          id_customer: this.id_customer,
          name: this.name,
          cart_id: this.cart_id,
          mobileNumber: this.mobileNumber,
          isAuthenticated: this.isAuthenticated,
        });
      }
    },

    initAuth() {
      console.log("[Auth Store] 🚀 Initializing auth...");
      this.loadSession();
    },

    logout() {
      this.key = null;
      this.id_customer = null;
      this.name = null;
      this.cart_id = null;    // <-- Clear cart_id
      this.mobileNumber = "";
      this.isAuthenticated = false;

      const cookies = useCookies();
      cookies.remove("key");
      cookies.remove("id_customer");
      cookies.remove("name");
      cookies.remove("cart_id");   // <-- Remove cookie
      cookies.remove("mobileNumber");

      console.log("[Auth Store] ❌ Session cleared");
    },

    async sendLoginOTP(viaWhatsapp = false) {
      this.loading = true;
      this.error = null;
      try {
        console.log(`[Auth Store] 📩 Sending OTP for: ${this.mobileNumber}, viaWhatsapp: ${viaWhatsapp}`);
        const res = await $fetch("http://localhost:4000/send-otp", {
          method: "POST",
          body: {
            mobileNumber: this.mobileNumber,
            site: "sss",
            request_type: viaWhatsapp ? "whatsapp" : "",
            id_cart: "", 
            new_otp: "1",
          },
        });
        console.log("[Auth Store] 🔄 API Response (sendLoginOTP):", res);
        return res;
      } catch (err) {
        this.error = err?.data?.error || "Send OTP failed";
        console.error("[Auth Store] ❌ Send OTP Error:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async verifyOtp(otp) {
      this.loading = true;
      this.error = null;
      try {
        console.log("[Auth Store] 📩 Verifying OTP for:", this.mobileNumber);
        const res = await $fetch("http://localhost:4000/verify-otp", {
          method: "POST",
          body: {
            mobileNumber: this.mobileNumber,
            otp,
            newCustomer: this.newCustomer,
            site: "sss",
          },
        });
        console.log("[Auth Store] 🔄 API Response (verifyOtp):", res);

        if (res.newUser) {
          this.newCustomer = true;
          console.log("[Auth Store] 🔹 New user detected");
          return { newUser: true };
        }

        // Store customer info including cart_id
        this.setCustomer({
          key: res.key,
          id_customer: res.id_customer,
          name: res.first_name || res.email || "User",
          cart_id: res.cart_id,   // <-- Add cart_id here
        });

        console.log("[Auth Store] 🔹 Cart ID stored:", this.cart_id);  // <-- Confirm cart_id
        return res;
      } catch (err) {
        this.error = err?.data?.error || "Verify OTP failed";
        console.error("[Auth Store] ❌ Verify OTP Error:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async loginWithPassword(password) {
      this.loading = true;
      this.error = null;
      try {
        console.log("[Auth Store] 🔑 Login with password for:", this.mobileNumber);
        const res = await $fetch("http://localhost:4000/login-password", {
          method: "POST",
          body: { mobileNumber: this.mobileNumber, password, site: "sss" },
        });
        console.log("[Auth Store] 🔄 API Response (loginWithPassword):", res);
        this.setCustomer(res);
        return res;
      } catch (err) {
        this.error = err?.data?.error || "Login failed";
        console.error("[Auth Store] ❌ Login Error:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password) {
      this.loading = true;
      this.error = null;
      try {
        console.log("[Auth Store] 📝 Registering:", this.mobileNumber);
        const res = await $fetch("http://localhost:4000/register", {
          method: "POST",
          body: { mobileNumber: this.mobileNumber, email, password, site: "sss", checkout: false },
        });
        console.log("[Auth Store] 🔄 API Response (register):", res);
        this.setCustomer(res);
        return res;
      } catch (err) {
        this.error = err?.data?.error || "Register failed";
        console.error("[Auth Store] ❌ Register Error:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
