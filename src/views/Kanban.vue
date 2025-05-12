<template>
  <div class="h-full flex flex-col">
    <div class="px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Kanban de Serviços</h1>
      <div class="flex space-x-2">
        <button
          @click="reloadData"
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon class="-ml-0.5 mr-2 h-4 w-4" />
          Atualizar
        </button>
        <div class="relative">
          <button
            type="button"
            @click="isFilterOpen = !isFilterOpen"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon class="-ml-0.5 mr-2 h-4 w-4" />
            Filtrar
          </button>
          <div 
            v-if="isFilterOpen" 
            class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20"
          >
            <div class="py-2 px-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filtrar por Técnico
            </div>
            <div class="py-2 px-4 max-h-60 overflow-y-auto">
              <div class="flex items-center py-1">
                <input 
                  id="all-tecnicos" 
                  type="checkbox" 
                  v-model="filtroTodos"
                  @change="selectAllTecnicos"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="all-tecnicos" class="ml-2 block text-sm text-gray-900">
                  Todos os técnicos
                </label>
              </div>
              <div v-for="tecnico in tecnicos" :key="tecnico.id" class="flex items-center py-1">
                <input 
                  :id="`tecnico-${tecnico.id}`" 
                  type="checkbox" 
                  v-model="tecnicosSelecionados" 
                  :value="tecnico.id"
                  @change="updateFiltroTodos"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label :for="`tecnico-${tecnico.id}`" class="ml-2 block text-sm text-gray-900">
                  {{ tecnico.nome }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      {{ error }}
    </div>

    <!-- Kanban Board -->
    <div v-else class="flex-1 overflow-hidden">
      <div class="h-full flex pb-1">
        <div 
          class="h-full flex space-x-4 overflow-x-auto px-4 pb-4 kanban-container"
        >
          <div 
            v-for="column in kanbanColumns" 
            :key="column.id" 
            class="flex-shrink-0 w-72 bg-gray-100 rounded-lg shadow flex flex-col"
          >
            <div class="px-4 py-3 bg-gray-200 rounded-t-lg">
              <h3 class="text-sm font-medium text-gray-700 flex items-center justify-between">
                {{ column.title }}
                <span class="bg-white text-gray-600 text-xs font-bold ml-2 px-2 py-1 rounded-full">
                  {{ column.orders.length }}
                </span>
              </h3>
            </div>
            
            <div 
              class="p-3 flex-1 overflow-y-auto min-h-[200px]"
              @dragover.prevent
              @drop="onDrop($event, column.id)"
            >
              <div 
                v-for="order in column.orders" 
                :key="order.id"
                class="bg-white p-4 rounded-lg shadow mb-3 cursor-grab"
                draggable="true"
                @dragstart="onDragStart($event, order, column.id)"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-semibold text-sm text-gray-900">
                      <router-link :to="`/ordens/${order.id}`" class="hover:text-blue-600">
                        #{{ order.id }}
                      </router-link>
                    </h4>
                    <p class="text-sm text-gray-500 mt-1">{{ order.equipamento }} - {{ order.marca }}</p>
                  </div>
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded-full',
                      {
                        'bg-red-100 text-red-800': order.prioridade === 'alta',
                        'bg-yellow-100 text-yellow-800': order.prioridade === 'media',
                        'bg-green-100 text-green-800': order.prioridade === 'baixa',
                        'bg-gray-100 text-gray-800': !order.prioridade
                      }
                    ]"
                  >
                    {{ formatPrioridade(order.prioridade) }}
                  </span>
                </div>
                
                <div class="mt-3 pt-3 border-t border-gray-200">
                  <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-1">
                      <CalendarIcon class="h-3.5 w-3.5 text-gray-500" />
                      <span class="text-gray-500">{{ formatDate(order.dataCriacao) }}</span>
                    </div>
                    <div v-if="order.tecnicoResponsavel" class="flex items-center">
                      <span 
                        class="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        <UserIcon class="h-3 w-3 mr-1" />
                        {{ order.tecnicoResponsavel }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div
                v-if="column.orders.length === 0"
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm h-24 flex items-center justify-center"
              >
                Sem ordens nesta coluna
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrdemStore } from '@/stores/ordem';
import { useTecnicoStore } from '@/stores/tecnicoStore';
import { 
  ArrowPathIcon, 
  FunnelIcon, 
  CalendarIcon,
  UserIcon
} from '@heroicons/vue/24/outline';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { OrdemServico, Status, KanbanColumn } from '@/types';

