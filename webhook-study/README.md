# Webhook Study API

Projeto prático para simulação de recebimento, processamento e resiliência de webhooks usando Node.js, TypeScript e PostgreSQL.

## 🚀 Status do Projeto

Atualmente estamos na **Etapa 5** do plano de implementação. Abaixo está o resumo de tudo o que foi construído até agora e os próximos passos.

### ✅ O que já foi concluído:

- **Etapa 1: Setup do Ambiente**
  - Configuração do Node.js com TypeScript e `ts-jest`.
  - Configuração do `eslint`, `prettier` e scripts do `package.json`.
  - Arquivo `.gitignore` configurado e limpeza de arquivos de compilação.
- **Etapa 2: Estrutura Base e Endpoints**
  - Arquitetura baseada em Clean Architecture (Controllers, Use Cases, Repositories).
  - Rota de Health Check (`GET /health`).
  - Endpoint de Intake de Webhook (`POST /webhooks/provider-a`) com validação de assinatura e payload flexível.
- **Etapa 3: Persistência (Banco de Dados)**
  - Tabela `webhook_events` criada no PostgreSQL (rodando via Docker).
  - Configuração do Pool de conexões do PG.
  - Salvamento inicial dos eventos com status `received`.
- **Etapa 4: Testes Essenciais**
  - Criação da suíte de testes com Supertest e Jest (`npm test`).
  - Cobertura do Health Check e dos cenários de Webhook (Payload inválido, Assinatura inválida, Sucesso).
  - Teste automatizado de **Idempotência** simulando duplicidade de requisições do Provider.
- **Etapa 5 (Parcial): Idempotência e Máquina de Estados**
  - Banco blindado contra duplicação silenciosamente (usando `ON CONFLICT DO NOTHING`).
  - Criação do mecanismo de transição de estados de processamento (`received` -> `processing` -> `processed` / `failed`), rodando em background (não-bloqueante para a API).

---

### ⏳ Onde estamos agora (Próximos Passos):

Estamos no meio da **Etapa 5**. O próximo passo foca na resiliência do nosso worker de background.

- [ ] **Retry com backoff simples:** Implementar retentativas caso o evento falhe e entre no status `failed`.
- [ ] **Endpoint de Replay (Admin):** Criar a rota `POST /admin/events/:eventId/replay` para reenviar um evento falho manualmente para a fila de processamento.

### 🔜 Etapas Futuras:
- **Etapa 6:** Logging e observabilidade (usar Pino para gerar `request_id` e acompanhar o ciclo de vida).
- **Etapa 7:** Refatoração guiada (desacoplar regras e melhorar Design Patterns).

---

## 🛠 Como rodar localmente

**1. Subir o Banco de Dados (Docker)**
```bash
docker run --name webhook-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=webhook_study -p 5432:5432 -d postgres:16
```

**2. Instalar as dependências**
```bash
npm install
```

**3. Rodar o projeto em modo de desenvolvimento**
```bash
npm run dev
```

**4. Rodar os Testes Automatizados**
```bash
npm test
```
