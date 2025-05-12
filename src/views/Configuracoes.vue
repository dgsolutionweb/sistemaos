<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Configurações da Empresa</h1>

    <!-- Loading State -->
    <div v-if="configStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="configStore.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      {{ configStore.error }}
    </div>

    <form v-else @submit.prevent="saveConfiguracoes" class="space-y-6 max-w-3xl">
      <!-- Informações Básicas -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Nome da Empresa
            </label>
            <input
              type="text"
              v-model="formData.nomeEmpresa"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              CNPJ
            </label>
            <input
              type="text"
              v-model="formData.cnpj"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              v-model="formData.email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              v-model="formData.telefone"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              v-model="formData.endereco"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Logo -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Logo da Empresa</h2>
        
        <div class="flex items-center space-x-6">
          <div class="shrink-0">
            <img
              :src="logoPreview || formData.logo || '/placeholder-logo.png'"
              class="h-32 w-32 object-cover rounded-lg"
              alt="Logo da empresa"
            />
          </div>
          <label class="block">
            <span class="sr-only">Escolher arquivo</span>
            <input
              type="file"
              @change="handleLogoChange"
              accept="image/*"
              class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
        </div>
      </div>

      <!-- Horário de Funcionamento -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Horário de Funcionamento</h2>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Horário de Abertura
              </label>
              <input
                type="time"
                v-model="formData.horarioFuncionamento.inicio"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Horário de Fechamento
              </label>
              <input
                type="time"
                v-model="formData.horarioFuncionamento.fim"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Dias de Funcionamento
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label
                v-for="(dia, index) in diasSemana"
                :key="index"
                class="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  :value="index + 1"
                  v-model="formData.horarioFuncionamento.diasSemana"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ dia }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Termos de Garantia -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Termos de Garantia Padrão</h2>
        
        <div>
          <label class="sr-only">Termos de Garantia</label>
          <textarea
            v-model="formData.termosGarantia"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Digite os termos de garantia padrão..."
          ></textarea>
        </div>
      </div>

      <!-- Limpar Dados do Sistema -->
      <div class="bg-white shadow rounded-lg p-6 border border-red-200">
        <h2 class="text-lg font-medium text-red-800 mb-4">Manutenção do Sistema</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-medium text-gray-900">Limpar Dados do Sistema</h3>
              <p class="text-sm text-gray-500">Esta ação irá remover todos os dados de teste: clientes, ordens de serviço, garantias, etc.</p>
            </div>
            <button
              type="button"
              @click="showLimparDadosModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Limpar Dados
            </button>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Restaurar
        </button>
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="configStore.isLoading"
        >
          {{ configStore.isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
  </div>
  
  <!-- Modal de Confirmação para Limpar Dados -->
  <TransitionRoot appear :show="showLimparDadosModal" as="template">
    <Dialog as="div" class="relative z-10" @close="showLimparDadosModal = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Limpar Todos os Dados do Sistema
              </DialogTitle>
              
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Esta ação irá remover <strong>TODOS</strong> os dados do sistema, incluindo clientes, ordens de serviço, garantias e outros registros. Esta ação <strong>NÃO PODE</strong> ser desfeita.
                </p>
                
                <div class="mt-4 bg-red-50 p-4 rounded-md">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">Atenção: Esta ação é irreversível</h3>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4">
                  <label for="senha-confirmacao" class="block text-sm font-medium text-gray-700">
                    Digite a senha de confirmação
                  </label>
                  <input
                    type="password"
                    id="senha-confirmacao"
                    v-model="senha"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Digite a senha para confirmar"
                  />
                  <p v-if="senhaErro" class="mt-2 text-sm text-red-600">{{ senhaErro }}</p>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  @click="showLimparDadosModal = false"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  :disabled="limpandoDados"
                  @click="limparDadosConfirmado"
                >
                  <svg v-if="limpandoDados" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ limpandoDados ? 'Limpando...' : 'Confirmar Limpeza' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigStore } from '@/stores/configuracaoStore';
import { useOrdemStore } from '@/stores/ordem';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/composables/useToast';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import type { ConfiguracaoEmpresa } from '@/types';

const configStore = useConfigStore();
const ordemStore = useOrdemStore();
const toast = useToast();
const logoPreview = ref<string | null>(null);
const showLimparDadosModal = ref(false);
const senha = ref('');
const senhaErro = ref('');
const limpandoDados = ref(false);

const diasSemana = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

const formData = ref<ConfiguracaoEmpresa>({
  id: '1',
  nomeEmpresa: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: '',
  logo: '',
  horarioFuncionamento: {
    inicio: '08:00',
    fim: '18:00',
    diasSemana: [1, 2, 3, 4, 5], // Segunda a Sexta por padrão
  },
  termosGarantia: '',
});

onMounted(async () => {
  await configStore.buscarConfiguracao();
  if (configStore.configuracao) {
    formData.value = { ...configStore.configuracao };
  }
});

const handleLogoChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Preview do logo
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Upload do logo
    await configStore.uploadLogo(file);
    if (configStore.configuracao?.logo) {
      formData.value.logo = configStore.configuracao.logo;
    }
  }
};

const saveConfiguracoes = async () => {
  await configStore.atualizarConfiguracao(formData.value);
};

const resetForm = async () => {
  await configStore.buscarConfiguracao();
  if (configStore.configuracao) {
    formData.value = { ...configStore.configuracao };
    logoPreview.value = null;
  }
};

// Função para limpar todos os dados do sistema
const limparDadosConfirmado = async () => {
  senhaErro.value = '';
  
  // Verificar a senha
  if (senha.value !== '450159753') {
    senhaErro.value = 'Senha incorreta';
    return;
  }
  
  limpandoDados.value = true;
  
  try {
    // Limpar tabelas (exceto configuracao_empresa)
    const tabelas = [
      'garantias',
      'ordens_servico',
      'clientes',
      'tecnicos',
      'pecas'
    ];
    
    for (const tabela of tabelas) {
      const { error } = await supabase
        .from(tabela)
        .delete()
        .neq('id', '0'); // Garante que vai deletar todos os registros
      
      if (error) {
        console.error(`Erro ao limpar tabela ${tabela}:`, error);
        throw new Error(`Erro ao limpar tabela ${tabela}: ${error.message}`);
      }
    }
    
    // Reset sequências (opcional, se necessário)
    // Isso requereria uma chamada SQL direta ou função no back-end
    
    // Recarregar dados
    await ordemStore.fetchOrdens();
    
    // Fechar o modal
    showLimparDadosModal.value = false;
    senha.value = '';
    
    // Mostrar mensagem de sucesso
    toast.show({
      message: 'Todos os dados do sistema foram limpos com sucesso',
      type: 'success',
      duration: 5000
    });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    if (error instanceof Error) {
      toast.show({
        message: `Erro ao limpar dados: ${error.message}`,
        type: 'error',
        duration: 5000
      });
    }
  } finally {
    limpandoDados.value = false;
  }
};
</script> 