<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo e Título -->
      <div class="text-center">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sistema de Ordens de Serviço</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entre com seus dados para acessar o sistema
        </p>
      </div>

      <!-- Alerta de Erro -->
      <div v-if="authStore.erro" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ authStore.erro }}</span>
      </div>

      <!-- Formulário de Login -->
      <form class="mt-8 space-y-6" @submit.prevent="realizarLogin">
        <!-- Campos do formulário -->
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="senha" class="sr-only">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autocomplete="current-password"
              required
              v-model="senha"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
          </div>
        </div>

        <!-- Opções adicionais -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="lembrar"
              name="lembrar"
              type="checkbox"
              v-model="lembrar"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="lembrar" class="ml-2 block text-sm text-gray-900">Lembrar-me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Esqueceu sua senha?</a>
          </div>
        </div>

        <!-- Botão de Login -->
        <div>
          <button
            type="submit"
            :disabled="authStore.carregando"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="authStore.carregando" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Spinner quando carregando -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ authStore.carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>

        <!-- Link para registro -->
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Não tem uma conta? 
            <router-link to="/registro" class="font-medium text-indigo-600 hover:text-indigo-500">
              Registre-se
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Inicializar store
const authStore = useAuthStore()
const router = useRouter()

// Dados do formulário
const email = ref('')
const senha = ref('')
const lembrar = ref(false)

// Função de login
const realizarLogin = async () => {
  const sucesso = await authStore.login(email.value, senha.value)
  if (sucesso) {
    // Se lembrar estiver marcado, salvamos por 30 dias
    if (lembrar.value) {
      // Implementação futura para persistent cookies
    }
    router.push('/')
  }
}
</script> 