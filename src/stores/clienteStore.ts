import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { Cliente } from '../types'

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref<Cliente[]>([])
  const carregando = ref(false)
  const erro = ref<string | null>(null)
  
  const clientesOrdenados = computed(() => {
    return [...clientes.value].sort((a, b) => a.nome.localeCompare(b.nome))
  })

  const buscarClientes = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome')
      
      if (error) {
        throw error
      }
      
      // Mapear os dados do Supabase para o formato de Cliente
      clientes.value = data.map(item => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        endereco: item.endereco,
        cpf: item.cpf
      }))
      
      return clientes.value
    } catch (e) {
      console.error('Erro ao buscar clientes:', e)
      if (e instanceof Error) {
        erro.value = e.message
      } else {
        erro.value = 'Erro ao buscar clientes'
      }
      throw e
    } finally {
      carregando.value = false
    }
  }
  
  const buscarCliente = async (id: string) => {
    carregando.value = true
    erro.value = null
    
    try {
      // Primeiro verificamos se o cliente já está no store
      const clienteExistente = clientes.value.find(c => c.id === id)
      if (clienteExistente) {
        return clienteExistente
      }
      
      // Se não, buscamos do Supabase
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        throw error
      }
      
      if (!data) {
        throw new Error('Cliente não encontrado')
      }
      
      // Mapear para o formato de Cliente
      const cliente: Cliente = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cpf: data.cpf
      }
      
      // Adicionar ao array de clientes para cache
      if (!clientes.value.some(c => c.id === cliente.id)) {
        clientes.value.push(cliente)
      }
      
      return cliente
    } catch (e) {
      console.error(`Erro ao buscar cliente ${id}:`, e)
      if (e instanceof Error) {
        erro.value = e.message
      } else {
        erro.value = 'Erro ao buscar cliente'
      }
      throw e
    } finally {
      carregando.value = false
    }
  }
  
  const adicionarCliente = async (cliente: Omit<Cliente, 'id'>) => {
    carregando.value = true
    erro.value = null
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([
          {
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            endereco: cliente.endereco,
            cpf: cliente.cpf
          }
        ])
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      if (!data) {
        throw new Error('Erro ao adicionar cliente: nenhum dado retornado')
      }
      
      // Mapear para o formato de Cliente
      const novoCliente: Cliente = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cpf: data.cpf
      }
      
      // Adicionar ao array de clientes
      clientes.value.push(novoCliente)
      
      return novoCliente
    } catch (e) {
      console.error('Erro ao adicionar cliente:', e)
      if (e instanceof Error) {
        erro.value = e.message
      } else {
        erro.value = 'Erro ao adicionar cliente'
      }
      throw e
    } finally {
      carregando.value = false
    }
  }
  
  const atualizarCliente = async (id: string, dadosAtualizados: Partial<Omit<Cliente, 'id'>>) => {
    carregando.value = true
    erro.value = null
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(dadosAtualizados)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar cliente: nenhum dado retornado')
      }
      
      // Mapear para o formato de Cliente
      const clienteAtualizado: Cliente = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cpf: data.cpf
      }
      
      // Atualizar o cliente no array
      const index = clientes.value.findIndex(c => c.id === id)
      if (index !== -1) {
        clientes.value[index] = clienteAtualizado
      } else {
        clientes.value.push(clienteAtualizado)
      }
      
      return clienteAtualizado
    } catch (e) {
      console.error(`Erro ao atualizar cliente ${id}:`, e)
      if (e instanceof Error) {
        erro.value = e.message
      } else {
        erro.value = 'Erro ao atualizar cliente'
      }
      throw e
    } finally {
      carregando.value = false
    }
  }
  
  const excluirCliente = async (id: string) => {
    carregando.value = true
    erro.value = null
    
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // Remover o cliente do array
      clientes.value = clientes.value.filter(c => c.id !== id)
      
      return true
    } catch (e) {
      console.error(`Erro ao excluir cliente ${id}:`, e)
      if (e instanceof Error) {
        erro.value = e.message
      } else {
        erro.value = 'Erro ao excluir cliente'
      }
      throw e
    } finally {
      carregando.value = false
    }
  }
  
  return {
    clientes,
    clientesOrdenados,
    carregando,
    erro,
    buscarClientes,
    buscarCliente,
    adicionarCliente,
    atualizarCliente,
    excluirCliente
  }
}) 