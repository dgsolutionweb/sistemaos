<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo e Título -->
      <div class="text-center">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Criar uma nova conta</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Registre-se para acessar o sistema de Ordens de Serviço
        </p>
      </div>

      <!-- Alerta de Erro -->
      <div v-if="authStore.erro" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ authStore.erro }}</span>
      </div>

      <!-- Mensagem de Sucesso -->
      <div v-if="sucessoRegistro" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">Registro realizado com sucesso! <router-link to="/login" class="font-bold">Faça login</router-link> para continuar.</span>
      </div>

      <!-- Formulário de Registro -->
      <form v-if="!sucessoRegistro" class="mt-8 space-y-6" @submit.prevent="realizarRegistro">
        <!-- Campos do formulário -->
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="nome" class="sr-only">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              v-model="nome"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nome completo"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="senha" class="sr-only">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autocomplete="new-password"
              required
              v-model="senha"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Senha"
              @input="validarSenha"
            />
          </div>
          <div>
            <label for="confirmarSenha" class="sr-only">Confirmar Senha</label>
            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              autocomplete="new-password"
              required
              v-model="confirmarSenha"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmar senha"
              @input="validarSenha"
            />
          </div>
        </div>

        <!-- Feedback de validação de senha -->
        <div v-if="senhaErro" class="text-sm text-red-600">
          {{ senhaErro }}
        </div>
        
        <!-- Termos e condições -->
        <div class="flex items-center">
          <input
            id="termos"
            name="termos"
            type="checkbox"
            required
            v-model="aceitouTermos"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="termos" class="ml-2 block text-sm text-gray-900">
            Concordo com os <a href="#" class="text-indigo-600 hover:text-indigo-500">Termos de Serviço</a> e 
            <a href="#" class="text-indigo-600 hover:text-indigo-500">Política de Privacidade</a>
          </label>
        </div>

        <!-- Botão de Registro -->
        <div>
          <button
            type="submit"
            :disabled="!formValido || authStore.carregando"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.carregando" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Spinner quando carregando -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ authStore.carregando ? 'Registrando...' : 'Registrar' }}
          </button>
        </div>

        <!-- Link para login -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Já tem uma conta? 
            <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Faça login
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Inicializar store
const authStore = useAuthStore()
const router = useRouter()

// Dados do formulário
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const aceitouTermos = ref(false)
const senhaErro = ref('')
const sucessoRegistro = ref(false)

// Validações
const validarSenha = () => {
  if (senha.value.length > 0 && senha.value.length < 6) {
    senhaErro.value = 'A senha deve ter pelo menos 6 caracteres'
  } else if (confirmarSenha.value && senha.value !== confirmarSenha.value) {
    senhaErro.value = 'As senhas não coincidem'
  } else {
    senhaErro.value = ''
  }
}

const formValido = computed(() => {
  return (
    nome.value.length > 0 &&
    email.value.length > 0 &&
    senha.value.length >= 6 &&
    senha.value === confirmarSenha.value &&
    aceitouTermos.value &&
    !senhaErro.value
  )
})

// Função para realizar o registro
const realizarRegistro = async () => {
  if (!formValido.value) return

  const sucesso = await authStore.registrar(
    nome.value,
    email.value,
    senha.value
  )

  if (sucesso) {
    sucessoRegistro.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script> 