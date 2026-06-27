<div align="center">

# Social Network Backend

### REST API para uma rede social construida como challenge do Apple Developer Academy.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-0F6E56?style=for-the-badge)
![Platform](https://img.shields.io/badge/Node.js-0F6E56?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-0F6E56?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-0F6E56?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## Sobre o Projeto

Backend de uma rede social desenvolvido durante um challenge do **Apple Developer Academy**, focado em aprendizado de arquitetura de APIs, autenticacao, modelagem de banco de dados e boas praticas de seguranca.

O projeto simula uma plataforma onde usuarios podem compartilhar experiencias e avaliacoes sobre lugares, interagir com posts de outros usuarios e descobrir conteudo relevante atraves de um algoritmo de trending.

> Projeto academico com foco no aprendizado tecnico, nao no produto.

---

## Arquitetura

```
Request HTTP
     |
     v
ThrottlerGuard -------- 429 se exceder limite (100 req/min global)
     |
     v
JwtAuthGuard ---------- 401 se token invalido
     |
     v
ProfileCompleteGuard -- 403 se perfil incompleto
     |
     v
ValidationPipe -------- 400 se DTO invalido (whitelist + transform)
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

O projeto segue a organizacao modular do NestJS, onde cada dominio (users, posts, comments, reactions, reports) tem seu proprio modulo com controller, service, DTOs e schema.

---

## Endpoints

### Auth

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `POST` | `/auth/apple` | - | Login via Apple Sign-In |

### Users

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `GET` | `/users/me` | JWT | Retorna o usuario logado |
| `PATCH` | `/users/me/complete-profile` | JWT | Completa o perfil |
| `PATCH` | `/users/me` | JWT + Profile | Atualiza dados do usuario |
| `DELETE` | `/users/me` | JWT | Deleta a conta |
| `GET` | `/users` | JWT | Lista usuarios (paginado) |
| `GET` | `/users/:id` | - | Busca usuario por ID |

### Posts

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `POST` | `/posts` | JWT + Profile | Cria um post |
| `GET` | `/posts` | - | Lista posts por trending (paginado) |
| `GET` | `/posts/:id` | - | Busca post por ID |
| `PATCH` | `/posts/:id` | JWT + Profile | Atualiza post (apenas o autor) |
| `DELETE` | `/posts/:id` | JWT + Profile | Deleta post + dados relacionados |

### Comments

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `POST` | `/posts/:postId/comments` | JWT + Profile | Cria um comentario |
| `GET` | `/posts/:postId/comments` | - | Lista comentarios (paginado) |
| `DELETE` | `/posts/:postId/comments/:id` | JWT + Profile | Deleta comentario |

### Reactions

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `GET` | `/posts/:postId/reactions/me` | JWT | Retorna reacao do usuario |
| `POST` | `/posts/:postId/reactions` | JWT + Profile | Like/dislike com toggle |

### Reports

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `POST` | `/posts/:postId/reports` | JWT + Profile | Denuncia um post |

### Health

| Metodo | Rota | Auth | Descricao |
|--------|------|:----:|-----------|
| `GET` | `/health` | - | Healthcheck do servidor |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js + TypeScript |
| **Framework** | NestJS 11 |
| **Banco de dados** | MongoDB (via Mongoose 9) |
| **Autenticacao** | JWT + Apple Sign-In (passport-jwt, apple-signin-auth) |
| **Validacao** | class-validator + class-transformer |
| **Rate limiting** | @nestjs/throttler |
| **Agendamento** | @nestjs/schedule (cron jobs) |

---

## Funcionalidades Tecnicas

### Autenticacao OAuth + JWT
Login via Apple Sign-In com verificacao de `identityToken`. O backend gera um JWT com payload `{ sub, isProfileComplete }` que o app iOS armazena no Keychain e envia em toda request autenticada.

### Trending Algorithm
Cron job que recalcula o score de todos os posts periodicamente usando a formula `score = likes / (idadeEmHoras + 2) ^ gravity`. Implementado com `bulkWrite` para performance, projection para carregar apenas campos necessarios, e `.lean()` para reduzir overhead do Mongoose.

### Global Exception Filter
Filter customizado que intercepta toda excecao nao tratada e retorna respostas HTTP padronizadas: `MongoServerError 11000 -> 409`, `CastError -> 400`, erros desconhecidos -> `500` com log estruturado.

### Rate Limiting por Rota
Throttling global de 100 req/min com limites customizados: auth (5/min), posts (10/min), comentarios (20/min), reports (5/min).

### Sanitizacao de Dados
`toJSON` transform no schema de usuario remove campos sensiveis antes da serializacao. Queries com `.lean()` usam `.select()` para nem buscar esses campos do banco.

### Cascade Delete
Ao deletar um post, cada modulo filho (comments, reactions, reports) limpa seus proprios dados via `deleteByPostId()`, mantendo a separacao de responsabilidades.

---

## Como Rodar

```bash
# Clonar o repositorio
git clone https://github.com/marlonribasoficial/internship-backend.git
cd internship-backend

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar em desenvolvimento
npm run start:dev
```

### Variaveis de Ambiente

| Variavel | Descricao | Obrigatoria |
|----------|-----------|:-----------:|
| `MONGODB_URI` | Connection string do MongoDB | Sim |
| `JWT_SECRET` | Secret para assinar tokens (min 32 chars) | Sim |
| `APPLE_CLIENT_ID` | Bundle ID do app iOS | Sim |
| `JWT_EXPIRES_IN` | Tempo de expiracao do token | Nao (default: 7d) |
| `PORT` | Porta do servidor | Nao (default: 3000) |

---

## Estrutura do Projeto

```
src/
  main.ts                    # Bootstrap do app
  app.module.ts              # Modulo raiz
  auth/                      # Autenticacao (OAuth + JWT + Guards)
  users/                     # CRUD de usuarios
  posts/                     # CRUD de posts + TrendingService
  comments/                  # Comentarios (paginados)
  reactions/                 # Like/dislike com toggle
  reports/                   # Denuncias
  schemas/                   # Schemas do Mongoose
  common/                    # GlobalExceptionFilter + PaginationDto
  config/                    # Validacao de env com Joi
```

---

## Contexto

Projeto desenvolvido durante o programa de internship do **Apple Developer Academy** como parte de um challenge focado em aprendizado de desenvolvimento backend. O objetivo era estruturar e implementar a API de uma rede social do zero, passando por modelagem de dados, autenticacao, seguranca e performance.

---

<div align="center">

Feito por [**Marlon Ribas**](https://github.com/marlonribasoficial)

Apple Developer Academy 2026

</div>
