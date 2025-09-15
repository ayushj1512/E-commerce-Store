<template>
  <div class="bg-white min-h-screen flex items-center justify-center py-12 px-4 md:px-8 overflow-x-hidden">
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 md:p-14 border border-gray-200 overflow-hidden">

      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-3xl md:text-5xl font-extrabold text-black mb-3">Influencer Onboarding</h1>
        <p class="text-gray-600 text-lg md:text-xl">Complete your profile to join our influencer program.</p>
      </header>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Dynamic Inputs -->
        <div v-for="(field, index) in fields" :key="index" class="relative">
          <component :is="field.type === 'textarea' ? 'textarea' : 'input'"
                     v-model="form[field.id]"
                     :type="field.inputType"
                     :id="field.id"
                     :rows="field.type === 'textarea' ? 4 : null"
                     required
                     class="peer w-full border border-gray-400 rounded-xl py-4 pl-12 pr-4 text-black placeholder-transparent focus:border-black focus:ring-1 focus:ring-black shadow-sm hover:shadow-md transition resize-none bg-white"
                     placeholder=" "/>
          <label :for="field.id"
                 class="absolute left-12 top-4 text-gray-500 text-base transition-all 
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                        peer-placeholder-shown:text-gray-500
                        peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                        peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            {{ field.label }}
          </label>
          <span class="absolute left-3 top-4 w-5 h-5 text-gray-500" v-html="field.icon"></span>
        </div>

        <!-- Preference -->
        <div class="md:col-span-2">
          <p class="text-black font-semibold mb-2">Preference</p>
          <div class="flex gap-4 flex-wrap">
            <label v-for="option in preferences" :key="option"
                   :class="['cursor-pointer px-4 py-2 rounded-full border transition', 
                            form.paymentPreference === option ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-400 hover:bg-gray-100']">
              <input type="radio" name="preference" :value="option" v-model="form.paymentPreference" class="hidden" /> {{ option }}
            </label>
          </div>
        </div>

        <!-- Age Group -->
        <div class="md:col-span-2">
          <p class="text-black font-semibold mb-2">Which age group do you belong to?</p>
          <div class="flex gap-4 flex-wrap">
            <label v-for="option in ageGroups" :key="option.value"
                   :class="['cursor-pointer px-4 py-2 rounded-full border transition', 
                            form.ageGroup === option.value ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-400 hover:bg-gray-100']">
              <input type="radio" name="ageGroup" :value="option.value" v-model="form.ageGroup" class="hidden" /> {{ option.label }}
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="md:col-span-2 mt-6">
          <button type="submit"
                  class="w-full py-4 bg-black text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105">
            Submit Application
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const fields = [
  { id: "name", label: "Your Name *", inputType: "text", type: "input", icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>` },
  { id: "phone", label: "Contact Number *", inputType: "tel", type: "input", icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h2l2 7h10l2-7h2M5 5v2M19 5v2M5 9h14l-1.5 9H6.5L5 9z"/></svg>` },
  { id: "email", label: "Email *", inputType: "email", type: "input", icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m0 0l4-4m0 8l-4-4"/></svg>` },
  { id: "instagram", label: "Instagram Handle *", inputType: "text", type: "input", icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c-5.42 0-9.837 4.417-9.837 9.837 0 4.355 2.794 8.052 6.677 9.34.488.09.666-.212.666-.473v-1.68c-2.718.588-3.29-1.31-3.29-1.31-.443-1.124-1.082-1.422-1.082-1.422-.885-.605.067-.593.067-.593.977.069 1.493 1.004 1.493 1.004.869 1.49 2.28 1.06 2.835.811.088-.633.34-1.06.617-1.303-2.166-.247-4.443-1.083-4.443-4.816 0-1.063.38-1.933 1.003-2.614-.101-.247-.435-1.24.095-2.585 0 0 .817-.262 2.677 1.001a9.304 9.304 0 012.438-.328c.827.004 1.66.112 2.438.328 1.859-1.263 2.675-1.001 2.675-1.001.531 1.345.197 2.338.096 2.585.624.681 1.002 1.551 1.002 2.614 0 3.741-2.281 4.565-4.454 4.805.35.303.664.9.664 1.816v2.694c0 .263.177.567.672.471 3.882-1.288 6.677-4.985 6.677-9.34 0-5.42-4.417-9.837-9.837-9.837z"/></svg>` },
  { id: "collaboration", label: "Prior Collaboration Info", inputType: "text", type: "textarea", icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M5 4h14v2H5V4zm0 6h14v2H5v-2zm0 6h14v2H5v-2z"/></svg>` },
  { id: "reel", label: "Any Reel link for consideration", inputType: "url", type: "input", icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm4 4v8l6-4-6-4z"/></svg>` }
];

const preferences = ["Barter", "Coupon", "Commission"];
const ageGroups = [
  { value: "Gen Z", label: "Gen Z (Born 1997 – 2012)" },
  { value: "Millennial", label: "Millennial (Born 1981 – 1996)" },
  { value: "Other", label: "None of the above" }
];

const form = reactive({
  name: "",
  phone: "",
  email: "",
  instagram: "",
  collaboration: "",
  reel: "",
  paymentPreference: "",
  ageGroup: ""
});

const handleSubmit = async () => {
  try {
    const payload = {
      name: form.name,
      mobileNumber: form.phone,
      email: form.email,
      instagramHandle: form.instagram,
      priorCollab: form.collaboration,
      reelLink: form.reel,
      paymentPreference: form.paymentPreference,
      ageGroup: form.ageGroup,
      facebookProfile: "",
      youtubeChannel: "",
      snapchatProfile: ""
    };

    await axios.post(`${baseURL}`, payload);
    alert("Application submitted successfully!");
  } catch (error) {
    console.error(error);
    alert("Submission failed. Please try again.");
  }
};
</script>

<style scoped>
input:focus,
textarea:focus {
  outline: none;
}

input,
textarea {
  font-size: 1rem;
}

textarea {
  resize: vertical;
  max-height: 120px;
}
</style>
