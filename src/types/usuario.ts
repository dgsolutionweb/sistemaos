export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'tecnico' | 'atendente';
  foto?: string;
  ativo: boolean;
  ultimoAcesso?: string;
} 