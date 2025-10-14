<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-card">
      <button class="close-x" @click="closeModal">&times;</button>
      <div class="modal-header">
        <h2 class="modal-title">Important Note</h2>
      </div>
      <p class="modal-content">
        We do not offer returns or exchanges on purchase of items from this category.
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true }
})

const emit = defineEmits(['update:show'])

function closeModal() {
  emit('update:show', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  position: relative;
  background: #fff;
  border-radius: 1rem;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 12px 28px rgba(0,0,0,0.3);
  animation: scaleIn 0.25s ease-out;
}

/* Header with black background */
.modal-header {
  background-color: #000;
  padding: 1rem 1.5rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.modal-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.modal-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  padding: 1.5rem 1.5rem 2rem;
}

.close-x {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  transition: color 0.2s ease;
  z-index: 10;
}

.close-x:hover {
  color: #ddd;
}

@keyframes scaleIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
