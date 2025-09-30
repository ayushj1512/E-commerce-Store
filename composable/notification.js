import { addToast } from '@/common/components/GlobalToast.vue'

export const notification = {
  success: (text) => addToast('success', text),
  error: (text) => addToast('error', text),
  warn: (text) => addToast('warning', text),
  update: (text) => addToast('update', text),
}
