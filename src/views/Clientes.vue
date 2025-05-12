<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section with Stats -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
          <p class="mt-1 text-sm text-gray-500">
            Gerenciamento de clientes cadastrados no sistema
          </p>
          <div class="mt-2 flex items-center text-sm text-gray-600">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              Total: {{ clientes.length }}
            </span>
          </div>
        </div>
        <div class="mt-4 sm:mt-0">
          <button
            type="button"
            class="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            @click="modalAberto = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Novo Cliente
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Pesquisar</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              v-model="searchTerm"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Pesquisar por nome, email ou telefone..."
              type="search"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Clientes -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="filteredClientes.length === 0" class="text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchTerm ? 'Tente ajustar sua pesquisa.' : 'Comece adicionando um novo cliente.' }}
        </p>
        <div class="mt-6" v-if="!searchTerm">
          <button
            type="button"
            @click="modalAberto = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Adicionar Cliente
          </button>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="cliente in filteredClientes" :key="cliente.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-800 font-medium text-sm">{{ getInitials(cliente.nome) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ cliente.nome }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ cliente.telefone }}</div>
                <div class="text-sm text-gray-500">{{ cliente.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatCPF(cliente.cpf) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">{{ cliente.endereco }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div class="flex justify-end space-x-2">
                    <button
                    type="button"
                    class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                    @click="selecionarCliente(cliente)"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Cliente -->
    <TransitionRoot appear :show="modalAberto" as="template">
      <Dialog as="div" class="relative z-10" @close="fecharModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    @click="fecharModal"
                  >
                    <span class="sr-only">Fechar</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form @submit.prevent="salvarCliente">
                  <div>
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      {{ clienteSelecionado ? 'Editar Cliente' : 'Novo Cliente' }}
                    </DialogTitle>
                    <div class="mt-4">
                      <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                          <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
                          <div class="mt-1">
                            <input
                              type="text"
                              id="nome"
                              v-model="form.nome"
                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                          <div class="mt-1">
                            <input
                              type="email"
                              id="email"
                              v-model="form.email"
                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Opcional"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label for="telefone" class="block text-sm font-medium text-gray-700">Telefone</label>
                          <div class="mt-1">
                            <input
                              type="tel"
                              id="telefone"
                              v-model="form.telefone"
                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label for="cpf" class="block text-sm font-medium text-gray-700">CPF</label>
                          <div class="mt-1">
                            <input
                              type="text"
                              id="cpf"
                              v-model="form.cpf"
                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Opcional"
                            />
                          </div>
                        </div>
                        
                        <div class="sm:col-span-2">
                          <label for="endereco" class="block text-sm font-medium text-gray-700">Endereço</label>
                          <div class="mt-1">
                            <input
                              type="text"
                              id="endereco"
                              v-model="form.endereco"
                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Opcional"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors sm:col-start-2"
                      :disabled="loading"
                    >
                      <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ loading ? 'Salvando...' : 'Salvar' }}
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-start-1 sm:mt-0"
                      @click="fecharModal"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrdemStore } from '../stores/ordem'
import { storeToRefs } from 'pinia'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import type { Cliente } from '../types'

const store = useOrdemStore()
const { clientes, loading } = storeToRefs(store)

const modalAberto = ref(false)
const clienteSelecionado = ref<Cliente | null>(null)
const searchTerm = ref('')

const form = ref({
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  endereco: ''
})

const filteredClientes = computed(() => {
  if (!searchTerm.value) return clientes.value
  
  const searchLower = searchTerm.value.toLowerCase()
  return clientes.value.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchLower) ||
    cliente.email.toLowerCase().includes(searchLower) ||
    cliente.telefone.toLowerCase().includes(searchLower) ||
    cliente.cpf.toLowerCase().includes(searchLower)
  )
})

const getInitials = (name: string) => {
  if (!name) return '?'
  
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const formatCPF = (cpf: string) => {
  if (!cpf) return '-'
  
  // Remove non-numeric characters
  const numericCPF = cpf.replace(/\D/g, '')
  
  // Check if it has the right length
  if (numericCPF.length !== 11) return cpf
  
  // Format as XXX.XXX.XXX-XX
  return numericCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const selecionarCliente = (cliente: Cliente) => {
  clienteSelecionado.value = cliente
  form.value = { ...cliente }
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  clienteSelecionado.value = null
  form.value = {
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: ''
  }
}

const salvarCliente = async () => {
  try {
    await store.adicionarCliente(form.value)
    fecharModal()
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
  }
}


</script> 