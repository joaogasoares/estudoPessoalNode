# Chat Handoff - webhook-study

## Objetivo deste arquivo

Este arquivo substitui o historico do chat no outro notebook.
Se voce clonar o repositorio e abrir este arquivo, consegue continuar de onde parou.

## Estado atual (22/04/2026)

- Etapa 1 concluida (setup base).
- Etapa 2 quase concluida (estrutura + endpoint inicial).
- Etapa 3 em andamento (persistencia real no Postgres).

## Configuracao atual

- Projeto em ESM:
  - package.json com "type": "module"
  - imports relativos com sufixo .js em arquivos .ts
- Script de dev:
  - "dev": "tsx watch src/server.ts"
- TypeScript:
  - module: nodenext
  - moduleResolution: nodenext
  - verbatimModuleSyntax: true

## Arquivos ja criados

- src/app.ts
- src/server.ts
- src/http/routes.ts
- src/http/controllers/webhook-controller.ts
- src/application/use-cases/receive-event.ts
- src/domain/entities/webhook-event.ts
- src/domain/services/signature-validator.ts
- src/infra/db/connection.ts
- src/infra/repositories/event-repository.ts
- src/shared/errors.ts
- src/shared/logger.ts

## O que ja funciona

- GET /health definido em src/app.ts.
- Rota POST /webhooks/provider-a definida em src/http/routes.ts.
- Use-case de receive-event criado.
- Validacao de assinatura criada.

## O que falta para fechar Etapa 3

1. Subir Postgres no notebook atual (ou usar banco remoto).
2. Criar tabela webhook_events.
3. Trocar repositorio em memoria por repositorio com SQL no Postgres.
4. Atualizar controller para chamar receiveEvent e retornar resposta estavel.
5. Testar ponta a ponta: assinatura valida salva no banco; invalida retorna erro.

## Comandos de retomada rapida

### 1) Instalar deps

npm install

### 2) Rodar app

npm run dev

### 3) Rodar build e testes

npm run build
npm test

## Comandos para Postgres via Docker

### Subir container

docker run --name webhook-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=webhook_study -p 5432:5432 -d postgres:16

### Se o nome ja existir

docker start webhook-pg

### Criar tabela

docker exec -i webhook-pg psql -U postgres -d webhook_study -c "CREATE TABLE IF NOT EXISTS webhook_events (id BIGSERIAL PRIMARY KEY, event_id TEXT NOT NULL UNIQUE, event_type TEXT NOT NULL, payload JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'received', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());"

## .env sugerido

DATABASE_URL=postgres://postgres:postgres@localhost:5432/webhook_study
WEBHOOK_SECRET=my-secret
PORT=3000

## Prompt para primeira mensagem no novo notebook

Use este prompt no chat novo:

"Continue este projeto a partir do arquivo CHAT_HANDOFF.md e do IMPLEMENTATION_PLAN.md.
Estou na Etapa 3 (persistencia ponta a ponta).
Quero seguir de forma hands-on: voce me guia, eu faco os comandos e edits.
Primeiro, valide meu estado atual e me passe apenas o proximo bloco de comandos."

## Observacoes importantes

- Se o notebook novo nao tiver Docker/WSL, use um Postgres remoto temporario (Neon/Supabase/Railway) e ajuste DATABASE_URL.
- src/shared/logger.ts usa transporte pino-pretty; se der erro de runtime, instalar: npm install -D pino-pretty
