import { http, HttpResponse } from 'msw'
import type { Tecnico, ConfiguracaoEmpresa, OrdemServico, Cliente, Garantia, Orcamento } from '../types'
import type { Usuario } from '../types/usuario'
import { format, addMonths } from 'date-fns'

// Dados de mock para usuários
let usuarios: Usuario[] = [
  {
    id: '1',
    nome: 'Administrador',
    email: 'admin@exemplo.com',
    tipo: 'admin',
    ativo: true,
    ultimoAcesso: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao.silva@exemplo.com',
    tipo: 'tecnico',
    ativo: true,
    ultimoAcesso: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    tipo: 'atendente',
    ativo: true,
    ultimoAcesso: new Date().toISOString()
  }
]

// Dados de mock para técnicos
let tecnicos: Tecnico[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@exemplo.com',
    telefone: '(11) 98765-4321',
    especialidades: ['Notebooks', 'Impressoras', 'Desktops'],
    disponivel: true,
    foto: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    telefone: '(11) 91234-5678',
    especialidades: ['Celulares', 'Tablets', 'Notebooks'],
    disponivel: true,
    foto: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    nome: 'Carlos Santos',
    email: 'carlos.santos@exemplo.com',
    telefone: '(11) 92345-6789',
    especialidades: ['Redes', 'Servidores', 'Segurança'],
    disponivel: false,
    foto: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
]

// Dados de mock para configuração
let configuracao: ConfiguracaoEmpresa = {
  id: '1',
  nomeEmpresa: 'TechSupport Solutions',
  cnpj: '12.345.678/0001-90',
  endereco: 'Av. Paulista, 1000, São Paulo - SP',
  telefone: '(11) 3456-7890',
  email: 'contato@techsupport.com.br',
  logo: 'https://via.placeholder.com/150',
  horarioFuncionamento: {
    inicio: '08:00',
    fim: '18:00',
    diasSemana: [1, 2, 3, 4, 5]
  },
  termosGarantia: 'A garantia dos serviços é de 90 dias a partir da data de conclusão.'
}

// Dados de mock para clientes
let clientes: Cliente[] = [
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
    nome: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    telefone: '(11) 98765-4321',
    endereco: 'Av. Paulista, 1500 - São Paulo/SP',
    cpf: '987.654.321-00'
  }
]

// Dados de mock para ordens de serviço
let ordens: OrdemServico[] = [
  {
    id: '1',
    clienteId: '1',
    tecnicoId: '1',
    equipamento: 'Notebook',
    marca: 'Dell',
    modelo: 'Inspiron 15',
    numeroSerie: 'DL12345',
    defeito: 'Não liga',
    descricaoProblema: 'O notebook não liga, mesmo conectado à energia',
    observacoes: 'Cliente relatou que o problema começou após uma queda',
    status: 'em_analise',
    prioridade: 'alta',
    dataCriacao: '2023-05-10T10:30:00Z',
    dataEntrada: '2023-05-10T14:00:00Z',
    dataPrevisao: '2023-05-15T18:00:00Z',
    tecnicoResponsavel: 'João Silva'
  },
  {
    id: '2',
    clienteId: '2',
    tecnicoId: '2',
    equipamento: 'Smartphone',
    marca: 'Samsung',
    modelo: 'Galaxy S21',
    numeroSerie: 'SM21987',
    defeito: 'Tela quebrada',
    status: 'orcamento',
    prioridade: 'media',
    dataCriacao: '2023-05-12T09:15:00Z',
    dataEntrada: '2023-05-12T11:30:00Z',
    orcamento: {
      valor: 450,
      itens: [
        { descricao: 'Tela Original Samsung S21', valor: 350 },
        { descricao: 'Mão de obra', valor: 100 }
      ]
    },
    tecnicoResponsavel: 'Maria Oliveira'
  }
]

// Dados de mock para garantias
let garantias: Garantia[] = [
  {
    id: '1',
    ordemId: '1',
    dataInicio: '2023-05-15T18:00:00Z',
    dataFim: '2023-08-15T18:00:00Z',
    descricao: 'Garantia padrão de serviço',
    termos: 'Esta garantia cobre apenas defeitos relacionados ao reparo realizado.',
    status: 'ativa'
  },
  {
    id: '2',
    ordemId: '2',
    dataInicio: '2023-05-14T15:30:00Z',
    dataFim: '2023-11-14T15:30:00Z',
    descricao: 'Garantia estendida de peças',
    termos: 'Esta garantia cobre defeitos de fabricação da tela substituída por um período de 6 meses.',
    status: 'ativa'
  }
]

