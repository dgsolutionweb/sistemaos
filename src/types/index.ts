export type Status = 'pendente' | 'em_andamento' | 'em_analise' | 'aguardando' | 'orcamento' | 'aprovado' | 'em_execucao' | 'concluido' | 'cancelado'

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'tecnico' | 'atendente';
  foto?: string;
  ativo: boolean;
  ultimoAcesso?: string;
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  cpf: string
}

export interface OrdemServico {
  id: string
  clienteId: string
  tecnicoId?: string
  equipamento: string
  marca: string
  modelo: string
  numeroSerie: string
  defeito: string
  descricaoProblema?: string
  observacoes?: string
  status: Status
  prioridade?: 'baixa' | 'media' | 'alta' | 'urgente'
  dataCriacao: string
  dataEntrada?: string
  dataPrevisao?: string
  dataPrevista?: string
  dataConclusao?: string
  valorServico?: number
  valorPecas?: number
  tecnicoResponsavel?: string
  orcamento?: {
    valor: number;
    itens: Array<{
      descricao: string;
      valor: number;
    }>;
  };
  garantia?: Garantia;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  ordemId?: string;
  itens: Array<{
    descricao: string;
    valor: number;
  }>;
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  dataCriacao: string;
  dataAprovacao?: string;
  observacoes?: string;
}

export interface Tecnico {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidades: string[];
  disponivel: boolean;
  foto?: string;
}

export interface Garantia {
  id: string;
  ordemId: string;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  termos: string;
  status: 'ativa' | 'expirada' | 'cancelada';
}

export interface ConfiguracaoEmpresa {
  id: string;
  nomeEmpresa: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  logo?: string;
  horarioFuncionamento: {
    inicio: string;
    fim: string;
    diasSemana: number[];
  };
  termosGarantia: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  orders: OrdemServico[];
} 