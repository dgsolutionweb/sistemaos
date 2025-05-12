<template>
  <div v-if="open" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="onCancel"></div>
      
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div>
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <PrinterIcon class="h-6 w-6 text-indigo-600" />
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-base font-semibold leading-6 text-gray-900">Imprimir Ordem de Serviço</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Confirme as opções de impressão para a ordem de serviço #{{ ordemId }}.
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-5 sm:mt-6">
          <div class="mb-4">
            <label for="copies" class="block text-sm font-medium leading-6 text-gray-900">Número de cópias</label>
            <div class="mt-2">
              <select
                id="copies"
                v-model.number="copies"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option :value="1">1 cópia</option>
                <option :value="2">2 cópias (Cliente e Empresa)</option>
                <option :value="3">3 cópias</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-around">
            <button 
              type="button" 
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="onConfirm"
              :disabled="loading"
            >
              <Spinner v-if="loading" size="sm" color="white" class="mr-2" />
              Imprimir
            </button>
            <button 
              type="button" 
              class="ml-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              @click="onCancel"
              :disabled="loading"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { PrinterIcon } from '@heroicons/vue/24/outline'
import Spinner from './Spinner.vue'

interface Props {
  open: boolean
  ordemId: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'confirm', copies: number): void
  (e: 'cancel'): void
}>()

const copies = ref<number>(2)

const onConfirm = () => {
  emit('confirm', copies.value)
}

const onCancel = () => {
  emit('cancel')
}
</script> 