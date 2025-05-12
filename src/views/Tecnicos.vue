<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Técnicos</h1>
      <button
        @click="openModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Novo Técnico
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="tecnicoStore.isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="tecnicoStore.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      {{ tecnicoStore.error }}
    </div>

    <!-- Técnicos Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tecnico in tecnicoStore.tecnicos"
        :key="tecnico.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center space-x-4">
            <img
              :src="tecnico.foto || 'https://via.placeholder.com/150?text=Avatar'"
              :alt="tecnico.nome"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ tecnico.nome }}</h3>
              <p class="text-gray-600">{{ tecnico.email }}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Telefone:</span> {{ tecnico.telefone }}
            </p>
            <div class="mt-2">
              <span class="font-medium text-sm text-gray-600">Especialidades:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                <span
                  v-for="(esp, index) in tecnico.especialidades"
                  :key="index"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {{ esp }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <span
              :class="[
                'px-2 py-1 rounded-full text-sm',
                tecnico.disponivel
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ tecnico.disponivel ? 'Disponível' : 'Ocupado' }}
            </span>
            <div class="flex space-x-2">
              <button
                @click="editTecnico(tecnico)"
                class="text-blue-600 hover:text-blue-800"
              >
                <span class="sr-only">Editar</span>
                <PencilIcon class="h-5 w-5" />
              </button>
              <button
                @click="confirmDelete(tecnico)"
                class="text-red-600 hover:text-red-800"
              >
                <span class="sr-only">Excluir</span>
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Formulário -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {{ editingTecnico ? 'Editar Técnico' : 'Novo Técnico' }}
                </DialogTitle>

                <form @submit.prevent="saveTecnico" class="space-y-4">
                  <!-- Foto do técnico -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Foto
                    </label>
                    <div class="flex items-center space-x-4">
                      <div class="shrink-0">
                        <img
                          :src="fotoPreview || formData.foto || 'https://via.placeholder.com/150?text=Avatar'"
                          class="h-20 w-20 object-cover rounded-full"
                          alt="Foto do técnico"
                        />
                      </div>
                      <label class="block">
                        <span class="sr-only">Escolher arquivo</span>
                        <input
                          type="file"
                          @change="handleFotoChange"
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

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      v-model="formData.nome"
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

                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Especialidades
                    </label>
                    <div class="mt-1 flex flex-wrap gap-2">
                      <input
                        type="text"
                        v-model="novaEspecialidade"
                        @keydown.enter.prevent="addEspecialidade"
                        placeholder="Digite e pressione Enter"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <div class="flex flex-wrap gap-2 mt-2">
                        <span
                          v-for="(esp, index) in formData.especialidades"
                          :key="index"
                          class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {{ esp }}
                          <button
                            type="button"
                            @click="removeEspecialidade(index)"
                            class="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <XMarkIcon class="h-4 w-4" />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="formData.disponivel"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label class="ml-2 block text-sm text-gray-900">
                      Disponível para novos serviços
                    </label>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {{ editingTecnico ? 'Atualizar' : 'Cadastrar' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal de Confirmação de Exclusão -->
    <TransitionRoot appear :show="isDeleteModalOpen" as="template">
      <Dialog as="div" @close="closeDeleteModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirmar Exclusão
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Tem certeza que deseja excluir este técnico? Esta ação não pode ser desfeita.
                  </p>
                </div>

                <div class="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeDeleteModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    @click="deleteTecnicoConfirmed"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Excluir
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { useTecnicoStore } from '@/stores/tecnicoStore';
import type { Tecnico } from '@/types';

const tecnicoStore = useTecnicoStore();

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingTecnico = ref<Tecnico | null>(null);
const tecnicoToDelete = ref<Tecnico | null>(null);
const novaEspecialidade = ref('');
const fotoPreview = ref<string | null>(null);

const formData = ref({
  nome: '',
  email: '',
  telefone: '',
  especialidades: [] as string[],
  disponivel: true,
  foto: ''
});

onMounted(async () => {
  await tecnicoStore.fetchTecnicos();
});

const openModal = () => {
  editingTecnico.value = null;
  formData.value = {
    nome: '',
    email: '',
    telefone: '',
    especialidades: [],
    disponivel: true,
    foto: ''
  };
  fotoPreview.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingTecnico.value = null;
  fotoPreview.value = null;
};

const editTecnico = (tecnico: Tecnico) => {
  editingTecnico.value = tecnico;
  formData.value = {
    nome: tecnico.nome,
    email: tecnico.email,
    telefone: tecnico.telefone,
    especialidades: [...tecnico.especialidades],
    disponivel: tecnico.disponivel,
    foto: tecnico.foto || ''
  };
  fotoPreview.value = null;
  isModalOpen.value = true;
};

const handleFotoChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Preview da foto
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Upload da foto
    try {
      const fotoUrl = await tecnicoStore.uploadFoto(file);
      if (fotoUrl) {
        formData.value.foto = fotoUrl;
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    }
  }
};

const saveTecnico = async () => {
  try {
    if (editingTecnico.value) {
      await tecnicoStore.updateTecnico(editingTecnico.value.id, formData.value);
    } else {
      await tecnicoStore.addTecnico(formData.value);
    }
    closeModal();
  } catch (error) {
    console.error('Erro ao salvar técnico:', error);
  }
};

const addEspecialidade = () => {
  if (novaEspecialidade.value.trim()) {
    formData.value.especialidades.push(novaEspecialidade.value.trim());
    novaEspecialidade.value = '';
  }
};

const removeEspecialidade = (index: number) => {
  formData.value.especialidades.splice(index, 1);
};

const confirmDelete = (tecnico: Tecnico) => {
  tecnicoToDelete.value = tecnico;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  tecnicoToDelete.value = null;
};

const deleteTecnicoConfirmed = async () => {
  if (tecnicoToDelete.value) {
    await tecnicoStore.deleteTecnico(tecnicoToDelete.value.id);
    closeDeleteModal();
  }
};
</script> 