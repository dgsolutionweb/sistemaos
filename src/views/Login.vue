<template>
  <div class="min-h-screen flex flex-col md:flex-row overflow-hidden">
    <!-- Left side with background image -->
    <div class="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-800 relative">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); opacity: 0.3;"></div>
      <div class="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
        <div class="mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.055 2.264-.22 2.944l-.012.06" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold mb-2">C&D OS</h1>
        <p class="text-xl opacity-80 text-center">Sistema de Gestão<br/>de Ordens de Serviço</p>
        <div class="mt-12 space-y-4 max-w-md">
          <div class="flex items-center space-x-3">
            <div class="bg-white/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span>Gestão completa de serviços</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="bg-white/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span>Controle de clientes e técnicos</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="bg-white/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span>Relatórios e estatísticas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side with login form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-white">
      <div class="max-w-md w-full">
        <!-- Logo para mobile -->
        <div class="text-center md:hidden mb-8">
          <div class="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-indigo-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.055 2.264-.22 2.944l-.012.06" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">C&D OS</h1>
          <p class="mt-2 text-gray-600">Sistema de Gestão de Ordens de Serviço</p>
        </div>

        <!-- Title para desktop -->
        <div class="hidden md:block">
          <h2 class="text-2xl font-bold text-gray-900">Acesse sua conta</h2>
          <p class="mt-2 text-gray-600">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <!-- Alerta de Erro -->
        <div v-if="authStore.erro" class="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm" role="alert">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-500 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span class="text-sm text-red-700">{{ authStore.erro }}</span>
          </div>
        </div>

        <!-- Formulário de Login -->
        <form class="mt-8 space-y-6" @submit.prevent="realizarLogin">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          
          <!-- Senha -->
          <div>
            <div class="flex justify-between">
              <label for="senha" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">Esqueceu sua senha?</a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <input
                id="senha"
                name="senha"
                type="password"
                autocomplete="current-password"
                required
                v-model="senha"
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Lembrar-me -->
          <div class="flex items-center">
            <input
              id="lembrar"
              name="lembrar"
              type="checkbox"
              v-model="lembrar"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="lembrar" class="ml-2 block text-sm text-gray-700">Lembrar-me</label>
          </div>

          <!-- Botão de Login -->
          <div>
            <button
              type="submit"
              :disabled="authStore.carregando"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-200"
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
        </form>
      </div>
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

<style scoped>
/* Adiciona um gradiente suave ao fundo da página */
@media (max-width: 768px) {
  .min-h-screen {
    background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%);
  }
}
</style> 