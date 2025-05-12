<template>
  <div v-if="show" class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="onClose">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

      <div 
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full" 
        @click.stop
      >
        <form @submit.prevent="onSave">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
                  {{ orcamento.id ? 'Editar Orçamento' : 'Novo Orçamento' }}
                </h3>

                <!-- Informações básicas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <select 
                      v-model="formData.clienteId"
                      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="" disabled>Selecione um cliente</option>
                      <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                        {{ cliente.nome }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Ordem de Serviço (opcional)
                    </label>
                    <select 
                      v-model="formData.ordemId"
                      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Nenhuma</option>
                      <option v-for="ordem in ordens" :key="ordem.id" :value="ordem.id">
                        #{{ ordem.id }} - {{ ordem.equipamento }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Tabela de itens -->
                <div class="mb-6">
                  <div class="flex justify-between items-center mb-2">
                    <h4 class="text-sm font-medium text-gray-700">Itens do orçamento</h4>
                    <button 
                      type="button"
                      @click="adicionarItem"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon class="h-4 w-4 mr-1" />
                      Adicionar Item
                    </button>
                  </div>

                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div v-if="formData.itens.length === 0" class="text-center py-4 text-gray-500 text-sm">
                      Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                    </div>

                    <table v-else class="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/4">
                            Descrição
                          </th>
                          <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor (R$)
                          </th>
                          <th class="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, index) in formData.itens" :key="index">
                          <td class="px-2 py-2">
                            <input
                              type="text"
                              v-model="item.descricao"
                              placeholder="Descrição do item"
                              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </td>
                          <td class="px-2 py-2">
                            <input
                              type="number"
                              v-model.number="item.valor"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              class="block w-full text-right border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </td>
                          <td class="px-2 py-2 text-right">
                            <button 
                              type="button" 
                              @click="removerItem(index)"
                              class="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon class="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td class="px-2 py-3 text-right text-sm font-medium">Total:</td>
                          <td class="px-2 py-3 text-right text-sm font-medium">
                            R$ {{ formatarValor(calcularTotal) }}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <!-- Observações -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea 
                    v-model="formData.observacoes"
                    rows="3"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Informações adicionais, condições especiais, prazos, etc."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isLoading"
            >
              <Spinner v-if="isLoading" size="sm" color="white" class="mr-2" />
              {{ orcamento.id ? 'Atualizar' : 'Criar' }} Orçamento
            </button>
            <button
              type="button"
              @click="onClose"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="isLoading"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Spinner from '@/components/Spinner.vue';
import { useOrdemStore } from '@/stores/ordem';
import { useConfigStore } from '@/stores/configuracaoStore';

// Props
const props = defineProps({
  orcamento: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Estado local
const isLoading = ref(false);
const formData = ref({
  id: props.orcamento.id || '',
  clienteId: props.orcamento.clienteId || '',
  ordemId: props.orcamento.ordemId || '',
  itens: props.orcamento.itens ? [...props.orcamento.itens] : [],
  valor: props.orcamento.valor || 0,
  status: props.orcamento.status || 'pendente',
  dataCriacao: props.orcamento.dataCriacao || '',
  observacoes: props.orcamento.observacoes || ''
});

// Stores
const ordemStore = useOrdemStore();
const configStore = useConfigStore();

// Dados
const clientes = computed(() => ordemStore.clientes);
const ordens = computed(() => ordemStore.ordens);

// Calcular total dos itens
const calcularTotal = computed(() => {
  return formData.value.itens.reduce((total, item) => total + (item.valor || 0), 0);
});

// Formatação de valores
const formatarValor = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Métodos
const adicionarItem = () => {
  formData.value.itens.push({
    descricao: '',
    valor: 0
  });
};

const removerItem = (index: number) => {
  formData.value.itens.splice(index, 1);
};

const onClose = () => {
  emit('close');
};

const onSave = () => {
  // Atualizar o valor total baseado nos itens
  formData.value.valor = calcularTotal.value;
  
  // Validar que temos um cliente selecionado
  if (!formData.value.clienteId) {
    alert('Por favor, selecione um cliente');
    return;
  }
  
  // Emitir evento com os dados do formulário
  emit('save', { ...formData.value });
};

// Carregar dados ao montar
onMounted(async () => {
  try {
    isLoading.value = true;
    await Promise.all([
      ordemStore.fetchOrdens(),
      ordemStore.fetchClientes(),
      configStore.buscarConfiguracao()
    ]);
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  } finally {
    isLoading.value = false;
  }
});

// Observar mudanças nas props
watch(() => props.orcamento, (newVal) => {
  formData.value = {
    id: newVal.id || '',
    clienteId: newVal.clienteId || '',
    ordemId: newVal.ordemId || '',
    itens: newVal.itens ? [...newVal.itens] : [],
    valor: newVal.valor || 0,
    status: newVal.status || 'pendente',
    dataCriacao: newVal.dataCriacao || '',
    observacoes: newVal.observacoes || ''
  };
}, { deep: true });
</script> 