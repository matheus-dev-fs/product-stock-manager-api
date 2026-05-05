# Product Stock Manager API

API em Node.js + TypeScript para gerenciamento de estoque, com autenticação JWT, refresh token, upload de avatar e dashboard de indicadores.

## Visão geral

O projeto organiza a aplicação em camadas:

- `routes`: define os endpoints da API.
- `controllers`: recebe a requisição e devolve a resposta.
- `services`: concentra a regra de negócio.
- `repositories`: faz o acesso ao banco com Drizzle ORM.
- `middlewares`: autentica, trata erros e faz upload de arquivos.
- `helpers` e `validators`: utilitários e validação com Zod.

A API expõe um endpoint de health check em `/api/ping`, rotas de autenticação, CRUD de usuários, categorias e produtos, movimentações de estoque e consultas de dashboard.

## Stack

- Node.js 22
- TypeScript
- Express 5
- PostgreSQL
- Drizzle ORM / Drizzle Kit
- JWT
- Zod
- Multer
- Sharp
- Jest
- Docker e Docker Compose

## Principais recursos

- Autenticação com `login`, `logout`, `refresh` e `me`.
- CRUD de usuários, com verificação de permissão de admin na criação.
- CRUD de categorias.
- CRUD de produtos com validação de quantidade mínima e máxima.
- Registro e listagem de movimentações de estoque (`IN` e `OUT`).
- Dashboard com informações de valor de inventário, resumo e gráfico de movimentações, produtos com baixo estoque e produtos estagnados.
- Upload e processamento de avatar com redimensionamento para 50x50.

## Rotas

Base da API: `/api`

### Públicas

- `GET /api/ping`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### Protegidas por JWT

- `GET /api/auth/me`
- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/categories`
- `GET /api/categories`
- `GET /api/categories/:id`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/stock-movements`
- `GET /api/stock-movements`
- `GET /api/dashboard/inventory-value`
- `GET /api/dashboard/stock-movements-summary`
- `GET /api/dashboard/stock-movements-graph`
- `GET /api/dashboard/low-stock-products`
- `GET /api/dashboard/stagnant-products`

## Requisitos

- Node.js 22
- PostgreSQL 16+
- npm

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores:

- `PORT`
- `NODE_ENV`
- `BASE_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `POSTGRES_TEST_DB`
- `DATABASE_URL`
- `DATABASE_TEST_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `LOG_LEVEL`

## Como executar localmente

### Desenvolvimento

```bash
npm install
npm run dev
```

### Build e execução

```bash
npm run build
npm start
```

### Testes

```bash
npm test
```

Ou via Docker:

```bash
npm run test:docker
```

## Docker

### Desenvolvimento

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Produção

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Banco de dados

Comandos disponíveis via Drizzle Kit:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Persistência de avatars

A aplicação salva os arquivos em `public/avatars` e expõe a pasta em `/public`.

- Em desenvolvimento, o `docker-compose.dev.yml` já monta um volume para `avatars`.
- Em produção, `docker-compose.prod.yml` monta `./public/avatars:/app/public/avatars` para manter os arquivos fora do ciclo de rebuild do container.

Se você estiver hospedando em uma plataforma sem volume persistente, os arquivos de avatar podem ser perdidos no redeploy. No Render, por exemplo, o caminho mais simples é usar um Persistent Disk montado em `/app/public/avatars` ou um serviço externo de arquivos.

## Estrutura resumida

```text
src/
  controllers/
  db/
  errors/
  helpers/
  interfaces/
  middlewares/
  repositories/
  routes/
  services/
  tests/
  types/
  validators/
```

## Observações

- O projeto usa ESM, então os imports relativos no TypeScript precisam terminar com `.js`.
- A autenticação usa access token e refresh token.
- O endpoint `/api/ping` pode ser usado para checagem rápida de disponibilidade.
