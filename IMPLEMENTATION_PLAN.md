# Plano de Implementacao Hands-on - TWU Backend

Objetivo: voce vai aprender fazendo. Este guia prioriza criacao/edicao manual de arquivos, instalacao manual e validacao continua.

## Como usar este arquivo

1. Siga as etapas na ordem.
2. Marque cada item concluido.
3. Nao pule os criterios de pronto.
4. Sempre rode os checkpoints antes de avancar.

Tempo sugerido: 8-10h por semana.

---

## Etapa 0 - Regra do jogo (30-45 min)

Objetivo:

- Definir como voce vai medir progresso de entrevista, e nao so escrever codigo.

Checklist:

- [ ] Criar rubric com 6 criterios: decomposicao, comunicacao, testes, debugging, design de API, trade-offs.
- [ ] Definir nota minima por sessao (exemplo: nenhuma dimensao abaixo de 2/4).
- [ ] Reservar 2 blocos de implementacao + 2 blocos de simulacao por semana.

Criterio de pronto:

- Voce sabe como vai se avaliar em cada simulacao.

---

## Etapa 1 - Ambiente e bootstrap (1-2h)

Objetivo:

- Criar base executavel local com Node + TypeScript + testes.

### 1.1 Criar pasta do projeto

Comandos:

```powershell
mkdir webhook-study
cd webhook-study
```

### 1.2 Validar ferramentas

Comandos:

```powershell
node -v
npm -v
```

Esperado:

- Node LTS instalado.
- npm funcionando.

### 1.3 Inicializar projeto

Comando:

```powershell
npm init -y
```

### 1.4 Instalar dependencias

Runtime:

```powershell
npm install express dotenv pg pino
```

Desenvolvimento:

```powershell
npm install -D typescript ts-node-dev jest ts-jest @types/jest @types/node @types/express supertest @types/supertest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### 1.5 Gerar configs iniciais

Comandos:

```powershell
npx tsc --init
npx ts-jest config:init
```

### 1.6 Ajustar scripts no package.json

Edite package.json e deixe scripts assim:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest --runInBand"
  }
}
```

Checkpoint:

```powershell
npm run build
npm test
```

Criterio de pronto:

- [x] Scripts existem e executam sem erro de configuracao.

---

## Etapa 2 - Estrutura e primeiro endpoint (1.5-2h)

Objetivo:

- Validar ciclo editar -> rodar -> conferir resposta.

Crie as pastas/arquivos:

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

Checklist:

- [x] GET /health respondendo 200.
- [x] POST /webhooks/provider-a com validacao basica de payload.

Execucao:

```powershell
npm run dev
```

Teste manual:

```powershell
curl http://localhost:3000/health
```

Criterio de pronto:

- [x] Health responde 200.
- [x] Payload invalido retorna erro consistente.

---

## Etapa 3 - Persistencia ponta a ponta (2-3h)

Objetivo:

- Receber, validar, salvar evento e retornar resposta estavel.

### 3.1 Subir Postgres (opcao Docker)

```powershell
docker run --name webhook-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=webhook_study -p 5432:5432 -d postgres:16
```

### 3.2 Criar tabela webhook_events

Campos minimos sugeridos:

- id
- event_id
- event_type
- payload
- status
- created_at

Checklist:

- [x] Evento valido e salvo com status received.
- [x] Evento invalido nao salva.

Checkpoint:

```powershell
npm run dev
npm test
```

Criterio de pronto:

- [x] Fluxo basico completo funcionando.

---

## Etapa 4 - Testes essenciais (1.5-2h)

Objetivo:

- Garantir confiabilidade basica.

Arquivos sugeridos:

```text
tests/
  health.spec.ts
  webhook-intake.spec.ts
```

Checklist:

- [x] Teste de health.
- [x] Teste de webhook valido.
- [x] Teste de webhook invalido.
- [x] Teste de idempotencia inicial (event_id repetido).

Comando:

```powershell
npm test
```

Criterio de pronto:

- [x] Suite passa de forma estavel (Testes de health e intake).

---

## Etapa 5 - Idempotencia, processamento e replay (2-3h)

Objetivo:

- Simular problema real de backend e mostrar maturidade tecnica.

Checklist:

- [x] Idempotencia por event_id.
- [x] Estados: received, processing, processed, failed.
- [x] Retry com backoff simples.
- [x] Endpoint de replay: POST /admin/events/:eventId/replay

Criterio de pronto:

- [x] event_id repetido nao duplica processamento.
- failed pode ser reenviado para processamento.

---

## Etapa 6 - Logging e observabilidade minima (1h)

Objetivo:

- Conseguir debugar ao vivo na entrevista.

Checklist:

- [x] request_id em logs.
- [ ] Logs de transicao de status.
- [ ] Logs de erro com causa e tentativa.

Criterio de pronto:

- Voce explica uma falha pelos logs sem depender de debugger visual.

---

## Etapa 7 - Refatoracao guiada (1-2h)

Objetivo:

- Demonstrar melhoria incremental sem regressao.

Checklist:

- [ ] Escolher 1 trecho acoplado.
- [ ] Refatorar para responsabilidade unica.
- [ ] Provar com testes que comportamento foi preservado.

Criterio de pronto:

- Antes/depois claro e defendivel tecnicamente.

---

## Etapa 8 - Simulacao de pair programming (2x por semana)

Objetivo:

- Treinar o formato da entrevista tecnica.

Roteiro por sessao (45-60 min):

1. Clarificar requisitos e limites.
2. Propor plano minimo.
3. Implementar milestone pequeno.
4. Validar resultado.
5. Discutir trade-offs.

Checklist por sessao:

- [ ] Fiz perguntas de clarificacao antes de codar.
- [ ] Narrei raciocinio em ingles.
- [ ] Entreguei incremento funcional validado.
- [ ] Registrei 1 melhoria objetiva para proxima sessao.

---

## Etapa 9 - Preparacao final TWU (1-2h)

Checklist:

- [ ] Pitch de arquitetura em ingles (3-5 min).
- [ ] 2 trade-offs tecnicos bem explicados.
- [ ] 3 historias STAR prontas (cultural).
- [ ] Checklist final de entrevista validado.

Criterio de pronto:

- Voce consegue abrir uma sessao de pairing com seguranca, sem roteiro fechado.

---

## Rotina de comandos por sessao

Inicio:

```powershell
git status
npm install
npm test
```

Durante:

```powershell
npm run dev
npm test
```

Fim:

```powershell
git status
```

Registro da sessao (manual):

- O que entreguei hoje.
- Onde travei.
- Primeiro comando da proxima sessao.

---

## Regras de ouro

- Sempre clarificar antes de codar.
- Sempre entregar em incrementos pequenos.
- Sempre validar antes de refatorar.
- Sempre justificar escolhas tecnicas.
- Nunca ficar travado em silencio por muito tempo: pausar, verbalizar, ajustar plano.
