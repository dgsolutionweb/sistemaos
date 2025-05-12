import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Orcamento } from '@/types'
import { useConfigStore } from './configuracaoStore'
import { useOrdemStore } from './ordem'
import { supabase } from '../lib/supabase'

export const useOrcamentoStore = defineStore('orcamento', () => {
  const orcamentos = ref<Orcamento[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOrcamentos = async () => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .select('*')
        .order('data_criacao', { ascending: false })
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (data) {
        // Mapear os campos do banco para o formato da aplicação
        orcamentos.value = data.map(item => ({
          id: item.id,
          clienteId: item.cliente_id,
          ordemId: item.ordem_id || undefined,
          itens: item.itens,
          valor: item.valor,
          status: item.status,
          dataCriacao: item.data_criacao,
          observacoes: item.observacoes || undefined
        }))
      } else {
        // Inicializar com array vazio
        orcamentos.value = []
      }
      
      return orcamentos.value
    } catch (e) {
      console.error('Erro ao buscar orçamentos:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao buscar orçamentos'
      orcamentos.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

  const getOrcamento = async (id: string) => {
    try {
      // Primeiro verificamos se já temos o orçamento carregado
      const orcamentoExistente = orcamentos.value.find(o => o.id === id)
      if (orcamentoExistente) {
        return orcamentoExistente
      }
      
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('id', id)
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Orçamento não encontrado')
      }
      
      // Mapear para o formato da aplicação
      const orcamento: Orcamento = {
        id: data.id,
        clienteId: data.cliente_id,
        ordemId: data.ordem_id || undefined,
        itens: data.itens,
        valor: data.valor,
        status: data.status,
        dataCriacao: data.data_criacao,
        observacoes: data.observacoes || undefined
      }
      
      // Adicionamos ao array de orçamentos se não existir
      const index = orcamentos.value.findIndex(o => o.id === orcamento.id)
      if (index === -1) {
        orcamentos.value.push(orcamento)
      } else {
        orcamentos.value[index] = orcamento
      }
      
      return orcamento
    } catch (e) {
      console.error(`Erro ao buscar orçamento ${id}:`, e)
      error.value = e instanceof Error ? e.message : 'Erro ao buscar orçamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  const criarOrcamento = async (orcamento: Omit<Orcamento, 'id' | 'dataCriacao'>) => {
    try {
      loading.value = true
      error.value = null
      
      // Calculamos o valor total somando os itens
      const valorTotal = orcamento.itens.reduce((total, item) => total + item.valor, 0)
      
      // Converter do formato da aplicação para o formato do Supabase
      const orcamentoParaInserir = {
        cliente_id: orcamento.clienteId,
        ordem_id: orcamento.ordemId || null, // Use null instead of empty string for UUID fields
        itens: orcamento.itens,
        valor: valorTotal,
        status: orcamento.status || 'pendente',
        data_criacao: new Date().toISOString(),
        observacoes: orcamento.observacoes
      }
      
      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .insert([orcamentoParaInserir])
        .select()
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Erro ao criar orçamento: nenhum dado retornado')
      }
      
      // Mapear a resposta para o formato da aplicação
      const novoOrcamento: Orcamento = {
        id: data.id,
        clienteId: data.cliente_id,
        ordemId: data.ordem_id || undefined,
        itens: data.itens,
        valor: data.valor,
        status: data.status,
        dataCriacao: data.data_criacao,
        observacoes: data.observacoes || undefined
      }
      
      orcamentos.value.push(novoOrcamento)
      
      // Se o orçamento está vinculado a uma ordem, vamos atualizar o status da ordem
      if (novoOrcamento.ordemId) {
        const ordemStore = useOrdemStore()
        await ordemStore.atualizarStatus(novoOrcamento.ordemId, 'orcamento')
      }
      
      return novoOrcamento
    } catch (e) {
      console.error('Erro ao criar orçamento:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao criar orçamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  const atualizarOrcamento = async (orcamento: Orcamento) => {
    try {
      loading.value = true
      error.value = null
      
      // Atualizamos o valor total baseado nos itens
      const valorTotal = orcamento.itens.reduce((total, item) => total + item.valor, 0)
      
      // Converter do formato da aplicação para o formato do Supabase
      const orcamentoParaAtualizar = {
        cliente_id: orcamento.clienteId,
        ordem_id: orcamento.ordemId || null, // Use null instead of empty string for UUID fields
        itens: orcamento.itens,
        valor: valorTotal,
        status: orcamento.status,
        observacoes: orcamento.observacoes
      }
      
      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .update(orcamentoParaAtualizar)
        .eq('id', orcamento.id)
        .select()
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar orçamento: nenhum dado retornado')
      }
      
      // Mapear a resposta para o formato da aplicação
      const orcamentoAtualizado: Orcamento = {
        id: data.id,
        clienteId: data.cliente_id,
        ordemId: data.ordem_id || undefined,
        itens: data.itens,
        valor: data.valor,
        status: data.status,
        dataCriacao: data.data_criacao,
        observacoes: data.observacoes || undefined
      }
      
      // Atualizamos o orçamento na lista
      const index = orcamentos.value.findIndex(o => o.id === orcamentoAtualizado.id)
      if (index !== -1) {
        orcamentos.value[index] = orcamentoAtualizado
      }
      
      return orcamentoAtualizado
    } catch (e) {
      console.error('Erro ao atualizar orçamento:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar orçamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  const atualizarStatusOrcamento = async (id: string, status: 'pendente' | 'aprovado' | 'rejeitado') => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: supabaseError } = await supabase
        .from('orcamentos')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      
      if (supabaseError) {
        throw supabaseError
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar status: orçamento não encontrado')
      }
      
      // Mapear a resposta para o formato da aplicação
      const orcamentoAtualizado: Orcamento = {
        id: data.id,
        clienteId: data.cliente_id,
        ordemId: data.ordem_id || undefined,
        itens: data.itens,
        valor: data.valor,
        status: data.status,
        dataCriacao: data.data_criacao,
        observacoes: data.observacoes || undefined
      }
      
      // Atualizamos o orçamento na lista
      const index = orcamentos.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orcamentos.value[index] = orcamentoAtualizado
      }
      
      return orcamentoAtualizado
    } catch (e) {
      console.error('Erro ao atualizar status do orçamento:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar status do orçamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  const imprimirOrcamento = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      // Buscar o orçamento
      const orcamento = await getOrcamento(id)
      if (!orcamento) {
        throw new Error('Orçamento não encontrado')
      }
      
      // Buscar cliente
      const ordemStore = useOrdemStore()
      const cliente = await ordemStore.fetchCliente(orcamento.clienteId)
      
      // Buscar configurações da empresa
      const configStore = useConfigStore()
      
      // Carregar as configurações se não estiverem carregadas
      if (!configStore.configuracao) {
        await configStore.buscarConfiguracao()
      }
      
      // Se ainda não tiver configurações, usar uma configuração padrão
      let configuracoes = configStore.configuracao
      if (!configuracoes) {
        console.warn('Utilizando configuração padrão para impressão')
        configuracoes = {
          id: 'default',
          nomeEmpresa: 'Assistência Técnica',
          cnpj: '00.000.000/0000-00',
          endereco: 'Endereço não configurado',
          telefone: 'Telefone não configurado',
          email: 'Email não configurado',
          horarioFuncionamento: {
            inicio: '08:00',
            fim: '18:00',
            diasSemana: [1, 2, 3, 4, 5]
          },
          termosGarantia: 'Termos de garantia não configurados'
        }
      }
      
      // Criar HTML para impressão
      const formatarData = (data: string) => {
        const date = new Date(data)
        return date.toLocaleDateString('pt-BR')
      }
      
      const formatarValor = (valor: number) => {
        return valor.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Orçamento #${orcamento.id}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #ddd;
            }
            .logo {
              max-width: 150px;
              max-height: 100px;
            }
            .titulo {
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
            }
            .info-empresa {
              font-size: 14px;
            }
            .info-orcamento {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .info-cliente, .info-resumo {
              width: 48%;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            h3 {
              margin-top: 0;
              font-size: 16px;
              color: #555;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              text-align: left;
              padding: 10px;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
            }
            .observacoes {
              margin-top: 30px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #777;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .assinaturas {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
            }
            .assinatura {
              width: 40%;
              text-align: center;
              margin-top: 30px;
            }
            .assinatura p {
              margin-top: 5px;
              margin-bottom: 0;
            }
            .linha-assinatura {
              width: 100%;
              height: 1px;
              background-color: #333;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${configuracoes.logo ? `<img src="${configuracoes.logo}" alt="Logo" class="logo">` : ''}
              <div class="titulo">${configuracoes.nomeEmpresa}</div>
              <div class="info-empresa">
                ${configuracoes.endereco} | CNPJ: ${configuracoes.cnpj}<br>
                Tel: ${configuracoes.telefone} | E-mail: ${configuracoes.email}
              </div>
            </div>
            
            <div class="titulo" style="text-align: center;">ORÇAMENTO #${orcamento.id}</div>
            <div style="text-align: center; margin-bottom: 20px;">
              Data: ${formatarData(orcamento.dataCriacao)}
            </div>
            
            <div class="info-orcamento">
              <div class="info-cliente">
                <h3>INFORMAÇÕES DO CLIENTE</h3>
                <p><strong>Nome:</strong> ${cliente.nome}</p>
                <p><strong>CPF/CNPJ:</strong> ${cliente.cpf}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                <p><strong>E-mail:</strong> ${cliente.email}</p>
                <p><strong>Endereço:</strong> ${cliente.endereco}</p>
              </div>
              
              <div class="info-resumo">
                <h3>RESUMO</h3>
                ${orcamento.ordemId ? `<p><strong>Ordem de Serviço:</strong> #${orcamento.ordemId}</p>` : ''}
                <p><strong>Status:</strong> ${
                  orcamento.status === 'pendente' ? 'Pendente' :
                  orcamento.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'
                }</p>
                <p><strong>Valor Total:</strong> R$ ${formatarValor(orcamento.valor)}</p>
              </div>
            </div>
            
            <h3>ITENS DO ORÇAMENTO</h3>
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th style="text-align: right;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${orcamento.itens.map(item => `
                  <tr>
                    <td>${item.descricao}</td>
                    <td style="text-align: right;">R$ ${formatarValor(item.valor)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              TOTAL: R$ ${formatarValor(orcamento.valor)}
            </div>
            
            ${orcamento.observacoes ? `
              <div class="observacoes">
                <h3>OBSERVAÇÕES</h3>
                <p>${orcamento.observacoes}</p>
              </div>
            ` : ''}
            
            <div class="assinaturas">
              <div class="assinatura">
                <div class="linha-assinatura"></div>
                <p>Cliente</p>
                <p>${cliente.nome}</p>
              </div>
              
              <div class="assinatura">
                <div class="linha-assinatura"></div>
                <p>Responsável</p>
                <p>${configuracoes.nomeEmpresa}</p>
              </div>
            </div>
            
            <div class="footer">
              Este orçamento é válido por 15 dias a partir da data de emissão.
              <br>
              ${configuracoes.nomeEmpresa} - ${configuracoes.cnpj}
            </div>
          </div>
          <script>
            // Imprimir automaticamente quando a página carregar
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
        </html>
      `
      
      // Criar iframe para impressão
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = '0'
      document.body.appendChild(iframe)
      
      // Escrever o HTML no iframe
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) {
        throw new Error('Não foi possível acessar o documento do iframe')
      }
      
      doc.open()
      doc.write(html)
      doc.close()
      
      // Aguardar o carregamento e imprimir
      iframe.onload = () => {
        try {
          // Imprimir o conteúdo
          iframe.contentWindow?.print()
        } catch (e) {
          console.error('Erro ao imprimir:', e)
        }
      }
      
      return true
    } catch (e) {
      console.error('Erro ao imprimir orçamento:', e)
      error.value = e instanceof Error ? e.message : 'Erro ao imprimir orçamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    orcamentos,
    loading,
    error,
    fetchOrcamentos,
    getOrcamento,
    criarOrcamento,
    atualizarOrcamento,
    atualizarStatusOrcamento,
    imprimirOrcamento
  }
}) 