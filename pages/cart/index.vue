<template>
  <div class="bg-white text-black min-h-screen p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Cart Items -->
      <div class="w-full md:w-2/3 space-y-4">
        <div v-for="item in cartItems" :key="item.id"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-2xl p-4 shadow-sm hover:shadow-lg transition"
        >
          <div class="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0">
            <img :src="item.image" alt="Product" class="w-20 h-24 object-cover rounded-xl"/>
            <div>
              <h2 class="font-semibold text-lg">{{ item.name }}</h2>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
              <p class="font-bold mt-1">₹{{ item.price }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button @click="decreaseQty(item)" class="px-2 py-1 border rounded-lg hover:bg-gray-200 transition">-</button>
            <span class="font-semibold">{{ item.qty }}</span>
            <button @click="increaseQty(item)" class="px-2 py-1 border rounded-lg hover:bg-gray-200 transition">+</button>
            <button @click="confirmRemove(item)" class="ml-3 text-red-500 hover:underline text-sm">Remove</button>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="w-full md:w-1/3 border rounded-2xl p-6 shadow-md bg-gray-50 md:sticky md:top-20">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        <div class="flex justify-between text-gray-700 mb-2"><span>Subtotal</span><span>₹{{ subtotal }}</span></div>
        <div class="flex justify-between text-gray-700 mb-2"><span>Delivery</span><span>₹40</span></div>

        <div class="mt-4">
          <label class="block mb-2 font-medium">Apply Coupon</label>
          <div class="flex gap-2">
            <input v-model="couponCode" type="text" placeholder="Enter code"
              class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"/>
            <button @click="applyCoupon" class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm">Apply</button>
          </div>
        </div>

        <div class="flex justify-between font-bold text-lg mt-6 border-t pt-3"><span>Total</span><span>₹{{ total }}</span></div>
        <button @click="checkout" class="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800 transition">Proceed to Checkout</button>
      </div>
    </div>

    <!-- Enhanced Confirm Remove Modal -->
    <transition name="fade-scale">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative transform scale-95 transition-all">
          <!-- Warning Icon -->
          <div class="text-red-500 text-center text-5xl mb-4">⚠️</div>
          <p class="text-lg font-semibold mb-6">Are you sure you want to remove <span class="text-red-500">"{{ modalItem.name }}"</span> from your cart?</p>
          <div class="flex justify-center gap-4">
            <button @click="removeConfirmed" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">Yes, Remove</button>
            <button @click="showModal=false" class="flex-1 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const cartItems = ref([
  {id:1,name:'Classic White Shirt',description:'Pure cotton, slim fit',price:1200,qty:1,image:'https://i.pinimg.com/736x/88/a2/7f/88a27fb10d01781e0d5ae6bbba078214.jpg'},
  {id:2,name:'Black Denim Jeans',description:'Comfort stretch, regular fit',price:2200,qty:2,image:'https://i.pinimg.com/736x/88/a2/7f/88a27fb10d01781e0d5ae6bbba078214.jpg'},
])

const couponCode = ref(''), discount = ref(0)
const subtotal = computed(()=>cartItems.value.reduce((sum,i)=>sum+i.price*i.qty,0))
const total = computed(()=>subtotal.value+40-discount.value)

const increaseQty=item=>{item.qty++; toast.info(`You increased the quantity of ${item.name}`,{timeout:1800,position:'top-right'})}
const decreaseQty=item=>{if(item.qty>1){item.qty--; toast.warning(`You decreased the quantity of ${item.name}`,{timeout:1800,position:'top-right'})}}

const showModal = ref(false)
const modalItem = ref(null)
const confirmRemove = item => { modalItem.value = item; showModal.value = true }
const removeConfirmed = () => {
  cartItems.value = cartItems.value.filter(i=>i.id!==modalItem.value.id)
  toast.error(`${modalItem.value.name} has been removed from your cart`,{timeout:2500,position:'top-right'})
  showModal.value = false
}

const applyCoupon=()=>{if(couponCode.value.toLowerCase()==='save10'){discount.value=200; toast.success('Coupon Applied! You saved ₹200',{timeout:2500,position:'top-right'})}else{discount.value=0; toast.warning('Invalid Coupon! Please enter a valid code',{timeout:2500,position:'top-right'})}}
const checkout=()=>{if(cartItems.value.length===0){toast.error('Your cart is empty!',{timeout:2500,position:'top-right'});return}toast.success('Proceeding to checkout...',{timeout:2500,position:'top-right'})}
</script>

<style scoped>
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.3s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity:0; transform: scale(0.95); }
.fade-scale-enter-to, .fade-scale-leave-from { opacity:1; transform: scale(1); }
</style>
