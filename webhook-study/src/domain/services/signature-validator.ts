import type { WebhookEvent } from "../entities/webhook-event.js";
import crypto from "crypto";

// Exemplo de segredo fixo (em produção, use variável de ambiente!)
const SECRET = process.env.WEBHOOK_SECRET || "my-secret";

export function validateSignature(event: WebhookEvent, signature: string): boolean {
  // Simulação: cria um hash HMAC do event_id + event_type + timestamp
  const payload = `${event.event_id}:${event.event_type}:${event.timestamp}`;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return signature === expected;
}