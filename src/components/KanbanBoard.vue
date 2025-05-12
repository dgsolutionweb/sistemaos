<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-x-auto">
      <div class="inline-flex h-full p-4 space-x-4">
        <div
          v-for="column in columns"
          :key="column.id"
          class="flex flex-col bg-gray-100 rounded-lg p-4 w-80"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ column.title }}
            </h3>
            <span class="px-3 py-1 text-sm font-medium rounded-full" :class="getStatusColor(column.id)">
              {{ column.orders.length }}
            </span>
          </div>

          <div
            class="flex-1 overflow-y-auto"
            @drop="onDrop($event, column.id)"
            @dragover.prevent
            @dragenter.prevent
          >
            <TransitionGroup
              tag="div"
              class="space-y-3"
              name="ordem-list"
              move-class="ordem-move"
            >
              <div
                v-for="ordem in column.orders"
                :key="ordem.id"
                class="bg-white p-4 rounded-lg shadow cursor-move"
                draggable="true"
                @dragstart="onDragStart($event, ordem, column.id)"
                @click="$emit('ordem-click', ordem)"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-medium text-gray-900">
                      #{{ ordem.id }} - {{ ordem.equipamento }}
                    </p>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                      {{ ordem.descricaoProblema }}
                    </p>
                  </div>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getPrioridadeColor(ordem.prioridade)"
                  >
                    {{ ordem.prioridade }}
                  </span>
                </div>

                <div class="mt-3 flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <CalendarIcon class="h-4 w-4 mr-1" />
                    {{ formatDate(ordem.dataEntrada) }}
                  </div>
                  <div class="flex items-center">
                    <UserIcon class="h-4 w-4 mr-1 text-gray-500" />
                    <span class="text-gray-600">{{ getTecnicoNome(ordem.tecnicoId) }}</span>
                  </div>
                </div>

                <div class="mt-2 flex items-center space-x-2">
                  <span
                    v-if="ordem.garantia"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    <ShieldCheckIcon class="h-3 w-3 mr-1" />
                    Garantia
                  </span>
                  <span
                    v-if="ordem.orcamento"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <CurrencyDollarIcon class="h-3 w-3 mr-1" />
                    R$ {{ formatCurrency(ordem.orcamento.valor) }}
                  </span>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline';
import type { OrdemServico, KanbanColumn } from '@/types';
import { useTecnicoStore } from '@/stores/tecnicoStore';

const props = defineProps<{
  ordens: OrdemServico[];
}>();

const emit = defineEmits<{
  (e: 'ordem-click', ordem: OrdemServico): void;
  (e: 'status-change', ordem: OrdemServico, novoStatus: string): void;
}>();

const tecnicoStore = useTecnicoStore();

const columns = computed<KanbanColumn[]>(() => [
  {
    id: 'aguardando',
    title: 'Aguardando',
    orders: props.ordens.filter(o => o.status === 'aguardando'),
  },
  {
    id: 'em_analise',
    title: 'Em Análise',
    orders: props.ordens.filter(o => o.status === 'em_analise'),
  },
  {
    id: 'orcamento',
    title: 'Orçamento',
    orders: props.ordens.filter(o => o.status === 'orcamento'),
  },
  {
    id: 'aprovado',
    title: 'Aprovado',
    orders: props.ordens.filter(o => o.status === 'aprovado'),
  },
  {
    id: 'em_execucao',
    title: 'Em Execução',
    orders: props.ordens.filter(o => o.status === 'em_execucao'),
  },
  {
    id: 'concluido',
    title: 'Concluído',
    orders: props.ordens.filter(o => o.status === 'concluido'),
  },
]);

const getStatusColor = (status: string) => {
  const colors = {
    aguardando: 'bg-yellow-100 text-yellow-800',
    em_analise: 'bg-blue-100 text-blue-800',
    orcamento: 'bg-purple-100 text-purple-800',
    aprovado: 'bg-green-100 text-green-800',
    em_execucao: 'bg-orange-100 text-orange-800',
    concluido: 'bg-gray-100 text-gray-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getPrioridadeColor = (prioridade: string | undefined) => {
  if (!prioridade) return 'bg-gray-100 text-gray-800';
  
  const colors = {
    baixa: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800',
  };
  return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getTecnicoNome = (tecnicoId: string | undefined) => {
  if (!tecnicoId) return 'Não atribuído';
  const tecnico = tecnicoStore.tecnicos.find(t => t.id === tecnicoId);
  return tecnico?.nome || 'Não atribuído';
};

const onDragStart = (event: DragEvent, ordem: OrdemServico, fromStatus: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('ordem', JSON.stringify(ordem));
    event.dataTransfer.setData('fromStatus', fromStatus);
  }
};

const onDrop = (event: DragEvent, toStatus: string) => {
  const ordemData = event.dataTransfer?.getData('ordem');
  const fromStatus = event.dataTransfer?.getData('fromStatus');

  if (ordemData && fromStatus && fromStatus !== toStatus) {
    const ordem = JSON.parse(ordemData) as OrdemServico;
    emit('status-change', ordem, toStatus);
  }
};
</script>

<style scoped>
.ordem-list-move {
  transition: transform 0.3s ease;
}

.ordem-list-enter-active,
.ordem-list-leave-active {
  transition: all 0.3s ease;
}

.ordem-list-enter-from,
.ordem-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 