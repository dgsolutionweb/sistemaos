<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between items-center pb-4">
      <h1 class="text-2xl font-bold text-gray-900">Orçamentos</h1>
      <div class="flex space-x-3">
        <div class="relative">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Buscar orçamentos..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <select
            v-model="statusFilter"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendentes</option>
            <option value="aprovado">Aprovados</option>
            <option value="rejeitado">Rejeitados</option>
          </select>
        </div>
        <button
          @click="criarNovoOrcamento"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Novo Orçamento
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <Spinner size="lg" color="indigo" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    >
      {{ error }}
    </div>

    <!-- Tabela de orçamentos -->
    <div v-else class="flex-1 bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Cliente
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ordem
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Valor
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Data
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Editar</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="orcamentosFiltrados.length === 0" class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <DocumentTextIcon class="h-12 w-12 text-gray-300 mb-2" />
                <p class="text-sm">Nenhum orçamento encontrado</p>
                <button 
                  @click="criarNovoOrcamento" 
                  class="mt-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Criar um novo orçamento
                </button>
              </div>
            </td>
          </tr>
          <tr 
            v-for="orcamento in orcamentosFiltrados" 
            :key="orcamento.id" 
            class="hover:bg-gray-50 cursor-pointer"
            @click="abrirDetalhesOrcamento(orcamento.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{{ orcamento.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ orcamento.cliente?.nome || 'Cliente não encontrado' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <template v-if="orcamento.ordemId">
                <router-link 
                  :to="`/ordens/${orcamento.ordemId}`" 
                  class="text-indigo-600 hover:text-indigo-900"
                  @click.stop
                >
                  #{{ orcamento.ordemId }}
                </router-link>
              </template>
              <span v-else class="text-gray-500 italic">Sem ordem</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              R$ {{ formatarValor(orcamento.valor) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': orcamento.status === 'pendente',
                  'bg-green-100 text-green-800': orcamento.status === 'aprovado',
                  'bg-red-100 text-red-800': orcamento.status === 'rejeitado',
                }"
              >
                {{ statusLabel(orcamento.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatarData(orcamento.dataCriacao) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex space-x-2 justify-end">
                <button
                  @click.stop="editarOrcamento(orcamento.id)"
                  class="text-gray-400 hover:text-indigo-600"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="orcamento.status === 'pendente'"
                  @click.stop="aprovarOrcamento(orcamento.id)"
                  class="text-gray-400 hover:text-green-600"
                >
                  <CheckCircleIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="orcamento.status === 'pendente'"
                  @click.stop="rejeitarOrcamento(orcamento.id)"
                  class="text-gray-400 hover:text-red-600"
                >
                  <XCircleIcon class="h-5 w-5" />
                </button>
                <button
                  @click.stop="imprimirOrcamento(orcamento.id)"
                  class="text-gray-400 hover:text-indigo-600"
                >
                  <PrinterIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Orçamento -->
    <OrcamentoModal
      v-if="showModal"
      :orcamento="orcamentoAtual"
      :show="showModal"
      @close="fecharModal"
      @save="salvarOrcamento"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon, 
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline';
import Spinner from '@/components/Spinner.vue';
import OrcamentoModal from '@/components/OrcamentoModal.vue';
import { useRouter } from 'vue-router';
import { useOrcamentoStore } from '@/stores/orcamentoStore';
import { useOrdemStore } from '@/stores/ordem';
import { useConfigStore } from '@/stores/configuracaoStore';

// Stores
const orcamentoStore = useOrcamentoStore();
const ordemStore = useOrdemStore();
const configStore = useConfigStore();
const router = useRouter();

// Estado local
const searchTerm = ref('');
const statusFilter = ref('all');
const showModal = ref(false);
const orcamentoAtual = ref<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Carregar dados
onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      orcamentoStore.fetchOrcamentos(),
      ordemStore.fetchOrdens(),
      ordemStore.fetchClientes(),
      configStore.buscarConfiguracao()
    ]);
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    error.value = 'Erro ao carregar dados. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
});

// Computados
const orcamentos = computed(() => {
  return orcamentoStore.orcamentos.map(orcamento => {
    const cliente = ordemStore.clientes.find(c => c.id === orcamento.clienteId);
    return { ...orcamento, cliente };
  });
});

const orcamentosFiltrados = computed(() => {
  let result = [...orcamentos.value];
  
  // Filtrar por termo de pesquisa
  if (searchTerm.value) {
    const termo = searchTerm.value.toLowerCase();
    result = result.filter(orc => 
      orc.id.toLowerCase().includes(termo) || 
      orc.cliente?.nome.toLowerCase().includes(termo) ||
      (orc.descricao && orc.descricao.toLowerCase().includes(termo))
    );
  }
  
  // Filtrar por status
  if (statusFilter.value !== 'all') {
    result = result.filter(orc => orc.status === statusFilter.value);
  }
  
  // Ordenar por data (mais recente primeiro)
  return result.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
});

// Métodos
const formatarValor = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatarData = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return dateString;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'pendente': return 'Pendente';
    case 'aprovado': return 'Aprovado';
    case 'rejeitado': return 'Rejeitado';
    default: return status;
  }
};

const criarNovoOrcamento = () => {
  orcamentoAtual.value = {
    clienteId: '',
    ordemId: '',
    itens: [],
    valor: 0,
    status: 'pendente',
    observacoes: ''
  };
  showModal.value = true;
};

const abrirDetalhesOrcamento = (id: string) => {
  router.push(`/orcamentos/${id}`);
};

const editarOrcamento = (id: string) => {
  const orcamento = orcamentoStore.orcamentos.find(o => o.id === id);
  if (orcamento) {
    orcamentoAtual.value = { ...orcamento };
    showModal.value = true;
  }
};

const fecharModal = () => {
  showModal.value = false;
  orcamentoAtual.value = null;
};

const salvarOrcamento = async (orcamento: any) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    if (orcamento.id) {
      await orcamentoStore.atualizarOrcamento(orcamento);
    } else {
      await orcamentoStore.criarOrcamento(orcamento);
    }
    fecharModal();
  } catch (err) {
    console.error('Erro ao salvar orçamento:', err);
    error.value = 'Erro ao salvar orçamento. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const aprovarOrcamento = async (id: string) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await orcamentoStore.atualizarStatusOrcamento(id, 'aprovado');
    // Se há uma ordem vinculada, atualizamos o status dela
    const orcamento = orcamentoStore.orcamentos.find(o => o.id === id);
    if (orcamento && orcamento.ordemId) {
      await ordemStore.atualizarStatus(orcamento.ordemId, 'aprovado');
    }
  } catch (err) {
    console.error('Erro ao aprovar orçamento:', err);
    error.value = 'Erro ao aprovar orçamento. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const rejeitarOrcamento = async (id: string) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await orcamentoStore.atualizarStatusOrcamento(id, 'rejeitado');
  } catch (err) {
    console.error('Erro ao rejeitar orçamento:', err);
    error.value = 'Erro ao rejeitar orçamento. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const imprimirOrcamento = async (id: string) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const orcamento = orcamentoStore.orcamentos.find(o => o.id === id);
    if (!orcamento) {
      throw new Error('Orçamento não encontrado');
    }
    
    await orcamentoStore.imprimirOrcamento(id);
  } catch (err) {
    console.error('Erro ao imprimir orçamento:', err);
    error.value = 'Erro ao imprimir orçamento. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};
</script> 