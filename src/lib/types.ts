export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          cpf: string
          created_at: string
          email: string
          endereco: string
          id: string
          nome: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          cpf: string
          created_at?: string
          email: string
          endereco: string
          id?: string
          nome: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string
          email?: string
          endereco?: string
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracao_empresa: {
        Row: {
          cnpj: string
          created_at: string
          email: string
          endereco: string
          horario_funcionamento: Json
          id: string
          logo: string | null
          nome_empresa: string
          telefone: string
          termos_garantia: string
          updated_at: string | null
        }
        Insert: {
          cnpj: string
          created_at?: string
          email: string
          endereco: string
          horario_funcionamento?: Json
          id?: string
          logo?: string | null
          nome_empresa: string
          telefone: string
          termos_garantia?: string
          updated_at?: string | null
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string
          endereco?: string
          horario_funcionamento?: Json
          id?: string
          logo?: string | null
          nome_empresa?: string
          telefone?: string
          termos_garantia?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      garantias: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string
          id: string
          ordem_id: string
          status: Database["public"]["Enums"]["status_garantia"]
          termos: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          descricao: string
          id?: string
          ordem_id: string
          status?: Database["public"]["Enums"]["status_garantia"]
          termos: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string
          id?: string
          ordem_id?: string
          status?: Database["public"]["Enums"]["status_garantia"]
          termos?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garantias_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          cliente_id: string
          created_at: string
          data_aprovacao: string | null
          data_criacao: string
          id: string
          itens: Json
          observacoes: string | null
          ordem_id: string | null
          status: Database["public"]["Enums"]["status_orcamento"]
          updated_at: string | null
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_aprovacao?: string | null
          data_criacao?: string
          id?: string
          itens?: Json
          observacoes?: string | null
          ordem_id?: string | null
          status?: Database["public"]["Enums"]["status_orcamento"]
          updated_at?: string | null
          valor: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_aprovacao?: string | null
          data_criacao?: string
          id?: string
          itens?: Json
          observacoes?: string | null
          ordem_id?: string | null
          status?: Database["public"]["Enums"]["status_orcamento"]
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          cliente_id: string
          created_at: string
          data_conclusao: string | null
          data_criacao: string
          data_entrada: string | null
          data_previsao: string | null
          data_prevista: string | null
          defeito: string
          descricao_problema: string | null
          equipamento: string
          id: string
          marca: string
          modelo: string
          numero_serie: string
          observacoes: string | null
          prioridade: Database["public"]["Enums"]["prioridade_ordem"] | null
          status: Database["public"]["Enums"]["status_ordem"]
          tecnico_id: string | null
          tecnico_responsavel: string | null
          updated_at: string | null
          valor_pecas: number | null
          valor_servico: number | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_conclusao?: string | null
          data_criacao?: string
          data_entrada?: string | null
          data_previsao?: string | null
          data_prevista?: string | null
          defeito: string
          descricao_problema?: string | null
          equipamento: string
          id?: string
          marca: string
          modelo: string
          numero_serie: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_ordem"] | null
          status?: Database["public"]["Enums"]["status_ordem"]
          tecnico_id?: string | null
          tecnico_responsavel?: string | null
          updated_at?: string | null
          valor_pecas?: number | null
          valor_servico?: number | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_conclusao?: string | null
          data_criacao?: string
          data_entrada?: string | null
          data_previsao?: string | null
          data_prevista?: string | null
          defeito?: string
          descricao_problema?: string | null
          equipamento?: string
          id?: string
          marca?: string
          modelo?: string
          numero_serie?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_ordem"] | null
          status?: Database["public"]["Enums"]["status_ordem"]
          tecnico_id?: string | null
          tecnico_responsavel?: string | null
          updated_at?: string | null
          valor_pecas?: number | null
          valor_servico?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "tecnicos"
            referencedColumns: ["id"]
          },
        ]
      }
      tecnicos: {
        Row: {
          created_at: string
          disponivel: boolean
          email: string
          especialidades: string[]
          foto: string | null
          id: string
          nome: string
          telefone: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          disponivel?: boolean
          email: string
          especialidades: string[]
          foto?: string | null
          id?: string
          nome: string
          telefone: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          disponivel?: boolean
          email?: string
          especialidades?: string[]
          foto?: string | null
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tecnicos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          foto: string | null
          id: string
          nome: string
          tipo: string
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          foto?: string | null
          id: string
          nome: string
          tipo: string
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          foto?: string | null
          id?: string
          nome?: string
          tipo?: string
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      prioridade_ordem: "baixa" | "media" | "alta"
      status_garantia: "ativa" | "expirada" | "cancelada"
      status_orcamento: "pendente" | "aprovado" | "rejeitado"
      status_ordem:
        | "pendente"
        | "em_andamento"
        | "em_analise"
        | "aguardando"
        | "orcamento"
        | "aprovado"
        | "em_execucao"
        | "concluido"
        | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 