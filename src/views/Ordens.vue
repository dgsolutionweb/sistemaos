<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Ordens de Serviço
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <RouterLink
          to="/ordens/nova"
          class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Nova Ordem
        </RouterLink>
      </div>
    </div>

    <!-- Filtros de busca -->
    <div class="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
      <div class="flex-1 relative">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar ordens..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div class="sm:w-48">
        <select
          v-model="statusFilter"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">Todos os Status</option>
          <option v-for="(label, status) in statusLabels" :key="status" :value="status">
            {{ label }}
          </option>
        </select>
      </div>
      <div class="sm:w-48">
        <select
          v-model="sortOrder"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <Spinner size="lg" color="indigo" />
    </div>

    <div v-else-if="error" class="rounded-md bg-red-50 p-4 mt-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <div v-else class="mt-8 flow-root">
      <div v-if="ordensFiltradas.length === 0" class="py-12 text-center">
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-300" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma ordem encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">
          Tente remover os filtros ou criar uma nova ordem de serviço.
        </p>
        <div class="mt-6">
          <RouterLink
            to="/ordens/nova"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Nova Ordem
          </RouterLink>
        </div>
      </div>

      <div v-else class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Cliente
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Equipamento
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data Criação
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="ordem in ordensFiltradas" :key="ordem.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ ordem.cliente?.nome }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ ordem.equipamento }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                      :class="statusClasses[ordem.status]"
                    >
                      {{ statusLabels[ordem.status] }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(ordem.dataCriacao) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-3">
                    <button
                      type="button"
                      @click="selectOrder(ordem)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <PrinterIcon class="h-5 w-5 inline-block" />
                    </button>
                    <RouterLink
                      :to="`/ordens/${ordem.id}`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Detalhes
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <PrintDialog 
    :open="showPrintDialog" 
    :ordem-id="selectedOrder?.id || ''" 
    :loading="printLoading"
    @confirm="handlePrint"
    @cancel="showPrintDialog = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrdemStore } from '../stores/ordem'
import { useConfigStore } from '../stores/configuracaoStore'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  PrinterIcon, 
  ExclamationCircleIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import Spinner from '../components/Spinner.vue'
import PrintDialog from '../components/PrintDialog.vue'
import type { OrdemServico } from '../types'

const store = useOrdemStore()
const configStore = useConfigStore()
const { ordens, clientes, loading, error } = storeToRefs(store)
const selectedOrder = ref<OrdemServico | null>(null)
const showPrintDialog = ref(false)
const printLoading = ref(false)

// Filtros
const searchTerm = ref('')
const statusFilter = ref('all')
const sortOrder = ref('newest')

onMounted(async () => {
  try {
    // Carregar configuração da empresa se ainda não estiver carregada
    if (!configStore.configuracao) {
      await configStore.buscarConfiguracao()
    }
    
    // Carregar as ordens
    await store.fetchOrdens()
    
    // Carregar clientes se necessário
    if (clientes.value.length === 0) {
      await store.fetchClientes()
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

const ordensComCliente = computed(() => 
  ordens.value.map(ordem => ({
    ...ordem,
    cliente: clientes.value.find(c => c.id === ordem.clienteId)
  }))
)

// Ordens filtradas com base nos filtros aplicados
const ordensFiltradas = computed(() => {
  let result = [...ordensComCliente.value]
  
  // Filtrar por termo de pesquisa
  if (searchTerm.value) {
    const termo = searchTerm.value.toLowerCase()
    result = result.filter(ordem => 
      // Busca por ID
      ordem.id.toLowerCase().includes(termo) || 
      // Busca por nome do cliente
      (ordem.cliente?.nome && ordem.cliente.nome.toLowerCase().includes(termo)) ||
      // Busca por equipamento
      ordem.equipamento.toLowerCase().includes(termo) ||
      // Busca por marca
      (ordem.marca && ordem.marca.toLowerCase().includes(termo)) ||
      // Busca por modelo
      (ordem.modelo && ordem.modelo.toLowerCase().includes(termo)) ||
      // Busca por número de série
      (ordem.numeroSerie && ordem.numeroSerie.toLowerCase().includes(termo)) ||
      // Busca por descrição do problema
      (ordem.descricaoProblema && ordem.descricaoProblema.toLowerCase().includes(termo))
    )
  }
  
  // Filtrar por status
  if (statusFilter.value !== 'all') {
    result = result.filter(ordem => ordem.status === statusFilter.value)
  }
  
  // Ordenar por data
  result.sort((a, b) => {
    const dateA = new Date(a.dataCriacao).getTime()
    const dateB = new Date(b.dataCriacao).getTime()
    return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB
  })
  
  return result
})

const statusLabels = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  em_analise: 'Em Análise',
  aguardando: 'Aguardando',
  orcamento: 'Orçamento',
  aprovado: 'Aprovado',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
}

const statusClasses = {
  pendente: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
  em_andamento: 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/20',
  em_analise: 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/20',
  aguardando: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
  orcamento: 'bg-purple-50 text-purple-800 ring-1 ring-inset ring-purple-600/20',
  aprovado: 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/20',
  em_execucao: 'bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-600/20',
  concluido: 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/20',
  cancelado: 'bg-red-50 text-red-800 ring-1 ring-inset ring-red-600/20'
}

const formatDate = (date: string) => {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

const selectOrder = (ordem: OrdemServico) => {
  selectedOrder.value = ordem
  showPrintDialog.value = true
}

const handlePrint = async (copies: number) => {
  if (selectedOrder.value) {
    try {
      printLoading.value = true
      await store.imprimirOrdem(selectedOrder.value.id, copies)
      showPrintDialog.value = false
    } catch (error) {
      console.error('Erro ao imprimir ordem:', error)
    } finally {
      printLoading.value = false
    }
  }
}
</script> 