<template>
  <transition name="fade-scale">
    <div v-if="voucher" class="mb-6 w-full flex justify-center">
      <div
        class="relative z-10 flex items-center justify-center px-8 py-5 
               rounded-lg bg-black text-white w-full max-w-xl text-center 
               shadow-md border border-dashed border-white font-bold text-lg md:text-xl uppercase tracking-wide"
      >
        {{ voucher.category_name }}
        <div class="w-10 h-10 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-5"></div>
        <div class="w-10 h-10 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-5"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { ofetch } from "ofetch";

const props = defineProps({
  categoryId: { type: [String, Number], required: true }
});

const voucher = ref(null);

const fetchVoucher = async () => {
  try {
    const res = await ofetch(
      "https://api.streetstylestore.com/collections/sss_config/documents/voucher-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    const data = JSON.parse(res.data || "[]");
    voucher.value = data.find(v => Number(v.id_category) === Number(props.categoryId)) || null;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchVoucher);
watch(() => props.categoryId, fetchVoucher);
</script>

<style scoped>
.fade-scale-enter-active { transition: all 0.4s ease; }
.fade-scale-leave-active { transition: all 0.3s ease; }
.fade-scale-enter-from { opacity: 0; transform: scale(0.95); }
.fade-scale-enter-to { opacity: 1; transform: scale(1); }
.fade-scale-leave-from { opacity: 1; transform: scale(1); }
.fade-scale-leave-to { opacity: 0; transform: scale(0.95); }
</style>
