import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Usuario } from '../types/usuario'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(null)
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  // Estado da autenticação
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => usuario.value?.tipo === 'admin')
  const isTecnico = computed(() => usuario.value?.tipo === 'tecnico')

  // Carregar dados do localStorage no início
  const inicializar = async () => {
    carregando.value = true
    erro.value = null
    
    try {
      // Verifica se já existe uma sessão
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        throw error
      }
      
      if (session) {
        token.value = session.access_token
        try {
          await fetchUsuario()
        } catch (e) {
          console.error('Erro ao buscar usuário, mas mantendo sessão:', e)
        }
      }
    } catch (e) {
      console.error('Erro ao inicializar autenticação:', e)
      token.value = null
      usuario.value = null
      if (e instanceof Error) {
        erro.value = e.message
      } else if (typeof e === 'object' && e !== null) {
        erro.value = JSON.stringify(e)
      } else {
        erro.value = 'Erro desconhecido ao inicializar autenticação'
      }
    } finally {
      carregando.value = false
    }
  }

  // Buscar dados do usuário do perfil
  const fetchUsuario = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      
      // Dados básicos do usuário autenticado
      const userBasic: Usuario = {
        id: user.id,
        nome: user.user_metadata?.nome || user.email || 'Usuário',
        email: user.email || '',
        tipo: 'atendente', // Valor padrão
        ativo: true,
        ultimoAcesso: new Date().toISOString()
      }
      
      try {
        // Tentar buscar perfil completo do usuário
        const { data: perfilUsuario, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) throw error
        
        if (perfilUsuario) {
          // Atualizar dados com informações do perfil
          userBasic.nome = perfilUsuario.nome
          userBasic.tipo = perfilUsuario.tipo as 'admin' | 'tecnico' | 'atendente'
          userBasic.foto = perfilUsuario.foto || undefined
          userBasic.ativo = perfilUsuario.ativo
          userBasic.ultimoAcesso = perfilUsuario.ultimo_acesso || new Date().toISOString()
          
          // Atualizar último acesso
          await supabase
            .from('users')
            .update({ ultimo_acesso: new Date().toISOString() })
            .eq('id', user.id)
        }
      } catch (profileError) {
        console.warn('Não foi possível buscar o perfil completo, usando dados básicos:', profileError)
      }
      
      usuario.value = userBasic
      
    } catch (e) {
      console.error('Erro ao buscar dados do usuário:', e)
      token.value = null
      usuario.value = null
      
      if (e instanceof Error) {
        erro.value = e.message
      } else if (typeof e === 'object' && e !== null) {
        erro.value = JSON.stringify(e)
      } else {
        erro.value = 'Erro ao buscar dados do usuário'
      }
    }
  }

  // Login
  const login = async (email: string, senha: string) => {
    erro.value = null
    carregando.value = true
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      })
      
      if (error) {
        throw error
      }
      
      token.value = data.session?.access_token || null
      
      if (token.value) {
        try {
          await fetchUsuario()
        } catch (userError) {
          console.warn('Login bem-sucedido, mas erro ao buscar perfil:', userError)
        }
        return true
      } else {
        throw new Error('Erro ao realizar login: Sessão não iniciada')
      }
    } catch (e) {
      console.error('Erro ao fazer login:', e)
      token.value = null
      usuario.value = null
      
      if (e instanceof Error) {
        erro.value = e.message
      } else if (typeof e === 'object' && e !== null) {
        erro.value = JSON.stringify(e)
      } else {
        erro.value = 'Ocorreu um erro desconhecido durante o login'
      }
      return false
    } finally {
      carregando.value = false
    }
  }

  // Registro
  const registrar = async (nome: string, email: string, senha: string) => {
    erro.value = null
    carregando.value = true
    
    try {
      // Registrar usuário com Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            email,
            tipo: 'atendente'
          }
        }
      })
      
      if (error) {
        throw error
      }

      // Se o registro foi bem-sucedido, retornar true
      return true
    } catch (e) {
      console.error('Erro ao registrar:', e)
      
      if (e instanceof Error) {
        erro.value = e.message
      } else if (typeof e === 'object' && e !== null) {
        erro.value = JSON.stringify(e)
      } else {
        erro.value = 'Ocorreu um erro desconhecido durante o registro'
      }
      return false
    } finally {
      carregando.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      carregando.value = true
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      token.value = null
      usuario.value = null
    } catch (e) {
      console.error('Erro ao fazer logout:', e)
      
      if (e instanceof Error) {
        erro.value = e.message
      } else if (typeof e === 'object' && e !== null) {
        erro.value = JSON.stringify(e)
      } else {
        erro.value = 'Ocorreu um erro desconhecido durante o logout'
      }
    } finally {
      carregando.value = false
    }
  }

  return {
    usuario,
    token,
    carregando,
    erro,
    isLoggedIn,
    isAdmin,
    isTecnico,
    inicializar,
    login,
    registrar,
    logout
  }
}) 