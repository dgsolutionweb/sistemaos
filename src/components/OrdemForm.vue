<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Cliente -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Cliente</label>
      <select
        v-model="form.clienteId"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        required
      >
        <option value="">Selecione um cliente</option>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nome }}
        </option>
      </select>
    </div>

    <!-- Técnico -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Técnico Responsável</label>
      <select
        v-model="form.tecnicoId"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">Selecione um técnico</option>
        <option v-for="tecnico in tecnicos" :key="tecnico.id" :value="tecnico.id">
          {{ tecnico.nome }}
        </option>
      </select>
    </div>

    <!-- Prioridade -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Prioridade</label>
      <select
        v-model="form.prioridade"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        required
      >
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
        <option value="urgente">Urgente</option>
      </select>
    </div>

    <!-- Equipamento -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Equipamento</label>
      <input
        type="text"
        v-model="form.equipamento"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      />
    </div>

    <!-- Marca -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Marca</label>
      <input
        type="text"
        v-model="form.marca"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      />
    </div>

    <!-- Modelo -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Modelo</label>
      <input
        type="text"
        v-model="form.modelo"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      />
    </div>

    <!-- Número de Série -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Número de Série</label>
      <input
        type="text"
        v-model="form.numeroSerie"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      />
    </div>

    <!-- Defeito -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Defeito Relatado</label>
      <textarea
        v-model="form.defeito"
        rows="3"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      ></textarea>
    </div>

    <!-- Observações -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Observações</label>
      <textarea
        v-model="form.observacoes"
        rows="3"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <!-- Previsão -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Previsão de Entrega</label>
      <input
        type="date"
        v-model="form.dataPrevisao"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>

    <!-- Botões -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :disabled="loading"
      >
        {{ loading ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useOrdemStore } from '../stores/ordem'
import { useTecnicoStore } from '../stores/tecnicoStore'
import { storeToRefs } from 'pinia'
import type { OrdemServico } from '../types'

const store = useOrdemStore()
const tecnicoStore = useTecnicoStore()
const { clientes, loading } = storeToRefs(store)
const { tecnicos } = storeToRefs(tecnicoStore)

// Carregar técnicos quando o componente é montado
onMounted(async () => {
  if (tecnicos.value.length === 0) {
    await tecnicoStore.fetchTecnicos()
  }
  
  // Garantir que temos a lista de clientes
  if (clientes.value.length === 0) {
    await store.fetchClientes()
  }
})

const emit = defineEmits<{
  (e: 'submit', ordem: Omit<OrdemServico, 'id'>): void
  (e: 'cancel'): void
}>()

const form = ref({
  clienteId: '',
  equipamento: '',
  marca: '',
  modelo: '',
  numeroSerie: '',
  defeito: '',
  descricaoProblema: '',
  observacoes: '',
  dataPrevisao: '',
  prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
  status: 'pendente' as const,
  dataEntrada: new Date().toISOString(),
  tecnicoId: ''
})

// Encontra o nome do técnico selecionado
const selectedTecnicoNome = computed(() => {
  if (!form.value.tecnicoId) return '';
  const tecnico = tecnicos.value.find(t => t.id === form.value.tecnicoId);
  return tecnico ? tecnico.nome : '';
});

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    dataCriacao: new Date().toISOString(),
    tecnicoResponsavel: selectedTecnicoNome.value
  })
}
</script> 