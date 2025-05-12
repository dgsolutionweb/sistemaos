<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ShieldCheckIcon,
  ViewColumnsIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';
import { useAuthStore } from './stores/authStore';
import Toast from '@/components/Toast.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  // Inicializa o auth store ao carregar o app
  authStore.inicializar();
});

const menuItems = [
  { name: 'Início', path: '/', icon: HomeIcon },
  { name: 'Ordens de Serviço', path: '/ordens', icon: ClipboardDocumentListIcon },
  { name: 'Kanban', path: '/kanban', icon: ViewColumnsIcon },
  { name: 'Orçamentos', path: '/orcamentos', icon: DocumentTextIcon },
  { name: 'Garantias', path: '/garantias', icon: ShieldCheckIcon },
  { name: 'Clientes', path: '/clientes', icon: UserGroupIcon },
  { name: 'Técnicos', path: '/tecnicos', icon: WrenchScrewdriverIcon, requiresAdmin: true },
  { name: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon, requiresAdmin: true },
];

const sidebarOpen = ref(true);
const mobileMenuOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const isActive = computed(() => (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
});

// Check if the current route is the login or register page
const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'registro';
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};

// Filtra itens do menu com base nas permissões
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => {
    if (item.requiresAdmin) {
      return authStore.isAdmin;
    }
    return true;
  });
});
</script>

<template>
  <div v-if="authStore.isLoggedIn && !isAuthPage" class="h-screen w-screen flex overflow-hidden">
    <!-- Sidebar para desktop - Versão expandida e retraída -->
    <aside 
      class="hidden md:flex flex-col bg-white shadow transition-all duration-300 ease-in-out overflow-hidden sidebar z-20"
      :class="[sidebarOpen ? 'w-64' : 'w-20']"
    >
      <!-- Logo -->
      <div class="flex items-center p-4 h-16" :class="[sidebarOpen ? 'justify-between' : 'justify-center']">
        <h1 v-if="sidebarOpen" class="text-xl font-bold text-gray-800 truncate">Assistência Técnica</h1>
        <button 
          @click="toggleSidebar" 
          class="rounded p-1 hover:bg-gray-100 focus:outline-none"
        >
          <ChevronDoubleLeftIcon v-if="sidebarOpen" class="h-5 w-5 text-gray-500" />
          <ChevronDoubleRightIcon v-else class="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <!-- Menu items -->
      <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in filteredMenuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-200"
          :class="[
            isActive(item.path)
              ? 'sidebar-active'
              : 'sidebar-inactive'
          ]"
        >
          <component :is="item.icon" class="w-6 h-6 flex-shrink-0" :class="[isActive(item.path) ? 'text-blue-700' : 'text-gray-500']" />
          <span v-if="sidebarOpen" class="ml-3 font-medium">{{ item.name }}</span>
        </RouterLink>

        <!-- Botão de logout -->
        <button
          @click="logout"
          class="flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-200 w-full text-left sidebar-inactive"
        >
          <ArrowRightOnRectangleIcon class="w-6 h-6 flex-shrink-0 text-gray-500" />
          <span v-if="sidebarOpen" class="ml-3 font-medium">Sair</span>
        </button>
      </nav>

      <!-- Versão/Info e Usuário logado -->
      <div v-if="sidebarOpen" class="p-4 text-xs text-gray-500 border-t">
        <div class="flex items-center mb-2">
          <span class="font-medium">{{ authStore.usuario?.nome }}</span>
          <span class="ml-1 text-xs">({{ authStore.usuario?.tipo }})</span>
        </div>
        <div>Versão 1.0.0</div>
      </div>
    </aside>

    <!-- Mobile Sidebar -->
    <div class="md:hidden">
      <div 
        v-if="mobileMenuOpen" 
        @click="mobileMenuOpen = false" 
        class="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
      ></div>

      <aside
        class="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow transition-all duration-300 transform sidebar"
        :class="[mobileMenuOpen ? 'translate-x-0' : '-translate-x-full']"
      >
        <!-- Logo -->
        <div class="flex items-center justify-between p-4 h-16">
          <h1 class="text-xl font-bold text-gray-800">Assistência Técnica</h1>
          <button 
            @click="mobileMenuOpen = false" 
            class="p-1 rounded hover:bg-gray-100 focus:outline-none"
          >
            <XMarkIcon class="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <!-- Menu items -->
        <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
          <RouterLink
            v-for="item in filteredMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-200"
            :class="[
              isActive(item.path)
                ? 'sidebar-active'
                : 'sidebar-inactive'
            ]"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" class="w-6 h-6 flex-shrink-0" :class="[isActive(item.path) ? 'text-blue-700' : 'text-gray-500']" />
            <span class="ml-3 font-medium">{{ item.name }}</span>
          </RouterLink>

          <!-- Botão de logout -->
          <button
            @click="logout"
            class="flex items-center py-3 px-4 mx-2 rounded-md transition-colors duration-200 w-full text-left sidebar-inactive"
          >
            <ArrowRightOnRectangleIcon class="w-6 h-6 flex-shrink-0 text-gray-500" />
            <span class="ml-3 font-medium">Sair</span>
          </button>
        </nav>

        <!-- Versão/Info e Usuário logado -->
        <div class="p-4 text-xs text-gray-500 border-t">
          <div class="flex items-center mb-2">
            <span class="font-medium">{{ authStore.usuario?.nome }}</span>
            <span class="ml-1 text-xs">({{ authStore.usuario?.tipo }})</span>
          </div>
          <div>Versão 1.0.0</div>
        </div>
      </aside>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col w-full h-full overflow-hidden main-content">
      <!-- Top bar mobile -->
      <header class="flex items-center justify-between p-4 bg-white shadow md:hidden">
        <h1 class="text-xl font-bold text-gray-800">Assistência Técnica</h1>
        <button
          @click="mobileMenuOpen = true"
          class="p-1 rounded-md hover:bg-gray-100"
        >
          <Bars3Icon class="h-6 w-6 text-gray-500" />
        </button>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-6 w-full">
        <RouterView />
      </main>
    </div>
  </div>
  <div v-else>
    <!-- Renderiza apenas o conteúdo da rota quando não autenticado (login/registro) -->
    <RouterView />
  </div>

  <!-- Toast notification component -->
  <Toast />
</template>


