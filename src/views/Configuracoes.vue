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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigStore } from '@/stores/configuracaoStore';
import type { ConfiguracaoEmpresa } from '@/types';

const configStore = useConfigStore();
const logoPreview = ref<string | null>(null);

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
</script> 