import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import type { ConfiguracaoEmpresa } from '../types';

export const useConfigStore = defineStore('config', () => {
  const configuracao = ref<ConfiguracaoEmpresa | null>(null);
  const carregando = ref(false);
  const erro = ref<string | null>(null);

  // Buscar configuração da empresa
  const buscarConfiguracao = async () => {
    carregando.value = true;
    erro.value = null;
    
    try {
      const { data, error } = await supabase
        .from('configuracao_empresa')
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Configuração não encontrada');
      }
      
      // Mapear dados do Supabase para o formato de ConfiguracaoEmpresa
      configuracao.value = {
        id: data.id,
        nomeEmpresa: data.nome_empresa,
        cnpj: data.cnpj,
        endereco: data.endereco,
        telefone: data.telefone,
        email: data.email,
        logo: data.logo || undefined,
        horarioFuncionamento: data.horario_funcionamento as {
          inicio: string;
          fim: string;
          diasSemana: number[];
        },
        termosGarantia: data.termos_garantia
      };
      
      return configuracao.value;
    } catch (e) {
      console.error('Erro ao buscar configuração:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao buscar configuração da empresa';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  // Atualizar configuração da empresa
  const atualizarConfiguracao = async (dadosAtualizados: Partial<ConfiguracaoEmpresa>) => {
    carregando.value = true;
    erro.value = null;
    
    try {
      // Convertendo do formato da aplicação para o formato do Supabase
      const dadosParaUpdate: any = {};
      
      if (dadosAtualizados.nomeEmpresa !== undefined) {
        dadosParaUpdate.nome_empresa = dadosAtualizados.nomeEmpresa;
      }
      
      if (dadosAtualizados.cnpj !== undefined) {
        dadosParaUpdate.cnpj = dadosAtualizados.cnpj;
      }
      
      if (dadosAtualizados.endereco !== undefined) {
        dadosParaUpdate.endereco = dadosAtualizados.endereco;
      }
      
      if (dadosAtualizados.telefone !== undefined) {
        dadosParaUpdate.telefone = dadosAtualizados.telefone;
      }
      
      if (dadosAtualizados.email !== undefined) {
        dadosParaUpdate.email = dadosAtualizados.email;
      }
      
      if (dadosAtualizados.logo !== undefined) {
        dadosParaUpdate.logo = dadosAtualizados.logo;
      }
      
      if (dadosAtualizados.horarioFuncionamento !== undefined) {
        dadosParaUpdate.horario_funcionamento = dadosAtualizados.horarioFuncionamento;
      }
      
      if (dadosAtualizados.termosGarantia !== undefined) {
        dadosParaUpdate.termos_garantia = dadosAtualizados.termosGarantia;
      }
      
      const id = configuracao.value?.id;
      
      if (!id) {
        throw new Error('ID da configuração não encontrado');
      }
      
      const { data, error } = await supabase
        .from('configuracao_empresa')
        .update(dadosParaUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar configuração: nenhum dado retornado');
      }
      
      // Atualizar o objeto de configuração
      configuracao.value = {
        id: data.id,
        nomeEmpresa: data.nome_empresa,
        cnpj: data.cnpj,
        endereco: data.endereco,
        telefone: data.telefone,
        email: data.email,
        logo: data.logo || undefined,
        horarioFuncionamento: data.horario_funcionamento as {
          inicio: string;
          fim: string;
          diasSemana: number[];
        },
        termosGarantia: data.termos_garantia
      };
      
      return configuracao.value;
    } catch (e) {
      console.error('Erro ao atualizar configuração:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao atualizar configuração da empresa';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  // Upload de logo
  const uploadLogo = async (file: File) => {
    carregando.value = true;
    erro.value = null;
    
    try {
      // Verificar se temos uma configuração carregada
      if (!configuracao.value) {
        await buscarConfiguracao();
        if (!configuracao.value) {
          throw new Error('Configuração não encontrada');
        }
      }
      
      // Nome do arquivo no storage
      const fileName = `logo_${Date.now()}_${file.name}`;
      const filePath = `empresas/${configuracao.value.id}/${fileName}`;
      
      // Fazer upload do arquivo
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Gerar URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);
      
      // Atualizar a configuração com a nova URL do logo
      return atualizarConfiguracao({ logo: publicUrl });
    } catch (e) {
      console.error('Erro ao fazer upload do logo:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao fazer upload do logo';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  return {
    configuracao,
    carregando,
    erro,
    buscarConfiguracao,
    atualizarConfiguracao,
    uploadLogo
  };
}); 