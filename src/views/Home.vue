<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <Spinner size="lg" color="indigo" />
    </div>

    <!-- Error state -->
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

    <div v-else>
      <!-- Métricas principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Ordens Abertas</p>
              <p class="text-3xl font-bold text-gray-900">{{ metricas.ordensAbertas }}</p>
            </div>
            <div class="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <ClipboardDocumentIcon class="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm">
              <span :class="metricas.ordensAbertas > metricas.mediaMensal ? 'text-red-500' : 'text-green-500'">
                {{ metricas.ordensAbertas > metricas.mediaMensal ? '↑' : '↓' }}
                {{ Math.abs(Math.round((metricas.ordensAbertas / Math.max(metricas.mediaMensal, 1) - 1) * 100)) }}%
              </span>
              <span class="text-gray-500 ml-2">em relação à média mensal</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Aguardando Aprovação</p>
              <p class="text-3xl font-bold text-gray-900">{{ metricas.ordensAguardando }}</p>
            </div>
            <div class="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-500">
              Em valor: R$ {{ formatarValor(metricas.valorAguardando) }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Concluídas (Mês)</p>
              <p class="text-3xl font-bold text-gray-900">{{ metricas.ordensConcluidas }}</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-500">
              {{ metricas.taxaConclusao }}% das ordens foram concluídas no prazo
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Faturamento (Mês)</p>
              <p class="text-3xl font-bold text-gray-900">R$ {{ formatarValor(metricas.faturamentoMensal) }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BanknotesIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm">
              <span :class="metricas.faturamentoVariacao >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ metricas.faturamentoVariacao >= 0 ? '↑' : '↓' }}
                {{ Math.abs(metricas.faturamentoVariacao) }}%
              </span>
              <span class="text-gray-500 ml-2">em relação ao mês anterior</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordens por Status e Ordens por Técnico -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <!-- Distribuição por Status -->
        <div class="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Distribuição por Status</h2>
          <div class="space-y-4">
            <div v-for="(status, index) in resumoStatusOrdens" :key="status.nome" class="flex items-center">
              <div class="w-1/3 text-sm text-gray-500">{{ status.nome }}</div>
              <div class="w-2/3">
                <div class="relative">
                  <div 
                    class="h-2 rounded-full" 
                    :class="[statusBarColors[index % statusBarColors.length]]"
                    :style="{ width: `${status.porcentagem}%` }"
                  ></div>
                  <div class="absolute top-0 right-0 -mt-1 text-xs text-gray-500">
                    {{ status.quantidade }} ({{ status.porcentagem }}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ordens por Técnico -->
        <div class="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Ordens por Técnico</h2>
            <select v-model="filtroTecnico" class="rounded-md border-gray-300 py-1 pl-2 pr-8 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm">
              <option value="quantidade">Quantidade</option>
              <option value="andamento">Em Andamento</option>
              <option value="concluidas">Concluídas</option>
            </select>
          </div>
          
          <div class="space-y-4">
            <div v-for="tecnico in ordensPorTecnicoFiltradas" :key="tecnico.id" class="flex items-center">
              <div class="shrink-0 mr-4">
                <img 
                  class="h-10 w-10 rounded-full" 
                  :src="tecnico.foto || '/images/placeholder-avatar.png'" 
                  :alt="tecnico.nome" 
                  @error="e => e.target.src = '/images/placeholder-avatar.png'" 
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ tecnico.nome }}</p>
                  <p class="text-sm text-gray-500">{{ obterValorTecnicoFiltrado(tecnico) }}</p>
                </div>
                <div class="relative">
                  <div class="h-2 bg-gray-200 rounded-full">
                    <div 
                      class="h-2 rounded-full bg-blue-600" 
                      :style="{ width: `${calcularPorcentagemTecnico(tecnico)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordens Recentes e Ordens Críticas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Ordens Recentes -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Ordens Recentes</h2>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="ordem in ordensRecentes" :key="ordem.id" class="px-6 py-4 hover:bg-gray-50">
              <router-link :to="`/ordens/${ordem.id}`" class="flex items-center">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-indigo-600 truncate">#{{ ordem.id }} - {{ ordem.equipamento }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ ordem.cliente?.nome || 'Cliente não encontrado' }}</p>
                  <p class="mt-1 text-xs text-gray-500">Criado em {{ formatDate(ordem.dataCriacao) }}</p>
                </div>
                <div>
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    :class="statusClasses[ordem.status]"
                  >
                    {{ statusLabels[ordem.status] }}
                  </span>
                </div>
              </router-link>
            </li>
            <li v-if="ordensRecentes.length === 0" class="px-6 py-4 text-center text-gray-500">
              Nenhuma ordem recente encontrada
            </li>
          </ul>
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <router-link to="/ordens" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Ver todas as ordens
              <ArrowLongRightIcon class="inline-block h-4 w-4 ml-1" />
            </router-link>
          </div>
        </div>

        <!-- Ordens Críticas -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Ordens Críticas</h2>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="ordem in ordensCriticas" :key="ordem.id" class="px-6 py-4 hover:bg-gray-50">
              <router-link :to="`/ordens/${ordem.id}`" class="flex items-center">
                <div class="shrink-0 mr-4">
                  <ExclamationTriangleIcon v-if="ordem.prioridade === 'alta'" class="h-6 w-6 text-red-500" />
                  <ClockIcon v-else-if="ordem.emAtraso" class="h-6 w-6 text-amber-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-indigo-600 truncate">#{{ ordem.id }} - {{ ordem.equipamento }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ ordem.cliente?.nome || 'Cliente não encontrado' }}</p>
                  <p v-if="ordem.dataPrevisao" class="mt-1 text-xs text-gray-500">
                    Previsão: {{ formatDate(ordem.dataPrevisao) }}
                  </p>
                </div>
                <div>
                  <span
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    :class="statusClasses[ordem.status]"
                  >
                    {{ statusLabels[ordem.status] }}
                  </span>
                </div>
              </router-link>
            </li>
            <li v-if="ordensCriticas.length === 0" class="px-6 py-4 text-center text-gray-500">
              Nenhuma ordem crítica encontrada
            </li>
          </ul>
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <router-link to="/kanban" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Ver Kanban
              <ArrowLongRightIcon class="inline-block h-4 w-4 ml-1" />
            </router-link>
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
import { storeToRefs } from 'pinia';
import { format, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ClipboardDocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ArrowLongRightIcon
} from '@heroicons/vue/24/outline';
import Spinner from '@/components/Spinner.vue';
import type { OrdemServico, Tecnico } from '@/types';

const ordemStore = useOrdemStore();
const tecnicoStore = useTecnicoStore();

const { ordens, clientes, loading: ordensLoading } = storeToRefs(ordemStore);
const { tecnicos, isLoading: tecnicosLoading } = storeToRefs(tecnicoStore);

const error = ref<string | null>(null);
const isLoading = computed(() => ordensLoading.value || tecnicosLoading.value);

const filtroTecnico = ref<'quantidade' | 'andamento' | 'concluidas'>('quantidade');

// Carregar os dados
onMounted(async () => {
  try {
    await Promise.all([
      ordemStore.fetchOrdens(),
      tecnicoStore.fetchTecnicos()
    ]);
  } catch (err) {
    error.value = 'Erro ao carregar dados do dashboard';
    console.error(err);
  }
});

// Formatar valor monetário
const formatarValor = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Formatar data
const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (e) {
    return dateString;
  }
};

