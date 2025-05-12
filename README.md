# Sistema de Ordem de Serviço

Sistema para gerenciamento de ordens de serviço para assistência técnica, desenvolvido com Vue.js 3, TypeScript e Tailwind CSS.

## Funcionalidades

- Cadastro e gerenciamento de clientes
- Criação e acompanhamento de ordens de serviço
- Dashboard com visão geral do status das ordens
- Atualização de status das ordens
- Interface responsiva e moderna

## Tecnologias Utilizadas

- Vue.js 3 com Composition API
- TypeScript
- Tailwind CSS para estilização
- Vue Router para navegação
- Pinia para gerenciamento de estado
- HeadlessUI para componentes de interface
- Heroicons para ícones
- Date-fns para formatação de datas

## Pré-requisitos

- Node.js (versão 16 ou superior)
- pnpm (versão 8 ou superior)

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd ordem-servico
```

2. Instale as dependências:
```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
ordem-servico/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── views/          # Páginas da aplicação
│   ├── stores/         # Stores Pinia
│   ├── router/         # Configuração do Vue Router
│   ├── types/          # Tipos TypeScript
│   └── utils/          # Funções utilitárias
├── public/            # Arquivos públicos
└── index.html         # Página HTML principal
```

## Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento
- `pnpm build`: Compila o projeto para produção
- `pnpm preview`: Visualiza a build de produção localmente

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar persistência de dados com backend
- [ ] Implementar geração de relatórios
- [ ] Adicionar sistema de notificações
- [ ] Implementar busca e filtros avançados
