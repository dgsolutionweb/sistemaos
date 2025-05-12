import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Tecnico } from '../types';
import { supabase } from '../lib/supabase';

export const useTecnicoStore = defineStore('tecnico', () => {
  const tecnicos = ref<Tecnico[]>([]);
  const carregando = ref(false);
  const erro = ref<string | null>(null);

  const buscarTecnicos = async () => {
    carregando.value = true;
    erro.value = null;
    try {
      const { data, error } = await supabase
        .from('tecnicos')
        .select('*')
        .order('nome');
      
      if (error) {
        throw error;
      }
      
      tecnicos.value = data.map(item => ({
        id: item.id,
        nome: item.nome,
        email: item.email,
        telefone: item.telefone,
        especialidades: item.especialidades,
        disponivel: item.disponivel,
        foto: item.foto || undefined,
        userId: item.user_id || undefined
      }));
      
      return tecnicos.value;
    } catch (e) {
      console.error('Erro ao carregar técnicos:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao carregar técnicos';
      }
      tecnicos.value = [];
      return [];
    } finally {
      carregando.value = false;
    }
  };

  const adicionarTecnico = async (tecnico: Omit<Tecnico, 'id'>) => {
    carregando.value = true;
    erro.value = null;
    try {
      const { data, error } = await supabase
        .from('tecnicos')
        .insert([
          {
            nome: tecnico.nome,
            email: tecnico.email,
            telefone: tecnico.telefone,
            especialidades: tecnico.especialidades,
            disponivel: tecnico.disponivel ?? true,
            foto: tecnico.foto,
            user_id: tecnico.userId
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Erro ao adicionar técnico: nenhum dado retornado');
      }
      
      const novoTecnico: Tecnico = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        especialidades: data.especialidades,
        disponivel: data.disponivel,
        foto: data.foto || undefined,
        userId: data.user_id || undefined
      };
      
      tecnicos.value.push(novoTecnico);
      return novoTecnico;
    } catch (e) {
      console.error('Erro ao adicionar técnico:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao adicionar técnico';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  const atualizarTecnico = async (id: string, dados: Partial<Omit<Tecnico, 'id'>>) => {
    carregando.value = true;
    erro.value = null;
    try {
      // Converter o formato da aplicação para o formato do Supabase
      const dadosParaUpdate: any = {};
      
      if (dados.nome !== undefined) dadosParaUpdate.nome = dados.nome;
      if (dados.email !== undefined) dadosParaUpdate.email = dados.email;
      if (dados.telefone !== undefined) dadosParaUpdate.telefone = dados.telefone;
      if (dados.especialidades !== undefined) dadosParaUpdate.especialidades = dados.especialidades;
      if (dados.disponivel !== undefined) dadosParaUpdate.disponivel = dados.disponivel;
      if (dados.foto !== undefined) dadosParaUpdate.foto = dados.foto;
      if (dados.userId !== undefined) dadosParaUpdate.user_id = dados.userId;
      
      const { data, error } = await supabase
        .from('tecnicos')
        .update(dadosParaUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Erro ao atualizar técnico: nenhum dado retornado');
      }
      
      const tecnicoAtualizado: Tecnico = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        especialidades: data.especialidades,
        disponivel: data.disponivel,
        foto: data.foto || undefined,
        userId: data.user_id || undefined
      };
      
      const index = tecnicos.value.findIndex(t => t.id === id);
      if (index !== -1) {
        tecnicos.value[index] = tecnicoAtualizado;
      } else {
        tecnicos.value.push(tecnicoAtualizado);
      }
      
      return tecnicoAtualizado;
    } catch (e) {
      console.error('Erro ao atualizar técnico:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao atualizar técnico';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  const excluirTecnico = async (id: string) => {
    carregando.value = true;
    erro.value = null;
    try {
      const { error } = await supabase
        .from('tecnicos')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      tecnicos.value = tecnicos.value.filter(t => t.id !== id);
      return true;
    } catch (e) {
      console.error('Erro ao excluir técnico:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao excluir técnico';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  // Upload de foto do técnico
  const uploadFoto = async (file: File) => {
    carregando.value = true;
    erro.value = null;
    
    try {
      // Nome do arquivo no storage
      const fileName = `tecnico_${Date.now()}_${file.name}`;
      const filePath = `tecnicos/${fileName}`;
      
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
      
      return publicUrl;
    } catch (e) {
      console.error('Erro ao fazer upload da foto:', e);
      if (e instanceof Error) {
        erro.value = e.message;
      } else {
        erro.value = 'Erro ao fazer upload da foto';
      }
      throw e;
    } finally {
      carregando.value = false;
    }
  };

  return {
    tecnicos,
    carregando,
    erro,
    buscarTecnicos,
    adicionarTecnico,
    atualizarTecnico,
    excluirTecnico,
    uploadFoto,
    // Aliases para compatibilidade com código existente
    fetchTecnicos: buscarTecnicos,
    addTecnico: adicionarTecnico,
    updateTecnico: atualizarTecnico,
    deleteTecnico: excluirTecnico,
    isLoading: carregando,
    error: erro
  };
}); 