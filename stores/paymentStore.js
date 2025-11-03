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

  // ✅ Select a payment method (always exclusive)
  function selectMethod(method) {
    if (selectedPaymentMethod.value === method) {
      selectedPaymentMethod.value = ''
      console.log(`🔕 Deselected payment method: ${method}`)
    } else {
      selectedPaymentMethod.value = method
      console.log(`✅ Selected payment method: ${method}`)
    }
  }

  // ✅ Check if a method is selected
  function isSelected(method) {
    return selectedPaymentMethod.value === method
  }

  // ✅ Clear payment method selection
  function clearSelectedMethod() {
    selectedPaymentMethod.value = ''
  }

  // 🚀 Proceed to payment (Cashfree integration)
  async function proceedToPayment(selectedMethod = selectedPaymentMethod.value || 'upi') {
  try {
    loading.value = true
    error.value = null

    const addressStore = useAddressStore()
    const authStore = useAuthStore()

    // 🧠 Ensure addresses are available
    if (!addressStore.addresses?.length) {
      console.log('📡 [Payment Store] Fetching addresses before proceeding...')
      await addressStore.fetchAddresses()
    }

    // 🔍 Resolve id_address safely
    const idAddress =
      addressStore.id_address ||
      addressStore.deliveryAddress?.id_address ||
      addressStore.lastUsedAddress?.id_address ||
      addressStore.addresses?.[0]?.id_address

    console.log('🏷️ [Payment Store] Selected id_address:', idAddress)

    if (!idAddress) {
      throw new Error('❌ No valid delivery address found in Address Store.')
    }

    // Detect device type
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    )
    const deviceType = isMobile ? 'Mobile' : 'Desktop'

    // 🧾 Build payment payload
    const payload = {
      type: 'create_order',
      deliveryAddress: { idAddress: String(idAddress) },
      gateway_action: 'order/cashfree/index',
      id_cart: String(authStore.cart_id || ''),       // ✅ Converted to string
      id_customer: String(authStore.id_customer || ''), // ✅ Converted to string
      orderFrom: deviceType,
      payment_type: selectedMethod,
      site: 'sss',
      checkOut: 'new',
      deal_city: '',
      user_hash_key: authStore.key || '',
    }

    console.log(`📦 [Payment Store] Sending Cashfree payload for [${selectedMethod}] →`, payload)
    console.table(payload)

    // 🌐 API Call
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
      console.log('✅ [Cashfree] Session initialized successfully:', newSessionId)
    } else {
      console.warn('⚠️ [Cashfree] Missing session ID in response:', data)
    }

    return data
  } catch (err) {
    console.error('❌ [Payment Store] Payment initialization failed:', err)
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
