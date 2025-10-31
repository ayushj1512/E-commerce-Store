import { ref, computed, onMounted, watch } from "vue";
import { $fetch } from "ofetch"; // ✅ Import $fetch explicitly
import { useAuthStore } from "~/stores/auth";
import { useAddressStore } from "~/stores/address";

/**
 * ✅ Composable: useFetchPreOrderDetail
 * Fetches preorder details dynamically from gateway
 * based on the selected delivery address from address store.
 */
export function useFetchPreOrderDetail() {
  const auth = useAuthStore();
  const addressStore = useAddressStore();

  // Reactive states
  const loading = ref(false);
  const error = ref(null);
  const details = ref(null);

  // ✅ Dynamically pick selected address ID
  const usedAddressId = computed(() => addressStore.deliveryAddress?.id_address || null);

  /**
   * Fetch preorder details from API
   */
  const fetchPreOrderDetails = async () => {
    console.log("🚀 [useFetchPreOrderDetail] Fetch function triggered...");

    if (!process.client) {
      console.warn("[useFetchPreOrderDetail] 🧠 Skipped: Running on server (SSR).");
      return;
    }

    if (!auth.key || !auth.id_customer || !auth.cart_id) {
      console.warn("[useFetchPreOrderDetail] ⚠️ Missing authentication/cart details:", {
        key: auth.key,
        id_customer: auth.id_customer,
        cart_id: auth.cart_id,
      });
      error.value = "User not authenticated or missing cart details.";
      return;
    }

    if (!usedAddressId.value) {
      console.warn("[useFetchPreOrderDetail] ⚠️ No delivery address selected.");
      error.value = "Please select a delivery address before proceeding.";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const payload = {
        gateway_action: "cart/getPreOrderDetail",
        id_address: usedAddressId.value, // ✅ from address store
        id_cart: auth.cart_id,
        id_customer: auth.id_customer,
        user_hash_key: auth.key,
        version: "1",
        site: "sss",
        checkout: "new",
        deal_city: "",
      };

      console.log("[useFetchPreOrderDetail] 📤 Sending POST request:", payload);

      const res = await $fetch("https://gateway.streetstylestore.com/gateway/v1/", {
        method: "POST",
        headers: {
          "x-typesense-api-key": "Bm23NaocNyDb2qWiT9Mpn4qXdSmq7bqdoLzY6espTB3MC6Rx",
          "Content-Type": "application/json",
        },
        body: payload,
      });

      console.log("[useFetchPreOrderDetail] ✅ API Response received:", res);
      details.value = res;
    } catch (err) {
      console.error("[useFetchPreOrderDetail] ❌ Error fetching preorder details:", err);
      error.value = err?.data?.error || "Failed to fetch preorder details";
    } finally {
      loading.value = false;
      console.log("[useFetchPreOrderDetail] ⏳ Request completed.");
    }
  };

  // ✅ Auto-fetch on mount (client-only)
  onMounted(() => {
    if (process.client) {
      console.log("[useFetchPreOrderDetail] ⏫ Mounted on client → auto-fetching preorder details...");
      fetchPreOrderDetails();
    } else {
      console.log("[useFetchPreOrderDetail] 🧠 Skipping fetch — server side render.");
    }
  });

  // ✅ Refetch when delivery address changes
  watch(
    () => addressStore.deliveryAddress,
    (newVal, oldVal) => {
      if (newVal?.id_address && newVal?.id_address !== oldVal?.id_address) {
        console.log("[useFetchPreOrderDetail] 🔁 Address changed → refetching preorder details...");
        fetchPreOrderDetails();
      }
    },
    { deep: true }
  );

  return {
    fetchPreOrderDetails,
    loading,
    error,
    details,
    usedAddressId,
  };
}
