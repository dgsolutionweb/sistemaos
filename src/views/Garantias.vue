<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ ordemId ? 'Garantias da Ordem #' + ordemId : 'Todas as Garantias' }}
      </h1>
      <div class="flex space-x-4">
        <button
          v-if="!ordemId && ordensConcluidasSemGarantia.length > 0"
          @click="criarGarantiasAutomaticas"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Criar Garantias Automáticas ({{ ordensConcluidasSemGarantia.length }})
        </button>
        <button
          @click="openModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nova Garantia
        </button>
      </div>
    </div>

    <!-- Notificação -->
    <div v-if="notificacao" class="mb-6 p-4 rounded-md bg-green-100 text-green-800 flex justify-between items-center">
      <div class="flex items-center">
        <CheckCircleIcon class="h-5 w-5 mr-2" />
        {{ notificacao }}
      </div>
      <button @click="notificacao = ''" class="text-green-700 hover:text-green-900">
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="garantiaStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="garantiaStore.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      {{ garantiaStore.error }}
    </div>

    <!-- Garantias Table -->
    <div v-else-if="garantias.length" class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ordem #
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Período
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Descrição
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="garantia in garantias" :key="garantia.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <router-link 
                :to="{ name: 'ordem-detalhes', params: { id: garantia.ordemId }}"
                class="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {{ garantia.ordemId }}
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ formatDate(garantia.dataInicio) }}
              </div>
              <div class="text-sm text-gray-500">
                até {{ formatDate(garantia.dataFim) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ garantia.descricao }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  {
                    'bg-green-100 text-green-800': garantia.status === 'ativa',
                    'bg-red-100 text-red-800': garantia.status === 'cancelada',
                    'bg-gray-100 text-gray-800': garantia.status === 'expirada'
                  }
                ]"
              >
                {{ statusFormatado(garantia.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button
                  @click="visualizarDetalhes(garantia)"
                  class="text-gray-600 hover:text-gray-800"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="garantia.status === 'ativa'"
                  @click="editarGarantia(garantia)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="garantia.status === 'ativa'"
                  @click="confirmarCancelamento(garantia)"
                  class="text-orange-600 hover:text-orange-800"
                >
                  <NoSymbolIcon class="h-5 w-5" />
                </button>
                <button
                  @click="confirmarExclusao(garantia)"
                  class="text-red-600 hover:text-red-800"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white shadow-md rounded-lg p-6 text-center">
      <DocumentTextIcon class="h-16 w-16 mx-auto text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma garantia encontrada</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ ordemId ? 'Esta ordem de serviço não possui garantias registradas.' : 'Não há garantias registradas no sistema.' }}
      </p>
      <div class="mt-6">
        <button
          @click="openModal()"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nova Garantia
        </button>
      </div>
    </div>

    <!-- Modal de Formulário -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {{ editandoGarantia ? 'Editar Garantia' : 'Nova Garantia' }}
                </DialogTitle>

                <form @submit.prevent="salvarGarantia" class="space-y-4">
                  <div v-if="!ordemId">
                    <label class="block text-sm font-medium text-gray-700">
                      Ordem de Serviço
                    </label>
                    <select
                      v-model="formData.ordemId"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="" disabled>Selecione uma ordem</option>
                      <option v-for="ordem in ordensDisponiveis" :key="ordem.id" :value="ordem.id">
                        Ordem #{{ ordem.id }} - {{ ordem.equipamento }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <input
                      type="text"
                      v-model="formData.descricao"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      v-model="formData.dataInicio"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Data de Fim
                    </label>
                    <input
                      type="date"
                      v-model="formData.dataFim"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Termos da Garantia
                    </label>
                    <textarea
                      v-model="formData.termos"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {{ editandoGarantia ? 'Atualizar' : 'Cadastrar' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de Detalhes -->
    <TransitionRoot appear :show="isDetalhesModalOpen" as="template">
      <Dialog as="div" @close="closeDetalhesModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel v-if="garantiaSelecionada" class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Detalhes da Garantia
                </DialogTitle>
                
                <div class="mt-4 space-y-4">
                  <div class="border-t border-gray-200 pt-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Ordem de Serviço</h4>
                        <p class="mt-1 text-sm text-gray-900">
                          <router-link 
                            :to="{ name: 'ordem-detalhes', params: { id: garantiaSelecionada.ordemId }}"
                            class="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            #{{ garantiaSelecionada.ordemId }}
                          </router-link>
                        </p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Status</h4>
                        <p class="mt-1">
                          <span
                            :class="[
                              'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                              {
                                'bg-green-100 text-green-800': garantiaSelecionada.status === 'ativa',
                                'bg-red-100 text-red-800': garantiaSelecionada.status === 'cancelada',
                                'bg-gray-100 text-gray-800': garantiaSelecionada.status === 'expirada'
                              }
                            ]"
                          >
                            {{ statusFormatado(garantiaSelecionada.status) }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <h4 class="text-sm font-medium text-gray-500">Descrição</h4>
                    <p class="mt-1 text-sm text-gray-900">{{ garantiaSelecionada.descricao }}</p>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Data de Início</h4>
                        <p class="mt-1 text-sm text-gray-900">{{ formatDate(garantiaSelecionada.dataInicio) }}</p>
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-500">Data de Término</h4>
                        <p class="mt-1 text-sm text-gray-900">{{ formatDate(garantiaSelecionada.dataFim) }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <h4 class="text-sm font-medium text-gray-500">Termos da Garantia</h4>
                    <p class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ garantiaSelecionada.termos }}</p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    @click="closeDetalhesModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  >
                    Fechar
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de Confirmação de Cancelamento -->
    <TransitionRoot appear :show="isCancelamentoModalOpen" as="template">
      <Dialog as="div" @close="closeCancelamentoModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirmar Cancelamento
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja cancelar esta garantia? Esta ação não pode ser desfeita.
                  </p>
                </div>

                <div class="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeCancelamentoModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    @click="cancelarGarantiaConfirmado"
                    class="inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Cancelar Garantia
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de Confirmação de Exclusão -->
    <TransitionRoot appear :show="isExclusaoModalOpen" as="template">
      <Dialog as="div" @close="closeExclusaoModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirmar Exclusão
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir esta garantia? Esta ação não pode ser desfeita.
                  </p>
                </div>

                <div class="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeExclusaoModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    @click="excluirGarantiaConfirmado"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Excluir
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  DocumentTextIcon,
  PlusIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import { useGarantiaStore } from '@/stores/garantiaStore';
import { useOrdemStore } from '@/stores/ordem';
import { useConfigStore } from '@/stores/configuracaoStore';
import type { Garantia, OrdemServico } from '@/types';
import { format, parseISO, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const props = defineProps<{
  ordemId?: string;
}>();

const garantiaStore = useGarantiaStore();
const ordemStore = useOrdemStore();
const configStore = useConfigStore();

const garantias = ref<Garantia[]>([]);
const isModalOpen = ref(false);
const isDetalhesModalOpen = ref(false);
const isCancelamentoModalOpen = ref(false);
const isExclusaoModalOpen = ref(false);
const editandoGarantia = ref<Garantia | null>(null);
const garantiaSelecionada = ref<Garantia | null>(null);
const garantiaParaCancelar = ref<Garantia | null>(null);
const garantiaParaExcluir = ref<Garantia | null>(null);
const notificacao = ref('');
const ordensConcluidasSemGarantia = ref<OrdemServico[]>([]);

const formData = ref({
  ordemId: props.ordemId || '',
  descricao: '',
  dataInicio: '',
  dataFim: '',
  termos: '',
  status: 'ativa' as Garantia['status']
});

const ordensDisponiveis = computed(() => {
  return ordemStore.ordens.filter(o => 
    o.status === 'concluido' || 
    o.status === 'em_execucao' || 
    o.status === 'aprovado'
  );
});

onMounted(async () => {
  // Buscar configurações da empresa
  await configStore.buscarConfiguracao();
  
  // Buscar todas as ordens
  await ordemStore.fetchOrdens();
  
  if (props.ordemId) {
    const ordemGarantias = await garantiaStore.fetchGarantiasPorOrdem(props.ordemId);
    garantias.value = ordemGarantias;
  } else {
    await garantiaStore.fetchGarantias();
    garantias.value = garantiaStore.garantias;
    
    // Verificar ordens concluídas sem garantia
    await verificarOrdensSemGarantia();
  }
});

watch(() => garantiaStore.garantias, (newGarantias) => {
  if (!props.ordemId) {
    garantias.value = newGarantias;
  }
}, { deep: true });

const verificarOrdensSemGarantia = async () => {
  // Buscar todas as ordens concluídas
  const ordensConcluidas = ordemStore.ordens.filter(ordem => ordem.status === 'concluido');
  
  // Para cada ordem concluída, verificar se já existe garantia
  const ordens: OrdemServico[] = [];
  const garantiasMap = new Map<string, boolean>();
  
  // Criar um mapa para verificação rápida
  garantias.value.forEach(garantia => {
    garantiasMap.set(garantia.ordemId, true);
  });
  
  // Filtrar ordens que não têm garantia
  ordensConcluidas.forEach(ordem => {
    if (!garantiasMap.has(ordem.id)) {
      ordens.push(ordem);
    }
  });
  
  ordensConcluidasSemGarantia.value = ordens;
};

const criarGarantiasAutomaticas = async () => {
  try {
    // Buscar termos de garantia padrão da configuração da empresa
    const termosGarantia = configStore.configuracao?.termosGarantia || 
      'Garantia padrão de 90 dias para peças e serviços realizados, conforme legislação vigente.';
    
    let garantiasCriadas = 0;
    
    for (const ordem of ordensConcluidasSemGarantia.value) {
      // Definir datas para a garantia (padrão: 90 dias a partir da conclusão)
      const dataInicio = ordem.dataConclusao || new Date().toISOString();
      const dataInicioDate = parseISO(dataInicio);
      const dataFimDate = addMonths(dataInicioDate, 3); // 3 meses = 90 dias
      
      // Preparar dados da garantia
      const garantia = {
        ordemId: ordem.id,
        descricao: `Garantia para ${ordem.equipamento} ${ordem.marca} ${ordem.modelo}`,
        dataInicio,
        dataFim: dataFimDate.toISOString(),
        termos: termosGarantia,
        status: 'ativa' as Garantia['status']
      };
      
      // Criar a garantia
      await garantiaStore.addGarantia(garantia);
      garantiasCriadas++;
    }
    
    // Atualizar lista de garantias
    await garantiaStore.fetchGarantias();
    garantias.value = garantiaStore.garantias;
    
    // Atualizar lista de ordens sem garantia
    await verificarOrdensSemGarantia();
    
    // Exibir notificação
    notificacao.value = `${garantiasCriadas} garantias foram criadas automaticamente.`;
  } catch (error) {
    console.error('Erro ao criar garantias automáticas:', error);
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return dateString;
  }
};

const statusFormatado = (status: Garantia['status']) => {
  switch (status) {
    case 'ativa':
      return 'Ativa';
    case 'expirada':
      return 'Expirada';
    case 'cancelada':
      return 'Cancelada';
    default:
      return status;
  }
};

const openModal = (garantia?: Garantia) => {
  if (garantia) {
    editandoGarantia.value = garantia;
    const dataInicio = garantia.dataInicio ? 
      format(parseISO(garantia.dataInicio), 'yyyy-MM-dd') : '';
    const dataFim = garantia.dataFim ? 
      format(parseISO(garantia.dataFim), 'yyyy-MM-dd') : '';
      
    formData.value = {
      ordemId: garantia.ordemId,
      descricao: garantia.descricao,
      dataInicio,
      dataFim,
      termos: garantia.termos,
      status: garantia.status
    };
  } else {
    editandoGarantia.value = null;
    formData.value = {
      ordemId: props.ordemId || '',
      descricao: '',
      dataInicio: format(new Date(), 'yyyy-MM-dd'),
      dataFim: '',
      termos: configStore.configuracao?.termosGarantia || '',
      status: 'ativa'
    };
  }
  
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const visualizarDetalhes = (garantia: Garantia) => {
  garantiaSelecionada.value = garantia;
  isDetalhesModalOpen.value = true;
};

const closeDetalhesModal = () => {
  isDetalhesModalOpen.value = false;
  garantiaSelecionada.value = null;
};

const editarGarantia = (garantia: Garantia) => {
  openModal(garantia);
};

const confirmarCancelamento = (garantia: Garantia) => {
  garantiaParaCancelar.value = garantia;
  isCancelamentoModalOpen.value = true;
};

const closeCancelamentoModal = () => {
  isCancelamentoModalOpen.value = false;
  garantiaParaCancelar.value = null;
};

const confirmarExclusao = (garantia: Garantia) => {
  garantiaParaExcluir.value = garantia;
  isExclusaoModalOpen.value = true;
};

const closeExclusaoModal = () => {
  isExclusaoModalOpen.value = false;
  garantiaParaExcluir.value = null;
};

const salvarGarantia = async () => {
  try {
    const dataInicio = new Date(formData.value.dataInicio);
    const dataFim = new Date(formData.value.dataFim);
    
    const dadosGarantia = {
      ...formData.value,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
    };
    
    if (editandoGarantia.value) {
      await garantiaStore.updateGarantia(editandoGarantia.value.id, dadosGarantia);
      
      if (props.ordemId) {
        // Atualiza garantias da ordem específica
        const ordemGarantias = await garantiaStore.fetchGarantiasPorOrdem(props.ordemId);
        garantias.value = ordemGarantias;
      }
    } else {
      const novaGarantia = await garantiaStore.addGarantia(dadosGarantia);
      
      if (props.ordemId) {
        // Adiciona a nova garantia à lista se for da ordem atual
        if (novaGarantia.ordemId === props.ordemId) {
          garantias.value.push(novaGarantia);
        }
      }
    }
    
    // Verificar ordens sem garantia após adicionar/editar
    if (!props.ordemId) {
      await verificarOrdensSemGarantia();
    }
    
    closeModal();
  } catch (error) {
    console.error('Erro ao salvar garantia:', error);
  }
};

const cancelarGarantiaConfirmado = async () => {
  if (garantiaParaCancelar.value) {
    try {
      await garantiaStore.cancelarGarantia(garantiaParaCancelar.value.id);
      
      if (props.ordemId) {
        // Atualiza garantias da ordem específica
        const ordemGarantias = await garantiaStore.fetchGarantiasPorOrdem(props.ordemId);
        garantias.value = ordemGarantias;
      }
      
      closeCancelamentoModal();
    } catch (error) {
      console.error('Erro ao cancelar garantia:', error);
    }
  }
};

const excluirGarantiaConfirmado = async () => {
  if (garantiaParaExcluir.value) {
    try {
      await garantiaStore.deleteGarantia(garantiaParaExcluir.value.id);
      
      if (props.ordemId) {
        // Filtrar a garantia excluída da lista de garantias da ordem
        garantias.value = garantias.value.filter(g => g.id !== garantiaParaExcluir.value?.id);
      } else {
        // Verificar ordens sem garantia após excluir
        await verificarOrdensSemGarantia();
      }
      
      closeExclusaoModal();
    } catch (error) {
      console.error('Erro ao excluir garantia:', error);
    }
  }
};
</script> 