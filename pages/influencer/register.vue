<template>
  <div class="bg-white min-h-screen flex items-center justify-center py-12 px-4 md:px-8">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">

      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-black mb-2">Influencer Onboarding</h1>
        <p class="text-gray-700 text-base md:text-lg">Complete your profile to join our influencer program.</p>
      </header>

      <!-- Progress Bar -->
      <div class="flex justify-between items-center mb-10">
        <div v-for="step in 4" :key="step" class="flex-1 h-1 mx-1 bg-gray-300 rounded-full relative">
          <div :class="['h-1 rounded-full transition-all duration-500', step <= 1 ? 'bg-black' : 'bg-gray-300']"></div>
        </div>
      </div>

      <!-- Form -->
      <form class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Name -->
        <div class="relative">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804z M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <input id="name" type="text" required
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="name"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Your Name *
          </label>
        </div>

        <!-- Contact Number -->
        <div class="relative">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 5h2l2 7h10l2-7h2M5 5v2M19 5v2M5 9h14l-1.5 9H6.5L5 9z" />
          </svg>
          <input id="phone" type="tel" required
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="phone"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Contact Number *
          </label>
        </div>

        <!-- Email -->
       <div class="relative">
  <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M16 12H8m0 0l4-4m0 8l-4-4" />
  </svg>
  <input id="email" type="email" required placeholder=" " 
    class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
  />
  <label for="email"
    class="absolute left-10 top-3 text-gray-400 text-base transition-all
           peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
           peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
           peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
    Email *
  </label>
</div>


        <!-- Instagram Handle -->
        <div class="relative">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2.163c-5.42 0-9.837 4.417-9.837 9.837 0 4.355 2.794 8.052 6.677 9.34.488.09.666-.212.666-.473v-1.68c-2.718.588-3.29-1.31-3.29-1.31-.443-1.124-1.082-1.422-1.082-1.422-.885-.605.067-.593.067-.593.977.069 1.493 1.004 1.493 1.004.869 1.49 2.28 1.06 2.835.811.088-.633.34-1.06.617-1.303-2.166-.247-4.443-1.083-4.443-4.816 0-1.063.38-1.933 1.003-2.614-.101-.247-.435-1.24.095-2.585 0 0 .817-.262 2.677 1.001a9.304 9.304 0 012.438-.328c.827.004 1.66.112 2.438.328 1.859-1.263 2.675-1.001 2.675-1.001.531 1.345.197 2.338.096 2.585.624.681 1.002 1.551 1.002 2.614 0 3.741-2.281 4.565-4.454 4.805.35.303.664.9.664 1.816v2.694c0 .263.177.567.672.471 3.882-1.288 6.677-4.985 6.677-9.34 0-5.42-4.417-9.837-9.837-9.837z" />
          </svg>
          <input id="instagram" type="text" required
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="instagram"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Instagram Handle *
          </label>
        </div>

        <!-- Facebook -->
        <div class="relative">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54v-2.892h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
          </svg>
          <input id="facebook" type="text"
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="facebook"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Facebook Profile
          </label>
        </div>

        <!-- Snapchat -->
        <div class="relative">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8 2 4 6 4 10s4 8 8 8 8-4 8-8-4-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
          </svg>
          <input id="snapchat" type="text"
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="snapchat"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Snapchat
          </label>
        </div>

        <!-- Youtube -->
        <div class="relative">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 15l5-3-5-3v6zm12-3c0-1.104-.896-2-2-2h-4V8c0-1.104-.896-2-2-2H6c-1.104 0-2 .896-2 2v2H0v6h4v2c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2v-2h4c1.104 0 2-.896 2-2z"/>
          </svg>
          <input id="youtube" type="text"
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="youtube"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Youtube Channel
          </label>
        </div>

        <!-- Prior Collaboration -->
        <div class="relative md:col-span-2">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 4h14v2H5V4zm0 6h14v2H5v-2zm0 6h14v2H5v-2z"/>
          </svg>
          <textarea id="collaboration" rows="3" required
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"></textarea>
          <label for="collaboration"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Prior Collaboration Info
          </label>
        </div>

        <!-- Reel Link -->
        <div class="relative md:col-span-2">
          <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4V4zm4 4v8l6-4-6-4z"/>
          </svg>
          <input id="reel" type="url"
            class="peer w-full border-b border-gray-300 py-3 pl-10 text-black focus:border-black focus:outline-none transition"
          />
          <label for="reel"
            class="absolute left-10 top-3 text-gray-400 text-base transition-all
                   peer-focus:top-0 peer-focus:text-sm peer-focus:text-black
                   peer-valid:top-0 peer-valid:text-sm peer-valid:text-black">
            Any Reel link for consideration
          </label>
        </div>

        <!-- Preference -->
        <div class="md:col-span-2">
          <p class="text-gray-700 font-semibold mb-2">Preference</p>
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="radio" name="preference" value="Barter" class="form-radio" /> Barter
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="preference" value="Coupon" class="form-radio" /> Coupon
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="preference" value="Commission" class="form-radio" /> Commission
            </label>
          </div>
        </div>

        <!-- Age Group -->
        <div class="md:col-span-2">
          <p class="text-gray-700 font-semibold mb-2">Which age group do you belong to?</p>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2">
              <input type="radio" name="ageGroup" value="Gen Z" class="form-radio" /> Gen Z (Born 1997 – 2012)
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="ageGroup" value="Millennial" class="form-radio" /> Millennial (Born 1981 – 1996)
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="ageGroup" value="Other" class="form-radio" /> None of the above
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="md:col-span-2">
          <button type="submit"
            class="w-full py-3 bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-gray-900 hover:shadow-2xl transform transition duration-300 hover:scale-105">
            Submit Application
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
// No JS logic yet
</script>

<style scoped>
input:focus, textarea:focus {
  outline: none;
}
.form-radio {
  accent-color: black;
}
</style>
