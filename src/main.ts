import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Forçar o uso do Supabase, ignorando o MSW
const USE_MSW = false // Alterado de import.meta.env.DEV && !import.meta.env.VITE_USE_SUPABASE

async function setupApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  // Inicializa o mock service worker apenas em ambiente de desenvolvimento
  // e quando não estiver usando Supabase real
  if (USE_MSW) {
    try {
      console.log('[App] Usando Mock Service Worker para API simulada')
      const { worker } = await import('./mocks/browser')
      
      // Inicializa o MSW com opções mais robustas
      await worker.start({
        onUnhandledRequest: 'bypass', // Ignora requisições não interceptadas
        waitUntilReady: true, // Garante que o MSW está pronto antes de continuar
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: {
            scope: '/'
          }
        }
      })
      
      console.log('[MSW] Mock Service Worker inicializado com sucesso')
    } catch (error) {
      console.error('[MSW] Erro ao inicializar Mock Service Worker:', error)
    }
  } else {
    console.log('[App] Usando Supabase como backend')
  }

  app.mount('#app')
}

setupApp()