// Dados de mock para orçamentos
let orcamentos: Orcamento[] = [
  {
    id: '1',
    clienteId: '1',
    ordemId: '1',
    itens: [
      { descricao: 'Placa Mãe Notebook Dell Inspiron 15', valor: 850 },
      { descricao: 'Mão de obra técnica especializada', valor: 250 },
      { descricao: 'Diagnóstico avançado', valor: 150 }
    ],
    valor: 1250,
    status: 'pendente',
    dataCriacao: '2023-05-10T16:30:00Z',
    observacoes: 'Orçamento sujeito a alterações após diagnóstico completo.'
  },
  {
    id: '2',
    clienteId: '2',
    ordemId: '2',
    itens: [
      { descricao: 'Tela Original Samsung S21', valor: 350 },
      { descricao: 'Mão de obra', valor: 100 }
    ],
    valor: 450,
    status: 'aprovado',
    dataCriacao: '2023-05-12T12:15:00Z',
    dataAprovacao: '2023-05-12T15:45:00Z'
  }
]

export const handlers = [
  // ===================== API de Autenticação =====================
  // POST /api/auth/login - Login de usuário
  http.post('/api/auth/login', async ({ request }) => {
    const { email, senha } = await request.json() as { email: string, senha: string }
    
    // Para fins de demonstração, aceita qualquer senha para os emails cadastrados
    const usuario = usuarios.find(u => u.email === email)
    
    if (!usuario) {
      return HttpResponse.json(
        { message: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }
    
    // Atualiza o último acesso
    usuario.ultimoAcesso = new Date().toISOString()
    
    // Gera um token (simulado)
    const token = `token-${btoa(`${usuario.id}:${Date.now()}`)}`
    
    return HttpResponse.json({
      token,
      usuario
    })
  }),
  
  // POST /api/auth/registrar - Registro de novo usuário
  http.post('/api/auth/registrar', async ({ request }) => {
    const { nome, email, senha } = await request.json() as { nome: string, email: string, senha: string }
    
    // Verifica se o email já existe
    if (usuarios.some(u => u.email === email)) {
      return HttpResponse.json(
        { message: 'Este email já está em uso' },
        { status: 400 }
      )
    }
    
    // Cria novo usuário (por padrão como atendente)
    const novoUsuario: Usuario = {
      id: String(Date.now()),
      nome,
      email,
      tipo: 'atendente', // Tipo padrão para novos registros
      ativo: true,
      ultimoAcesso: new Date().toISOString()
    }
    
    usuarios.push(novoUsuario)
    
    return HttpResponse.json(
      { message: 'Usuário registrado com sucesso' },
      { status: 201 }
    )
  }),
  
  // GET /api/auth/me - Obter informações do usuário atual
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    // Em uma implementação real, verificaríamos o token JWT
    // Aqui apenas simulamos extraindo o ID do usuário do token
    
    try {
      const tokenData = atob(token.replace('token-', ''))
      const userId = tokenData.split(':')[0]
      
      const usuario = usuarios.find(u => u.id === userId)
      
      if (!usuario) {
        return HttpResponse.json(
          { message: 'Usuário não encontrado' },
          { status: 404 }
        )
      }
      
      return HttpResponse.json(usuario)
    } catch (e) {
      return HttpResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      )
    }
  }),

  // ===================== API de Técnicos =====================
  // GET /api/tecnicos - Listar todos os técnicos
  http.get('/api/tecnicos', () => {
    return HttpResponse.json(tecnicos)
  }),

  // POST /api/tecnicos - Adicionar um novo técnico
  http.post('/api/tecnicos', async ({ request }) => {
    const novoTecnico = await request.json() as Omit<Tecnico, 'id'>
    const tecnico: Tecnico = {
      ...novoTecnico,
      id: String(Date.now()) // Gerando um ID único baseado no timestamp
    }
    tecnicos.push(tecnico)
    return HttpResponse.json(tecnico, { status: 201 })
  }),

  // PUT /api/tecnicos/:id - Atualizar um técnico existente
  http.put('/api/tecnicos/:id', async ({ params, request }) => {
    const { id } = params
    const dadosAtualizados = await request.json() as Partial<Tecnico>
    
    const index = tecnicos.findIndex(t => t.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    tecnicos[index] = { ...tecnicos[index], ...dadosAtualizados }
    return HttpResponse.json(tecnicos[index])
  }),

  // DELETE /api/tecnicos/:id - Excluir um técnico
  http.delete('/api/tecnicos/:id', ({ params }) => {
    const { id } = params
    const index = tecnicos.findIndex(t => t.id === id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    tecnicos = tecnicos.filter(t => t.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // =================== API de Configuração ===================
  // GET /api/configuracao - Obter configuração da empresa
  http.get('/api/configuracao', () => {
    return HttpResponse.json(configuracao)
  }),

  // PUT /api/configuracao - Atualizar configuração da empresa
  http.put('/api/configuracao', async ({ request }) => {
    const dadosAtualizados = await request.json() as Partial<ConfiguracaoEmpresa>
    configuracao = { ...configuracao, ...dadosAtualizados }
    return HttpResponse.json(configuracao)
  }),

  // POST /api/configuracao/logo - Upload de logo
  http.post('/api/configuracao/logo', async () => {
    // Simula um upload de logo
    configuracao.logo = `https://via.placeholder.com/150?text=Logo&timestamp=${Date.now()}`
    return HttpResponse.json({ url: configuracao.logo })
  }),

  // ====================== API de Clientes ======================
  // GET /api/clientes - Listar todos os clientes
  http.get('/api/clientes', () => {
    return HttpResponse.json(clientes, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  // GET /api/clientes/:id - Obter um cliente específico
  http.get('/api/clientes/:id', ({ params }) => {
    const { id } = params
    const cliente = clientes.find(c => c.id === id)
    
    if (!cliente) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(cliente, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  // POST /api/clientes - Adicionar um novo cliente
  http.post('/api/clientes', async ({ request }) => {
    const novoCliente = await request.json() as Omit<Cliente, 'id'>
    const cliente: Cliente = {
      ...novoCliente,
      id: String(Date.now())
    }
    clientes.push(cliente)
    return HttpResponse.json(cliente, { status: 201 })
  }),

  // PUT /api/clientes/:id - Atualizar um cliente existente
  http.put('/api/clientes/:id', async ({ params, request }) => {
    const { id } = params
    const dadosAtualizados = await request.json() as Partial<Cliente>
    
    const index = clientes.findIndex(c => c.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    clientes[index] = { ...clientes[index], ...dadosAtualizados }
    return HttpResponse.json(clientes[index])
  }),

  // DELETE /api/clientes/:id - Excluir um cliente
  http.delete('/api/clientes/:id', ({ params }) => {
    const { id } = params
    const index = clientes.findIndex(c => c.id === id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    clientes = clientes.filter(c => c.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // ================= API de Orçamentos =================
  // GET /api/orcamentos - Listar todos os orçamentos
  http.get('/api/orcamentos', () => {
    return HttpResponse.json(orcamentos)
  }),

  // GET /api/orcamentos/:id - Obter um orçamento específico
  http.get('/api/orcamentos/:id', ({ params }) => {
    const { id } = params
    const orcamento = orcamentos.find(o => o.id === id)
    
    if (!orcamento) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(orcamento)
  }),

  // POST /api/orcamentos - Criar um novo orçamento
  http.post('/api/orcamentos', async ({ request }) => {
    const novoOrcamento = await request.json() as Orcamento
    
    // Garantir que o ID seja exclusivo
    if (!novoOrcamento.id) {
      novoOrcamento.id = String(Date.now())
    }
    
    // Garantir que a data de criação esteja definida
    if (!novoOrcamento.dataCriacao) {
      novoOrcamento.dataCriacao = new Date().toISOString()
    }
    
    orcamentos.push(novoOrcamento)
    
    // Se o orçamento está vinculado a uma ordem, atualizamos a ordem
    if (novoOrcamento.ordemId) {
      const ordemIndex = ordens.findIndex(o => o.id === novoOrcamento.ordemId)
      if (ordemIndex !== -1) {
        ordens[ordemIndex].status = 'orcamento'
        ordens[ordemIndex].orcamento = {
          valor: novoOrcamento.valor,
          itens: novoOrcamento.itens
        }
      }
    }
    
    return HttpResponse.json(novoOrcamento, { status: 201 })
  }),

  // PUT /api/orcamentos/:id - Atualizar um orçamento
  http.put('/api/orcamentos/:id', async ({ params, request }) => {
    const { id } = params
    const dadosAtualizados = await request.json() as Partial<Orcamento>
    
    const index = orcamentos.findIndex(o => o.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    orcamentos[index] = { ...orcamentos[index], ...dadosAtualizados }
    
    // Se o orçamento está vinculado a uma ordem, atualizamos a ordem
    if (orcamentos[index].ordemId) {
      const ordemIndex = ordens.findIndex(o => o.id === orcamentos[index].ordemId)
      if (ordemIndex !== -1) {
        ordens[ordemIndex].orcamento = {
          valor: orcamentos[index].valor,
          itens: orcamentos[index].itens
        }
      }
    }
    
    return HttpResponse.json(orcamentos[index])
  }),

  // PUT /api/orcamentos/:id/status - Atualizar o status de um orçamento
  http.put('/api/orcamentos/:id/status', async ({ params, request }) => {
    const { id } = params
    const { status } = await request.json() as { status: 'pendente' | 'aprovado' | 'rejeitado' }
    
    const index = orcamentos.findIndex(o => o.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    orcamentos[index].status = status
    
    // Se o status for "aprovado", definimos a data de aprovação
    if (status === 'aprovado') {
      orcamentos[index].dataAprovacao = new Date().toISOString()
      
      // Se o orçamento está vinculado a uma ordem, atualizamos o status da ordem
      if (orcamentos[index].ordemId) {
        const ordemIndex = ordens.findIndex(o => o.id === orcamentos[index].ordemId)
        if (ordemIndex !== -1) {
          ordens[ordemIndex].status = 'aprovado'
        }
      }
    }
    
    return HttpResponse.json(orcamentos[index])
  }),

  // DELETE /api/orcamentos/:id - Excluir um orçamento
  http.delete('/api/orcamentos/:id', ({ params }) => {
    const { id } = params
    const index = orcamentos.findIndex(o => o.id === id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    orcamentos = orcamentos.filter(o => o.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // ================= API de Ordens de Serviço =================
  // GET /api/ordens - Listar todas as ordens de serviço
  http.get('/api/ordens', () => {
    return HttpResponse.json(ordens, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  // GET /api/ordens/:id - Obter uma ordem específica
  http.get('/api/ordens/:id', ({ params }) => {
    const { id } = params
    const ordem = ordens.find(o => o.id === id)
    
    if (!ordem) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(ordem)
  }),

  // POST /api/ordens - Criar uma nova ordem de serviço
  http.post('/api/ordens', async ({ request }) => {
    const novaOrdem = await request.json() as Omit<OrdemServico, 'id'>
    const ordem: OrdemServico = {
      ...novaOrdem,
      id: String(Date.now()),
      dataCriacao: new Date().toISOString()
    }
    ordens.push(ordem)
    return HttpResponse.json(ordem, { status: 201 })
  }),

  // PUT /api/ordens/:id - Atualizar uma ordem existente
  http.put('/api/ordens/:id', async ({ params, request }) => {
    const { id } = params
    const dadosAtualizados = await request.json() as Partial<OrdemServico>
    
    const index = ordens.findIndex(o => o.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    ordens[index] = { ...ordens[index], ...dadosAtualizados }
    return HttpResponse.json(ordens[index])
  }),

  // PUT /api/ordens/:id/status - Atualizar status de uma ordem
  http.put('/api/ordens/:id/status', async ({ params, request }) => {
    const { id } = params
    const { status } = await request.json() as { status: OrdemServico['status'] }
    
    const index = ordens.findIndex(o => o.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    ordens[index].status = status
    return HttpResponse.json(ordens[index])
  }),

  // =================== API de Garantias ===================
  // GET /api/garantias - Listar todas as garantias
  http.get('/api/garantias', () => {
    return HttpResponse.json(garantias)
  }),

  // GET /api/garantias/:id - Obter uma garantia específica
  http.get('/api/garantias/:id', ({ params }) => {
    const { id } = params
    const garantia = garantias.find(g => g.id === id)
    
    if (!garantia) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(garantia)
  }),

  // GET /api/ordens/:ordemId/garantias - Obter garantias de uma ordem
  http.get('/api/ordens/:ordemId/garantias', ({ params }) => {
    const { ordemId } = params
    const garantiasOrdem = garantias.filter(g => g.ordemId === ordemId)
    
    return HttpResponse.json(garantiasOrdem)
  }),

  // POST /api/garantias - Criar uma nova garantia
  http.post('/api/garantias', async ({ request }) => {
    const novaGarantia = await request.json() as Omit<Garantia, 'id'>
    const garantia: Garantia = {
      ...novaGarantia,
      id: String(Date.now())
    }
    garantias.push(garantia)
    return HttpResponse.json(garantia, { status: 201 })
  }),

  // PUT /api/garantias/:id - Atualizar uma garantia existente
  http.put('/api/garantias/:id', async ({ params, request }) => {
    const { id } = params
    const dadosAtualizados = await request.json() as Partial<Garantia>
    
    const index = garantias.findIndex(g => g.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    garantias[index] = { ...garantias[index], ...dadosAtualizados }
    return HttpResponse.json(garantias[index])
  }),

  // PUT /api/garantias/:id/cancelar - Cancelar uma garantia
  http.put('/api/garantias/:id/cancelar', ({ params }) => {
    const { id } = params
    
    const index = garantias.findIndex(g => g.id === id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    garantias[index].status = 'cancelada'
    return HttpResponse.json(garantias[index])
  }),

  // DELETE /api/garantias/:id - Excluir uma garantia
  http.delete('/api/garantias/:id', ({ params }) => {
    const { id } = params
    const index = garantias.findIndex(g => g.id === id)
    
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    garantias = garantias.filter(g => g.id !== id)
    return new HttpResponse(null, { status: 204 })
  })
] 