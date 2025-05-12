import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Este exporta o worker MSW configurado
export const worker = setupWorker(...handlers) 