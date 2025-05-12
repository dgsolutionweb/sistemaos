<template>
  <div v-if="ordem">
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Ordem de Serviço #{{ ordem.id }}
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="showPrintDialog = true"
          :disabled="!ordem"
        >
          <PrinterIcon class="-ml-0.5 mr-1.5 h-5 w-5" />
          Imprimir Ordem
        </button>
        <router-link
          :to="{ name: 'garantias-ordem', params: { ordemId: ordem.id }}"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ShieldCheckIcon class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" />
          Garantias
        </router-link>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="router.push('/ordens')"
        >
          Voltar
        </button>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Informações do Cliente -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Informações do Cliente</h3>
          <div class="mt-5 border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Nome</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ cliente?.nome }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Telefone</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ cliente?.telefone }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ cliente?.email }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Status da Ordem -->
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Status da Ordem</h3>
          <div class="mt-5">
            <div class="rounded-md bg-gray-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ClockIcon v-if="ordem.status === 'pendente'" class="h-5 w-5 text-yellow-400" />
                  <WrenchScrewdriverIcon v-if="ordem.status === 'em_andamento'" class="h-5 w-5 text-blue-400" />
                  <CheckCircleIcon v-if="ordem.status === 'concluido'" class="h-5 w-5 text-green-400" />
                  <XCircleIcon v-if="ordem.status === 'cancelado'" class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium" :class="statusTextClasses[ordem.status]">
                    {{ statusLabels[ordem.status] }}
                  </h3>
                  <div class="mt-2 text-sm text-gray-500">
                    <p>Criado em {{ formatDate(ordem.dataCriacao) }}</p>
                    <p v-if="ordem.dataConclusao">Concluído em {{ formatDate(ordem.dataConclusao) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <label class="text-sm font-medium text-gray-700">Atualizar Status</label>
              <select
                v-model="novoStatus"
                class="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ statusLabels[status] }}
                </option>
              </select>
              <button
                type="button"
                class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="atualizarStatus"
                :disabled="novoStatus === ordem.status"
              >
                Atualizar Status
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Detalhes do Equipamento -->
      <div class="bg-white shadow sm:rounded-lg sm:col-span-2">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Detalhes do Equipamento</h3>
          <div class="mt-5 border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Equipamento</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ ordem.equipamento }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Marca</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ ordem.marca }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Modelo</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ ordem.modelo }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Número de Série</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ ordem.numeroSerie }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Defeito Relatado</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ ordem.defeito }}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Observações</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {{ ordem.observacoes || 'Nenhuma observação' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PrintDialog 
    :open="showPrintDialog" 
    :ordem-id="ordem?.id || ''" 
    :loading="printLoading"
    @confirm="handlePrint"
    @cancel="showPrintDialog = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdemStore } from '../stores/ordem'
import { useConfigStore } from '../stores/configuracaoStore'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ClockIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'
import Spinner from '../components/Spinner.vue'
import PrintDialog from '../components/PrintDialog.vue'
import type { Status } from '../types'

const route = useRoute()
const router = useRouter()
const store = useOrdemStore()
const configStore = useConfigStore()
const { ordens, clientes } = storeToRefs(store)

// Carregar dados da configuração ao inicializar o componente
onMounted(async () => {
  try {
    // Carregar configuração da empresa se ainda não estiver carregada
    if (!configStore.configuracao) {
      await configStore.fetchConfiguracao()
    }
    
    // Carregar o cliente associado à ordem se necessário
    if (ordem.value && !cliente.value) {
      await store.fetchCliente(ordem.value.clienteId)
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

const ordem = computed(() => 
  ordens.value.find(o => o.id === route.params.id)
)

const cliente = computed(() => 
  clientes.value.find(c => c.id === ordem.value?.clienteId)
)

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

const statusTextClasses = {
  pendente: 'text-yellow-800',
  em_andamento: 'text-blue-800',
  em_analise: 'text-blue-800',
  aguardando: 'text-yellow-800',
  orcamento: 'text-purple-800',
  aprovado: 'text-green-800',
  em_execucao: 'text-orange-800',
  concluido: 'text-green-800',
  cancelado: 'text-red-800'
}

const statusOptions: Status[] = [
  'pendente', 
  'em_andamento', 
  'em_analise', 
  'aguardando', 
  'orcamento', 
  'aprovado', 
  'em_execucao', 
  'concluido', 
  'cancelado'
]
const novoStatus = ref<Status>(ordem.value?.status || 'pendente')

const formatDate = (date: string) => {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

const atualizarStatus = async () => {
  if (ordem.value && novoStatus.value !== ordem.value.status) {
    try {
      await store.atualizarStatus(ordem.value.id, novoStatus.value)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }
}

const printLoading = ref(false)
const showPrintDialog = ref(false)

const handlePrint = async (copies: number) => {
  if (ordem.value) {
    try {
      printLoading.value = true
      await store.imprimirOrdem(ordem.value.id, copies)
      showPrintDialog.value = false
    } catch (error) {
      console.error('Erro ao imprimir ordem:', error)
    } finally {
      printLoading.value = false
    }
  }
}
</script> 