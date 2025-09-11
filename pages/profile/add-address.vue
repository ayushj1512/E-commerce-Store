<template>
  <div class="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 md:px-12 lg:px-24">
    <div class="max-w-5xl mx-auto bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-md space-y-8">

      <h1 class="text-2xl sm:text-3xl font-bold text-center">
        {{ isEditing ? "Edit Address" : "Add New Address" }}
      </h1>

      <!-- Contact Details -->
      <section class="space-y-6">
        <h2 class="font-semibold text-gray-700 text-lg sm:text-xl">
          Contact Details <span class="text-red-500">*</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.email" type="email" placeholder="Email *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />

          <div class="flex gap-2 items-center">
            <span class="text-gray-600 text-sm sm:text-base">+91</span>
            <input v-model="form.mobile" type="tel" placeholder="Mobile Number *" maxlength="10"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          </div>

          <input v-model="form.firstName" type="text" placeholder="First Name *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          <input v-model="form.lastName" type="text" placeholder="Last Name *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </section>

      <!-- Address Details -->
      <section class="space-y-6">
        <h2 class="font-semibold text-gray-700 text-lg sm:text-xl">Address Details</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.pinCode" type="text" placeholder="Pin Code *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          <input v-model="form.flatNo" type="text" placeholder="Flat/House No, Street, Floor, Area *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          <input v-model="form.locality" type="text" placeholder="Locality/Town *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          <input v-model="form.landmark" type="text" placeholder="Landmark (Optional)"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          <input v-model="form.city" type="text" placeholder="City/District *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          <input v-model="form.state" type="text" placeholder="State *"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
        </div>

        <div class="flex flex-col gap-2 mt-2">
          <label class="text-gray-600 text-sm sm:text-base">Save Address As</label>
          <div class="flex flex-wrap gap-3 md:gap-4">
            <button type="button" @click="form.addressType='Home'"
              :class="buttonClass('Home')"
              class="py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]">Home</button>
            <button type="button" @click="form.addressType='PG'"
              :class="buttonClass('PG')"
              class="py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]">PG</button>
            <button type="button" @click="form.addressType='Hostel'"
              :class="buttonClass('Hostel')"
              class="py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]">Hostel</button>
            <button type="button" @click="form.addressType='Office'"
              :class="buttonClass('Office')"
              class="py-2 px-4 rounded-lg border min-w-[70px] sm:min-w-[90px] md:min-w-[110px]">Office</button>
          </div>
        </div>
      </section>

      <!-- Save Button -->
      <button @click="saveAddress"
        class="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors text-base sm:text-lg md:text-xl">
        {{ isEditing ? "Update Address" : "Save Address" }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, onMounted } from "vue";
import { useAddressStore } from "~/stores/address";
import { useRouter } from "vue-router";

const addressStore = useAddressStore();
const router = useRouter();

const form = reactive({
  email: "",
  firstName: "",
  lastName: "",
  mobile: "",
  pinCode: "",
  flatNo: "",
  locality: "",
  landmark: "",
  city: "",
  state: "",
  defaultAddress: false,
  addressType: "Home",
});

// Check if editing
const isEditing = computed(() => Object.keys(addressStore.editAddress).length > 0);

// Prefill form if editing
watch(
  () => addressStore.editAddress,
  (newVal) => {
    if (Object.keys(newVal).length > 0) {
      Object.assign(form, newVal);
    }
  },
  { immediate: true }
);

const buttonClass = (type) =>
  form.addressType === type
    ? "bg-black text-white border-black"
    : "bg-white text-gray-700 hover:bg-gray-100";

const saveAddress = async () => {
  const requiredFields = ["email", "firstName", "lastName", "mobile", "pinCode", "flatNo", "locality", "city", "state"];
  for (const field of requiredFields) {
    if (!form[field]) {
      alert(`Please fill in ${field.replace(/([A-Z])/g, " $1")}`);
      return;
    }
  }

  const payload = { ...form };
  await addressStore.saveAddress(payload);

  alert(isEditing.value ? "Address updated successfully!" : "Address saved successfully!");

  // Reset edit mode
  addressStore.setEditAddress({});
  addressStore.setSaveAddressClick(false);

  router.push("/profile/addresses"); // Redirect to addresses list
};
</script>

<style scoped>
input:focus {
  outline: none;
}
button:focus {
  outline: none;
}
</style>
