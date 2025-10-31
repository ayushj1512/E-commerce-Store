// 📁 src/stores/paymentStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'

export const usePaymentStore = defineStore('payment', () => {
  const sessionId = ref('')
  const paymentData = ref({})
  const loading = ref(false)
  const error = ref(null)

  // 💳 Currently selected payment method (mutually exclusive)
  const selectedPaymentMethod = ref('')

  // ✅ Select a method (always exclusive)
  function selectMethod(method) {
    if (selectedPaymentMethod.value === method) {
      // Deselect if same method clicked again
      selectedPaymentMethod.value = ''
      console.log(`🔕 Deselected payment method: ${method}`)
    } else {
      // Switch method instantly
      selectedPaymentMethod.value = method
      console.log(`✅ Selected payment method: ${method}`)
    }
  }

  // ✅ Helper: check if a method is selected
  function isSelected(method) {
    return selectedPaymentMethod.value === method
  }

  // ✅ Clear selection manually
  function clearSelectedMethod() {
    selectedPaymentMethod.value = ''
  }

  // 🚀 Generate Cashfree Session
  async function proceedToPayment(selectedMethod = selectedPaymentMethod.value || 'upi') {
    try {
      loading.value = true
      error.value = null

      const addressStore = useAddressStore()
      const authStore = useAuthStore()

      // Detect device
      const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      )
      const deviceType = isMobile ? 'Mobile' : 'Desktop'

      // Get valid address
      const selectedAddr =
        addressStore.deliveryAddress ||
        addressStore.selectedAddress ||
        addressStore.addresses?.[0]

      if (!selectedAddr?.id_address) {
        throw new Error('❌ No valid delivery address found.')
      }

      // Build payload
      const payload = {
        type: 'create_order',
        deliveryAddress: { idAddress: String(selectedAddr.id_address) },
        gateway_action: 'order/cashfree/index',
        id_cart: authStore.cart_id,
        id_customer: authStore.id_customer,
        orderFrom: deviceType,
        payment_type: selectedMethod,
        site: 'sss',
        checkOut: 'new',
        deal_city: '',
        user_hash_key: authStore.key,
      }

      console.log(`📦 Sending Cashfree payload for [${selectedMethod}] →`, payload)

      const res = await fetch('https://gateway.streetstylestore.com/gateway/v1/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      const newSessionId =
        data?.payment_link?.payment_session_id || data?.payment_session_id || ''

      if (newSessionId) {
        sessionId.value = newSessionId
        paymentData.value = data
        console.log('✅ [Cashfree] Session ID:', newSessionId)
      } else {
        console.warn('⚠️ [Cashfree] Missing session ID in response', data)
      }

      return data
    } catch (err) {
      console.error('❌ [Cashfree] Error:', err)
      error.value = err.message || 'Payment initialization failed.'
    } finally {
      loading.value = false
    }
  }

  return {
    sessionId,
    paymentData,
    loading,
    error,
    selectedPaymentMethod,

    // Actions
    selectMethod,
    isSelected,
    clearSelectedMethod,
    proceedToPayment,
  }
})
