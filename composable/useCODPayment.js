// composable/useCODPayment.js
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

export function useCODPayment() {
  const auth = useAuthStore();

  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);
  const response = ref(null);

  const confirmCODPayment = async () => {
    error.value = null;
    success.value = false;

    if (!auth.key || !auth.id_customer || !auth.cart_id) {
      error.value = "Missing authentication or cart details.";
      console.warn("[useCODPayment] ❌ Missing auth/cart info.");
      return;
    }

    loading.value = true;

    try {
      const payload = {
        gateway_action: "cart/addPayment",
        payment: "cod",
        version: "1",
        id_cart: auth.cart_id,
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
      };

      console.log("📦 [useCODPayment] Sending payload:", payload);

      const res = await fetch("https://gateway.streetstylestore.com/gateway/v1/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ Read response as text first (to handle empty body)
      const text = await res.text();
      let data = null;

      if (text && text.trim().length > 0) {
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.warn("⚠️ [useCODPayment] Could not parse JSON:", text);
        }
      } else {
        console.log("ℹ️ [useCODPayment] Empty response body from server.");
      }

      response.value = data;

      if (res.ok) {
        success.value = true;
        console.log("🎉 [useCODPayment] COD confirmed successfully.");
      } else {
        error.value = data?.error || `Failed (HTTP ${res.status})`;
        console.error("[useCODPayment] ❌ COD failed:", error.value);
      }
    } catch (err) {
      error.value = err.message || "Unexpected error while confirming COD.";
      console.error("[useCODPayment] ❌ Exception:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    confirmCODPayment,
    loading,
    error,
    success,
    response,
  };
}
