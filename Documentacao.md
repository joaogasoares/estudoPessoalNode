# Documentacao de Progresso - TWU Backend (ate o fim da Etapa 2)

## Escopo desta documentacao
Este registro cobre o que foi implementado e validado **ate o final da Etapa 2 - Estrutura e primeiro endpoint**.

---

## 1) Etapa 1 - Ambiente e bootstrap

### 1.1 Projeto inicializado
- Projeto Node/TypeScript criado em `webhook-study`.
- `package.json` configurado com scripts principais:
	- `dev`
	- `build`
	- `start`
	- `test`

### 1.2 Dependencias instaladas
- Runtime:
	- `express`
	- `dotenv`
	- `pg`
	- `pino`
- Desenvolvimento:
	- `typescript`, `tsx`, `ts-node-dev`
	- `jest`, `ts-jest`, `supertest` e tipos
	- `eslint` e plugins TypeScript

### 1.3 Configuracoes base
- Ambiente TypeScript ativo (`tsconfig.json`).
- Estrutura de testes com Jest preparada (`jest.config.js`).

### 1.4 Checkpoint da etapa
- Build e testes executaveis via scripts do projeto.

---

## 2) Etapa 2 - Estrutura e primeiro endpoint

### 2.1 Estrutura de pastas/arquivos criada
Estrutura principal disponivel no projeto:

```text
src/
	server.ts
	app.ts
	http/
		routes.ts
		controllers/
			webhook-controller.ts
	application/
		use-cases/
			receive-event.ts
	domain/
		entities/
			webhook-event.ts
		services/
			signature-validator.ts
	infra/
		db/
			connection.ts
		repositories/
			event-repository.ts
	shared/
		errors.ts
		logger.ts
```

### 2.1.1 Papel de cada arquivo
- `src/server.ts`:
	- Ponto de entrada da aplicacao.
	- Sobe o servidor HTTP e define a porta.

- `src/app.ts`:
	- Monta a instancia do Express.
	- Configura middlewares globais (ex.: `express.json()`).
	- Registra rotas e endpoint de health.

- `src/http/routes.ts`:
	- Centraliza o mapeamento de rotas HTTP.
	- Faz a ligacao entre URL/metodo e controller.

- `src/http/controllers/webhook-controller.ts`:
	- Recebe a requisicao do webhook.
	- Extrai e valida payload/header.
	- Chama o caso de uso e converte resultado em resposta HTTP.

- `src/application/use-cases/receive-event.ts`:
	- Contem a regra de aplicacao para recebimento de eventos.
	- Orquestra validacao de assinatura e persistencia.

- `src/domain/entities/webhook-event.ts`:
	- Define o contrato/tipo da entidade `WebhookEvent`.
	- Representa os dados essenciais do evento no dominio.

- `src/domain/services/signature-validator.ts`:
	- Implementa a regra de validacao de assinatura do provider.
	- Garante integridade/autenticidade do evento recebido.

- `src/infra/db/connection.ts`:
	- Configura e exporta conexao/pool com Postgres.
	- Encapsula detalhes tecnicos de acesso ao banco.

- `src/infra/repositories/event-repository.ts`:
	- Implementa operacoes de persistencia para eventos.
	- Salva e consulta eventos na tabela `webhook_events`.

- `src/shared/errors.ts`:
	- Centraliza tipos/fabricas de erros compartilhados.
	- Ajuda a manter padrao de tratamento de erro.

- `src/shared/logger.ts`:
	- Centraliza configuracao de logs da aplicacao.
	- Padroniza saida para observabilidade e debugging.

### 2.2 Endpoints implementados

#### GET /health
- Registrado em `app.ts`.
- Retorna HTTP `200` com payload:

```json
{ "status": "ok" }
```

#### POST /webhooks/provider-a
- Registrado em `src/http/routes.ts`.
- Controller em `src/http/controllers/webhook-controller.ts`.
- Validacao basica de payload implementada.
- Quando payload invalido, resposta padrao:

```json
{ "error": "Invalid payload" }
```

### 2.3 Fluxo da aplicacao
- `server.ts` inicia servidor na porta configurada (default `3000`).
- `app.ts` aplica `express.json()` e registra rotas.
- `webhook-controller.ts` recebe requisicao do provider e valida campos minimos.

---

## 3) Checklist de pronto da Etapa 2

- [x] GET `/health` respondendo `200`.
- [x] POST `/webhooks/provider-a` com validacao basica de payload.

**Criterio de pronto atingido:**
- Health responde `200`.
- Payload invalido retorna erro consistente.

---

## 4) Comandos usados para validacao da Etapa 2

```powershell
npm run dev
curl http://localhost:3000/health
```