// Status labels e classes
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
};

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
};

const statusBarColors = [
  'bg-blue-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500'
];

// Calcular métricas
const metricas = computed(() => {
  // Status das ordens
  const ordensAbertas = ordens.value.filter(o => o.status !== 'concluido' && o.status !== 'cancelado').length;
  const ordensAguardando = ordens.value.filter(o => o.status === 'orcamento').length;
  
  // Orçamentos aguardando aprovação
  const valorAguardando = ordens.value
    .filter(o => o.status === 'orcamento' && o.orcamento)
    .reduce((total, ordem) => total + (ordem.orcamento?.valor || 0), 0);
  
  // Ordens concluídas no mês atual
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ordensConcluidas = ordens.value.filter(o => {
    if (o.status !== 'concluido' || !o.dataConclusao) return false;
    const dataConclusao = parseISO(o.dataConclusao);
    return dataConclusao >= inicioMes;
  }).length;

  // Taxa de conclusão no prazo
  const ordensConcludasNoMes = ordens.value.filter(o => {
    if (o.status !== 'concluido' || !o.dataConclusao) return false;
    const dataConclusao = parseISO(o.dataConclusao);
    return dataConclusao >= inicioMes;
  });
  
  const ordensConcludasNoPrazo = ordensConcludasNoMes.filter(o => {
    if (!o.dataPrevisao || !o.dataConclusao) return true; // Sem previsão, consideramos como no prazo
    return parseISO(o.dataConclusao) <= parseISO(o.dataPrevisao);
  }).length;
  
  const taxaConclusao = ordensConcludasNoMes.length > 0 
    ? Math.round((ordensConcludasNoPrazo / ordensConcludasNoMes.length) * 100) 
    : 100;

  // Faturamento mensal
  const faturamentoMensal = ordens.value
    .filter(o => {
      if (o.status !== 'concluido' || !o.dataConclusao) return false;
      const dataConclusao = parseISO(o.dataConclusao);
      return dataConclusao >= inicioMes;
    })
    .reduce((total, ordem) => {
      const valorServico = ordem.valorServico || 0;
      const valorPecas = ordem.valorPecas || 0;
      return total + valorServico + valorPecas;
    }, 0);

  // Variação de faturamento (simulando com valor fixo para exemplo)
  const faturamentoVariacao = 15;

  // Média mensal (simulada)
  const mediaMensal = Math.round(ordensAbertas * 0.85);

  return {
    ordensAbertas,
    ordensAguardando,
    valorAguardando,
    ordensConcluidas,
    taxaConclusao,
    faturamentoMensal,
    faturamentoVariacao,
    mediaMensal
  };
});

