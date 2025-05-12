<template>
  <div>
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Nova Ordem de Serviço
        </h2>
      </div>
    </div>

    <div class="mt-8">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <OrdemForm
            @submit="handleSubmit"
            @cancel="router.push('/ordens')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useOrdemStore } from '../stores/ordem'
import { useTecnicoStore } from '../stores/tecnicoStore'
import { onMounted } from 'vue'
import OrdemForm from '../components/OrdemForm.vue'
import type { OrdemServico } from '../types'

const router = useRouter()
const store = useOrdemStore()
const tecnicoStore = useTecnicoStore()

// Pré-carregamos os dados
onMounted(async () => {
  // Carregar clientes e técnicos
  await Promise.all([
    store.fetchClientes(),
    tecnicoStore.fetchTecnicos()
  ])
})

const handleSubmit = async (ordem: Omit<OrdemServico, 'id'>) => {
  try {
    await store.adicionarOrdem(ordem)
    router.push('/ordens')
  } catch (error) {
    console.error('Erro ao criar ordem:', error)
  }
}
</script> 