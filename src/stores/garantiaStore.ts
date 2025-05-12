import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Garantia } from '@/types';
import { supabase } from '../lib/supabase';

export const useGarantiaStore = defineStore('garantia', () => {
  const garantias = ref<Garantia[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchGarantias = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase
        .from('garantias')
        .select('*')
        .order('data_inicio', { ascending: false });
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      if (data) {
        // Mapear os campos do banco para o formato da aplicação
        garantias.value = data.map(item => ({
          id: item.id,
          ordemId: item.ordem_id,
          dataInicio: item.data_inicio,
          dataFim: item.data_fim,
          descricao: item.descricao,
          termos: item.termos,
          status: item.status
        }));
      } else {
        garantias.value = [];
      }
      
      return garantias.value;
    } catch (e) {
      error.value = 'Erro ao carregar garantias';
      console.error(e);
      garantias.value = [];
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchGarantiasPorOrdem = async (ordemId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase
        .from('garantias')
        .select('*')
        .eq('ordem_id', ordemId);
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      if (data) {
        // Mapear os campos do banco para o formato da aplicação
        return data.map(item => ({
          id: item.id,
          ordemId: item.ordem_id,
          dataInicio: item.data_inicio,
          dataFim: item.data_fim,
          descricao: item.descricao,
          termos: item.termos,
          status: item.status
        }));
      }
      
      return [];
    } catch (e) {
      error.value = 'Erro ao carregar garantias da ordem';
      console.error(e);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const addGarantia = async (garantia: Omit<Garantia, 'id'>) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Converter do formato da aplicação para o formato do Supabase
      const garantiaParaInserir = {
        ordem_id: garantia.ordemId,
        data_inicio: garantia.dataInicio,
        data_fim: garantia.dataFim,
        descricao: garantia.descricao,
        termos: garantia.termos,
        status: garantia.status
      };
      
      const { data, error: supabaseError } = await supabase
        .from('garantias')
        .insert([garantiaParaInserir])
        .select()
        .single();
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      if (!data) {
        throw new Error('Erro ao adicionar garantia: nenhum dado retornado');
      }
      
      // Mapear a resposta para o formato da aplicação
      const novaGarantia: Garantia = {
        id: data.id,
        ordemId: data.ordem_id,
        dataInicio: data.data_inicio,
        dataFim: data.data_fim,
        descricao: data.descricao,
        termos: data.termos,
        status: data.status
      };
      
      garantias.value.push(novaGarantia);
      return novaGarantia;
    } catch (e) {
      error.value = 'Erro ao adicionar garantia';
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const updateGarantia = async (id: string, dados: Partial<Garantia>) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Converter do formato da aplicação para o formato do Supabase
      const dadosParaAtualizar: any = {};
      
      if (dados.ordemId !== undefined) dadosParaAtualizar.ordem_id = dados.ordemId;
      if (dados.dataInicio !== undefined) dadosParaAtualizar.data_inicio = dados.dataInicio;
      if (dados.dataFim !== undefined) dadosParaAtualizar.data_fim = dados.dataFim;
      if (dados.descricao !== undefined) dadosParaAtualizar.descricao = dados.descricao;
      if (dados.termos !== undefined) dadosParaAtualizar.termos = dados.termos;
      if (dados.status !== undefined) dadosParaAtualizar.status = dados.status;
      
      const { data, error: supabaseError } = await supabase
        .from('garantias')
        .update(dadosParaAtualizar)
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar garantia: nenhum dado retornado');
      }
      
      // Mapear a resposta para o formato da aplicação
      const garantiaAtualizada: Garantia = {
        id: data.id,
        ordemId: data.ordem_id,
        dataInicio: data.data_inicio,
        dataFim: data.data_fim,
        descricao: data.descricao,
        termos: data.termos,
        status: data.status
      };
      
      const index = garantias.value.findIndex(g => g.id === id);
      if (index !== -1) {
        garantias.value[index] = garantiaAtualizada;
      }
      
      return garantiaAtualizada;
    } catch (e) {
      error.value = 'Erro ao atualizar garantia';
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const cancelarGarantia = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase
        .from('garantias')
        .update({ status: 'cancelada' })
        .eq('id', id)
        .select()
        .single();
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      if (!data) {
        throw new Error('Erro ao cancelar garantia: nenhum dado retornado');
      }
      
      // Mapear a resposta para o formato da aplicação
      const garantiaAtualizada: Garantia = {
        id: data.id,
        ordemId: data.ordem_id,
        dataInicio: data.data_inicio,
        dataFim: data.data_fim,
        descricao: data.descricao,
        termos: data.termos,
        status: data.status
      };
      
      const index = garantias.value.findIndex(g => g.id === id);
      if (index !== -1) {
        garantias.value[index] = garantiaAtualizada;
      }
      
      return garantiaAtualizada;
    } catch (e) {
      error.value = 'Erro ao cancelar garantia';
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteGarantia = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { error: supabaseError } = await supabase
        .from('garantias')
        .delete()
        .eq('id', id);
      
      if (supabaseError) {
        throw supabaseError;
      }
      
      garantias.value = garantias.value.filter(g => g.id !== id);
    } catch (e) {
      error.value = 'Erro ao excluir garantia';
      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    garantias,
    isLoading,
    error,
    fetchGarantias,
    fetchGarantiasPorOrdem,
    addGarantia,
    updateGarantia,
    cancelarGarantia,
    deleteGarantia,
  };
}); 