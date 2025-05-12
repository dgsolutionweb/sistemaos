import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { OrdemServico, Cliente, Status } from '../types'
import { printOrdemServico } from '../utils/printService'
import { useConfigStore } from './configuracaoStore'
import { supabase } from '../lib/supabase'

export const useOrdemStore = defineStore('ordem', () => {
  const ordens = ref<OrdemServico[]>([])
  const clientes = ref<Cliente[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrdens = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('ordens_servico')
        .select('*')
        .order('data_criacao', { ascending: false })
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (data) {
        // Mapear os campos do banco para o formato da aplicação
        ordens.value = data.map(item => ({
          id: item.id,
          clienteId: item.cliente_id,
          tecnicoId: item.tecnico_id || undefined,
          equipamento: item.equipamento,
          marca: item.marca,
          modelo: item.modelo,
          numeroSerie: item.numero_serie,
          defeito: item.defeito,
          descricaoProblema: item.descricao_problema || undefined,
          observacoes: item.observacoes || undefined,
          status: item.status,
          prioridade: item.prioridade || 'media',
          dataCriacao: item.data_criacao,
          dataEntrada: item.data_entrada || undefined,
          dataPrevisao: item.data_previsao || undefined,
          dataPrevista: item.data_prevista || undefined,
          dataConclusao: item.data_conclusao || undefined,
          valorServico: item.valor_servico || undefined,
          valorPecas: item.valor_pecas || undefined,
          tecnicoResponsavel: item.tecnico_responsavel || undefined
        }))
      } else {
        // Usar dados de fallback para desenvolvimento
        if (import.meta.env.DEV) {
          console.warn('Usando dados de fallback para ordens')
          ordens.value = [
            {
              id: '1',
              clienteId: '1',
              equipamento: 'Notebook',
              marca: 'Dell',
              modelo: 'Inspiron 15',
              numeroSerie: 'DL12345',
              defeito: 'Não liga',
              status: 'em_analise',
              dataCriacao: new Date().toISOString()
            },
            {
              id: '2',
              clienteId: '2',
              equipamento: 'Smartphone',
              marca: 'Samsung',
              modelo: 'Galaxy S21',
              numeroSerie: 'SM21987',
              defeito: 'Tela quebrada',
              status: 'orcamento',
              dataCriacao: new Date().toISOString()
            }
          ]
        } else {
          ordens.value = []
        }
      }
      
      return ordens.value
    } catch (e) {
      console.error('Erro ao buscar ordens:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao buscar ordens de serviço'
      // Em caso de erro, inicializar com array vazio para não quebrar a UI
      ordens.value = []
    } finally {
      loading.value = false
    }
  }

  const adicionarOrdem = async (ordem: Omit<OrdemServico, 'id'>) => {
    try {
      loading.value = true
      error.value = null
      
      // Converter do formato da aplicação para o formato do Supabase
      const ordemParaInserir = {
        cliente_id: ordem.clienteId,
        tecnico_id: ordem.tecnicoId || null, // Use null instead of empty string for UUID
        equipamento: ordem.equipamento,
        marca: ordem.marca,
        modelo: ordem.modelo,
        numero_serie: ordem.numeroSerie,
        defeito: ordem.defeito,
        descricao_problema: ordem.descricaoProblema,
        observacoes: ordem.observacoes,
        status: ordem.status || 'pendente',
        prioridade: ordem.prioridade || 'media',
        data_criacao: new Date().toISOString(),
        data_entrada: ordem.dataEntrada,
        data_previsao: ordem.dataPrevisao,
        data_prevista: ordem.dataPrevista,
        tecnico_responsavel: ordem.tecnicoResponsavel || null // Use null instead of empty string
      }
      
      const { data, error: supabaseError } = await supabase
        .from('ordens_servico')
        .insert([ordemParaInserir])
        .select()
        .single()
        
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Erro ao adicionar ordem: nenhum dado retornado')
      }
      
      // Mapear a resposta para o formato da aplicação
      const novaOrdem: OrdemServico = {
        id: data.id,
        clienteId: data.cliente_id,
        tecnicoId: data.tecnico_id || undefined,
        equipamento: data.equipamento,
        marca: data.marca,
        modelo: data.modelo,
        numeroSerie: data.numero_serie,
        defeito: data.defeito,
        descricaoProblema: data.descricao_problema || undefined,
        observacoes: data.observacoes || undefined,
        status: data.status,
        prioridade: data.prioridade || 'media',
        dataCriacao: data.data_criacao,
        dataEntrada: data.data_entrada || undefined,
        dataPrevisao: data.data_previsao || undefined,
        dataPrevista: data.data_prevista || undefined,
        dataConclusao: data.data_conclusao || undefined,
        valorServico: data.valor_servico || undefined,
        valorPecas: data.valor_pecas || undefined,
        tecnicoResponsavel: data.tecnico_responsavel || undefined
      }
      
      ordens.value.push(novaOrdem)
      return novaOrdem
    } catch (e) {
      console.error('Erro ao adicionar ordem:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao criar ordem de serviço'
      throw e
    } finally {
      loading.value = false
    }
  }

  const atualizarStatus = async (id: string, status: Status) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('ordens_servico')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar status: ordem não encontrada')
      }
      
      // Atualizar a ordem no estado local
      const indice = ordens.value.findIndex(o => o.id === id)
      if (indice >= 0) {
        ordens.value[indice].status = status
      }
      
      return true
    } catch (e) {
      console.error('Erro ao atualizar status:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar status'
      throw e
    } finally {
      loading.value = false
    }
  }

  const adicionarCliente = async (cliente: Omit<Cliente, 'id'>) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .insert([{
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          endereco: cliente.endereco,
          cpf: cliente.cpf
        }])
        .select()
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Erro ao adicionar cliente: nenhum dado retornado')
      }
      
      const novoCliente: Cliente = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cpf: data.cpf
      }
      
      clientes.value.push(novoCliente)
      return novoCliente
    } catch (e) {
      console.error('Erro ao adicionar cliente:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao adicionar cliente'
      throw e
    } finally {
      loading.value = false
    }
  }

  const imprimirOrdem = async (id: string, copies = 2, showPrintDialog = true) => {
    try {
      loading.value = true
      error.value = null
      
      // Buscar a ordem atualizada do banco de dados
      const { data: ordemData, error: ordemError } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('id', id)
        .single()
      
      if (ordemError) {
        throw ordemError
      }
      
      if (!ordemData) {
        throw new Error('Ordem não encontrada')
      }
      
      // Mapear para o formato da aplicação
      const ordem: OrdemServico = {
        id: ordemData.id,
        clienteId: ordemData.cliente_id,
        tecnicoId: ordemData.tecnico_id || undefined,
        equipamento: ordemData.equipamento,
        marca: ordemData.marca,
        modelo: ordemData.modelo,
        numeroSerie: ordemData.numero_serie,
        defeito: ordemData.defeito,
        descricaoProblema: ordemData.descricao_problema || undefined,
        observacoes: ordemData.observacoes || undefined,
        status: ordemData.status,
        prioridade: ordemData.prioridade || 'media',
        dataCriacao: ordemData.data_criacao,
        dataEntrada: ordemData.data_entrada || undefined,
        dataPrevisao: ordemData.data_previsao || undefined,
        dataPrevista: ordemData.data_prevista || undefined,
        dataConclusao: ordemData.data_conclusao || undefined,
        valorServico: ordemData.valor_servico || undefined,
        valorPecas: ordemData.valor_pecas || undefined,
        tecnicoResponsavel: ordemData.tecnico_responsavel || undefined
      }
      
      // Buscar os dados do cliente
      const cliente = await fetchCliente(ordem.clienteId)
      if (!cliente) {
        throw new Error('Cliente não encontrado')
      }

      const configStore = useConfigStore()
      await configStore.buscarConfiguracao()
      const configuracao = configStore.configuracao
      
      if (!configuracao) {
        throw new Error('Configuração da empresa não encontrada')
      }

      await printOrdemServico(ordem, cliente, configuracao, { copies, showPrintDialog })
      return true
    } catch (e) {
      console.error('Erro ao imprimir ordem:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao imprimir ordem de serviço'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchCliente = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      // Verificar se já temos o cliente em cache
      const clienteExistente = clientes.value.find(c => c.id === id)
      if (clienteExistente) {
        return clienteExistente
      }
      
      // Buscar cliente do Supabase
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Cliente não encontrado')
      }
      
      const cliente: Cliente = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cpf: data.cpf
      }
      
      // Adicionar o cliente à lista
      clientes.value.push(cliente)
      return cliente
    } catch (e) {
      console.error('Erro ao buscar cliente:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao buscar cliente'
      
      // Usar dados de fallback para desenvolvimento
      if (import.meta.env.DEV) {
        console.warn(`Usando dados de fallback para cliente ${id}`)
        const clienteFallback = {
          id,
          nome: `Cliente ${id}`,
          email: `cliente${id}@exemplo.com`,
          telefone: '(00) 00000-0000',
          endereco: 'Endereço não disponível',
          cpf: '000.000.000-00'
        }
        
        clientes.value.push(clienteFallback)
        return clienteFallback
      }
      
      throw e
    } finally {
      loading.value = false
    }
  }

  // Buscar todos os clientes
  const fetchClientes = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .select('*')
        .order('nome')
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (data) {
        clientes.value = data.map(item => ({
          id: item.id,
          nome: item.nome,
          email: item.email,
          telefone: item.telefone,
          endereco: item.endereco,
          cpf: item.cpf
        }))
      } else {
        // Usar dados de fallback para desenvolvimento
        if (import.meta.env.DEV) {
          console.warn('Usando dados de fallback para clientes')
          clientes.value = [
            {
              id: '1',
              nome: 'Ana Paula Souza',
              email: 'ana.souza@email.com',
              telefone: '(11) 99876-5432',
              endereco: 'Rua das Flores, 123 - São Paulo/SP',
              cpf: '123.456.789-00'
            },
            {
              id: '2',
              nome: 'Carlos Eduardo Silva',
              email: 'carlos.silva@email.com',
              telefone: '(11) 98765-4321',
              endereco: 'Av. Paulista, 1000 - São Paulo/SP',
              cpf: '987.654.321-00'
            }
          ]
        } else {
          clientes.value = []
        }
      }
      
      return clientes.value
    } catch (e) {
      console.error('Erro ao buscar clientes:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao buscar clientes'
      clientes.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    ordens,
    clientes,
    loading,
    error,
    fetchOrdens,
    adicionarOrdem,
    atualizarStatus,
    fetchCliente,
    fetchClientes,
    adicionarCliente,
    imprimirOrdem
  }
}) 