// Resumo por status
const resumoStatusOrdens = computed(() => {
  const total = ordens.value.length;
  if (total === 0) return [];

  const contagem: Record<string, number> = {};
  ordens.value.forEach(ordem => {
    contagem[ordem.status] = (contagem[ordem.status] || 0) + 1;
  });

  return Object.entries(statusLabels).map(([key, nome]) => {
    const quantidade = contagem[key] || 0;
    const porcentagem = total > 0 ? Math.round((quantidade / total) * 100) : 0;

    return {
      nome,
      status: key,
      quantidade,
      porcentagem
    };
  });
});

// Ordens por técnico
const ordensPorTecnico = computed(() => {
  return tecnicos.value.map(tecnico => {
    const todasOrdens = ordens.value.filter(o => o.tecnicoId === tecnico.id);
    const ordensEmAndamento = todasOrdens.filter(o => 
      o.status !== 'concluido' && o.status !== 'cancelado'
    );
    const ordensConcluidas = todasOrdens.filter(o => o.status === 'concluido');

    return {
      ...tecnico,
      ordens: {
        total: todasOrdens.length,
        emAndamento: ordensEmAndamento.length,
        concluidas: ordensConcluidas.length
      }
    };
  });
});

// Filtragem de técnicos
const ordensPorTecnicoFiltradas = computed(() => {
  let resultado = [...ordensPorTecnico.value];
  
  // Ordenar por critério selecionado
  if (filtroTecnico.value === 'quantidade') {
    resultado.sort((a, b) => b.ordens.total - a.ordens.total);
  } else if (filtroTecnico.value === 'andamento') {
    resultado.sort((a, b) => b.ordens.emAndamento - a.ordens.emAndamento);
  } else if (filtroTecnico.value === 'concluidas') {
    resultado.sort((a, b) => b.ordens.concluidas - a.ordens.concluidas);
  }
  
  return resultado;
});

// Auxiliar para obter o valor filtrado
const obterValorTecnicoFiltrado = (tecnico: any) => {
  if (filtroTecnico.value === 'quantidade') {
    return `${tecnico.ordens.total} ordens`;
  } else if (filtroTecnico.value === 'andamento') {
    return `${tecnico.ordens.emAndamento} em andamento`;
  } else if (filtroTecnico.value === 'concluidas') {
    return `${tecnico.ordens.concluidas} concluídas`;
  }
  return '';
};

// Cálculo de porcentagem para barra de progresso
const calcularPorcentagemTecnico = (tecnico: any) => {
  const maxValue = ordensPorTecnicoFiltradas.value.reduce((max, t) => {
    let valorAtual = 0;
    if (filtroTecnico.value === 'quantidade') {
      valorAtual = t.ordens.total;
    } else if (filtroTecnico.value === 'andamento') {
      valorAtual = t.ordens.emAndamento;
    } else if (filtroTecnico.value === 'concluidas') {
      valorAtual = t.ordens.concluidas;
    }
    return Math.max(max, valorAtual);
  }, 0);

  let valorTecnico = 0;
  if (filtroTecnico.value === 'quantidade') {
    valorTecnico = tecnico.ordens.total;
  } else if (filtroTecnico.value === 'andamento') {
    valorTecnico = tecnico.ordens.emAndamento;
  } else if (filtroTecnico.value === 'concluidas') {
    valorTecnico = tecnico.ordens.concluidas;
  }

  return maxValue > 0 ? (valorTecnico / maxValue) * 100 : 0;
};

// Ordens recentes
const ordensRecentes = computed(() => {
  const ordensComCliente = ordens.value.map(ordem => ({
    ...ordem,
    cliente: clientes.value.find(c => c.id === ordem.clienteId)
  }));

  return [...ordensComCliente]
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 5);
});

// Ordens críticas (prioridade alta ou atrasadas)
const ordensCriticas = computed(() => {
  const hoje = new Date();
  
  const ordensComCliente = ordens.value
    .filter(ordem => 
      ordem.status !== 'concluido' && 
      ordem.status !== 'cancelado' &&
      (
        ordem.prioridade === 'alta' || 
        (ordem.dataPrevisao && isAfter(hoje, parseISO(ordem.dataPrevisao)))
      )
    )
    .map(ordem => ({
      ...ordem,
      cliente: clientes.value.find(c => c.id === ordem.clienteId),
      emAtraso: ordem.dataPrevisao ? isAfter(hoje, parseISO(ordem.dataPrevisao)) : false
    }));

  return [...ordensComCliente]
    .sort((a, b) => {
      // Priorizar ordens com prioridade alta
      if (a.prioridade === 'alta' && b.prioridade !== 'alta') return -1;
      if (a.prioridade !== 'alta' && b.prioridade === 'alta') return 1;
      
      // Depois, ordens em atraso
      if (a.emAtraso && !b.emAtraso) return -1;
      if (!a.emAtraso && b.emAtraso) return 1;
      
      // Por fim, ordenar por data de previsão
      if (a.dataPrevisao && b.dataPrevisao) {
        return parseISO(a.dataPrevisao).getTime() - parseISO(b.dataPrevisao).getTime();
      }
      
      return 0;
    })
    .slice(0, 5);
});
</script> 