Para payload invalido (exemplo conceitual):

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/webhooks/provider-a" -ContentType "application/json" -Body '{}'
```

---

## 5) Estado ao fim da Etapa 2

Projeto com base funcional para evoluir para persistencia (Etapa 3), mantendo:
- estrutura em camadas,
- endpoint de health,
- endpoint de intake com validacao inicial.

---

## 6) Etapa 3 - Persistencia ponta a ponta

Objetivo da etapa:
- Receber evento do webhook,
- validar assinatura,
- persistir no Postgres,
- e retornar resposta estavel para o provider.

### 6.1 Comandos de infraestrutura (Docker + Postgres)

#### Passo 0 - Criacao do container `webhook-pg`

Opcao A (CLI):

```powershell
docker run --name webhook-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=webhook_study -p 5432:5432 -d postgres:16
```

Opcao B (Docker Desktop):
1. Abrir Docker Desktop.
2. Ir em **Images** e baixar `postgres:16` (Pull).
3. Clicar em **Run**.
4. Definir:
	- Container name: `webhook-pg`
	- Ports: `5432` (host) -> `5432` (container)
	- Environment variables:
		- `POSTGRES_PASSWORD=postgres`
		- `POSTGRES_DB=webhook_study`
5. Confirmar em **Run**.

Depois da criacao inicial, os proximos ciclos usaram `docker start webhook-pg` para reaproveitar o mesmo container.

#### Comando
```powershell
docker start webhook-pg
```
**O que fazia:** iniciava o container Postgres ja criado anteriormente.

**Por que foi feito:** garantir banco ativo sem recriar container a cada sessao.

---

#### Comando
```powershell
if ($LASTEXITCODE -ne 0) {
	docker run --name webhook-pg `
		-e POSTGRES_PASSWORD=postgres `
		-e POSTGRES_DB=webhook_study `
		-p 5432:5432 `
		-d postgres:16
}
```
**O que fazia:** criava o container somente se `docker start` falhasse.

**Por que foi feito:** tornar setup resiliente (funciona para ambiente novo e ambiente ja existente).

---

#### Comando
```powershell
docker exec -i webhook-pg psql -U postgres -d webhook_study -c "CREATE TABLE IF NOT EXISTS webhook_events (id BIGSERIAL PRIMARY KEY, event_id TEXT NOT NULL UNIQUE, event_type TEXT NOT NULL, payload JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'received', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());"
```
**O que fazia:** criava a tabela `webhook_events` de forma idempotente.

**Por que foi feito:** definir schema minimo da etapa e permitir reruns sem erro (`IF NOT EXISTS`).

---

#### Comando
```powershell
docker exec -i webhook-pg psql -U postgres -d webhook_study -c "\d webhook_events"
```
**O que fazia:** exibia estrutura da tabela (colunas, tipos, indices e constraints).

**Por que foi feito:** validar se tabela/constraint de unicidade de `event_id` estavam corretas.

---

#### Comando
```powershell
docker exec -i webhook-pg psql -U postgres -d webhook_study -c "SELECT event_id, event_type, status, created_at FROM webhook_events ORDER BY id DESC LIMIT 10;"
```
**O que fazia:** consultava os ultimos eventos persistidos.

**Por que foi feito:** prova objetiva de persistencia ponta a ponta.

### 6.2 Comandos de API e testes manuais

#### Comando
```powershell
npm run dev
```
**O que fazia:** subia API local em modo desenvolvimento.

**Por que foi feito:** habilitar testes manuais do endpoint de intake.

---

#### Comando
```powershell
Invoke-RestMethod -Method POST `
	-Uri "http://localhost:3000/webhooks/provider-a" `
	-ContentType "application/json" `
	-Headers @{ "x-signature" = "valid-signature" } `
	-Body '{"event_id":"evt_002","event_type":"payment.succeeded","timestamp":"2026-04-22T12:05:00.000Z","data":{"amount":100}}'
```
**O que fazia:** enviava webhook valido para a rota de intake com header de assinatura.

**Por que foi feito:** validar caminho completo request -> controller -> use-case -> repositorio -> banco.

> Observacao importante de ambiente Windows/PowerShell:
> - Foi necessario usar `Invoke-RestMethod` (ou `curl.exe`) porque `curl` em PowerShell pode mapear para `Invoke-WebRequest` e gerar erro de header/escaping.

### 6.3 Ajustes tecnicos realizados durante a etapa

1. **Controller de webhook atualizado** para:
	- aceitar campos em `snake_case` e `camelCase` (`event_id/eventId`, `event_type/eventType`, `data/payload`),
	- preencher `timestamp` quando ausente,
	- chamar `receiveEvent(...)` e retornar status HTTP coerente (`400`, `401`, `500`, `200`).

2. **Validador de assinatura atualizado** para desenvolvimento:
	- manteve validacao HMAC real,
	- adicionou fallback `valid-signature` quando `NODE_ENV !== production`.

3. **Repositorio de eventos migrado de memoria para Postgres**:
	- antes: `events[]` em memoria (nao persistia),
	- depois: `INSERT` em `webhook_events` usando `pool.query(...)`,
	- com `ON CONFLICT (event_id) DO NOTHING` para base de idempotencia.

### 6.4 Evidencias de resultado

- Requisicao retornando:
	- `{ "received": true }`
- Consulta no banco retornando linha real:
	- `event_id = evt_002`
	- `event_type = payment.succeeded`
	- `status = received`

### 6.5 Problemas encontrados e resolucao

- **Problema:** erro de parse JSON no envio com `curl`.
	- **Causa:** escaping no PowerShell.
	- **Resolucao:** uso de `Invoke-RestMethod` com JSON valido.

- **Problema:** resposta `Invalid payload` em testes iniciais.
	- **Causa:** controller antigo exigia combinacao diferente de campos.
	- **Resolucao:** normalizacao de campos no controller.

- **Problema:** resposta `received: true` sem gravar no banco.
	- **Causa:** repositorio ainda estava em memoria.
	- **Resolucao:** migracao para `event-repository` com Postgres.

### 6.6 Checkpoint da etapa

Comandos de checkpoint:

```powershell
npm run dev
npm test
```

Status:
- Persistencia ponta a ponta validada para evento valido.
- Estrutura pronta para avancar para Etapa 4 (testes essenciais).

