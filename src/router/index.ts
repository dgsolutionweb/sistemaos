import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Clientes from '@/views/Clientes.vue'
import Ordens from '@/views/Ordens.vue'
import OrdemDetalhes from '@/views/OrdemDetalhes.vue'
import NovaOrdem from '@/views/NovaOrdem.vue'
import Tecnicos from '@/views/Tecnicos.vue'
import Configuracoes from '@/views/Configuracoes.vue'
import Garantias from '@/views/Garantias.vue'
import Kanban from '@/views/Kanban.vue'
import Orcamentos from '@/views/Orcamentos.vue'
import Login from '@/views/Login.vue'
import Registro from '@/views/Registro.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/registro',
      name: 'registro',
      component: Registro,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Clientes,
      meta: { requiresAuth: true }
    },
    {
      path: '/ordens',
      name: 'ordens',
      component: Ordens,
      meta: { requiresAuth: true }
    },
    {
      path: '/ordens/nova',
      name: 'nova-ordem',
      component: NovaOrdem,
      meta: { requiresAuth: true }
    },
    {
      path: '/ordens/:id',
      name: 'ordem-detalhes',
      component: OrdemDetalhes,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/tecnicos',
      name: 'tecnicos',
      component: Tecnicos,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: Configuracoes,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/garantias',
      name: 'garantias',
      component: Garantias,
      meta: { requiresAuth: true }
    },
    {
      path: '/garantias/ordem/:ordemId',
      name: 'garantias-ordem',
      component: Garantias,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/kanban',
      name: 'kanban',
      component: Kanban,
      meta: { requiresAuth: true }
    },
    {
      path: '/orcamentos',
      name: 'orcamentos',
      component: Orcamentos,
      meta: { requiresAuth: true }
    },
    {
      path: '/orcamentos/:id',
      name: 'orcamento-detalhes',
      component: Orcamentos,
      props: true,
      meta: { requiresAuth: true }
    },
  ]
})

// Navegação guard para verificar autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializa o store de autenticação para carregar dados do localStorage
  if (!authStore.isLoggedIn) {
    authStore.inicializar()
  }
  
  // Verificando se a rota requer autenticação
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Redirecionar para login se não estiver autenticado
    next({ name: 'login' })
  } 
  // Verificando se a rota requer admin
  else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // Redirecionar para home se não for admin
    next({ name: 'home' })
  }
  // Redirecionando para home se já estiver logado e tentar acessar login/registro
  else if (!to.meta.requiresAuth && authStore.isLoggedIn && (to.name === 'login' || to.name === 'registro')) {
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router 