<div align="center">

# Social Network Backend

### REST API para uma rede social construída como challenge do Apple Developer Academy.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-0F6E56?style=for-the-badge)
![Platform](https://img.shields.io/badge/Node.js-0F6E56?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-0F6E56?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-0F6E56?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## Sobre o Projeto

Backend de uma rede social desenvolvido durante um challenge do **Apple Developer Academy**, focado em aprendizado de arquitetura de APIs, autenticação, modelagem de banco de dados e boas práticas de segurança.

O projeto simula uma plataforma onde usuários podem compartilhar experiências e avaliações sobre lugares, interagir com posts de outros usuários e descobrir conteúdo relevantes.

---

## Arquitetura

```
Request HTTP
     |
     v
ThrottlerGuard -------- 429 se exceder limite (100 req/min global)
     |
     v
JwtAuthGuard ---------- 401 se token inválido
     |
     v
ProfileCompleteGuard -- 403 se perfil incompleto
     |
     v
ValidationPipe -------- 400 se DTO inválido (whitelist + transform)
     |
     v
Controller --> Service --> Mongoose Model --> MongoDB
     |
     v
GlobalExceptionFilter -- captura MongoServerError, CastError, erros inesperados
     |
     v
Response HTTP
```

O projeto segue a organização modular do NestJS, onde cada domínio (users, posts, comments, reactions, reports) tem seu próprio módulo com controller, service, DTOs e schema.

---

## Endpoints

### Auth

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `POST` | `/auth/apple` | - | Login via Apple Sign-In |

### Users

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `GET` | `/users/me` | JWT | Retorna o usuário logado |
| `PATCH` | `/users/me/complete-profile` | JWT | Completa o perfil |
| `PATCH` | `/users/me` | JWT + Profile | Atualiza dados do usuário |
| `DELETE` | `/users/me` | JWT | Deleta a conta |
| `GET` | `/users` | JWT | Lista usuários (paginado) |
| `GET` | `/users/:id` | - | Busca usuário por ID |

### Posts

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `POST` | `/posts` | JWT + Profile | Cria um post |
| `GET` | `/posts` | - | Lista posts por trending (paginado) |
| `GET` | `/posts/:id` | - | Busca post por ID |
| `PATCH` | `/posts/:id` | JWT + Profile | Atualiza post (apenas o autor) |
| `DELETE` | `/posts/:id` | JWT + Profile | Deleta post + dados relacionados |

### Comments

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `POST` | `/posts/:postId/comments` | JWT + Profile | Cria um comentário |
| `GET` | `/posts/:postId/comments` | - | Lista comentários (paginado) |
| `DELETE` | `/posts/:postId/comments/:id` | JWT + Profile | Deleta comentário |

### Reactions

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `GET` | `/posts/:postId/reactions/me` | JWT | Retorna reação do usuário |
| `POST` | `/posts/:postId/reactions` | JWT + Profile | Like/dislike com toggle |

### Reports

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `POST` | `/posts/:postId/reports` | JWT + Profile | Denuncia um post |

### Health

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| `GET` | `/health` | - | Healthcheck do servidor |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js + TypeScript |
| **Framework** | NestJS 11 |
| **Banco de dados** | MongoDB (via Mongoose 9) |
| **Autenticação** | JWT + Apple Sign-In (passport-jwt, apple-signin-auth) |
| **Validação** | class-validator + class-transformer |
| **Rate limiting** | @nestjs/throttler |
| **Agendamento** | @nestjs/schedule (cron jobs) |

---

## Funcionalidades Técnicas

### Autenticação OAuth + JWT
Login via Apple Sign-In com verificação de `identityToken`. O backend gera um JWT com payload `{ sub, isProfileComplete }` que o app iOS armazena no Keychain e envia em toda request autenticada.

### Trending Algorithm
Cron job que recalcula o score de todos os posts periodicamente usando a formula `score = likes / (idadeEmHoras + 2) ^ gravity`. Implementado com `bulkWrite` para performance, projection para carregar apenas campos necessarios, e `.lean()` para reduzir overhead do Mongoose. Algoritmo original desenvolvido por [**Murilo**](https://github.com/jorasind).

### Global Exception Filter
Filter customizado que intercepta toda exceção não tratada e retorna respostas HTTP padronizadas: `MongoServerError 11000 -> 409`, `CastError -> 400`, erros desconhecidos -> `500` com log estruturado.

### Rate Limiting por Rota
Throttling global de 100 req/min com limites customizados: auth (5/min), posts (10/min), comentários (20/min), reports (5/min).

### Sanitização de Dados
`toJSON` transform no schema de usuário remove campos sensíveis antes da serialização. Queries com `.lean()` usam `.select()` para nem buscar esses campos do banco.

### Cascade Delete
Ao deletar um post, cada módulo filho (comments, reactions, reports) limpa seus próprios dados via `deleteByPostId()`, mantendo a separação de responsabilidades.

---

## Como Rodar

```bash
# Clonar o repositório
git clone https://github.com/marlonribasoficial/internship-backend.git
cd internship-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar em desenvolvimento
npm run start:dev
```

### Variaveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|:-----------:|
| `MONGODB_URI` | Connection string do MongoDB | Sim |
| `JWT_SECRET` | Secret para assinar tokens (min 32 chars) | Sim |
| `APPLE_CLIENT_ID` | Bundle ID do app iOS | Sim |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | Nao (default: 7d) |
| `PORT` | Porta do servidor | Nao (default: 3000) |

---

## Estrutura do Projeto

```
src/
  main.ts                    # Bootstrap do app
  app.module.ts              # Módulo raiz
  auth/                      # Autenticação (OAuth + JWT + Guards)
  users/                     # CRUD de usuários
  posts/                     # CRUD de posts + TrendingService
  comments/                  # Comentários (paginados)
  reactions/                 # Like/dislike com toggle
  reports/                   # Denúncias
  schemas/                   # Schemas do Mongoose
  common/                    # GlobalExceptionFilter + PaginationDto
  config/                    # Validação de env com Joi
```

---

<div align="center">

Feito por [**Marlon Ribas**](https://github.com/marlonribasoficial)

Apple Developer Academy 2026

</div>