const ordemStore = useOrdemStore();
const tecnicoStore = useTecnicoStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const isFilterOpen = ref(false);
const filtroTodos = ref(true);
const tecnicosSelecionados = ref<string[]>([]);
const tecnicos = computed(() => tecnicoStore.tecnicos);
const ordens = computed(() => ordemStore.ordens);

const dragItem = ref<{order: OrdemServico, sourceColumn: string} | null>(null);

const statusLabels: Record<Status, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  em_analise: 'Em Análise',
  aguardando: 'Aguardando Cliente',
  orcamento: 'Orçamento',
  aprovado: 'Aprovado',
  em_execucao: 'Em Execução',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
};

const statusColumns: Status[] = [
  'pendente',
  'em_analise',
  'aguardando',
  'orcamento',
  'aprovado',
  'em_execucao',
  'concluido',
  'cancelado'
];

const kanbanColumns = computed(() => {
  return statusColumns.map(status => {
    let filteredOrders = ordens.value.filter(ordem => ordem.status === status);
    
    // Aplicar filtro de técnicos se necessário
    if (!filtroTodos.value && tecnicosSelecionados.value.length > 0) {
      filteredOrders = filteredOrders.filter(ordem => 
        ordem.tecnicoId && tecnicosSelecionados.value.includes(ordem.tecnicoId)
      );
    }
    
    return {
      id: status,
      title: statusLabels[status],
      orders: filteredOrders
    } as KanbanColumn;
  });
});

onMounted(async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      ordemStore.fetchOrdens(),
      tecnicoStore.fetchTecnicos()
    ]);
    
    // Inicializar a lista de técnicos selecionados com todos os técnicos
    tecnicosSelecionados.value = tecnicos.value.map(t => t.id);
  } catch (err) {
    error.value = 'Erro ao carregar dados do Kanban';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const reloadData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await ordemStore.fetchOrdens();
  } catch (err) {
    error.value = 'Erro ao atualizar os dados';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yy', { locale: ptBR });
  } catch (e) {
    return dateString;
  }
};

const formatPrioridade = (prioridade?: string) => {
  switch (prioridade) {
    case 'alta': return 'Alta';
    case 'media': return 'Média';
    case 'baixa': return 'Baixa';
    default: return 'Normal';
  }
};

const selectAllTecnicos = () => {
  if (filtroTodos.value) {
    tecnicosSelecionados.value = tecnicos.value.map(t => t.id);
  } else {
    tecnicosSelecionados.value = [];
  }
};

const updateFiltroTodos = () => {
  filtroTodos.value = tecnicosSelecionados.value.length === tecnicos.value.length;
};

const onDragStart = (e: DragEvent, order: OrdemServico, sourceColumnId: string) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    dragItem.value = { order, sourceColumn: sourceColumnId };
  }
};

const onDrop = async (e: DragEvent, targetColumnId: string) => {
  e.preventDefault();
  
  if (!dragItem.value || dragItem.value.sourceColumn === targetColumnId) {
    return;
  }
  
  const { order } = dragItem.value;
  const newStatus = targetColumnId as Status;
  
  try {
    await ordemStore.atualizarStatus(order.id, newStatus);
  } catch (err) {
    error.value = 'Erro ao atualizar o status da ordem';
    console.error(err);
  } finally {
    dragItem.value = null;
  }
};
</script>

<style scoped>
.kanban-container {
  scrollbar-width: thin;
  scrollbar-color: #c5c5c5 #f1f1f1;
}

.kanban-container::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.kanban-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

.kanban-container::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 8px;
}

.kanban-container::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

.kanban-container > div:last-child {
  margin-right: 1rem;
}

/* Ajusta a altura das colunas para preencher o espaço disponível */
.kanban-container > div {
  min-height: calc(100vh - 140px);
}

/* Estiliza a barra de rolagem vertical dentro de cada coluna */
div[class*="overflow-y-auto"]::-webkit-scrollbar {
  width: 4px;
}

div[class*="overflow-y-auto"]::-webkit-scrollbar-track {
  background: transparent;
}

div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

div[class*="overflow-y-auto"]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style> 