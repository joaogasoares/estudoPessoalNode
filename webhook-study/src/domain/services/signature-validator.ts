import type { WebhookEvent } from "../entities/webhook-event.js";
import crypto from "crypto";

// Exemplo de segredo fixo (em produção, use variável de ambiente!)
const SECRET = process.env.WEBHOOK_SECRET || "my-secret";
const DEV_BYPASS_SIGNATURE = "valid-signature";

export function validateSignature(event: WebhookEvent, signature: string): boolean {
  // Simulação: cria um hash HMAC do event_id + event_type + timestamp
  const payload = `${event.event_id}:${event.event_type}:${event.timestamp}`;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");

  if (signature === expected) {
    return true;
  }

  // Fallback para ambiente local de estudo/manual testing.
  if (process.env.NODE_ENV !== "production" && signature === DEV_BYPASS_SIGNATURE) {
    return true;
  }

  return false;
}
