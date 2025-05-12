import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id?: number;
  message: string;
  type: ToastType;
  duration?: number;
}

const toasts = ref<ToastMessage[]>([]);
let lastId = 0;

export function useToast() {
  const show = (toast: ToastMessage) => {
    const id = ++lastId;
    const duration = toast.duration || 3000;
    
    toasts.value.push({
      ...toast,
      id
    });
    
    setTimeout(() => {
      dismiss(id);
    }, duration);
    
    return id;
  };
  
  const dismiss = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return {
    toasts,
    show,
    dismiss
  };
} 