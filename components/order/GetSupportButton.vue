<template>
  <teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
    >
      <div
        class="bg-white/95 rounded-2xl shadow-2xl w-full sm:w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 h-full sm:h-auto max-h-[90vh] flex flex-col animate-fadeIn overflow-hidden"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-5 border-b flex-shrink-0 sticky top-0 bg-black z-10 shadow-sm">
          <h3 class="text-lg sm:text-2xl font-bold text-white">Order Support</h3>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-white text-2xl transition-transform hover:scale-110"
          >
            &times;
          </button>
        </div>

        <!-- FAQ Content -->
        <div class="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5">
          <div v-if="supportData.length" class="space-y-5">
            <div
              v-for="(category, index) in supportData"
              :key="category.cat_id"
              class="border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <!-- Parent Category Header -->
              <div
                class="px-5 py-3 cursor-pointer flex justify-between items-center font-semibold text-white bg-black hover:bg-gray-800 rounded-t-2xl transition-colors"
                @click="toggleCategory(index)"
              >
                <span class="text-sm sm:text-base">{{ category.name }}</span>
                <span class="text-gray-300 text-lg">{{ expandedCategory === index ? '-' : '+' }}</span>
              </div>

              <!-- Child Questions -->
              <transition name="accordion">
                <div v-show="expandedCategory === index" class="p-4 space-y-3 bg-gray-100">
                  <div
                    v-for="(q, qIndex) in category.query"
                    :key="q.id_question"
                    class="border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <!-- Child Question Header -->
                    <div
                      class="px-4 py-2 cursor-pointer flex justify-between items-center font-medium rounded-t-xl text-black bg-gray-300 hover:bg-gray-400 transition-colors"
                      @click="toggleQuestion(category.cat_id, qIndex)"
                    >
                      <span class="text-sm sm:text-base">{{ q.question }}</span>
                      <span class="text-gray-700">{{ isQuestionExpanded(category.cat_id, qIndex) ? '-' : '+' }}</span>
                    </div>

                    <!-- Answer -->
                    <transition name="accordion">
                      <div
                        v-show="isQuestionExpanded(category.cat_id, qIndex)"
                        class="px-4 py-3 text-black text-sm sm:text-base space-y-3 bg-white rounded-b-xl"
                      >
                        <div v-html="q.answer"></div>
                        <iframe
                          v-if="q.youtube_url"
                          :src="q.youtube_url"
                          class="w-full mt-2 aspect-video rounded-lg border"
                          frameborder="0"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </transition>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- No Data -->
          <div v-else class="text-gray-500 text-center py-8 text-sm sm:text-base">
            No support data available.
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(["update:modelValue"]);

const showModal = ref(false);
const supportData = ref([]);
const expandedCategory = ref(null);
const expandedQuestions = ref({});

watch(
  () => props.modelValue,
  (val) => {
    showModal.value = val;
    if (val && !supportData.value.length) fetchSupportData();
  }
);

const fetchSupportData = async () => {
  try {
    const res = await axios.get(
      "https://api.streetstylestore.com/collections/sss_config/documents/sss-new-order-support-listing?a=1&x-typesense-api-key=F5gdSFxpg6bi8ZXfuybIsQy074HtBDkC"
    );
    if (res.data?.data) {
      let cleanedData = res.data.data.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      supportData.value = JSON.parse(cleanedData);
    }
  } catch (err) {
    console.error("Failed to fetch support data:", err);
    alert("Failed to load support information.");
  }
};

const toggleCategory = (index) => {
  expandedCategory.value = expandedCategory.value === index ? null : index;
};

const toggleQuestion = (catId, qIndex) => {
  if (!expandedQuestions.value[catId]) expandedQuestions.value[catId] = {};
  expandedQuestions.value[catId][qIndex] = !expandedQuestions.value[catId][qIndex];
};

const isQuestionExpanded = (catId, qIndex) => {
  return expandedQuestions.value[catId]?.[qIndex] || false;
};

watch(showModal, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }

.accordion-enter-active,
.accordion-leave-active { transition: all 0.25s ease; }
.accordion-enter-from,
.accordion-leave-to { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }
.accordion-enter-to,
.accordion-leave-from { max-height: 2000px; opacity: 1; }
</style>
